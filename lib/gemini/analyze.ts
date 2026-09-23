import type { DiagnosisResult, Severity } from "@/types";

/**
 * Leaf image analysis.
 *
 * Runs Gemini vision through the platform AI gateway, so no personal API key
 * is required. The gateway speaks the OpenAI chat-completions dialect.
 */

export interface TreatmentStep {
  order: number;
  title: string;
  description: string;
}

export interface AnalysisResult extends DiagnosisResult {
  treatmentSteps: TreatmentStep[];
  prevention: string[];
  fertilizerAdvice: string;
  isHealthy: boolean;
  modelVersion: string;
}

const MODEL = "google/gemini-2.5-flash";
const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const PROMPT = `You are an expert plant pathologist for Indian agriculture.
Analyse the crop leaf photo and reply with ONLY valid JSON (no markdown fences):
{
  "crop": string (best guess, e.g. "tomato"),
  "diseaseSlug": string or null (kebab-case, e.g. "tomato-early-blight"; null if healthy or unclear),
  "diseaseName": string (plain-English name, or "Healthy leaf"),
  "isHealthy": boolean,
  "confidence": number between 0 and 1,
  "severity": "low" | "moderate" | "high" | "critical",
  "reasoning": string (2-3 short sentences a farmer can understand),
  "treatmentSteps": [{ "order": number, "title": string, "description": string }],
  "prevention": [string],
  "fertilizerAdvice": string
}
Give 3-5 practical treatment steps using inputs available in Indian agri stores.`;

const SEVERITIES: Severity[] = ["low", "moderate", "high", "critical"];

function clampConfidence(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

export async function analyzeLeafImage(
  imageBase64: string,
  mimeType: string
): Promise<AnalysisResult> {
  const apiKey = process.env.LOVABLE_API_KEY ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("AI is not configured for this project.");
  }

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PROMPT },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${imageBase64}` },
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("AI is busy right now. Please try again in a moment.");
    }
    throw new Error("The AI service could not analyse this photo.");
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const text = payload.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("The AI returned an empty response.");
  }

  const cleaned = text.replace(/```(?:json)?/g, "").trim();
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    // Last resort: pull the first JSON object out of the response.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("The AI response could not be read.");
    parsed = JSON.parse(match[0]);
  }

  const severity = SEVERITIES.includes(parsed.severity as Severity)
    ? (parsed.severity as Severity)
    : "moderate";

  const rawSteps = Array.isArray(parsed.treatmentSteps)
    ? (parsed.treatmentSteps as Array<Record<string, unknown>>)
    : [];

  return {
    crop: parsed.crop ? String(parsed.crop) : null,
    diseaseSlug: parsed.diseaseSlug ? String(parsed.diseaseSlug) : null,
    diseaseName: String(parsed.diseaseName ?? "Unknown"),
    isHealthy: Boolean(parsed.isHealthy),
    confidence: clampConfidence(parsed.confidence),
    severity,
    reasoning: String(parsed.reasoning ?? ""),
    treatmentSteps: rawSteps.map((step, i) => ({
      order: i + 1,
      title: String(step.title ?? `Step ${i + 1}`),
      description: String(step.description ?? ""),
    })),
    prevention: Array.isArray(parsed.prevention)
      ? (parsed.prevention as unknown[]).map(String)
      : [],
    fertilizerAdvice: String(parsed.fertilizerAdvice ?? ""),
    modelVersion: MODEL,
  };
}
