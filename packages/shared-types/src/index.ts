// Shared domain types used across web, api, and worker.

// ── Enums ──────────────────────────────────────────────────────────────────

export type AnalysisStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export type AnalysisStage =
  | "QUEUED"
  | "COLLECTOR"
  | "ANALYZER"
  | "MODEL"
  | "INTERPRETER"
  | "COMPLETED";

export type SiteStatus = "Stable" | "Critical" | "Optimizing" | "Warning";

// ── Domain models ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  userId: string;
  name: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analysis {
  id: string;
  projectId: string;
  url: string;
  status: AnalysisStatus;
  stage: AnalysisStage;
  progress: number; // 0–100
  errorCode?: string | null;
  errorMessage?: string | null;
  createdAt: string;
  updatedAt: string;
  result?: AnalysisResult | null;
}

export interface CategoryScores {
  nlp?: number;
  performance?: number;
  dom?: number;
}

export interface AnalysisResult {
  id: string;
  analysisId: string;
  overallScore: number; // 0–100
  categoryScores: CategoryScores;
  rawFeatures: Record<string, unknown>;
  insights: string[];
  screenshotUrl?: string | null;
  createdAt: string;
}

// Dashboard view of a project — computed fields added by the API layer
export interface SiteView {
  id: string;
  name: string;
  url: string;
  score: number;
  issues: number;
  status: SiteStatus;
  lastCrawledAt: string | null;
}

// ── Auth ──────────────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// ── API response shapes ────────────────────────────────────────────────────

export interface HealthResponse {
  status: "ok" | "degraded";
  service: string;
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Job payloads (BullMQ) ──────────────────────────────────────────────────

export interface AnalysisJobPayload {
  analysisId: string;
  projectId: string;
  url: string;
}
