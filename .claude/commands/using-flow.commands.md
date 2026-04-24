# 🗺️ Claude Code — Command Playbook
# From idea to shipped feature, using all 5 commands optimally.

---

## 📁 Available Commands

| Command | File | Purpose |
|---|---|---|
| `/product-architect` | product-architect.md | Break epics → stories → tasks |
| `/frontend-architecture` | frontend-architecture.md | Review React / TypeScript code |
| `/backend-architecture` | backend-architecture.md | Review Node.js / Express / Prisma code |
| `/code-reviewer` | code-reviewer.md | Deep bug + quality review on any file |
| `/ml-engineer` | ml-engineer.md | Review ML pipeline + API |

---

## 🔄 The Perfect Flow: Idea → Shipped Feature

### PHASE 1 — 📋 Plan
> "What are we building and how do we break it down?"

**When**: you have a new feature idea, epic, or user request
**Command**: /product-architect epic: [תאר את הפיצ'ר במשפט אחד]

**What you get**:
- User stories + acceptance criteria
- Task breakdown (Frontend / Backend / DB / Testing)
- Effort estimates (S / M / L)
- Risks + open questions flagged
- The first task to start with

**✅ Done when**: every task has a clear owner, acceptance criteria, and estimate

---

### PHASE 2 — 🏗️ System Design
> "How does this connect technically before we write a line of code?"

**When**: after planning, before coding — especially for new features touching multiple layers
**Command**:/product-architect [feature name] system design snapshot
**What you get**:
- DB entities + schema changes needed
- API endpoints (method, path, input, output)
- Business rules + edge cases
- Dependencies between frontend and backend

**✅ Done when**: frontend and backend both know the contract before coding starts

---

### PHASE 3 — ⚙️ Build
> "Write the code."

No command here — this is where Claude Code writes the actual implementation.
Use the task list from Phase 1 as your prompt input:
Implement this task: [paste the specific task from /product-architect output]
Acceptance criteria: [paste the criteria]

**Tips**:
- One task per conversation context — don't mix tasks
- Always paste the acceptance criteria so Claude knows when to stop
- For ML tasks, describe the expected input/output shape explicitly

---

### PHASE 4 — 🔍 Review
> "Is what we built correct, clean, and safe?"

Run reviews in this order 👇

#### 4a — Code Quality First
/code-reviewer [file or feature description]
- Catches bugs, logic errors, security issues
- Explains WHY each issue matters
- Run this on every non-trivial file before architecture review

#### 4b — Frontend Architecture
/frontend-architecture [component or hook name]
- Run after code-reviewer
- Focuses on structure, state, performance, TypeScript quality
- Especially useful after building a new hook or context

#### 4c — Backend Architecture
/backend-architecture [service or route name]
- Run after code-reviewer
- Focuses on layer separation, Prisma usage, error handling
- Flag if Prisma calls are leaking outside the repository layer

#### 4d — ML Pipeline (if relevant)
/ml-engineer [pipeline file or API endpoint]
- Run last, after backend review
- Focuses on data leakage, reproducibility, model correctness
- Always check: is random_state fixed everywhere?

**✅ Done when**: all Critical 🔴 issues resolved, Warnings 🟡 reviewed and accepted or fixed

---

### PHASE 5 — 🚀 Ship
> "Is the feature ready to merge and deploy?"

**Final checklist before merging**:
/code-reviewer final check: [PR description or list of changed files]
Ask Claude to verify:
- [ ] All acceptance criteria from Phase 1 are met
- [ ] No 🔴 Critical issues remaining
- [ ] Error states and loading states handled
- [ ] No hardcoded secrets, URLs, or magic numbers
- [ ] TypeScript: no `any` types introduced
- [ ] Prisma: no missing transactions or over-fetching
- [ ] ML (if relevant): random_state fixed, no data leakage

**✅ Done when**: all checklist items pass

---

## 🧭 Quick Reference — When to Use What

| Situation | Command to use |
|---|---|
| New feature idea or epic | `/product-architect` |
| Not sure what tasks to build | `/product-architect` |
| Just wrote a React component | `/frontend-architecture` |
| Just wrote a custom hook | `/frontend-architecture` |
| Just wrote an Express route or service | `/backend-architecture` |
| Just wrote a Prisma query | `/backend-architecture` |
| Any file feels messy or risky | `/code-reviewer` |
| Before every PR | `/code-reviewer` |
| Touched the ML pipeline | `/ml-engineer` |
| Touched the FastAPI serving layer | `/ml-engineer` + `/backend-architecture` |
| Figma mockup arrived | `/product-architect [describe the screen]` |

