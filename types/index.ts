/**
 * Shared domain types for the CropWise AI Care platform.
 * These mirror the Supabase schema (see supabase/migrations/0001_init.sql).
 */

export type Language = "en" | "hi" | "mr";

export type Severity = "low" | "moderate" | "high" | "critical";

export type DiagnosisStatus = "pending" | "analyzing" | "completed" | "failed";

/** Structured output contract enforced on Gemini via responseSchema. */
export interface DiagnosisResult {
  /** Best-guess crop, e.g. "tomato". */
  crop: string | null;
  /** Curated-library slug, or null when the leaf is healthy/unknown. */
  diseaseSlug: string | null;
  diseaseName: string;
  /** 0–1 calibrated confidence. */
  confidence: number;
  severity: Severity;
  reasoning: string;
}

export interface Disease {
  id: string;
  slug: string;
  name: string;
  crop: string;
  pathogen?: string;
  severity: Severity;
  symptoms: string[];
  causes: string[];
  organicTreatments: string[];
  chemicalTreatments: string[];
  prevention: string[];
  imageUrl?: string;
  /** Localized content keyed by language; English is the source of truth. */
  translations?: Record<Language, Partial<Record<string, string[]>>>;
}

export interface TreatmentStep {
  order: number;
  title: string;
  description: string;
  completed?: boolean;
}

export interface TreatmentPlan {
  steps: TreatmentStep[];
}

export interface DiagnosisRecord {
  id: string;
  userId?: string;
  imageUrl?: string;
  diseaseId?: string;
  diseaseName: string;
  confidence: number;
  severity: Severity;
  status: DiagnosisStatus;
  createdAt: string;
}

export interface AgriCentre {
  id: string;
  name: string;
  type: "krishi_kendra" | "soil_lab" | "input_dealer" | "other";
  address?: string;
  phone?: string;
  lat: number;
  lng: number;
  hours?: string;
  /** Distance from query point in km (computed at request time). */
  distanceKm?: number;
}

export interface WeatherAlert {
  level: "none" | "low" | "medium" | "high";
  message: string;
  cropsAtRisk?: string[];
  conditions: {
    humidity: number;
    temperatureC: number;
    rainExpected: boolean;
    outbreakWindowDays: number;
  };
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
