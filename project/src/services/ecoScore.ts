import type { CarbonResult } from '@/services/carbonCalculator';
import { globalAveragePerCapita } from '@/data/emissionFactors';

/**
 * Calculate an Eco Score from 0–100 based on the user's carbon footprint.
 *
 * The score is relative to the global average per-capita emissions (~4.7 t CO₂e/yr).
 * A footprint at or below the global average scores highly; a footprint well above
 * it scores lower. The score is clamped to 0–100.
 *
 * This is an estimate — not a certified environmental rating.
 */
export function calculateEcoScore(totalCO2: number): number {
  if (totalCO2 <= 0) return 100;
  const avg = globalAveragePerCapita;
  const ratio = totalCO2 / avg;
  const score = Math.round(100 - (ratio - 0.3) * 40);
  return Math.max(0, Math.min(100, score));
}

export interface ScoreBand {
  label: string;
  color: string;
  description: string;
}

export function getScoreBand(score: number): ScoreBand {
  if (score >= 80) return { label: 'Excellent', color: '#118865', description: 'Your footprint is well below average.' };
  if (score >= 60) return { label: 'Good', color: '#1594a1', description: 'You are below the global average.' };
  if (score >= 40) return { label: 'Fair', color: '#e0932a', description: 'You are near the global average.' };
  if (score >= 20) return { label: 'Poor', color: '#d4562f', description: 'Your footprint is above average.' };
  return { label: 'Very Poor', color: '#d65b5b', description: 'Your footprint is well above average.' };
}

export interface Insight {
  text: string;
  percentage: number;
  category: string;
}

export function getTopInsight(result: CarbonResult): Insight {
  const categories: Array<{ name: string; value: number; pct: number }> = [
    { name: 'Transportation', value: result.transportationCO2, pct: result.categoryPercentages.transportation },
    { name: 'Electricity', value: result.electricityCO2, pct: result.categoryPercentages.electricity },
    { name: 'Food', value: result.foodCO2, pct: result.categoryPercentages.food },
    { name: 'Waste', value: result.wasteCO2, pct: result.categoryPercentages.waste },
    { name: 'Air Travel', value: result.travelCO2, pct: result.categoryPercentages.travel },
  ];
  const top = categories.reduce((max, c) => (c.value > max.value ? c : max), categories[0]);
  return { text: `Your biggest impact area is ${top.name}.`, percentage: top.pct, category: top.name };
}

export function getHighestCategory(result: CarbonResult): { name: string; value: number } {
  const categories: Array<{ name: string; value: number }> = [
    { name: 'Transportation', value: result.transportationCO2 },
    { name: 'Electricity', value: result.electricityCO2 },
    { name: 'Food', value: result.foodCO2 },
    { name: 'Waste', value: result.wasteCO2 },
    { name: 'Air Travel', value: result.travelCO2 },
  ];
  return categories.reduce((max, c) => (c.value > max.value ? c : max), categories[0]);
}

export function getLowestCategory(result: CarbonResult): { name: string; value: number } {
  const categories: Array<{ name: string; value: number }> = [
    { name: 'Transportation', value: result.transportationCO2 },
    { name: 'Electricity', value: result.electricityCO2 },
    { name: 'Food', value: result.foodCO2 },
    { name: 'Waste', value: result.wasteCO2 },
    { name: 'Air Travel', value: result.travelCO2 },
  ];
  const nonzero = categories.filter((c) => c.value > 0);
  const pool = nonzero.length > 0 ? nonzero : categories;
  return pool.reduce((min, c) => (c.value < min.value ? c : min), pool[0]);
}
