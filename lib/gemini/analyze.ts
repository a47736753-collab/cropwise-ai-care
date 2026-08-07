import { GoogleGenAI } from "@google/genai";
import type { DiagnosisResult, Severity } from "@/types";

export interface TreatmentStep {
  order: number;
  title: string;
  description: string;
}

export interface AnalysisResult extends DiagnosisResult {
  treatmentSteps: TreatmentStep[];
  prevention: string[];
}

const PROMPT = `You are an expert plant pathologist for Indian agriculture. Analyze the crop leaf photo and return ONLY valid JSON matching this exact schema:
{
  "diseaseSlug": string or null (null if healthy/unknown),
  "diseaseName": string,
  "confidence": number between 0 and 1,
  "severity": "low" | "medium" | "high",
  "reasoning": string,
  "treatmentSteps": [{ "order": number, "title": string, "description": string }],
  "prevention": [string]
}
Respond in plain English JSON with no markdown fences.`;

const SEVERITIES: Severity[] = ["low", "medium", "high"];

function clampConfidence(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0.5;
  return Math.min(1, Math.max(0, n));
}

export async function analyzeLeafImage(
  imageBase64: string,
  mimeType: string
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
      {
        role: "user",
        parts: [
          { text: PROMPT },
          { inlineData: { mimeType, data: imageBase64 } },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Strip any accidental markdown fences and retry once.
    const cleaned = text.replace(/```(?:json)?/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  const severity = SEVERITIES.includes(parsed.severity as Severity)
    ? (parsed.severity as Severity)
    : "medium";

  const rawSteps = Array.isArray(parsed.treatmentSteps)
    ? (parsed.treatmentSteps as Array<Record<string, unknown>>)
    : [];
  const treatmentSteps = rawSteps.map((step, i) => ({
    order: i + 1,
    title: String(step.title ?? `Step ${i + 1}`),
    description: String(step.description ?? ""),
  }));

  return {
    diseaseSlug: parsed.diseaseSlug ? String(parsed.diseaseSlug) : null,
    diseaseName: String(parsed.diseaseName ?? "Unknown"),
    confidence: clampConfidence(parsed.confidence),
    severity,
    reasoning: String(parsed.reasoning ?? ""),
    treatmentSteps,
    prevention: Array.isArray(parsed.prevention)
      ? (parsed.prevention as unknown[]).map(String)
      : [],
  };
}
