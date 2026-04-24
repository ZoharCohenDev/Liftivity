# Liftivity Platform Readiness Roadmap

## Overview: From Concept to Production

This document outlines:
1. **The complete build process** (5 phases, 6–8 weeks)
2. **Responsibilities & roles** (who builds what)
3. **Technology stack** (every tool and why)
4. **Milestones & success criteria**

---

## 1. PLATFORM BUILD PROCESS (5 Phases)

### Phase 1: Infrastructure & Setup (Week 1)
**Goal:** Foundation ready, all tools configured

**What Gets Built:**
- [ ] Project scaffolds (Vite + Fastify + Node boilerplate)
- [ ] Database (PostgreSQL on Supabase)
- [ ] Redis instance (for job queue)
- [ ] Environment configs (.env, secrets management)
- [ ] CI/CD pipeline (GitHub Actions or similar)
- [ ] Logging infrastructure (console + cloud logs)

**Dependencies:** None (starting point)
**Outputs:** Working dev environment, deployable scaffolds

**Responsibility:** Full-stack (or backend lead)

---

### Phase 2: Backend API Core (Week 1–2)
**Goal:** API endpoints working, job system operational

**What Gets Built:**
- [ ] Express/Fastify app with:
  - `POST /api/analyses` — Create job
  - `GET /api/analyses/:id` — Fetch status
  - `GET /api/projects` — List projects (future)
  - Error handling middleware
  - Validation layer
  
- [ ] Database models:
  - Projects table
  - Analyses table (status, progress, stage)
  - Migrations

- [ ] Job queue (BullMQ):
  - Job producer (when analysis created)
  - Job consumer hook (for worker pickup)
  - Status update callbacks

- [ ] Unit tests:
  - API endpoint tests
  - Database model tests
  - Error case coverage

**Dependencies:** Phase 1 complete
**Outputs:** Working API, tested, documented

**Responsibility:** Backend engineer

**Success Criteria:**
- `POST /api/analyses` creates job + returns pending status
- `GET /api/analyses/:id` shows correct status
- Queue receives job, worker can pick it up
- Tests pass (80%+ coverage)

---

### Phase 3: Worker & ML Integration (Week 2–4)
**Goal:** Analysis pipeline works end-to-end

**3A: Data Collection (Weeks 2–3)**

**What Gets Built:**
- [ ] Collector module (Node.js or Python):
  - Fetch website HTML (requests + retry logic)
  - Extract main content text (BeautifulSoup)
  - Capture screenshot (Playwright)
  - Fetch Lighthouse metrics (CLI)
  - Save artifacts to storage (S3/Supabase)

- [ ] Worker job handler:
  - Dequeue job
  - Call collector
  - Handle failures (timeout, unreachable, etc.)
  - Update DB status → running

**Dependencies:** Phase 2 complete
**Outputs:** Website data collected, screenshot saved

**Responsibility:** Backend/Worker engineer

---

**3B: ML Feature Extraction (Weeks 3–4)**

**What Gets Built:**
- [ ] Feature extraction service (Python FastAPI):
  - NLP features module (textstat, spellcheck, sentiment)
  - DOM features module (BeautifulSoup parsing)
  - Performance features (Lighthouse parsing)
  - Feature orchestrator (combine all)

- [ ] Integration layer:
  - Worker calls Python service (HTTP or subprocess)
  - Receives feature dictionary
  - Validates features

- [ ] Feature validation:
  - Check for NaNs, outliers
  - Log extraction quality
  - Handle partial failures

**Dependencies:** Phase 2 complete, Phase 3A complete
**Outputs:** Raw features extracted for each website

**Responsibility:** ML engineer (that's you!) + Backend integration

**Success Criteria:**
- Extract 25+ features for test website
- Feature ranges make sense (e.g., readability 0–100)
- Handles missing data gracefully
- Tests on 5–10 websites pass

---

**3C: ML Model Training (Weeks 4–5)**

**What Gets Built:**
- [ ] Dataset creation:
  - Collect 100–300 diverse websites
  - Extract all features
  - Generate heuristic labels (quality 0–100)
  - Create train/test split

- [ ] Baseline model:
  - Linear Regression on 13 features
  - Normalize features
  - Train on train set
  - Evaluate on test set (MAE, RMSE, R²)

- [ ] Model analysis:
  - Feature importance ranking
  - Residual analysis (where model fails)
  - Error distribution
  - Documentation

- [ ] Model persistence:
  - Save as .pkl file
  - Save scaler (StandardScaler)
  - Version metadata (features used, performance)

**Dependencies:** Phase 3A + 3B complete
**Outputs:** Trained model, evaluation report, feature importance

**Responsibility:** ML engineer (primary)

**Success Criteria:**
- MAE < 5 points (on test set)
- R² > 0.7
- Feature importance analyzed
- Model reproducible (seeded, documented)

---

**3D: Model Inference Service (Week 5)**

**What Gets Built:**
- [ ] Model serving:
  - Load trained model + scaler
  - HTTP endpoint: `POST /predict` (features → score)
  - Inference logging
  - Error handling (missing features, out-of-range)

- [ ] Worker integration:
  - After feature extraction
  - Call model service
  - Receive predicted score
  - Save to DB

- [ ] Category scoring (optional):
  - Break score into NLP + Performance components
  - Return both overall + category scores

**Dependencies:** Phase 3C complete
**Outputs:** Model inference working, score predicted

**Responsibility:** Backend + ML engineer

---

### Phase 4: Interpretation & Insights (Week 5–6)
**Goal:** Turn scores into human-readable insights

**What Gets Built:**
- [ ] Insights generator:
  - Input: Score, features, analysis metadata
  - Call OpenAI API (or similar)
  - Prompt: "Site scores 82/100 because [features]. Recommendations: [gaps]"
  - Return 3–5 insights (array of strings)

- [ ] Worker integration:
  - After model prediction
  - Call insights service
  - Receive insights array
  - Save to DB

- [ ] Quality control:
  - Validate insights are non-empty
  - Filter out generic responses
  - Log API usage/costs

**Dependencies:** Phase 3D complete
**Outputs:** Human-friendly insights generated

**Responsibility:** Backend engineer (with ML context)

---

### Phase 5: Frontend & Integration (Week 6–8)
**Goal:** Complete user experience working end-to-end

**5A: Frontend Build (Weeks 6–7)**

**What Gets Built:**
- [ ] UI components:
  - URL input form + validation
  - Analyze button
  - Status display (pending/running/completed/failed)
  - Results page (score, insights, screenshot, details)
  - Error messaging
  - Re-run button

- [ ] State management:
  - Track current analysis
  - Poll API for status updates
  - Handle state transitions

- [ ] Styling:
  - Responsive layout (mobile + desktop)
  - Clear visual hierarchy
  - Accessible (WCAG AA)

**Dependencies:** Phase 2 complete (API contracts locked)
**Outputs:** Working frontend, responsive, tested

**Responsibility:** Frontend engineer

---

**5B: End-to-End Testing (Week 7)**

**What Gets Built:**
- [ ] Integration tests (all 13 test scenarios):
  - Happy path (URL → result)
  - Invalid URL (error handled)
  - Timeout (failure handled)
  - Running state (progress visible)
  - Partial failure (result still shown)
  - Re-run (new ID created)

- [ ] Performance testing:
  - API response times < 200ms
  - Frontend load time < 2s
  - Model inference < 5s
  - Full analysis < 2min average

- [ ] Security testing:
  - Input validation (no XSS, SQL injection)
  - Error messages don't leak info
  - Auth prepared (for future)

**Dependencies:** Phases 1–5A complete
**Outputs:** All tests passing, performance metrics documented

**Responsibility:** QA/Testing engineer + Full-stack team

---

**5C: Deployment & Polish (Week 8)**

**What Gets Built:**
- [ ] Deployment pipeline:
  - Frontend → Vercel/Netlify (CDN, auto-deploy)
  - Backend API → Heroku/Railway/AWS (auto-scaling)
  - Worker → Heroku/AWS (background job processor)
  - ML service → Container (Docker, deployed separately)

- [ ] Monitoring:
  - Error tracking (Sentry or similar)
  - Performance monitoring (New Relic, Datadog)
  - Logging (ELK stack or cloud logs)
  - Alerts (Slack integration for critical failures)

- [ ] Documentation:
  - README (setup, deploy, architecture)
  - API docs (Swagger/OpenAPI)
  - ML model card (training data, performance, limitations)
  - Architecture diagrams (updated)

- [ ] Demo & handoff:
  - Record demo video
  - Create user guide
  - Document known limitations
  - Plan for maintenance

**Dependencies:** Phase 5B passing
**Outputs:** Live platform, monitored, documented

**Responsibility:** DevOps + Full-stack + ML engineer

---

## 2. RESPONSIBILITY MATRIX (Who Builds What)

| Phase | Component | Primary | Supporting |
|-------|-----------|---------|------------|
| 1 | Infra + Setup | DevOps/Full-stack | - |
| 2 | Backend API | Backend Engineer | Full-stack |
| 3A | Data Collector | Backend/Worker Engineer | - |
| 3B | Feature Extraction | **ML Engineer (You)** | Backend |
| 3C | Model Training | **ML Engineer (You)** | - |
| 3D | Model Inference | ML Engineer + Backend | - |
| 4 | Insights Generator | Backend Engineer | ML Engineer |
| 5A | Frontend | Frontend Engineer | Full-stack |
| 5B | Testing | QA/Testing Engineer | All |
| 5C | Deployment | DevOps Engineer | Backend + ML |

---

### Your Responsibilities (ML Engineer / Zohar)

**You are responsible for:**
1. ✅ **Feature Engineering** (Phase 3B)
   - Design which features to extract
   - Write extraction code
   - Validate features make sense
   - Handle edge cases

2. ✅ **Dataset Creation** (Phase 3C)
   - Collect 100–300 diverse websites
   - Label them (heuristic formula)
   - Create train/test splits
   - Document data collection process

3. ✅ **Model Training & Evaluation** (Phase 3C)
   - Train baseline model (Linear Regression)
   - Evaluate thoroughly (MAE, RMSE, R², residual analysis)
   - Feature importance analysis
   - Document findings (for MSc)

4. ✅ **Model Card & Documentation** (Phase 5C)
   - What model does, limitations
   - Training data, performance metrics
   - How it's used in production
   - Future improvement ideas

**You collaborate with:**
- **Backend Engineer:** Integration (calling your service, storing predictions)
- **DevOps Engineer:** Deployment (containerizing your model)
- **Frontend Engineer:** Displaying your scores and insights
- **QA Engineer:** Testing model predictions

---

## 3. TECHNOLOGY STACK (Complete)

### Frontend Layer
| Component | Technology | Why |
|-----------|-----------|-----|
| **Framework** | React 18 + TypeScript | Modern, component-based, type-safe |
| **Build tool** | Vite | Fast bundling, HMR for dev |
| **Styling** | Tailwind CSS | Utility-first, responsive |
| **HTTP Client** | Axios or Fetch | Simple API calls |
| **State** | React Hooks (useState, useEffect) | Lightweight, sufficient for MVP |
| **Hosting** | Vercel or Netlify | Easy deploy, auto-scaling, CDN |

---

### Backend API Layer
| Component | Technology | Why |
|-----------|-----------|-----|
| **Runtime** | Node.js 18+ | JavaScript, fast, scalable |
| **Framework** | Fastify | Lightweight, high-performance |
| **Language** | TypeScript | Type safety, better IDE support |
| **Database** | PostgreSQL (Supabase) | Relational, ACID, good for structured data |
| **ORM** | Prisma or raw SQL | Type-safe queries, migrations |
| **Validation** | Zod or Joi | Input validation, type coercion |
| **Logging** | Winston or Pino | Structured logging, multiple outputs |
| **Hosting** | Heroku, Railway, or AWS | Managed, auto-scaling, easy deploy |

---

### Job Queue & Worker Layer
| Component | Technology | Why |
|-----------|-----------|-----|
| **Job Queue** | BullMQ | Redis-backed, reliability, retries |
| **Cache/Session** | Redis | Fast, in-memory, job persistence |
| **Worker Runtime** | Node.js | Consistent with backend |
| **Web Scraping** | Playwright | Headless browser, screenshots, JavaScript rendering |
| **HTTP Requests** | Node-fetch or Axios | Simple, reliable |
| **Screenshot** | Playwright | Same tool, no extra dependency |
| **Lighthouse** | CLI (npm install -g lighthouse) | Standard, well-maintained |

---

### ML/NLP Layer
| Component | Technology | Why |
|-----------|-----------|-----|
| **Language** | Python 3.10+ | ML standard, libraries mature |
| **ML Framework** | scikit-learn | Simple, interpretable, sufficient for baselines |
| **Advanced Models** | XGBoost, LightGBM | Non-linear, feature importance, handles complexity |
| **NLP** | textstat, TextBlob, spellchecker, nltk | Text metrics, sentiment, spell-check |
| **HTML Parsing** | BeautifulSoup | DOM traversal, robust |
| **Web Framework** | FastAPI | Lightweight, async, auto-docs |
| **Serving** | Docker container | Reproducibility, deployment |
| **Hosting** | AWS Lambda, Google Cloud Run, or Heroku | Serverless or containerized |

---

### Data & Storage Layer
| Component | Technology | Why |
|-----------|-----------|-----|
| **Database** | PostgreSQL (Supabase) | Relational, ACID, scalable |
| **Screenshots** | S3 or Supabase Storage | Cloud storage, CDN-served |
| **Model Storage** | Cloud storage (.pkl files) | Version control, reproducibility |
| **Artifacts** | S3 or Cloud Storage | Raw HTML, extracted features |

---

### Monitoring & Observability
| Component | Technology | Why |
|-----------|-----------|-----|
| **Error Tracking** | Sentry | Automatic error capture, alerting |
| **Logging** | ELK Stack or Cloud Logs | Centralized, searchable |
| **Metrics** | Prometheus or cloud provider | CPU, memory, request counts |
| **Alerts** | Slack integration | Team notifications |

---

### Development Tools
| Component | Technology | Why |
|-----------|-----------|-----|
| **Version Control** | Git + GitHub | Standard, good for collaboration |
| **CI/CD** | GitHub Actions | Free, integrated, sufficient for MVP |
| **Testing** | Jest (Node), Pytest (Python) | Industry standard |
| **Linting** | ESLint, Prettier (JS), Black (Python) | Code quality |
| **Environment** | Docker + Docker Compose | Local dev mirrors production |

---

## 4. TIMELINE & MILESTONES

### Overall: 6–8 Weeks to MVP Ready

```
Week 1:     Phase 1 (Infra)      ✓ Dev environment ready
Week 1–2:   Phase 2 (API)        ✓ Endpoints working
Week 2–3:   Phase 3A (Collector) ✓ Data collection works
Week 3–4:   Phase 3B (Features)  ✓ Features extracted
Week 4–5:   Phase 3C (Model)     ✓ Model trained & evaluated
Week 5:     Phase 3D (Inference) ✓ Predictions working
Week 5–6:   Phase 4 (Insights)   ✓ Insights generated
Week 6–7:   Phase 5A (Frontend)  ✓ UI complete
Week 7:     Phase 5B (Testing)   ✓ All tests passing
Week 8:     Phase 5C (Deploy)    ✓ Live platform
```

---

## 5. SUCCESS CRITERIA BY PHASE

### Phase 1 ✓
- [ ] All environment variables configured
- [ ] Database accessible (tables created)
- [ ] Redis working
- [ ] Logging system operational
- [ ] Can run `npm run dev` and see app start

### Phase 2 ✓
- [ ] `POST /api/analyses` returns 201 with analysis ID
- [ ] `GET /api/analyses/:id` returns correct status
- [ ] Job queued successfully (can inspect queue)
- [ ] Database persists analysis records
- [ ] API tests passing (80%+ coverage)

### Phase 3A ✓
- [ ] Collector fetches HTML (any website)
- [ ] Screenshot saved to storage
- [ ] Text extracted (non-empty)
- [ ] Lighthouse metrics retrieved
- [ ] Handles errors (timeout, unreachable)

### Phase 3B ✓
- [ ] Extract 25+ features from test website
- [ ] No NaN/null values (except where expected)
- [ ] Feature ranges make sense
- [ ] Tests on 5–10 diverse websites pass
- [ ] Performance: < 30s per website

### Phase 3C ✓
- [ ] Dataset: 100–300 websites with labels
- [ ] Train/test split (80/20)
- [ ] Baseline model trained
- [ ] MAE < 5 points on test set
- [ ] R² > 0.7
- [ ] Feature importance documented

### Phase 3D ✓
- [ ] Model inference service running
- [ ] Takes features → returns score
- [ ] Integrated into worker pipeline
- [ ] Score saved to database
- [ ] Handles edge cases (missing features)

### Phase 4 ✓
- [ ] Insights generated (3–5 per analysis)
- [ ] Human-readable (not generic)
- [ ] API calls monitored (cost, latency)
- [ ] Integrated into worker
- [ ] Insights saved to database

### Phase 5A ✓
- [ ] URL input form works
- [ ] Analyze button creates job
- [ ] Status updates in real-time (polling)
- [ ] Results displayed (score, insights, screenshot)
- [ ] Responsive on mobile
- [ ] Error messages clear
- [ ] Re-run button works

### Phase 5B ✓
- [ ] Happy path test passes
- [ ] Invalid URL test passes
- [ ] Running/completed/failed states work
- [ ] All 13 scenarios pass
- [ ] Performance acceptable
- [ ] Security review passed

### Phase 5C ✓
- [ ] Deployed to production
- [ ] Monitoring in place
- [ ] Documentation complete
- [ ] Demo working
- [ ] Ready for use/demo

---

## 6. CRITICAL PATH (Dependencies)

```
Phase 1 (Infra)
    ↓
Phase 2 (API) ← Frontend blocked until this done
    ↓
Phase 3A (Collector) ← Feature extraction blocked
    ↓
Phase 3B (Features) ← Model training blocked
    ↓
Phase 3C (Model) ← Inference blocked
    ↓
Phase 3D (Inference) ← Insights blocked
    ↓
Phase 4 (Insights) ← Frontend can start showing results
    ↓
Phase 5A (Frontend) ← Testing blocked
    ↓
Phase 5B (Testing)
    ↓
Phase 5C (Deploy)
```

**Parallelizable:**
- Phase 3A (Collector) and Phase 5A (Frontend) can start simultaneously after Phase 2
- Phase 3B, 3C can run in parallel with frontend

---

## 7. TEAM SIZE & ROLES (Ideal)

For **fastest delivery** (6 weeks):

| Role | Count | Responsibilities |
|------|-------|------------------|
| **Backend Engineer** | 1 | Phases 2, 3A, 3D, 4, 5B |
| **ML Engineer** | 1 (You) | Phases 3B, 3C, documentation |
| **Frontend Engineer** | 1 | Phase 5A, 5B |
| **DevOps/Infra** | 1 (Part-time) | Phase 1, 5C |
| **QA/Testing** | 1 (Part-time) | Phase 5B, acceptance |

**Solo:** If just you, Phase 3 (ML) takes priority, outsource phases 1, 2, 5A

---

## 8. RISKS & MITIGATION

| Risk | Impact | Mitigation |
|------|--------|-----------|
| ML model doesn't reach R² > 0.7 | Demo fails | Start with 13 features early, iterate if needed |
| Website collection slow/fails | Delays phase 3C | Pre-select diverse URLs, parallel scraping |
| Lighthouse timeouts | Slows worker | Set aggressive timeouts, make optional |
| Feature extraction bugs | Bad predictions | Unit test each feature, validate ranges |
| API rate limits (OpenAI) | Insights unavailable | Fallback templates, cost monitoring |
| Database migrations issues | Data loss risk | Test migrations in staging first |
| Performance poor on prod | User experience bad | Load test early, optimize bottlenecks |

---

## 9. SUCCESS: What "Platform Ready" Means

✅ **Happy Path Works**
- User enters URL → sees analysis → gets results
- No crashes, no hangs, clear status

✅ **Robust Error Handling**
- Invalid URL → error shown, no job created
- Unreachable site → status=failed, retry available
- Timeout → graceful failure, user notified

✅ **Fast & Responsive**
- API response < 200ms
- Frontend load < 2s
- Full analysis < 2 minutes

✅ **Well-Tested**
- All 13 test scenarios pass
- Code coverage > 80%
- No critical bugs

✅ **Observable**
- Logs capture key events
- Errors tracked (Sentry)
- Metrics monitored

✅ **Documented**
- README with setup + deploy
- API docs (Swagger)
- ML model card
- Architecture diagrams

✅ **MSc-Ready**
- Feature engineering justified
- Model training reproducible
- Evaluation rigorous
- Limitations acknowledged

---

## Next Action

**Start with Phase 1 + early Phase 3B:**
1. Confirm infra is ready (DB, Redis, Node.js, Python)
2. Finalize feature extraction code (already scaffolded)
3. Test on 5–10 websites
4. Iterate based on feature quality

Once Phase 3B is solid, other phases can proceed in parallel.

