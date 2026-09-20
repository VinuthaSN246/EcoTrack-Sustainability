import type {
  FormData,
  UserLifestyle,
  CarbonBreakdown,
  CategoryPercentages,
  CarbonResult,
} from '@/types';
import {
  transportFactors,
  electricityFactor,
  dietAnnualFactors,
  foodWasteMultipliers,
  wasteFactor,
  recyclingMultipliers,
  flightsFactors,
} from '@/data/emissionFactors';

export type { UserLifestyle, CarbonBreakdown, CategoryPercentages, CarbonResult };



/** Convert FormData (strings from inputs) into typed numeric UserLifestyle. */
export function mapFormData(data: FormData): UserLifestyle {
  return {
    transportation: data.transportType,
    distance: parseFloat(data.dailyDistance) || 0,
    travelDays: parseFloat(data.travelDays) || 0,
    electricity: parseFloat(data.electricity) || 0,
    food: data.dietType,
    foodWaste: data.foodWaste,
    waste: parseFloat(data.wastePerWeek) || 0,
    recycling: data.recycling,
    travel: data.flightsPerYear,
  };
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function pct(value: number, total: number): number {
  if (total <= 0) return 0;
  return round((value / total) * 100, 1);
}

/**
 * Calculate annual carbon emissions from user lifestyle data.
 * Each category is computed independently then summed.
 * All results are in tonnes CO₂e per year.
 */
export function calculateCarbon(input: UserLifestyle): CarbonResult {
  // Transportation: daily distance × emission factor × days/week × 52 weeks
  const transportRate = transportFactors[input.transportation] ?? 0;
  const transportationKg = input.distance * transportRate * input.travelDays * 52;
  const transportationCO2 = transportationKg / 1000;

  // Electricity: monthly kWh × 12 months × grid factor
  const electricityKg = input.electricity * 12 * electricityFactor;
  const electricityCO2 = electricityKg / 1000;

  // Food: annual diet base × food-waste multiplier
  const dietBase = dietAnnualFactors[input.food] ?? 0;
  const wasteMult = foodWasteMultipliers[input.foodWaste] ?? 1;
  const foodKg = dietBase * wasteMult;
  const foodCO2 = foodKg / 1000;

  // Waste: weekly kg × 52 weeks × landfill factor × recycling multiplier
  const recyclingMult = recyclingMultipliers[input.recycling] ?? 1;
  const wasteKg = input.waste * 52 * wasteFactor * recyclingMult;
  const wasteCO2 = wasteKg / 1000;

  // Air travel: lookup by category
  const flightsKg = flightsFactors[input.travel] ?? 0;
  const travelCO2 = flightsKg / 1000;

  const totalCO2 = transportationCO2 + electricityCO2 + foodCO2 + wasteCO2 + travelCO2;

  const breakdown: CarbonBreakdown = {
    transportationCO2: round(transportationCO2),
    electricityCO2: round(electricityCO2),
    foodCO2: round(foodCO2),
    wasteCO2: round(wasteCO2),
    travelCO2: round(travelCO2),
  };

  return {
    ...breakdown,
    totalCO2: round(totalCO2),
    categoryPercentages: {
      transportation: pct(transportationCO2, totalCO2),
      electricity: pct(electricityCO2, totalCO2),
      food: pct(foodCO2, totalCO2),
      waste: pct(wasteCO2, totalCO2),
      travel: pct(travelCO2, totalCO2),
    },
  };
}

/** Convenience: map form data and calculate in one call. */
export function calculateFromFormData(data: FormData): CarbonResult {
  return calculateCarbon(mapFormData(data));
}
