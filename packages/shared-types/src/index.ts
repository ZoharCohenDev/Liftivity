// Shared domain types used across web, api, and worker

export interface User {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface Workout {
  id: string;
  userId: string;
  title: string;
  startedAt: string;
  completedAt?: string;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

export interface Set {
  reps: number;
  weightKg?: number;
  durationSecs?: number;
  formScore?: number; // 0–100, provided by scoring-service
}

export interface HealthResponse {
  status: "ok" | "degraded";
  service: string;
}
