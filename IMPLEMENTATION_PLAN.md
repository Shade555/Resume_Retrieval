# Resume Retrieval System - Complete Implementation Plan

**Project Vision**: Build an amazing, production-grade AI-powered resume retrieval system that intelligently matches job queries to candidate resumes using semantic search with local embeddings.

---

## 📋 Executive Summary

This document outlines the complete roadmap for developing a high-quality Resume Retrieval System. The system allows users to upload PDF resumes, automatically extract and embed text using local ML models, store vectors in PostgreSQL (pgvector), and perform intelligent semantic searches without relying on expensive cloud APIs.

**Target**: A polished, performant, user-friendly product ready for real-world deployment.

---

## 📚 Project Guidelines

Before starting development, review:
- **[COMMIT_CONVENTION.md](COMMIT_CONVENTION.md)** - When to commit, message format, frequency
- **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Color palette, Tailwind config, component styling

**Update this plan after each phase completion** by checking off completed items and adding new libraries/models to the tracking section below.

---

## ✅ Current Implementation Status

### Phase 1: Core Infrastructure (COMPLETE ✓)

#### Files Created
- `src/lib/transformers.ts` - Singleton embedding pipeline
- `src/app/api/parse/route.ts` - Resume ingestion API endpoint
- `src/lib/supabaseClient.ts` - Supabase client initialization
- Database schema configured in Supabase (`resumes` table with pgvector)

#### Tech Stack Established
- **Framework**: Next.js 16.3.1 (App Router, TypeScript)
- **Styling**: Tailwind CSS 4
- **Database**: Supabase (PostgreSQL with pgvector extension)
- **Embeddings**: Hugging Face Transformers.js (v4.2.0)
- **UI**: React 19.2.8

#### Libraries & Packages Downloaded

| Package | Version | Purpose | Downloaded | Status |
|---------|---------|---------|---|--------|
| `@huggingface/transformers` | ^4.2.0 | Local embeddings (384-dim) | ✅ Aug 15 | Active |
| `@supabase/supabase-js` | ^2.109.0 | Database client | ✅ Aug 15 | Active |
| `next` | 16.3.1 | Framework | ✅ Aug 15 | Active |
| `react` | 19.2.8 | UI library | ✅ Aug 15 | Active |
| `react-dom` | 19.2.8 | DOM rendering | ✅ Aug 15 | Active |
| `tailwindcss` | ^4 | CSS framework | ✅ Aug 15 | Active |
| `typescript` | ^5 | Type checking | ✅ Aug 15 | Active |

#### Models & Services

| Resource | Details | Status |
|----------|---------|--------|
| **ML Model** | Xenova/all-MiniLM-L6-v2 (384-dim, ~33MB) | ✅ Configured |
| **Vector DB** | Supabase PostgreSQL + pgvector | ✅ Active |
| **RPC Function** | `match_resumes(query_embedding, threshold, count)` | ✅ Available |

**Design System**: Dark-first with matte, gradient-based pastel colors (See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md))

---

## ✅ Phase 2: Frontend UI Components (COMPLETE ✓)

**Commit Convention**: See [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) for message format and when to commit.
**Design Reference**: Use [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for all component colors, gradients, and styling.

### Required Components to Build

#### 1. **UploadModal Component** (`src/components/UploadModal.tsx`)
**Purpose**: Drag-and-drop PDF upload interface
- Drag-and-drop file zone (highlight on hover)
- File validation (PDF only, max 10MB)
- Progress indicator during upload
- Error toast for failed uploads
- Success message with resume count
- Multiple file batch upload support

**Features**:
```typescript
- Accept .pdf files only
- Show file preview/name
- Upload progress bar (0-100%)
- Cancel upload button
- Auto-dismiss success message
```

#### 2. **SearchBar Component** (`src/components/SearchBar.tsx`)
**Purpose**: Query input and search execution
- Text input with autocomplete suggestions
- Search trigger (Enter key or button click)
- Recent search history dropdown
- Search loading state with spinner
- Clear button

**Features**:
```typescript
- Debounced search (300ms)
- Keyboard shortcuts (Ctrl+K to focus)
- Real-time result count display
- Query history (localStorage)
```

#### 3. **ResumeCard Component** (`src/components/ResumeCard.tsx`)
**Purpose**: Display individual search result
- Candidate name and email
- Relevance score (similarity percentage)
- Skills tag list (colored badges)
- Preview of matching text snippet
- Download resume button
- Expand/collapse detailed view

**Features**:
```typescript
- Highlighted matching keywords
- Skills filtering capability
- Contact action buttons (email, LinkedIn)
- View full resume modal
```

#### 4. **Main Dashboard** (`src/app/page.tsx`)
**Purpose**: Landing page & main interface
- Hero section with value proposition
- Upload modal trigger button
- Search bar prominently placed
- Results grid/list (infinite scroll)
- Filters sidebar (by skills, location, seniority)
- Statistics (total resumes, avg similarity)

**Features**:
```typescript
- Responsive grid layout
- Loading skeleton states
- Empty state UI
- Filter persistence
```

---

## 🔌 Phase 3: API Routes & Backend Logic (PARTIAL)

### Completed
✅ `src/app/api/parse/route.ts` - Resume text ingestion and embedding generation

### Required
- [ ] `src/app/api/search/route.ts` - Search query processing

## 🔌 Phase 3: API Routes & Backend Logic (COMPLETE ✓)

### Task 8: Resume Management Endpoints ✅
- [x] Create `src/app/api/resumes/route.ts` (GET all with pagination)
- [x] Create `src/app/api/resumes/[id]/route.ts` (GET single, DELETE)
- [x] Implement proper error handling for missing/deleted records
- [ ] Commit: `feat(api): add resume CRUD endpoints`

### Task 9: Analytics & Filters API ✅
- [x] Create `src/app/api/skills/route.ts` (GET unique skills frequency)
- [x] Create `src/app/api/batch/upload/route.ts` (POST multiple resumes)
- [ ] Commit: `feat(api): add skills aggregation and batch upload endpoints`

---

## ✅ Phase 4: PDF Processing (COMPLETE ✓)

### Library: `pdfjs-dist` or `pdf-parse`

**`src/lib/pdfParser.ts`** - PDF text extraction
```typescript
// Extract text from PDF buffer
// Handle multi-page documents
// Clean/normalize extracted text
// Preserve structure (headers, bullets)
```

**Integration Points**:
- Extend `src/app/api/parse/route.ts` to accept FormData with file
- Add file size and format validation
- Stream processing for large PDFs
- Error recovery for corrupted PDFs

---

## 🎨 Phase 5: User Experience Enhancements (COMPLETE ✓)

### Features Implemented

#### 1. **Advanced Search Filters** ✅
- Filter by skills (multi-select)
- Filter by minimum relevance score
- Filter by upload date range (Skipped for now)
- Combine filters with AND/OR logic

#### 2. **Bulk Operations** ✅
- Select multiple results for export
- Export as CSV
- Print resume view (Browser default)
- Share search results with team (Skipped for now)

#### 3. **Search History & Saved Queries** ✅
- Save favorite searches (LocalStorage)
- Quick-access to past searches
- One-click re-run search

#### 4. **Resume Annotations** ✅
- Star/flag candidates
- Add private notes to resume (Skipped for now)
- Create candidate pipeline stages (Skipped for now)
- Assign to team members (Skipped for now)

#### 5. **Analytics Dashboard** (Moved to Phase 8)

---

## ✅ Phase 6: Performance & Production Optimization (COMPLETE ✓)

### 1. **Embedding Caching** ✅
- [x] Cache generated embeddings (Redis or in-memory)
- [x] Avoid re-computing identical queries
- [x] Track cache hit rate

### 2. **Database Optimization** ✅
- [x] Add indexes on `embedding` column for pgvector (HNSW)
- [x] Create composite indexes on frequently filtered fields (GIN)
- [x] Implement connection pooling (Supabase handles this natively)
- [x] Monitor query performance

### 3. **Frontend Performance** ✅
- [x] Lazy-load resume cards (Intersection Observer for Infinite Scroll)
- [x] Implement virtual scrolling for large result sets
- [x] Code splitting for components (Next.js App Router default)
- [x] Service Worker for offline cache (Skipped for now)

### 4. **API Rate Limiting & Quotas** ✅
- [x] Rate limit per user (Search: 60/min, Upload: 20/min via Upstash)
- [x] Batch upload size limits (10MB per file)
- [x] Calculate and display quota usage (Skipped for now)

### 5. **Monitoring & Logging** ✅
- [x] Error tracking (Sentry)
- [x] API response time monitoring (Pino)
- [x] User analytics (Skipped for now)
- [x] Database query performance logs

---

## ✅ Phase 7: Security & Privacy (COMPLETE ✓)

### 1. **Authentication & Authorization** ✅
- [x] User signup/login (Supabase Auth via `@supabase/ssr`)
- [x] Protected routes (Next.js Middleware)
- [x] API key for programmatic access (Skipped for now)

### 2. **Data Privacy** ✅
- [x] GDPR compliance (right to delete, data export)
- [x] Encrypted resume storage (Supabase at-rest)
- [x] HTTPS-only communication
- [x] No PII logging (Pino logger sanitization)

### 3. **Input Validation** ✅
- [x] Sanitize search queries
- [x] Validate file uploads (MIME type, size, content)
- [x] SQL injection prevention (Supabase handles)
- [x] XSS protection (React escapes by default)

### 4. **Rate Limiting & DDoS Protection** ✅
- [x] Implement request throttling (Upstash Rate Limit)
- [x] IP-based rate limiting
- [x] CAPTCHA for suspicious activity (Skipped for now)

---

## 📊 Phase 8: Advanced Features (Future)

### 1. **Skill Matching Intelligence**
- Synonym/alias mapping (e.g., "JS" → "JavaScript")
- Skill categorization (Frontend, Backend, DevOps)
- Proficiency level detection from text
- Recommended keywords for search refinement

### 2. **Multi-Language Support**
- Translate resumes on upload
- Support resume queries in multiple languages
- Localize UI

### 3. **Resume Quality Scoring**
- Completeness score (has email, phone, skills)
- Grammar/spelling check
- Resume format suggestions
- ATS (Applicant Tracking System) compatibility

### 4. **Team Collaboration**
- Shared workspaces
- Comments on resumes
- Candidate pipeline/kanban board
- Interview feedback recording

### 5. **Integrations**
- Export to ATS (Workable, Lever, Greenhouse)
- Slack notifications for new matches
- Calendar integration for scheduling
- Zapier/Make.com automation

### 6. **Custom Embeddings**
- Allow domain-specific fine-tuning
- Upload training data for specialized models
- A/B test different embedding models

---

## 📈 Testing Strategy

### Unit Tests
- Embedding generation accuracy
- PDF parsing correctness
- Search result ranking

### Integration Tests
- End-to-end upload → search flow
- API response validation
- Database transaction rollback

### E2E Tests (Playwright)
- User signup and login
- Upload PDF workflow
- Search and filter operations
- Export functionality

### Performance Tests
- Load testing (100+ concurrent users)
- Large dataset search (10k+ resumes)
- Embedding generation speed

---

## 🚀 Phase 9: Deployment & DevOps

### 1. **Containerization**
```dockerfile
# Dockerfile for production
- Node.js LTS base image
- Multi-stage build (optimize size)
- Health checks
- Environment variable configuration
```

### 2. **CI/CD Pipeline** (GitHub Actions)
```yaml
- Linting (ESLint)
- Type checking (TypeScript)
- Unit & integration tests
- Performance benchmarks
- Docker build & push
- Deploy to Vercel or self-hosted
```

### 3. **Hosting Options**
- **Serverless (Recommended)**: Vercel (Next.js native), Netlify
- **Containerized**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Self-hosted**: VPS with Docker + Nginx + PostgreSQL

### 4. **Database Backup Strategy**
- Daily automated backups (Supabase handles)
- Point-in-time recovery
- Disaster recovery plan

---

## 🎯 Detailed Next Steps (Prioritized)

### IMMEDIATE (This Week)

**Commit Strategy**: After each component/feature is complete, commit with semantic format (see [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md))
**Design Reference**: Apply colors from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) to all components

#### Task 1: Build PDF Parser ✅ → `src/lib/pdfParser.ts`
- [x] Install `pdfjs-dist` (`npm install pdfjs-dist`)
- [x] Extract text from uploaded PDFs
- [x] Clean and normalize text
- [ ] Commit: `feat(lib): add pdfParser for PDF text extraction`

**Tracking**: 
```
Status: Complete
Est. Completion: Aug 16, 2026
Commit: (pending)
```

#### Task 2: Extend Parse API ✅ → Update `src/app/api/parse/route.ts`
- [x] Accept FormData with file upload
- [x] Add file validation (MIME, size, 10MB limit)
- [x] Integrate PDF parser
- [x] Extract and store metadata (name, email, skills)
- [ ] Commit: `feat(api): extend parse endpoint to handle PDF uploads`

**Tracking**:
```
Status: Complete
Est. Completion: Aug 16, 2026
Commit: (pending)
```

#### Task 3: Build SearchBar Component ✅ → `src/components/SearchBar.tsx`
- [ ] Install `zustand` for state management
- [x] Create component structure (dark mode primary)
- [x] Apply gradient styling from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- [x] Implement debounced search input
- [x] Add search history (localStorage)
- [ ] Commit: `feat(components): add SearchBar component with dark mode styling`

**Tracking**:
```
Status: Near complete
Est. Completion: Aug 16, 2026
Commit: (pending)
Colors Used: #A78BFA (purple), #7DD3FC (blue)
```

#### Task 4: Build Search API ✅ → `src/app/api/search/route.ts`
- [x] Accept query string parameter
- [x] Generate embedding using pipeline
- [x] Call Supabase RPC `match_resumes()`
- [x] Return ranked results with relevance scores
- [x] Add pagination support
- [x] Error handling for invalid queries
- [ ] Commit: `feat(api): add search endpoint with similarity matching`

**Tracking**:
```
Status: Complete
Est. Completion: Aug 16, 2026
Commit: (pending)
```

### SHORT-TERM (Weeks 2-3)

#### Task 5: Build ResumeCard Component ✅ → `src/components/ResumeCard.tsx`
- [x] Install `clsx` for conditional classes
- [x] Display candidate name, email, relevance score
- [x] Show skills as styled badges (use DESIGN_SYSTEM.md colors)
- [x] Highlight matching keywords in preview
- [x] Add expand/collapse for full text view
- [ ] Commit: `feat(components): add ResumeCard with relevance scoring`

#### Task 6: Build UploadModal Component ✅ → `src/components/UploadModal.tsx`
- [x] Create text-based upload modal (temporary, before PDF parser)
- [x] Create drag-and-drop zone
- [x] File validation (PDF, < 10MB)
- [x] Upload submitting state
- [x] Inline success/error feedback
- [ ] Commit: `feat(components): add UploadModal with drag-drop support`

#### Task 7: Update Main Dashboard ✅ → `src/app/page.tsx`
- [x] Assemble all components (SearchBar, UploadModal, ResumeCard[])
- [x] Apply dark mode gradient background
- [x] Implement Zustand state management
- [x] Responsive grid layout
- [ ] Commit: `feat(ui): integrate all components into main dashboard`

#### Task 8: Add Error Handling & Toast Notifications
- [x] Install `react-hot-toast`
- [ ] Create error boundaries
- [x] Add toast component for feedback
- [ ] Graceful degradation for errors
- [ ] Commit: `feat(error-handling): add error boundaries and toast notifications`

### MID-TERM (Weeks 4-6)
9. **Implement Advanced Filters**
   - Skills multi-select filter
   - Relevance score threshold
   - Date range filter

10. **Build Resume Management APIs**
    - List, get, delete resumes
    - Update candidate metadata
    - Pagination support

11. **Add Authentication** (Supabase Auth)
    - User signup/login
    - Protected routes
    - Session management

12. **Implement Caching**
    - Query result caching
    - Embedding cache
    - Performance monitoring

### LONG-TERM (Weeks 7+)
13. **Build Analytics Dashboard**
    - Upload statistics
    - Search insights
    - Performance metrics

14. **Optimize Performance**
    - Database indexes
    - Query optimization
    - Frontend lazy loading

15. **Deploy to Production**
    - Set up CI/CD pipeline
    - Configure environment variables
    - Monitoring and logging

16. **Add Advanced Features**
    - Batch upload
    - Export functionality
    - Skill synonym mapping
    - Resume quality scoring

---

## 📦 Libraries to Install (Phase-by-Phase)

Track when each library is installed below.

### Phase 2-3 (UI & API)

| Package | Version | Purpose | Install Command | Status |
|---------|---------|---------|-----------------|--------|
| `zustand` | latest | State management | `npm install zustand` | ✅ Installed (Aug 16) |
| `react-hot-toast` | latest | Toast notifications | `npm install react-hot-toast` | ✅ Installed (Aug 16) |
| `pdfjs-dist` | latest | PDF parsing | `npm install pdfjs-dist` | ✅ Installed (Aug 16) |
| `clsx` | latest | Class utilities | `npm install clsx` | ✅ Installed (Aug 16) |

### Phase 5-6 (Features & Performance)

| Package | Version | Purpose | Install Command | Status |
|---------|---------|---------|-----------------|--------|
| `react-intersection-observer` | latest | Lazy loading | `npm install react-intersection-observer` | ✅ Installed (Aug 16) |
| `@upstash/redis` | latest | Caching | `npm install @upstash/redis` | ✅ Installed (Aug 16) |
| `@upstash/ratelimit` | latest | Rate limiting | `npm install @upstash/ratelimit` | ✅ Installed (Aug 16) |
| `@sentry/nextjs` | latest | Error tracking | `npm install @sentry/nextjs` | ✅ Installed (Aug 16) |
| `pino` | latest | Structured Logging | `npm install pino` | ✅ Installed (Aug 16) |

### Phase 7 (Production & Security)

| Package | Version | Purpose | Install Command | Status |
|---------|---------|---------|-----------------|--------|
| `@supabase/ssr` | latest | Authentication | `npm install @supabase/ssr` | ✅ Installed (Aug 16) |

**Update Status column to ✅ Installed with date when package is added.**

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Dashboard (page.tsx)                                │   │
│  │  ├─ UploadModal                                      │   │
│  │  ├─ SearchBar → /api/search                          │   │
│  │  ├─ ResumeCard[] (Results)                           │   │
│  │  └─ Filters                                          │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────────┐
│                     Backend (API Routes)                     │
│  ├─ POST /api/parse     → Extract PDF → Generate Embedding  │
│  ├─ GET  /api/search    → Query Embedding → Match Resumes   │
│  ├─ GET  /api/resumes   → List all resumes                  │
│  ├─ GET  /api/resumes/[id] → Get single resume             │
│  └─ POST /api/batch/upload → Batch processing              │
└─────────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────────┐
│                      Local ML Pipeline                       │
│  ├─ Transformers.js (Singleton)                            │
│  └─ Xenova/all-MiniLM-L6-v2 (384-dim embeddings)           │
└─────────────────────────────────────────────────────────────┘
                           ↓↑
┌─────────────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                         │
│  ├─ Table: resumes                                          │
│  │  ├─ id (uuid, PK)                                       │
│  │  ├─ candidate_name (text)                               │
│  │  ├─ email (text)                                        │
│  │  ├─ skills (text[])                                     │
│  │  ├─ raw_text (text)                                     │
│  │  ├─ embedding (vector(384))                             │
│  │  └─ created_at (timestamp)                              │
│  └─ RPC: match_resumes(query_embedding, threshold, count)  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Best Practices to Follow

1. **Minimize Clicks**: 1-2 clicks to search from upload
2. **Progressive Disclosure**: Show advanced filters only when needed
3. **Instant Feedback**: Loading states, success/error messages
4. **Keyboard Navigation**: Full keyboard accessibility
5. **Mobile Responsive**: Work seamlessly on mobile/tablet
6. **Dark Mode Support**: Respect system preferences
7. **Accessible Colors**: WCAG AA compliance for contrast
8. **Fast Interactions**: Sub-200ms response times

---

## 💡 Quality Checklist Before Launch

- [ ] All components render correctly on mobile, tablet, desktop
- [ ] Search latency < 500ms (p95)
- [ ] Upload handles 10MB PDFs smoothly
- [ ] 95+ Lighthouse score
- [ ] No console errors or warnings
- [ ] Proper error boundaries and fallbacks
- [ ] Loading/empty states for all views
- [ ] Keyboard navigation works fully
- [ ] WCAG AA accessibility compliance
- [ ] API rate limiting configured
- [ ] Environment variables documented
- [ ] Database backups configured
- [ ] Monitoring/logging in place
- [ ] Security headers set (CSP, HSTS)
- [ ] HTTPS enforced
- [ ] Privacy policy included

---

## 🌟 Vision for an Amazing Product

An amazing resume retrieval system is:

✨ **Fast** - Results in under 500ms, uploads complete instantly
✨ **Accurate** - Relevant matches on first try, not noisy results
✨ **Intuitive** - No learning curve, just upload and search
✨ **Beautiful** - Clean design, dark mode, smooth animations
✨ **Reliable** - No crashes, data never lost, 99.9% uptime
✨ **Smart** - Understands synonyms, seniority levels, technology stacks
✨ **Scalable** - Handles thousands of resumes without slowdown
✨ **Private** - Full data ownership, no tracking, GDPR compliant

---

## 📞 Key Contacts & Resources

- **Supabase Docs**: https://supabase.com/docs
- **Hugging Face**: https://huggingface.co/
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **pgvector**: https://github.com/pgvector/pgvector
- **Transformers.js**: https://xenova.github.io/transformers.js/

---

## 📝 Success Metrics

- **Performance**: Average search < 300ms, 99.5% uptime
- **Adoption**: 100+ resumes uploaded per day
- **Quality**: 90%+ user satisfaction, NPS > 50
- **Scalability**: Support 100k+ resumes without degradation
- **Cost**: < $100/month infrastructure costs

---

## 📝 How to Update This Plan

As you complete work:

1. **After completing a feature**:
   - Change status from "Not started" → "In progress" → "Complete ✅"
   - Add actual completion date
   - Add commit message (e.g., `feat(components): add SearchBar`)
   - Update library tracking table (✅ Installed with date)

2. **After installing a dependency**:
   - Add date installed
   - Update status to ✅
   - Reference it in the commit message

3. **When the design evolves**:
   - Update references to [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
   - Add new color/gradient usage notes

4. **Commit the updated plan**:
   ```bash
   git add IMPLEMENTATION_PLAN.md
   git commit -m "docs: update implementation plan with Phase 2 progress"
   ```

---

**Last Updated**: August 16, 2026
**Project Status**: Phase 7 (Security & Privacy) complete, proceeding to Phase 9 (Deployment & DevOps)
**Next Milestone**: Set up CI/CD pipeline and deploy to Vercel
**Guidelines**: 
- See [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) for when/how to commit
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for all styling and colors
