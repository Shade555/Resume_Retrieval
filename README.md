<div align="center">
  <br />
  <h1>✨ Resume Retrieval System ✨</h1>
  <p>
    <strong>AI-Powered Semantic Resume Search & Matching</strong>
  </p>
  <p>
    Built with Next.js 16, Supabase, pgvector, and Local ML Embeddings.
  </p>
  <br />
</div>

## 🌌 Overview

The **Resume Retrieval System** is an ultra-modern, fully serverless applicant tracking engine. Instead of relying on traditional keyword searches, it uses **Semantic AI** to understand the *meaning* behind a query and match it with the most relevant candidates—even if they use different terminology.

By running the Hugging Face `all-MiniLM-L6-v2` model directly in your Node.js runtime, we achieve zero-cost, hyper-fast AI embeddings without relying on paid APIs like OpenAI. 

---

## 🚀 Key Features

- **🧠 Semantic Search**: Uses AI embeddings to understand context. Searching for "UI Engineer" will intelligently match resumes containing "Frontend Developer" or "React Specialist".
- **⚡ Serverless Optimized**: Custom **Model Bundling** architecture ensures the AI model boots and runs inference in under 3 seconds on Vercel's free tier.
- **🎨 Awwwards-Level UI**: Fluid, micro-interaction-rich interface built with Tailwind CSS v4, Framer-motion-style CSS transitions, and a matte dark aesthetic.
- **🔒 Secure & Private**: Built on Supabase Auth and Row Level Security. Resumes and embeddings are strictly protected.

---

## 🔍 Example Search Queries

Try these natural language queries to see the semantic AI in action:

- *"Frontend developer with 5+ years of React and TypeScript experience"*
- *"Machine learning engineer specializing in PyTorch and NLP"*
- *"Senior DevOps engineer who knows Kubernetes, Docker, and AWS"*
- *"Product manager with experience leading Agile teams and using Jira"*
- *"Someone who is an engineering intern"* (The system will highlight related skills even if "intern" isn't explicitly listed as a job title!)

---

## 🛠️ The Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase PostgreSQL with `pgvector`
- **Authentication:** Supabase Auth (`@supabase/ssr`)
- **AI / ML:** `@huggingface/transformers` (`Xenova/all-MiniLM-L6-v2` - 384 dimensions)
- **Caching & Rate Limiting:** Upstash Redis
- **Error Tracking:** Sentry

---

## ☁️ Vercel Deployment Architecture

This project is meticulously optimized for Vercel's free serverless tier. Since Vercel Serverless Functions have a strict 10-second timeout, downloading a 30MB+ AI model on-the-fly will cause a `500 Internal Server Error`. 

To solve this, we use a **Model Bundling** approach:
1. The `onnxruntime-node` native C++ binary is explicitly excluded from Webpack via `serverExternalPackages`.
2. The AI model is downloaded locally to `./models` via `scripts/download-model.mjs`.
3. Vercel is instructed to bundle this `./models` directory directly into the Serverless container.
4. `transformers.js` is locked to **strictly read from the local disk** (`env.allowRemoteModels = false`).

This eliminates all network latency during serverless cold starts, keeping response times well under Vercel's limits.

### Push to Vercel

Before deploying, run the setup script to bundle the model into your repo:
```bash
npm run setup:model
git add models/
git commit -m "chore: bundle local ai model for vercel deployment"
git push
```

---

## ⚙️ Local Development Setup

### 1. Environment Variables
Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Sentry
SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_generated_sentry_auth_token
```

### 2. Database Setup
1. Create a [Supabase](https://supabase.com/) project.
2. Enable the `pgvector` extension.
3. Run the SQL script found in `scripts/optimize_db.sql` to generate the schemas, `match_resumes` RPC, and HNSW indexes.

### 3. Install & Run
```bash
npm install
npm run dev
```
Navigate to `http://localhost:3000`. The AI model will download automatically on the first API request.

---

## 📡 API Endpoints

- `POST /api/parse`: Uploads and parses PDF/text, generates a 384-dimensional embedding, and saves to pgvector.
- `POST /api/search`: Accepts a natural language query, embeds it locally, and executes the Supabase RPC similarity search.
- `POST /api/batch/upload`: Uploads multiple resumes in parallel with strict transaction rollbacks.
- `GET /api/resumes`: Lists all resumes with pagination.
- `GET /api/skills`: Analyzes the database to extract and rank unique skill frequencies.

---

<div align="center">
  <i>Designed for performance. Built for scale.</i>
</div>
