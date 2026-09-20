/**
 * ML Prediction Service
 * ──────────────────────
 * Calls the Flask backend (/api/predict) to get a machine-learning-based
 * carbon footprint prediction from a trained Random Forest regressor.
 *
 * The Flask API runs on port 5001. If it is unreachable, we fall back
 * gracefully so the dashboard still works with just the calculator-based
 * estimate.
 */

import type { FormData } from '@/types';
import { mapFormData } from '@/services/carbonCalculator';

export interface MLPredictionResult {
  predictedCO2: number;
  modelName: string;
  r2: number;
  mae: number;
  rmse: number;
}

export interface MLPredictionResponse {
  prediction: MLPredictionResult | null;
  error: string | null;
}

const API_BASE = (import.meta.env?.VITE_API_BASE as string) || 'http://127.0.0.1:5001/api';
const API_URL = `${API_BASE}/predict`;
const TIMEOUT_MS = 5000;

/**
 * Send lifestyle data to the Flask ML API and return the prediction.
 * Returns null + an error message if the API is unreachable.
 */
export async function fetchMLPrediction(data: FormData): Promise<MLPredictionResponse> {
  const lifestyle = mapFormData(data);

  const payload = {
    transport_type: lifestyle.transportation,
    daily_distance_km: lifestyle.distance,
    travel_days_per_week: lifestyle.travelDays,
    electricity_kwh_month: lifestyle.electricity,
    diet_type: lifestyle.food,
    food_waste_frequency: lifestyle.foodWaste,
    waste_kg_week: lifestyle.waste,
    recycling_frequency: lifestyle.recycling,
    flights_per_year: lifestyle.travel,
  };

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const body = await res.text();
      return { prediction: null, error: `API returned ${res.status}: ${body}` };
    }

    const json: MLPredictionResult = await res.json();
    return { prediction: json, error: null };
  } catch {
    return {
      prediction: null,
      error: 'ML prediction service is not available. The Flask backend may not be running.',
    };
  }
}
