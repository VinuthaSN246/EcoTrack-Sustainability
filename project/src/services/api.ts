/**
 * EcoTrack API client — talks to the Flask backend for:
 *  - User auth (register, login)
 *  - Footprint records (save, get all, get latest)
 *
 * The Flask API runs on port 5001. If it's unreachable, functions
 * return null/error so the UI degrades gracefully.
 */

import { calculateFromFormData } from '@/services/carbonCalculator';
import { calculateEcoScore } from '@/services/ecoScore';
import type { FormData } from '@/types';

const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://127.0.0.1:5001/api';
const TIMEOUT_MS = 8000;

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface FootprintRecord {
  id: number;
  user_id: number;
  transportation: number;
  electricity: number;
  food: number;
  waste: number;
  travel: number;
  total_co2: number;
  eco_score: number;
  created_at: string | null;
}

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    const json = await res.json();
    if (!res.ok) {
      return { data: null, error: json.error || `HTTP ${res.status}` };
    }
    return { data: json as T, error: null };
  } catch {
    return { data: null, error: 'Backend service unavailable' };
  }
}

// ── Auth ─────────────────────────────────────────────────────────

export async function registerUser(name: string, email: string, password: string): Promise<ApiResponse<{ user: User; message: string }>> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(email: string, password: string): Promise<ApiResponse<{ user: User; message: string }>> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ── Footprints ──────────────────────────────────────────────────

export async function saveFootprint(userId: number, formData: FormData): Promise<ApiResponse<{ footprint: FootprintRecord; message: string }>> {
  const result = calculateFromFormData(formData);
  const ecoScore = calculateEcoScore(result.totalCO2);

  return apiFetch('/footprints', {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      transportation: result.transportationCO2,
      electricity: result.electricityCO2,
      food: result.foodCO2,
      waste: result.wasteCO2,
      travel: result.travelCO2,
      total_co2: result.totalCO2,
      eco_score: ecoScore,
    }),
  });
}

export async function getFootprints(userId: number): Promise<ApiResponse<{ footprints: FootprintRecord[]; count: number }>> {
  return apiFetch(`/footprints?user_id=${userId}`);
}

export async function getLatestFootprint(userId: number): Promise<ApiResponse<{ footprint: FootprintRecord }>> {
  return apiFetch(`/footprints/latest?user_id=${userId}`);
}

// ── Session management (localStorage) ────────────────────────────

const SESSION_KEY = 'ecotrack_user';

export function saveSession(user: User): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function loadSession(): User | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

// ── AI Assistant ────────────────────────────────────────────────

export async function sendMessageToAssistant(message: string): Promise<ApiResponse<{ reply: string }>> {
  return apiFetch('/assistant', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
