# Liftivity Project Understanding — Complete Context Review

## Executive Summary

Liftivity is a **website quality analysis system** that combines custom machine learning (for core predictions) with external APIs (for insights interpretation) to provide users with actionable website quality scores and recommendations.

The system is **async, scalable, and modular**—designed to handle websites at scale while demonstrating production ML engineering capabilities as part of an MSc program.

---

## 1. PRODUCT VISION & GOAL

**Core Value Proposition:**
User enters a website URL → System analyzes the site → Returns score (0–100) + insights

**Key Differentiator:**
Hybrid ML approach: Custom models for rigorous analysis + APIs for human-friendly explanations (not just raw scores)

**MSc Context:**
This project demonstrates **real ML work** (feature engineering, model training, evaluation) within a complete, working product—not just ML in isolation.

---

## 2. MVP SCOPE

### In Scope (MVP)
- ✅ URL input + validation
- ✅ Async analysis job processing
- ✅ Website feature extraction (NLP + DOM + Performance)
- ✅ Baseline regression model (quality score prediction)
- ✅ API-generated insights + recommendations
- ✅ Results page with score + insights
- ✅ Screenshot capture
- ✅ Error handling + retries

### Out of Scope (MVP)
- ❌ Monitoring over time / trend analysis
- ❌ Alerts / automation
- ❌ Advanced CV (deep learning vision analysis)
- ❌ Classification models (low/medium/high) — can extend after baseline works
- ❌ Complex multi-modal analysis

---

## 3. USER FLOW (Visual + Detailed)

```
START
  ↓
[Project Setup/Selection]
  • Create new project or select existing
  • Project holds all analyses for a domain
  ↓
[URL Input]
  • User enters website URL
  • Frontend validates: valid URL format
  ↓
[Validation Gate]
  • Invalid → Error shown, stay on input
  • Valid → Create analysis job
  ↓
[Job Created]
  • Analysis record created in DB: status=pending
  • User sees "pending" state
  ↓
[Queue + Worker Processing]
  • Job moved to queue (BullMQ)
  • Worker picks up → status=running
  • User sees progress/stage (e.g., "Fetching site...", "Analyzing...", "Generating insights...")
  ↓
[Processing Stages]
  1. Collector: Fetch HTML + Screenshot + Extract text
  2. Analyzer: Extract features (NLP, DOM, Performance)
  3. Model: Predict quality score
  4. Interpreter: Generate human-readable insights (via API)
  ↓
[Completion States]
  • Success → status=completed, result saved
    └─ Show: score, insights, details, screenshot
  • Failure → status=failed, error logged
    └─ Show: error message, retry button
  ↓
[Results Page]
  • Overall score (0–100)
  • Category scores (NLP, Performance, etc.)
  • Insights list (human-friendly text)
  • Visual: screenshot preview
  • Action: Re-run analysis button
  ↓
[Re-run]
  • New analysis ID created
  • Previous analysis preserved
  • Loop back to running state
  ↓
END
```

**Key UX Principles:**
- Clear status indication (pending/running/completed/failed)
- Progress feedback (not blocking)
- Error messages are actionable
- Retry possible for transient failures
- Previous results always available

---

## 4. SYSTEM ARCHITECTURE (MVP)

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  • URL input form                                           │
│  • Analysis status poller (GET /api/analyses/:id)           │
│  • Results display (score, insights, screenshot)            │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────┴──────────────────────────────────────┐
│              BACKEND API (Node.js + Fastify)                │
│  • POST /api/analyses → Create job                          │
│  • GET /api/analyses/:id → Fetch analysis status + result   │
│  • Validation + Auth (future)                               │
└──────────────────────┬──────────────────────────────────────┘
                       │ Enqueue
┌──────────────────────┴──────────────────────────────────────┐
│              JOB QUEUE (BullMQ + Redis)                     │
│  • Async job scheduling                                     │
│  • Status persistence                                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ Dequeue + Process
┌──────────────────────┴──────────────────────────────────────┐
│                 WORKER (Node.js)                            │
│  ┌──────────────────────────────────────────────────┐       │
│  │ Collector (Playwright + Lighthouse)              │       │
│  │  • Fetch HTML                                    │       │
│  │  • Capture screenshot                            │       │
│  │  • Extract visible text                          │       │
│  │  • Fetch Lighthouse metrics                      │       │
│  └────────┬─────────────────────────────────────────┘       │
│           │                                                  │
│  ┌────────▼─────────────────────────────────────────┐       │
│  │ Analyzer (Python FastAPI)                        │       │
│  │  • Extract NLP features                          │       │
│  │  • Extract DOM features                          │       │
│  │  • Combine with performance metrics              │       │
│  └────────┬─────────────────────────────────────────┘       │
│           │                                                  │
│  ┌────────▼─────────────────────────────────────────┐       │
│  │ ML Model                                         │       │
│  │  • Load trained model                            │       │
│  │  • Predict quality score (0–100)                 │       │
│  │  • Generate category scores                      │       │
│  └────────┬─────────────────────────────────────────┘       │
│           │                                                  │
│  ┌────────▼─────────────────────────────────────────┐       │
│  │ Interpreter (OpenAI API or similar)              │       │
│  │  • Take score + features                         │       │
│  │  • Generate insights: "Clear value prop, slow..." │       │
│  │  • Human-friendly explanations                   │       │
│  └────────┬─────────────────────────────────────────┘       │
│           │                                                  │
│  ┌────────▼─────────────────────────────────────────┐       │
│  │ Save Result                                      │       │
│  │  • Update analysis status=completed              │       │
│  │  • Store result (score, insights, screenshot)    │       │
│  │  • Log completion                                │       │
│  └──────────────────────────────────────────────────┘       │
└──────────────────────┬──────────────────────────────────────┘
                       │ Query
┌──────────────────────┴──────────────────────────────────────┐
│          DATABASE (PostgreSQL on Supabase)                  │
│  • projects: { id, name, url, createdAt }                  │
│  • analyses: { id, projectId, status, progress, stage }    │
│  • analysis_data: { analysisId, rawFeatures, score }        │
│  • analysis_details: { analysisId, nlpDetails, perfDetails }│
│  • screenshots: { analysisId, url, metadata }              │
└──────────────────────────────────────────────────────────────┘
```

**Technology Stack:**
- **Frontend:** React + Vite (modern, fast)
- **Backend API:** Node.js + Fastify (lightweight, high-performance)
- **Worker:** Node.js (same runtime for consistency)
- **ML/NLP Service:** Python + FastAPI (feature extraction + model inference)
- **Queue:** BullMQ + Redis (async job processing)
- **Database:** PostgreSQL (relational, structured)
- **Storage:** S3/Supabase Storage (screenshots, artifacts)

---

## 5. API CONTRACTS (MVP v1)

### Create Analysis
```
POST /api/analyses
{
  "projectId": "proj_001",
  "url": "https://example.com"
}

Response (201):
{
  "analysisId": "an_001",
  "status": "pending",
  "progress": 0,
  "stage": "queued",
  "createdAt": "2026-04-22T10:00:00Z"
}
```

### Get Analysis
```
GET /api/analyses/:analysisId

Response (200) - Running:
{
  "analysisId": "an_001",
  "status": "running",
  "progress": 45,
  "stage": "nlp_analysis",
  "updatedAt": "2026-04-22T10:05:45Z"
}

Response (200) - Completed:
{
  "analysisId": "an_001",
  "status": "completed",
  "progress": 100,
  "stage": "completed",
  "result": {
    "score": 82,
    "categoryScores": {
      "nlp": 85,
      "performance": 74
    },
    "insights": [
      "Clear value proposition above the fold.",
      "Page load time is slower than ideal."
    ],
    "details": {
      "nlp": { "clarityScore": 88, "ctaDetected": true },
      "performance": { "lcpMs": 2300 }
    },
    "screenshotUrl": "https://cdn.liftivity.dev/screenshots/an_001.png"
  }
}

Response (200) - Failed:
{
  "analysisId": "an_001",
  "status": "failed",
  "progress": 60,
  "stage": "collector",
  "error": {
    "code": "TIMEOUT",
    "message": "Website took too long to respond.",
    "retryable": true
  }
}
```

### Error Response
```
Response (400/500):
{
  "error": {
    "code": "INVALID_URL",
    "message": "URL format is invalid.",
    "details": "Must be a valid HTTP/HTTPS URL."
  }
}
```

**Valid Status Enum:** `pending | running | completed | failed`
**Valid Stage Values:** `queued | collector | analyzer | model | interpreter | completed`

---

## 6. DATABASE SCHEMA

### Core Tables
```
projects
├─ id (PK)
├─ name
├─ url (original domain)
├─ createdAt
└─ updatedAt

analyses (Main entity)
├─ id (PK)
├─ projectId (FK → projects)
├─ status (pending/running/completed/failed)
├─ progress (0-100)
├─ stage (queued/collector/analyzer/model/interpreter/completed)
├─ createdAt
├─ updatedAt
└─ error (nullable, if failed)

analysis_data (Feature storage)
├─ id (PK)
├─ analysisId (FK → analyses)
├─ rawFeatures (JSON: all extracted features)
├─ predictedScore (0-100)
├─ categoryScores (JSON: {nlp: X, performance: Y})
└─ createdAt

analysis_details (Structured insights)
├─ id (PK)
├─ analysisId (FK → analyses)
├─ nlpAnalysis (JSON: clarity, tone, CTA, etc.)
├─ performanceAnalysis (JSON: LCP, CLS, load time, etc.)
├─ insights (JSON array of strings)
└─ warnings (JSON array of issues)

screenshot_metadata
├─ id (PK)
├─ analysisId (FK → analyses)
├─ url (cloud storage URL)
├─ width
├─ height
└─ createdAt
```

---

## 7. ML COMPONENT INTEGRATION

### Where ML Fits
```
Worker Pipeline:
  [Collector] → [Features] → [ML Model] → [Interpreter] → [Save]
                    ↑              ↑
               Python service   Custom model
```

### Current Month 1 Focus
**Feature Extraction Layer:**
- Extract 13 priority features (NLP + DOM + Performance)
- 5 NLP: text length, readability, sentence length, spelling, sentiment
- 5 DOM: H1 count, hierarchy, image alt text, meta desc, mobile viewport
- 3 Performance: Lighthouse score, LCP, CLS

**Baseline Model:**
- Linear Regression on extracted features
- Predict quality score (0–100)
- Evaluate: MAE < 5 points, R² > 0.7

### Future Enhancements (Roadmap)
- Month 2: Tree-based models (XGBoost)
- Month 3: Feature engineering + embeddings
- Month 4+: Classification models, CV features, multimodal analysis

---

## 8. TEST SCENARIOS (13 MVP Test Cases)

### Critical Path Tests (Must Pass for MVP)
1. ✅ **Happy Path** — URL → analysis → completed result
2. ✅ **Invalid URL** — Blocked before job creation
3. ✅ **Running State UI** — Progress visible to user
4. ✅ **Completed Result** — Score, insights, screenshot rendered
5. ✅ **Failed Result** — Clear error + retry option
6. ✅ **Re-run Analysis** — New ID, previous result preserved
7. ✅ **API Contract Validation** — Responses match DTOs

### Additional Coverage Tests
8. Site Unreachable
9. Timeout During Collection
10. Partial Failure (one analyzer fails)
11. Queue + Worker Status Updates
12. Logging Validation
13. Mobile/Responsive Check

**Exit Criteria:** At least tests 1–7 must be stable before MVP demo.

---

## 9. BUILD ORDER (Phased Implementation)

**Phase 1: Infra Setup**
- Project scaffold (Vite, Fastify, Database)
- Supabase setup (PostgreSQL)
- Redis + BullMQ integration

**Phase 2: Backend Core**
- API endpoints (POST/GET analyses)
- Job queue integration
- Database models + migrations

**Phase 3: Worker + ML**
- Collector (Playwright, Lighthouse)
- Feature extraction (Python service)
- Model loading + inference

**Phase 4: Frontend**
- URL input form
- Status poller
- Results display
- Error handling

**Phase 5: Integration + Polish**
- End-to-end testing
- Performance tuning
- Logging + monitoring
- Documentation

---

## 10. DEFINITION OF DONE (Quality Checklist)

For each feature/task to be considered **complete**:
- ✅ Code meets style guidelines (linting passes)
- ✅ Unit tests written + passing
- ✅ Integration tests passing
- ✅ Logging implemented (key events logged)
- ✅ Error handling (graceful, user-friendly)
- ✅ Performance acceptable (response times < thresholds)
- ✅ Security reviewed (no injection, auth proper)
- ✅ Database migrations tested
- ✅ API contracts validated
- ✅ Documentation updated
- ✅ Code reviewed + approved (if team-based)

---

## 11. AI/ML ROADMAP (Progressive Enhancement)

### Month 1 (Current) — Baseline
- Extract 13 priority features
- Train Linear Regression
- Evaluate on 100–300 websites
- Establish baseline: MAE < 5 pts, R² > 0.7

### Month 2 — Feature Engineering
- Add advanced NLP (embeddings, topic modeling)
- Add DOM features (link quality, code structure)
- Train XGBoost (non-linear patterns)
- Improve R² to > 0.8

### Month 3 — Advanced Models
- Feature engineering (interaction terms)
- Hyperparameter tuning
- Cross-validation + regularization
- Target: R² > 0.85

### Month 4+ — Expansion
- Classification model (low/medium/high)
- Visual features (CV-based design analysis)
- Multi-task learning
- Production model deployment

---

## 12. HYBRID ML APPROACH (MSc Demonstrable)

### Custom ML Model (Your Code)
**Purpose:** Core predictions (quality scores)  
**Responsibility:** Feature engineering, model training, evaluation  
**Tech:** Python, scikit-learn, XGBoost  
**Deliverable:** Trained model (.pkl), feature importance analysis, performance metrics

**Why This Matters:**
- Shows ML fundamentals (supervised learning, regression, evaluation)
- Demonstrates feature engineering (understanding domain)
- Justifiable architectural decision (more control, lower cost at scale)

### External APIs (GPT/Similar)
**Purpose:** Interpretation + insight generation  
**Responsibility:** Taking score + features → human-friendly text  
**Tech:** OpenAI API / Google Cloud API  
**Deliverable:** Natural insights ("Clear value prop, slow load time")

**Why This Matters:**
- Complete system design (not just ML in vacuum)
- Production-ready architecture (APIs are reliable, scalable)
- Cost-effective (models expensive, interpretation cheap)
- UX focused (humans need explanations, not raw scores)

### System Integrity
```
Prediction: "This site scores 78/100" (Custom model)
     ↓
Interpretation: "Your site has clear messaging, but struggles with 
                 mobile performance. Focus on image optimization." 
                 (API)
     ↓
User Value: Actionable, understandable feedback
```

---

## 13. CURRENT PROJECT STATE

### What's Been Established ✅
- ✅ Product vision + MVP scope defined
- ✅ User flow designed (mockup + wireframes)
- ✅ System architecture documented (diagrams)
- ✅ API contracts specified (detailed DTOs)
- ✅ Database schema designed (ERD)
- ✅ Test scenarios defined (13 cases)
- ✅ Build order established (5 phases)
- ✅ ML roadmap created (4-month progression)
- ✅ Hybrid ML approach decided (custom + APIs)
- ✅ Feature specification created (27 features, 13 priority)
- ✅ Feature extraction layer scaffolded (Python modules ready)

### What's Next 🔄
- [ ] Validate feature extraction on test websites (5–10)
- [ ] Expand to 100–300 diverse websites
- [ ] Implement labeling heuristic (quality scores)
- [ ] Train baseline Linear Regression
- [ ] Evaluate + iterate
- [ ] Build end-to-end system (backend + frontend)
- [ ] Integrate ML service with production system
- [ ] Test + deploy

---

## 14. KEY PRINCIPLES FOR IMPLEMENTATION

1. **Async First** — All analysis is async, never blocking
2. **Graceful Degradation** — Partial failures still produce results
3. **Observability** — Log everything, make debugging easy
4. **User Clarity** — Status + errors are always clear
5. **Modularity** — Each component (collector, analyzer, model, interpreter) is independent
6. **Reproducibility** — ML experiments are tracked, models are versioned
7. **MSc Rigor** — Document decisions, justify choices, show your thinking
8. **Production Ready** — Code quality, testing, error handling from day 1

---

## Summary: System at a Glance

| Aspect | Details |
|--------|---------|
| **Product** | Website quality analysis (score 0–100 + insights) |
| **Users** | Anyone wanting to understand their website's quality |
| **MVP Scope** | URL input → Async analysis → Results (score, insights, screenshot) |
| **Architecture** | Frontend (React) → Backend API (Fastify) → Queue → Worker → ML Service → DB |
| **Core ML** | Custom model for predictions (Linear → XGBoost → Advanced) |
| **Interpretation** | External APIs for insights generation |
| **Test Strategy** | 13 test scenarios, happy path + error cases |
| **Build Phases** | 5 phases over 4–6 weeks |
| **MSc Focus** | Feature engineering + ML pipeline demonstrated end-to-end |

