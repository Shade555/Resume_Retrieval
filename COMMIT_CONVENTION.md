# Git Commit Convention & Workflow Guide

## 📝 Commit Message Format

Follow **Conventional Commits** format for clarity and automated changelog generation.

### Standard Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of:
- **feat**: A new feature (e.g., new component, new API endpoint)
- **fix**: A bug fix
- **refactor**: Code refactoring without adding features or fixing bugs
- **perf**: Performance improvements
- **style**: CSS/styling changes, formatting
- **test**: Adding or updating tests
- **docs**: Documentation changes
- **chore**: Dependencies, build config, setup scripts
- **ci**: CI/CD pipeline changes

### Scope (Optional)
Specifies what part of the codebase is affected:
- `components` - UI components
- `api` - API routes
- `lib` - Library utilities
- `db` - Database schema/config
- `config` - Configuration files
- `ui` - UI/design tokens
- `auth` - Authentication
- `perf` - Performance

### Subject Rules
- Use imperative mood ("add" not "added" or "adds")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters
- Be specific and descriptive

### Body (Optional but Recommended for Substantial Changes)
- Explain **what** and **why**, not how
- Wrap at 72 characters
- Separate from subject with blank line
- Use bullet points for multiple changes

### Footer (Optional)
Used for:
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Fixes #123`, `Closes #456`
- Co-authored: `Co-authored-by: Name <email>`

---

## ✅ Commit Examples

### Simple Feature
```
feat(components): add SearchBar component

- Implement debounced search input
- Add keyboard navigation (Ctrl+K)
- Display recent search history
```

### Bug Fix
```
fix(api): handle null embedding in parse endpoint

The endpoint was crashing when transformers returned an unexpected shape.
Added validation to ensure 384-dimensional vector before storing.

Fixes #42
```

### Styling
```
style(ui): apply dark mode gradient to hero section

Updated Tailwind classes to use new pastel gradient defined in design system.
```

### Refactor
```
refactor(lib): simplify embedding pipeline initialization

Extract singleton logic into dedicated function to improve testability.
```

### Performance
```
perf(components): implement virtual scrolling for resume results

Reduces DOM nodes from 1000+ to ~20, improving render time by 60%.
```

### Documentation
```
docs: update implementation plan with phase 2 completion
```

### Dependencies
```
chore(deps): add zod for schema validation

Will be used for API request/response validation throughout the app.
```

---

## 🎯 When to Commit

### Commit After Completing:

#### ✅ **DO COMMIT**
1. **Feature Completion** - A feature is fully functional and tested
   - Example: SearchBar component is built, styled, and integrated
   - Example: Search API endpoint works end-to-end

2. **Bug Fix** - A bug is fixed and verified
   - Create a minimal test case proving the fix works
   - Reference the issue number

3. **UI Component** - A new component is finished
   - Component is created
   - Component is styled (dark + light modes)
   - Component is integrated into parent

4. **API Endpoint** - A new route is complete
   - Route handles success cases
   - Route has error handling
   - Route is documented in code

5. **Dependency Updates** - After installing/updating packages
   - Commit right after `npm install`
   - Ensures everyone has same package-lock.json

6. **Config Changes** - After modifying configuration
   - Tailwind config updates
   - TypeScript config changes
   - Environment setup

7. **Test Addition** - After writing tests
   - New test file or test cases
   - Include test coverage improvement

#### ❌ **DO NOT COMMIT**
- Incomplete features (mid-way through building)
- Console.log() statements left in production code
- Commented-out code (either delete or commit separately with explanation)
- Broken functionality (always verify before committing)
- Just dependency installs without actual code changes
- Temporary debugging branches

---

## 📋 Commit Checklist

Before running `git commit`, verify:

```
☐ Feature/fix is complete and working
☐ Code is tested (manual testing at minimum)
☐ No console errors or warnings
☐ Dark mode AND light mode look correct
☐ TypeScript types are correct (no `any` unless necessary)
☐ No `console.log()` statements left in code
☐ No commented-out code
☐ Code follows project conventions
☐ Commit message follows semantic format
☐ Related files are staged (not missing files)
```

---

## 🔄 Recommended Git Workflow

### For Each Feature/Task:

1. **Create a feature branch** (if working with team)
   ```bash
   git checkout -b feat/search-bar-component
   ```

2. **Make incremental commits** as you build
   ```bash
   git add src/components/SearchBar.tsx
   git commit -m "feat(components): add SearchBar component"
   
   git add src/app/page.tsx
   git commit -m "feat(ui): integrate SearchBar into dashboard"
   ```

3. **Before pushing, verify your commits**
   ```bash
   git log --oneline origin/main..HEAD
   ```

4. **Push to remote**
   ```bash
   git push origin feat/search-bar-component
   ```

5. **Create Pull Request** (if team workflow)
   - Title: Copy your commit message
   - Description: Explain the feature briefly

---

## 📊 Commit Frequency Guidelines

### By Phase of Development

**Early Development (Phase 1-2)**:
- Commit after each **component** is complete
- 2-5 commits per day is normal
- Frequency: Every 30-60 minutes of focused work

**Feature Development (Phase 3-4)**:
- Commit after each **API endpoint** or **logical feature**
- 1-3 commits per day
- Frequency: End of meaningful work unit

**Refinement (Phase 5-6)**:
- Commit after **feature completion**
- 1-2 commits per day
- Frequency: After feature is fully working

**Production (Phase 7+)**:
- Commit after **reviewed and verified changes**
- 1 commit per day or less
- Frequency: Only after team review/approval

---

## 🏆 Best Practices

### 1. **Atomic Commits**
Each commit should be a single, logical unit of work. You should be able to revert one commit without breaking things.

✅ **Good**: One commit per component/feature
❌ **Bad**: Mixing styling + functionality + database changes

### 2. **Descriptive Messages**
Future you (and team members) will thank you.

✅ Good: `fix(api): validate embedding dimensions before storing`
❌ Bad: `fix stuff`, `update`, `wip`

### 3. **Small & Focused**
Smaller commits are easier to review, understand, and revert if needed.

✅ Good: 20-50 lines changed per commit
❌ Bad: 500+ lines in one commit

### 4. **Update Implementation Plan**
Each phase completion → Update `IMPLEMENTATION_PLAN.md`
```markdown
## ✅ Phase 2: Frontend UI Components (IN PROGRESS → COMPLETE ✓)
- [x] SearchBar component built
- [x] ResumeCard component built
- [x] UploadModal component built
```

### 5. **Use Semantic Versioning for Releases**
When ready to release:
- `v0.1.0` - Initial release (features from Phase 1-2)
- `v0.2.0` - Add UI components (Phase 2 complete)
- `v1.0.0` - Production-ready (Phase 7 complete)

Create a git tag:
```bash
git tag -a v0.1.0 -m "Initial core infrastructure release"
git push origin v0.1.0
```

---

## 📝 Example Daily Workflow

**Monday - Building SearchBar Component**

```bash
# Start of day
git checkout -b feat/search-bar

# First commit: Structure
git add src/components/SearchBar.tsx
git commit -m "feat(components): add SearchBar component structure

- Create TextInput component
- Add keyboard event handlers
- Connect to search history"

# Second commit: Styling
git add src/components/SearchBar.tsx
git commit -m "style(components): apply dark mode gradient to SearchBar

Uses new pastel color palette from design system.
Responsive on mobile, tablet, desktop."

# Third commit: Integration
git add src/app/page.tsx
git commit -m "feat(ui): integrate SearchBar into dashboard

Connect SearchBar to search API.
Add loading state during search."

# End of day: Review commits
git log --oneline -3

# Push when complete
git push origin feat/search-bar
```

---

## 🚀 Deployment Commits

When deploying to production:

```bash
# Create a release commit
git commit --allow-empty -m "chore(release): v1.0.0

Stable production release.
All phases complete, ready for deployment."

# Tag the release
git tag -a v1.0.0 -m "Production release v1.0.0"

# Push
git push origin main
git push origin v1.0.0
```

---

## ⚠️ If You Made a Mistake

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Amend Last Commit
```bash
git add .
git commit --amend --no-edit
```

### Fix Commit Message
```bash
git commit --amend -m "feat(api): new correct message"
```

---

## 📚 Reference

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [How to Write Good Commit Messages](https://chris.beams.io/posts/git-commit/)

---

**Last Updated**: August 15, 2026
**Project**: Resume Retrieval System
