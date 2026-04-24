# Liftivity Test Scenarios v1

## Purpose
This document defines the minimum test scenarios for the Liftivity MVP.
The goal is to validate the full flow from URL submission to result display.

---

## 1. Happy Path — Analysis completes successfully

**Goal:** Verify that a valid website can be analyzed end-to-end.

### Steps
1. Open the app.
2. Create or select a project.
3. Enter a valid URL such as `https://example.com`.
4. Click **Analyze**.
5. Wait until the analysis finishes.

### Expected
- A new analysis record is created.
- Status changes in this order: `pending -> running -> completed`.
- The results page displays:
  - overall score
  - category scores
  - insights
- No frontend crash occurs.
- No backend error is logged for this run.

---

## 2. Invalid URL

**Goal:** Verify that invalid input is blocked before job creation.

### Steps
1. Open the app.
2. Enter an invalid value such as `abc` or `hello`.
3. Click **Analyze**.

### Expected
- Validation error is shown immediately.
- No job is added to the queue.
- No analysis row is created in the database.
- The user stays on the URL input step.

---

## 3. Site Unreachable

**Goal:** Verify failure handling when the site cannot be reached.

### Steps
1. Enter a valid-looking but unreachable URL.
2. Click **Analyze**.
3. Wait for the worker to attempt collection.

### Expected
- Analysis moves to `running`.
- Collector fails gracefully.
- Status changes to `failed`.
- Error message is shown to the user.
- Failure reason is logged with context.

---

## 4. Timeout During Collection

**Goal:** Verify timeout behavior for slow websites.

### Steps
1. Enter a very slow website URL.
2. Click **Analyze**.
3. Wait until the collector timeout threshold is reached.

### Expected
- Analysis starts normally.
- Worker stops the job after timeout.
- Status changes to `failed`.
- Error code is `TIMEOUT`.
- User sees a clear retry-friendly message.

---

## 5. Running State UI

**Goal:** Verify that the UI handles in-progress analysis correctly.

### Steps
1. Start an analysis for a valid URL.
2. Observe the screen while the analysis is running.

### Expected
- UI shows a loading or running state.
- Progress or stage information is visible.
- User cannot confuse running state with completed state.
- No broken layout appears while polling.

---

## 6. Completed Result Rendering

**Goal:** Verify that the completed result is rendered correctly.

### Steps
1. Load a completed mock analysis response.
2. Open the results page.

### Expected
- Overall score is visible.
- Insights list is visible.
- Category scores are visible if supported by the page.
- Screenshot preview is shown if available.
- No undefined or null values are shown raw to the user.

---

## 7. Failed Result Rendering

**Goal:** Verify that failed analysis is handled cleanly in the UI.

### Steps
1. Load a failed mock analysis response.
2. Open the status or results page.

### Expected
- Failure state is clearly displayed.
- Error message is readable and actionable.
- Re-run button is available if the failure is retryable.
- No stale completed data is shown for the failed run.

---

## 8. Partial Failure

**Goal:** Verify that partial results can still be shown when one analyzer fails.

### Steps
1. Trigger an analysis where NLP succeeds but part of the performance analyzer fails.
2. Wait for completion.

### Expected
- Status can still be `completed` if your product allows partial completion.
- Available insights are shown.
- Missing sections are labeled clearly.
- Warning message indicates partial failure.
- The UI does not break because of missing metrics.

---

## 9. Re-run Analysis

**Goal:** Verify that the user can start a new analysis for the same project.

### Steps
1. Open a completed analysis result.
2. Click **Re-run Analysis**.

### Expected
- A new analysis ID is created.
- Previous analysis remains stored.
- New analysis begins at `pending`.
- UI follows the same flow as a fresh analysis.
- User eventually sees the new result.

---

## 10. Queue + Worker Status Updates

**Goal:** Verify that worker updates are persisted correctly.

### Steps
1. Start an analysis.
2. Inspect database or logs during execution.

### Expected
- Status transitions are saved correctly.
- `updatedAt` changes on each significant transition.
- Result is saved only after processing is complete.
- Failed jobs store error details.

---

## 11. API Contract Validation

**Goal:** Verify backend responses match the agreed contract.

### Steps
1. Call `POST /api/analyses`.
2. Call `GET /api/analyses/:id` for pending, running, completed, and failed analyses.

### Expected
- All responses match the documented DTO shape.
- Required fields always exist.
- Status values are valid enums only.
- Error responses follow the standard error format.

---

## 12. Logging Validation

**Goal:** Verify that logs are useful for debugging.

### Steps
1. Run one successful analysis.
2. Run one failed analysis.

### Expected
- Logs include:
  - job created
  - job started
  - collector started
  - analyzer started
  - result saved
  - job completed or failed
- Each log entry includes analysis ID.
- Failure logs include error code and message.

---

## 13. Basic Mobile / Responsive Check

**Goal:** Verify that core analysis flow is usable on smaller screens.

### Steps
1. Open the app in a narrow viewport.
2. Start an analysis and navigate to results.

### Expected
- URL input is usable.
- Analyze button is visible and clickable.
- Running and completed states are readable.
- Results layout does not overflow badly.

---

## Minimum Exit Criteria for MVP
The MVP is ready for coding/demo use when at least these are stable:
- Happy path
- Invalid URL
- Running state
- Completed result rendering
- Failed result rendering
- Re-run analysis
- API contract validation
