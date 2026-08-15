# Agent Context & Project Handoff Guide

**Project**: Resume Retrieval System (AI-powered semantic search for resumes)
**Last Updated**: August 15, 2026
**Primary Agent**: (Initial setup and Phase 1-2)
**Future Agent**: (Continuation from Phase 2 onward)

---

## 🎯 Project Overview

This is a **production-grade AI resume retrieval system** that allows users to:
1. Upload PDF resumes
2. Automatically extract text and generate 384-dimensional vector embeddings (locally, no paid APIs)
3. Store resumes in a Supabase PostgreSQL database with pgvector
4. Search for candidates using semantic similarity matching

**Vision**: An amazing, fast, accurate, user-friendly product that doesn't rely on expensive cloud APIs.

---

## 🛠️ Tech Stack (Fixed)

| Category | Technology | Version | Notes |
|----------|-----------|---------|-------|
| **Framework** | Next.js (App Router) | 16.3.1 | TypeScript enabled |
| **UI Library** | React | 19.2.8 | With Server Components |
| **Styling** | Tailwind CSS | ^4 | Dark-first design system |
| **Database** | Supabase (PostgreSQL) | Latest | pgvector extension enabled |
| **Embeddings** | Hugging Face Transformers.js | ^4.2.0 | Xenova/all-MiniLM-L6-v2 (384-dim) |
| **Client SDK** | @supabase/supabase-js | ^2.109.0 | For DB operations |
| **Type Safety** | TypeScript | ^5 | Strict mode enabled |

**CONSTRAINT**: Absolutely no OpenAI, Anthropic, or paid APIs. All embeddings generated locally.

---

## 📁 Project Structure

```
resume_retrieval/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── parse/
│   │   │   │   └── route.ts          # Resume text → embedding → store
│   │   │   └── search/               # (To be built) Query → search results
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Main dashboard
│   ├── components/
│   │   ├── SearchBar.tsx             # (To be built)
│   │   ├── ResumeCard.tsx            # (To be built)
│   │   ├── UploadModal.tsx           # (To be built)
│   │   └── ThemeToggle.tsx           # (To be built)
│   └── lib/
│       ├── transformers.ts           # Embedding pipeline singleton
│       ├── supabaseClient.ts          # Supabase initialization
│       └── pdfParser.ts              # (To be built) PDF → text
├── .env.local                         # Supabase credentials (DO NOT COMMIT)
├── IMPLEMENTATION_PLAN.md             # Phase breakdown, task tracking
├── COMMIT_CONVENTION.md               # Git workflow & message format
├── DESIGN_SYSTEM.md                   # Color palette, Tailwind config
├── AGENT_CONTEXT.md                   # This file (agent handoff)
├── tailwind.config.ts                 # Tailwind with design tokens
├── tsconfig.json                      # TypeScript config
└── package.json                       # Dependencies
```

---

## ✅ Current Implementation Status

### Phase 1: Core Infrastructure (COMPLETE ✅)

**What's Done**:
- ✅ Next.js 16 app initialized with TypeScript
- ✅ Tailwind CSS configured
- ✅ Supabase client setup (`src/lib/supabaseClient.ts`)
- ✅ Embedding pipeline built (`src/lib/transformers.ts`)
  - Singleton pattern prevents re-downloading model
  - Uses Hugging Face Transformers.js (NOT Xenova)
  - Generates 384-dimensional embeddings
  - Includes validation for dimension checking
- ✅ Parse API endpoint created (`src/app/api/parse/route.ts`)
  - Accepts raw text in request body
  - Generates embedding via pipeline
  - Stores in Supabase `resumes` table
  - Full error handling
- ✅ Database schema configured in Supabase
  - Table: `resumes` (id, candidate_name, email, skills, raw_text, embedding)
  - RPC function: `match_resumes()` for similarity search
- ✅ Design system established (See DESIGN_SYSTEM.md)
  - Dark-first palette with pastel gradients
  - Tailwind config ready to use
  - Light mode support included

**Libraries Installed**:
- `@huggingface/transformers` - Local embeddings
- `@supabase/supabase-js` - Database operations
- `next`, `react`, `react-dom` - Framework
- `tailwindcss` - Styling
- `typescript` - Type safety

### Phase 2: Frontend UI Components (NEXT)

**What's Needed** (In Priority Order):
1. PDF Parser (`src/lib/pdfParser.ts`) - Extract text from PDFs
2. Extend Parse API - Accept FormData + files
3. SearchBar Component - Query input with debouncing
4. Search API Route - Query embedding + similarity search
5. ResumeCard Component - Display results
6. UploadModal Component - Drag-and-drop upload
7. Update Dashboard - Assemble all components
8. Error Handling & Toasts - User feedback

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for detailed breakdown.

---

## 📚 Essential Documents to Read

Before continuing, read these in order:

1. **[IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** (CRITICAL)
   - What's done, what's next
   - Phase breakdown with tasks
   - Library tracking
   - Shows where to add completed work
   - **UPDATE THIS AFTER EACH PHASE**

2. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** (REFERENCE)
   - Dark/light mode colors
   - Gradient presets
   - Component styling
   - Tailwind configuration
   - Use for all UI work

3. **[COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)** (WORKFLOW)
   - When to commit (after each feature)
   - Commit message format (semantic)
   - Frequency guidelines
   - Commit checklist
   - Example workflow

---

## 🔄 How to Continue the Project

### 1. Review Current State
```bash
# Check existing files
cat src/lib/transformers.ts        # Embedding pipeline
cat src/app/api/parse/route.ts     # Parse endpoint
cat IMPLEMENTATION_PLAN.md         # Where we are
```

### 2. Pick Your Next Task
From [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) Phase 2 section:
- Usually starts with PDF Parser
- Then Search API
- Then UI components

### 3. Before Building
- Read the specific task in IMPLEMENTATION_PLAN.md
- Check DESIGN_SYSTEM.md for styling
- Decide what libraries need installing

### 4. While Building
- Reference [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for ALL colors/gradients
- Use dark mode first (primary), light mode second (dark: prefix)
- Keep components small and focused
- Test both dark and light themes

### 5. After Completing a Feature
```bash
# 1. Verify it works (manual testing)
# 2. Install any new libraries
npm install <package-name>

# 3. Update the implementation plan
# Open IMPLEMENTATION_PLAN.md, mark task complete with:
# - [x] checkbox
# - Add completion date
# - Add commit message
# - Update library table if libs were installed

# 4. Stage changes
git add .

# 5. Commit using semantic format
git commit -m "feat(components): add SearchBar component with dark mode styling

- Implement debounced search input
- Add keyboard navigation (Ctrl+K)
- Use gradient color from design system"

# 6. Push to branch
git push origin main
```

---

## 🎨 Design System Quick Reference

### Colors (Dark Mode - Primary)
```
Purple: #A78BFA - Main CTA, links
Blue: #7DD3FC - Secondary, hover
Pink: #F472B6 - Highlights, badges
Mint: #6EE7B7 - Success states
Peach: #FCA5A5 - Warnings

Backgrounds:
Base: #0F0F0F - Page background
Card: #1A1A1A - Cards, modals
Hover: #262626 - Interactive hover
Border: #333333 - Dividers
```

### Common Tailwind Classes (Pre-configured)
```jsx
// Button primary
className="bg-gradient-primary text-surface-base px-6 py-3 rounded-default"

// Card
className="bg-card border border-matte rounded-lg p-6 shadow-matte hover:shadow-matte-lg"

// Input
className="bg-card border border-matte rounded-default px-4 py-2 focus:border-dark-purple"

// Badge (Skill)
className="bg-dark-purple/10 text-dark-purple border border-dark-purple/20 rounded-full px-3 py-1"
```

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for complete reference.

---

## 🚀 Deployment & Infrastructure

### Environment Variables Needed
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>  # Backend only
```

### Database Schema
Already configured in Supabase. Table structure:
```sql
CREATE TABLE resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_name TEXT,
  email TEXT,
  skills TEXT[],
  raw_text TEXT,
  embedding vector(384),
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX ON resumes USING ivfflat (embedding vector_cosine_ops);
```

### RPC Function Available
```sql
match_resumes(query_embedding, match_threshold, match_count)
-- Returns: Top matching resumes with similarity scores
```

---

## 🔒 Security & Best Practices

### DO:
- ✅ Keep `.env.local` in `.gitignore` (never commit secrets)
- ✅ Use TypeScript strict mode (no `any` without reason)
- ✅ Validate all API inputs
- ✅ Test both dark and light modes
- ✅ Use semantic commits
- ✅ Update IMPLEMENTATION_PLAN.md as you progress
- ✅ Add error boundaries for components
- ✅ Handle loading and empty states

### DON'T:
- ❌ Commit `.env.local`
- ❌ Use OpenAI/paid APIs for embeddings
- ❌ Leave `console.log()` in production code
- ❌ Commit incomplete features
- ❌ Skip tests before committing
- ❌ Mix styling + features in one commit
- ❌ Commit commented-out code
- ❌ Forget to update the plan

---

## 📊 Development Phases Overview

| Phase | Focus | Estimated Weeks | Status |
|-------|-------|-----------------|--------|
| 1 | Core Infrastructure | 1 | ✅ Complete |
| 2 | Frontend UI Components | 2-3 | 🔄 In Progress |
| 3 | API Routes & Backend | 1-2 | ⏳ To Do |
| 4 | PDF Processing | 1 | ⏳ To Do |
| 5 | User Experience Features | 2-3 | ⏳ To Do |
| 6 | Performance & Optimization | 2 | ⏳ To Do |
| 7 | Security & Privacy | 1-2 | ⏳ To Do |
| 8 | Advanced Features | 2-3 | ⏳ To Do |
| 9 | Deployment & DevOps | 1-2 | ⏳ To Do |

---

## 🎯 Common Tasks & How to Do Them

### Installing a New Library
```bash
npm install <package-name>
git add package.json package-lock.json
git commit -m "chore(deps): add <package-name> for <purpose>"
# Then update IMPLEMENTATION_PLAN.md library table
```

### Creating a New Component
```bash
# 1. Create file: src/components/ComponentName.tsx
# 2. Use design tokens from DESIGN_SYSTEM.md
# 3. Test dark and light modes
# 4. Commit:
git commit -m "feat(components): add ComponentName with dark mode styling"
# 5. Update IMPLEMENTATION_PLAN.md
```

### Creating a New API Route
```bash
# 1. Create file: src/app/api/route-name/route.ts
# 2. Add error handling
# 3. Test with curl or Postman
# 4. Commit:
git commit -m "feat(api): add route-name endpoint"
# 5. Update IMPLEMENTATION_PLAN.md
```

### Debugging Issues
```bash
# Check what's not working
npm run build  # Build errors show up here
npm run dev    # Run dev server and check browser console

# Common issues:
# - Color not applying? Check DESIGN_SYSTEM.md for correct class names
# - Embedding failing? Check that query text is non-empty string
# - Supabase error? Verify .env.local has correct credentials
# - TypeScript error? Run: npx tsc --noEmit
```

---

## 🔗 Important Links & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Hugging Face Transformers**: https://huggingface.co/Xenova/all-MiniLM-L6-v2
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **pgvector**: https://github.com/pgvector/pgvector
- **Conventional Commits**: https://www.conventionalcommits.org/

---

## ✨ Handoff Checklist

When passing this project to another agent, verify:

- [ ] Agent has read this file (AGENT_CONTEXT.md)
- [ ] Agent has read IMPLEMENTATION_PLAN.md
- [ ] Agent has read DESIGN_SYSTEM.md
- [ ] Agent has read COMMIT_CONVENTION.md
- [ ] Agent understands the tech stack
- [ ] Agent can access Supabase credentials (in .env.local)
- [ ] Agent knows to update IMPLEMENTATION_PLAN.md after each phase
- [ ] Agent commits using semantic format
- [ ] Agent never commits secrets
- [ ] Agent understands Phase 1 is complete, Phase 2 starts next

---

## 📝 Questions This File Answers

**Q: How do I know what to build next?**
A: Check IMPLEMENTATION_PLAN.md Phase 2 section. Tasks are listed in priority order.

**Q: What colors should I use?**
A: See DESIGN_SYSTEM.md. All colors are defined with Tailwind classes ready to use.

**Q: When should I commit?**
A: After each feature/component is complete and tested. See COMMIT_CONVENTION.md.

**Q: How do I format commit messages?**
A: Use semantic format: `feat(scope): description`. Examples in COMMIT_CONVENTION.md.

**Q: What if I install a new library?**
A: Update IMPLEMENTATION_PLAN.md library table and commit it with the library.

**Q: How do I test dark/light modes?**
A: Press theme toggle (will be built). Verify all text is readable and colors match DESIGN_SYSTEM.md.

**Q: Can I use OpenAI/GPT for embeddings?**
A: NO. All embeddings MUST be generated locally with Hugging Face Transformers.js.

**Q: What's the embedding model?**
A: Xenova/all-MiniLM-L6-v2. Outputs 384 dimensions. Non-negotiable.

**Q: Where are the database credentials?**
A: In .env.local (never committed). Supabase project must have pgvector enabled.

---

## 🚀 Next Agent: Start Here

If you're the next agent taking over this project:

1. **Read this file** (you're reading it now ✓)
2. **Read [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md)** - Understand what's done and what's next
3. **Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Learn the visual language
4. **Read [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)** - Understand the workflow
5. **Review existing code**:
   - `src/lib/transformers.ts` - How embeddings work
   - `src/app/api/parse/route.ts` - How data flows in
   - `src/lib/supabaseClient.ts` - How DB connection works
6. **Pick the first task** from IMPLEMENTATION_PLAN.md Phase 2
7. **Start building** using these guides as reference
8. **Commit** following the conventions
9. **Update IMPLEMENTATION_PLAN.md** when done
10. **Commit the plan update** separately

**Estimated time to get up to speed: 30-45 minutes**

---

**Last Updated**: August 15, 2026
**Created By**: Initial Agent
**Project Status**: Phase 1 complete, Phase 2 ready to start
**Handoff Status**: Ready for next agent 🚀
