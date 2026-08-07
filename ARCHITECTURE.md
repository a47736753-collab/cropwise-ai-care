# CropWise AI Care — AI-Powered Crop Disease Detection

Architecture for the Smart India Hackathon build, modeled on the reference app
**KrishiRakshak** (`cropwise-ai-care.vercel.app`).

---

## 1. Requirements Analysis

### 1.1 Product vision

Farmers photograph a crop leaf with their phone; the app returns:

1. **AI leaf diagnosis** — disease name, severity, calibrated confidence (< 10s)
2. **Curated disease library** — symptoms, causes, organic + chemical treatments, prevention
3. **Treatment timeline** — a step-by-step, checkable spray/treatment plan
4. **Weather-aware alerts** — warnings when humidity + rainfall create outbreak conditions
5. **Agriculture chatbot** — grounded, practical answers about crops/soil/fertilizer
6. **Nearby agri centres** — krishi kendra, soil labs, input dealers
7. **Multilingual** — English · हिन्दी · मराठी

### 1.2 Non-functional requirements

| Requirement | Decision |
|---|---|
| Diagnosis speed < 10s | Serverless route handlers, streaming chatbot, edge-friendly APIs |
| Mobile-first (farmers) | Responsive UI, image upload from camera, low bandwidth |
| Zero cost (hackathon) | Free tiers only: Gemini, Supabase, OpenWeatherMap |
| Deployability | Vercel (frontend + API routes) + Supabase (DB/Auth/Storage) |

---

## 2. Confirmed Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15** (App Router, TypeScript, RSC) | SSR + API routes, Vercel-native, modern default |
| Styling | **Tailwind CSS v4** | Utility-first, shadcn/ui-compatible component system |
| AI vision | **Google Gemini** (`gemini-2.0-flash` via `@google/genai`) | Free tier (~15 RPM), structured JSON output via `responseMimeType` |
| Chatbot | **OpenAI** (`gpt-4o-mini` via `openai` v4) | Grounded answers with disease-library context |
| Database | **Supabase Postgres** | Free tier, Row Level Security, JSONB for multilingual content |
| Auth | **Supabase Auth** | Email OTP + Google, SSR cookie sessions, `@supabase/ssr` |
| Storage | **Supabase Storage** | Uploaded leaf images, public URLs |
| Weather | **OpenWeatherMap** | Free tier, current + forecast (humidity/rain/temp) |
| Validation | **zod** | API input safety |
| i18n | **Custom lightweight dictionaries** (JSON: `en`/`hi`/`mr`) | No framework overhead; content stored as JSONB translations |

---

## 3. System Design

### 3.1 Diagnosis flow (core loop)

```
[Mobile browser]                          [Vercel — Next.js]                       [External]
      │  POST /api/diagnose                    │                                        │
      │  (FormData: leaf image, crop, locale)  │                                        │
      ▼                                        ▼                                        │
   Upload form  ───────────► 1. zod-validate (type, size ≤ 5MB)                         │
                               2. Upload image → Supabase Storage → public URL          │
                               3. Send base64 image + structured prompt to Gemini ─────►│ gemini-2.0-flash
                               ◄── JSON: { diseaseSlug|null, diseaseName, confidence,  │ (responseMimeType:
                                    severity, reasoning }                               │   application/json)
                               4. Join diseaseSlug against `diseases` table             │
                               5. Build treatment plan + timeline (multilingual)        │
                               6. Persist `diagnoses` + `treatment_plans` rows (RLS)    │
      ◄───────────── Diagnosis result + treatment plan (JSON)                          │
```

- **Structured output**: Gemini is given the curated list of disease slugs and told to return
  JSON matching `DiagnosisResult` (`types/index.ts`). Unknown/healthy leaves → `diseaseSlug: null`.
- **Confidence calibration**: raw model probability mapped to low/medium/high buckets + a 0–1 score.

### 3.2 Chatbot flow (streaming)

```
POST /api/chatbot  ──►  system prompt + compact disease-library context (grounding)
                         + recent messages  ──►  openai.chat.completions.create({stream:true})
                         ──►  SSE stream back to client
```

Grounding prevents hallucination: the library context injected is the relevant subset of
`diseases` rows (name, crop, symptoms, treatments) filtered by the user's query keywords.

### 3.3 Weather-aware alerts

```
GET /api/weather?lat=..&lng=..  ──►  OpenWeatherMap (current + 5-day forecast)
   Risk heuristic: RH > 85% AND rain expected AND temp 20–30°C for ≥ 2 days
   ──►  alert: { level: none|low|medium|high, message (localized), crops at risk }
```

### 3.4 Auth & session flow

- Supabase Auth (email OTP, Google) · `@supabase/ssr` cookie sessions
- Root `middleware.ts` → `updateSession()` refreshes tokens + protects `/dashboard/*`
- RLS policies enforce row ownership on `diagnoses`, `treatment_plans`, `profiles`
- Public tables (`diseases`, `agri_centres`) are read-only for everyone

### 3.5 i18n

- Locale in URL: `/en`, `/hi`, `/mr` (route group `[locale]`)
- UI strings: JSON dictionaries in `lib/i18n/`
- Content (disease treatments, alerts): stored as JSONB in `diseases.translations`
  with English as source of truth and AI-assisted translation for hi/mr

---

## 4. Data Model (Supabase)

Full DDL in `supabase/migrations/0001_init.sql`.

| Table | Purpose | Key columns |
|---|---|---|
| `profiles` | User profile (mirrors `auth.users`) | `id`, `full_name`, `preferred_language`, `location`, `crop_preference` |
| `diseases` | Curated disease library | `slug`, `name`, `crop`, `pathogen`, `severity`, `symptoms[]`, `causes[]`, `organic_treatments[]`, `chemical_treatments[]`, `prevention[]`, `translations jsonb` |
| `diagnoses` | Diagnosis history | `user_id`, `image_url`, `disease_id`, `disease_name`, `confidence`, `severity`, `status` |
| `treatment_plans` | Checkable timeline per diagnosis | `diagnosis_id`, `steps jsonb` `[{order,title,description,completed}]` |
| `agri_centres` | Seed data for locator | `name`, `type`, `address`, `phone`, `lat`, `lng`, `hours` |

---

## 5. Folder Structure

```
Freebuff/
├── app/
│   ├── (public)/                    # Marketing + public pages (landing, about)
│   ├── (dashboard)/                 # Authenticated area (diagnose, history, settings)
│   ├── api/
│   │   ├── diagnose/route.ts        # POST: leaf image → Gemini diagnosis
│   │   ├── chatbot/route.ts         # POST: agriculture Q&A (SSE stream)
│   │   ├── weather/route.ts         # GET: outbreak-risk weather alerts
│   │   ├── agri-centres/route.ts    # GET: nearby centres
│   │   └── diseases/route.ts        # GET: disease library
│   ├── [locale]/                    # i18n route segment (en | hi | mr)
│   ├── layout.tsx                   # Root layout + metadata
│   ├── page.tsx                     # Landing placeholder (UI ships next phase)
│   └── globals.css                  # Tailwind v4 entry
├── components/
│   ├── ui/                          # primitives: button, card, input, badge…
│   ├── layout/                      # navbar, footer, mobile nav
│   ├── diagnosis/                   # upload form, result card, treatment timeline
│   ├── chatbot/                     # chat window, message bubbles
│   └── disease/                     # disease library cards, detail view
├── lib/
│   ├── supabase/
│   │   ├── client.ts                # browser client (createBrowserClient)
│   │   ├── server.ts                # server client (createServerClient)
│   │   └── middleware.ts            # updateSession() token refresh + guard
│   ├── gemini/diagnosis.ts          # vision → structured DiagnosisResult
│   ├── openai/chatbot.ts            # grounded chat + streaming
│   ├── weather/risk.ts              # OpenWeatherMap client + risk heuristic
│   ├── i18n/                        # dictionaries (en/hi/mr) + helpers
│   ├── validations/                 # zod schemas for every API route
│   └── utils.ts                     # cn() class-merge helper
├── data/
│   ├── diseases/                    # curated disease dataset (source of truth)
│   └── agri-centres/                # seed data for locator
├── types/
│   └── index.ts                     # shared domain types
├── supabase/
│   └── migrations/0001_init.sql     # full schema + RLS + triggers
├── public/                          # static assets, images
├── middleware.ts                    # root middleware → updateSession
├── .env.example                     # documented env template
├── package.json / tsconfig.json / next.config.ts / postcss.config.mjs / eslint.config.mjs
└── ARCHITECTURE.md
```

---

## 6. API Surface

| Method / Route | Body / Query | Returns |
|---|---|---|
| `POST /api/diagnose` | FormData: `image`, `crop?`, `locale?` | `{ diagnosis: DiagnosisResult, treatmentPlan, disease? }` |
| `POST /api/chatbot` | `{ messages, locale? }` | SSE stream of assistant text |
| `GET /api/weather` | `?lat=&lng=` | `{ alert: WeatherAlert }` |
| `GET /api/agri-centres` | `?lat=&lng=&type=` | `AgriCentre[]` sorted by distance |
| `GET /api/diseases` | `?crop=&search=&locale=` | `Disease[]` (localized) |
| `POST /api/auth/send-otp` | `{ email }` | Supabase OTP trigger |

---

## 7. Environment Variables

See `.env.example`. Table:

| Variable | Used by | Required |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase client (browser + server) | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Seeding library / admin ops (server-only) | for seeding |
| `GEMINI_API_KEY` | `/api/diagnose` | ✅ |
| `OPENAI_API_KEY` | `/api/chatbot` | ✅ |
| `OPENWEATHER_API_KEY` | `/api/weather` | ✅ |
| `NEXT_PUBLIC_APP_URL` | Auth redirects, absolute URLs | dev default |

---

## 8. Hackathon Roadmap

| Phase | Deliverable |
|---|---|
| **0 (done)** | Scaffold: Next.js 15 + TS + Tailwind v4 + Supabase clients + schema migration |
| 1 | Supabase project setup, auth (OTP/Google), profiles, seeded disease data |
| 2 | Diagnosis flow: upload → Gemini → structured result + treatment plan |
| 3 | Disease library pages + checkable treatment timeline |
| 4 | Agriculture chatbot (OpenAI streaming) |
| 5 | Weather alerts + nearby agri centres + full i18n (en/hi/mr) |
| 6 | Polish, seed data, deploy to Vercel |

---

## 9. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Gemini returns free-form text | `responseMimeType: application/json` + `responseSchema` + zod re-validation |
| Rate limits during demo | Cache diagnoses server-side; fallback model (`gemini-2.0-flash-lite`); error UX |
| Offline/misidentification | "Unknown / healthy" path + confidence display + disclaimer |
| Translation quality | English source-of-truth; AI-translated fallbacks stored in JSONB |
| Supabase free-tier storage | Compress/resize images client-side before upload (max 5MB) |
