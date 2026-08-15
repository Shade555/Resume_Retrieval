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

## 🎯 Phase 2: Frontend UI Components (IN PROGRESS)

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
  - Accept search query string
  - Generate embedding for query
  - Call Supabase RPC `match_resumes()`
  - Return ranked results with scores
  - Pagination support

- [ ] `src/app/api/resumes/route.ts` - Resume management
  - GET: List all resumes with pagination
  - DELETE: Remove resume by ID
  - Filter by date range

- [ ] `src/app/api/resumes/[id]/route.ts` - Resume details
  - GET: Fetch single resume with full text
  - UPDATE: Modify candidate metadata
  - DELETE: Remove resume

- [ ] `src/app/api/skills/route.ts` - Skills extraction & aggregation
  - Analyze all resumes for skill frequency
  - Return top skills for filter suggestions

- [ ] `src/app/api/batch/upload/route.ts` - Batch resume upload
  - Accept multiple PDFs
  - Parallel embedding generation
  - Transaction rollback on failure

---

## 📦 Phase 4: PDF Processing (TO BUILD)

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

## 🎨 Phase 5: User Experience Enhancements

### Features to Implement

#### 1. **Advanced Search Filters**
- Filter by skills (multi-select)
- Filter by minimum relevance score
- Filter by upload date range
- Combine filters with AND/OR logic

#### 2. **Bulk Operations**
- Select multiple results for export
- Export as CSV/JSON
- Print resume view
- Share search results with team

#### 3. **Search History & Saved Queries**
- Save favorite searches
- Quick-access to past searches
- One-click re-run search
- Search analytics (most common queries)

#### 4. **Resume Annotations**
- Star/flag candidates
- Add private notes to resume
- Create candidate pipeline stages
- Assign to team members

#### 5. **Analytics Dashboard**
- Total resumes uploaded
- Search volume by skill
- Most searched keywords
- System performance metrics

---

## ⚙️ Phase 6: Performance & Production Optimization

### 1. **Embedding Caching**
- Cache generated embeddings (Redis or in-memory)
- Avoid re-computing identical queries
- Track cache hit rate

### 2. **Database Optimization**
- Add indexes on `embedding` column for pgvector
- Create composite indexes on frequently filtered fields
- Implement connection pooling
- Monitor query performance

### 3. **Frontend Performance**
- Lazy-load resume cards (Intersection Observer)
- Implement virtual scrolling for large result sets
- Code splitting for components
- Service Worker for offline cache

### 4. **API Rate Limiting & Quotas**
- Rate limit per user (100 queries/hour)
- Batch upload size limits (10MB per file, 100 files/day)
- Calculate and display quota usage

### 5. **Monitoring & Logging**
- Error tracking (Sentry or similar)
- API response time monitoring
- User analytics (Plausible or Fathom - privacy-focused)
- Database query performance logs

---

## 🔒 Phase 7: Security & Privacy

### 1. **Authentication & Authorization**
- User signup/login (Supabase Auth)
- Role-based access (Admin, Recruiter, Viewer)
- API key for programmatic access

### 2. **Data Privacy**
- GDPR compliance (right to delete, data export)
- Encrypted resume storage (at-rest)
- HTTPS-only communication
- No PII logging

### 3. **Input Validation**
- Sanitize search queries
- Validate file uploads (MIME type, size, content)
- SQL injection prevention (Supabase handles)
- XSS protection (React escapes by default)

### 4. **Rate Limiting & DDoS Protection**
- Implement request throttling
- CAPTCHA for suspicious activity
- IP-based rate limiting

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
- [ ] Install `pdfjs-dist` (`npm install pdfjs-dist`)
- [ ] Extract text from uploaded PDFs
- [ ] Clean and normalize text
- [ ] Commit: `feat(lib): add pdfParser for PDF text extraction`

**Tracking**: 
```
Status: Not started
Est. Completion: 
Commit: (pending)
```

#### Task 2: Extend Parse API ✅ → Update `src/app/api/parse/route.ts`
- [ ] Accept FormData with file upload
- [ ] Add file validation (MIME, size, 10MB limit)
- [ ] Integrate PDF parser
- [ ] Extract and store metadata (name, email, skills)
- [ ] Commit: `feat(api): extend parse endpoint to handle PDF uploads`

**Tracking**:
```
Status: Not started
Est. Completion: 
Commit: (pending)
```

#### Task 3: Build SearchBar Component ✅ → `src/components/SearchBar.tsx`
- [ ] Install `zustand` for state management
- [ ] Create component structure (dark mode primary)
- [ ] Apply gradient styling from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- [ ] Implement debounced search input
- [ ] Add search history (localStorage)
- [ ] Commit: `feat(components): add SearchBar component with dark mode styling`

**Tracking**:
```
Status: Not started
Est. Completion: 
Commit: (pending)
Colors Used: #A78BFA (purple), #7DD3FC (blue)
```

#### Task 4: Build Search API ✅ → `src/app/api/search/route.ts`
- [ ] Accept query string parameter
- [ ] Generate embedding using pipeline
- [ ] Call Supabase RPC `match_resumes()`
- [ ] Return ranked results with relevance scores
- [ ] Add pagination support
- [ ] Error handling for invalid queries
- [ ] Commit: `feat(api): add search endpoint with similarity matching`

**Tracking**:
```
Status: Not started
Est. Completion: 
Commit: (pending)
```

### SHORT-TERM (Weeks 2-3)

#### Task 5: Build ResumeCard Component → `src/components/ResumeCard.tsx`
- [ ] Install `clsx` for conditional classes
- [ ] Display candidate name, email, relevance score
- [ ] Show skills as styled badges (use DESIGN_SYSTEM.md colors)
- [ ] Highlight matching keywords in preview
- [ ] Add expand/collapse for full text view
- [ ] Commit: `feat(components): add ResumeCard with relevance scoring`

#### Task 6: Build UploadModal Component → `src/components/UploadModal.tsx`
- [ ] Create drag-and-drop zone
- [ ] File validation (PDF, < 10MB)
- [ ] Upload progress indicator
- [ ] Success/error toast notifications
- [ ] Commit: `feat(components): add UploadModal with drag-drop support`

#### Task 7: Update Main Dashboard → `src/app/page.tsx`
- [ ] Assemble all components (SearchBar, UploadModal, ResumeCard[])
- [ ] Apply dark mode gradient background
- [ ] Implement Zustand state management
- [ ] Responsive grid layout
- [ ] Commit: `feat(ui): integrate all components into main dashboard`

#### Task 8: Add Error Handling & Toast Notifications
- [ ] Install `react-hot-toast`
- [ ] Create error boundaries
- [ ] Add toast component for feedback
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
| `zustand` | latest | State management | `npm install zustand` | ⏳ To install |
| `react-hot-toast` | latest | Toast notifications | `npm install react-hot-toast` | ⏳ To install |
| `pdfjs-dist` | latest | PDF parsing | `npm install pdfjs-dist` | ⏳ To install |
| `clsx` | latest | Class utilities | `npm install clsx` | ⏳ To install |

### Phase 5-6 (Features & Performance)

| Package | Version | Purpose | Install Command | Status |
|---------|---------|---------|-----------------|--------|
| `lodash-es` | latest | Utility functions | `npm install lodash-es` | ⏳ To install |
| `date-fns` | latest | Date formatting | `npm install date-fns` | ⏳ To install |
| `react-intersection-observer` | latest | Lazy loading | `npm install react-intersection-observer` | ⏳ To install |
| `zod` | latest | Schema validation | `npm install zod` | ⏳ To install |

### Phase 7 (Production)

| Package | Version | Purpose | Install Command | Status |
|---------|---------|---------|-----------------|--------|
| `next-auth` | latest | Authentication | `npm install next-auth` | ⏳ To install |
| `@sentry/nextjs` | latest | Error tracking | `npm install @sentry/nextjs` | ⏳ To install |
| `pino` | latest | Logging | `npm install pino` | ⏳ To install |
| `compression` | latest | Gzip compression | `npm install compression` | ⏳ To install |

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

**Last Updated**: August 15, 2026
**Project Status**: Core infrastructure complete, proceeding to Phase 2 (UI Components)
**Next Milestone**: Complete PDF parser and Search API by end of this week
**Guidelines**: 
- See [COMMIT_CONVENTION.md](COMMIT_CONVENTION.md) for when/how to commit
- See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for all styling and colors
