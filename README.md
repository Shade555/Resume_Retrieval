# Resume Retrieval System

AI-powered semantic resume retrieval built with Next.js, Supabase, pgvector, and local embeddings using Hugging Face Transformers.js.

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- Next.js Middleware (Route Protection & Edge Auth)
- Tailwind CSS
- Supabase PostgreSQL with pgvector (Row Level Security Enabled)
- Supabase Auth (`@supabase/ssr`)
- Local embeddings with all-MiniLM-L6-v2 (384 dimensions) via @huggingface/transformers

## Prerequisites

- Node.js 18+ (latest LTS recommended)
- npm
- Supabase project with:
	- resumes table including embedding vector(384)
	- match_resumes RPC function

## Production Deployment (Vercel)

This project is fully optimized for Vercel's free serverless tier. Since Vercel Serverless Functions have a strict 10-second timeout, downloading large AI models on-the-fly will cause a `500 Internal Server Error`. 

To solve this, we use a **Model Bundling** architecture:
1. The `onnxruntime-node` native C++ binary is explicitly excluded from Webpack via `serverExternalPackages` in `next.config.ts`.
2. The `Xenova/all-MiniLM-L6-v2` model is downloaded directly into the local `./models` directory using the provided `scripts/download-model.mjs`.
3. Vercel is instructed to upload this `./models` directory into the Serverless environment via `outputFileTracingIncludes`.
4. `transformers.js` is configured to **strictly read from the local disk** (`env.allowRemoteModels = false`).

This completely eliminates network downloading during a serverless "cold start," allowing the AI to boot and run inference in under 3 seconds—well within Vercel's 10-second limit.

### Prerequisites for Vercel Deployment

Before pushing to Vercel, you must run the model download script locally so the model is committed to your repository:

```bash
npm run setup:model
git add models/
git commit -m "chore: bundle local ai model for vercel"
git push
```

## External Services Setup & Environment Variables

This project relies on a few critical external services. Create a `.env.local` file in the root of your project and configure the following variables.

### 1. Supabase (Database & pgvector)
We use Supabase for PostgreSQL and vector storage.
1. Create a project at [Supabase](https://supabase.com/).
2. Enable the `pgvector` extension.
3. Run the SQL script found in `scripts/optimize_db.sql` to create your tables, functions, and HNSW indexes.
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
# Optional (for server-side bypass of RLS)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Hugging Face Transformers.js (Local ML)
We use `@huggingface/transformers` to generate embeddings directly in your Node.js runtime using the `all-MiniLM-L6-v2` model.
- **Setup:** None required! The model downloads automatically on the first run and operates locally. No API keys needed.

### 3. Upstash Redis (Caching & Rate Limiting)
We use Upstash for distributed caching (to skip re-embedding identical queries) and rate-limiting (to protect APIs).
1. Create a free account at [Upstash](https://upstash.com/).
2. Create a Redis database.
3. Scroll down to the REST API section and copy the URL and token.
```env
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
```

### 4. Sentry (Error Tracking)
We use Sentry for production crash reporting and performance tracing.
1. Create a Next.js project at [Sentry.io](https://sentry.io/).
2. Follow the wizard in your terminal by running `npx @sentry/wizard@latest -i nextjs`.
3. Save the generated Auth Token to your CI/CD provider, or locally to test.
```env
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_generated_sentry_auth_token
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Build and Run Production

```bash
npm run build
npm run start
```

## Lint

```bash
npm run lint
```

## How to Test the App (UI)

1. Start the app with npm run dev.
2. Open http://localhost:3000.
3. Click Add Resume Text and paste raw resume text.
4. Run a search query, for example: Frontend developer with React experience.
5. Verify ranked results appear with similarity scores.

Note: The first embedding request can be slower because the model loads locally.

## API Testing

### Parse Endpoint

```bash
curl -X POST http://localhost:3000/api/parse \
	-H "Content-Type: application/json" \
	-d '{"raw_text":"John Doe frontend engineer react typescript"}'
```

Expected:
- HTTP 201
- JSON response with message and resumeId

### Search Endpoint

```bash
curl -X POST http://localhost:3000/api/search \
	-H "Content-Type: application/json" \
	-d '{"query":"Frontend developer with React","threshold":0.35,"count":12}'
```

Expected:
- HTTP 200
- JSON response with ranked results by similarity

## Current API Endpoints

- `POST /api/parse`
  - Accepts text or PDF via FormData
  - Generates a 384-dimensional embedding and stores in Supabase
- `POST /api/search`
  - Accepts query, threshold, limit, and pagination params
  - Generates query embedding locally and calls match_resumes RPC
- `GET /api/resumes`
  - Lists all uploaded resumes with pagination and date filtering
- `GET /api/resumes/[id]`
  - Retrieves full details for a specific resume
- `PATCH /api/resumes/[id]`
  - Updates candidate metadata (name, email, skills)
- `DELETE /api/resumes` & `DELETE /api/resumes/[id]`
  - Deletes a resume and its embedding
- `GET /api/skills`
  - Analyzes the database and aggregates unique skill frequencies
- `POST /api/batch/upload`
  - Uploads multiple PDF resumes in parallel with strict transaction rollbacks

*Note: All API routes and the dashboard are protected by Next.js Middleware and require Supabase Authentication.*

## Project Structure (Current)

- UI page: app/page.tsx
- Global styles: app/globals.css
- Parse API: src/app/api/parse/route.ts
- Search API: src/app/api/search/route.ts
- Components:
	- src/components/SearchBar.tsx
	- src/components/ResumeCard.tsx
	- src/components/UploadModal.tsx
- Embeddings singleton: src/lib/transformers.ts
- Supabase client: src/lib/supabaseClient.ts

## Notes

- App is dark-first with a light mode toggle.
- Embeddings are generated locally (no paid API usage).
- Keep IMPLEMENTATION_PLAN.md updated after each feature commit.
