/**
 * Centralized emission factors for EcoTrack's carbon calculator.
 * Each factor includes its source and unit. Where an exact factor
 * could not be established, it is marked as an estimate.
 *
 * All factors are expressed in kg CO₂e per the stated unit.
 * Results are converted to tonnes CO₂e (1 tonne = 1000 kg) in the calculator.
 */

// ── Transportation ──────────────────────────────────────────────
// kg CO₂e per km travelled
// Source: UK DEFRA / BEIS Greenhouse Gas Reporting — 2023 conversion factors
// https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023
export const transportFactors: Record<string, number> = {
  Car: 0.192, // Average petrol car, DEFRA 2023 (kg CO₂e/km)
  Motorcycle: 0.113, // Average motorcycle, DEFRA 2023 (kg CO₂e/km)
  Bus: 0.097, // Average local bus, DEFRA 2023 (kg CO₂e/km)
  Train: 0.035, // National rail average, DEFRA 2023 (kg CO₂e/km)
  Bicycle: 0, // Zero direct emissions
  Walking: 0, // Zero direct emissions
  'Electric Vehicle': 0.053, // Battery EV (UK grid), DEFRA 2023 (kg CO₂e/km)
};

// ── Electricity ─────────────────────────────────────────────────
// kg CO₂e per kWh consumed
// Source: IEA "Emissions Factors 2023" — global average grid emission factor
// https://www.iea.org/data-and-statistics/data-product/emissions-factors
// NOTE: This is a global average. Actual emissions vary by country/grid.
export const electricityFactor = 0.475; // kg CO₂e/kWh (IEA global average, 2022)

// ── Food ────────────────────────────────────────────────────────
// Annual kg CO₂e per person by diet type
// Source: Poore & Nemecek (2018), "Reducing food's environmental impacts
// through producers and consumers", Science 360(6392):987-992
// https://science.sciencemag.org/content/360/6392/987
// Values are approximate annual dietary emissions derived from the study.
export const dietAnnualFactors: Record<string, number> = {
  Vegan: 600, // kg CO₂e/year
  Vegetarian: 900, // kg CO₂e/year
  'Non-Vegetarian': 1700, // kg CO₂e/year (includes regular meat consumption)
  Mixed: 1300, // kg CO₂e/year — ESTIMATE: average of omnivore and vegetarian
};

// Food waste multiplier applied to diet base emissions
// Source: UNEP Food Waste Index Report 2021 — household food waste accounts
// for roughly 11% of food-related emissions globally.
// https://www.unep.org/resources/report/unep-food-waste-index-report-2021
// Multipliers are approximate adjustments based on waste frequency.
export const foodWasteMultipliers: Record<string, number> = {
  Rarely: 0.9, // ESTIMATE: ~10% below average
  Sometimes: 1.0, // Average waste
  Often: 1.2, // ESTIMATE: ~20% above average
};

// ── Waste ───────────────────────────────────────────────────────
// kg CO₂e per kg of household waste sent to landfill
// Source: US EPA "Greenhouse Gas Reporting Program" — landfill emission factor
// https://www.epa.gov/ghgemissions/ghgrp-waste
// Approximate value for mixed household waste decomposition.
export const wasteFactor = 0.5; // kg CO₂e per kg waste (EPA, approximate)

// Recycling multiplier — adjusts landfill emissions based on recycling habit
// Source: US EPA — recycling reduces net waste emissions significantly.
// https://www.epa.gov/smm/recycling-economic-information-rei-report
// Multipliers are estimates representing reduced landfill contribution.
export const recyclingMultipliers: Record<string, number> = {
  Never: 1.0, // No reduction — all waste to landfill
  Sometimes: 0.75, // ESTIMATE: ~25% reduction from partial recycling
  Often: 0.5, // ESTIMATE: ~50% reduction from consistent recycling
};

// ── Air Travel ──────────────────────────────────────────────────
// kg CO₂e per round-trip flight (average)
// Source: UK DEFRA 2023 — average flight emission factors
// Uses economy-class, medium-haul as a representative average.
// https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023
export const flightsFactors: Record<string, number> = {
  '0': 0,
  '1-2': 250, // ESTIMATE: 1.5 flights × ~167 kg CO₂e per short/medium round-trip
  '3-5': 750, // ESTIMATE: 4 flights × ~187 kg CO₂e per round-trip (mixed haul)
  '6+': 2000, // ESTIMATE: 8+ flights × ~250 kg CO₂e per round-trip (longer haul)
};

export const globalAveragePerCapita = 4.7; // tonnes CO₂e per person per year (approximate)

/** Standard scientific and methodology disclaimer */
export const CALCULATION_DISCLAIMER =
  'Results are estimates based on the inputs and emission factors used by this application.';

/** Category documentation and sources metadata for UI transparency */
export const categoryMetadata = {
  transportation: {
    name: 'Transportation',
    unit: 'kg CO₂e / km',
    source: 'UK DEFRA / BEIS 2023 Greenhouse Gas Conversion Factors',
    notes: 'Calculated using daily travel distance, weekly frequency, and vehicle type emission factors.',
  },
  electricity: {
    name: 'Electricity',
    unit: '0.475 kg CO₂e / kWh',
    source: 'International Energy Agency (IEA) 2023 Global Grid Average',
    notes: 'Annual electricity consumption based on monthly kWh multiplied by average grid carbon intensity.',
  },
  food: {
    name: 'Food',
    unit: 'kg CO₂e / year',
    source: 'Poore & Nemecek (2018) Science, UNEP Food Waste Index 2021',
    notes: 'Dietary lifecycle emissions adjusted by household food waste frequency.',
  },
  waste: {
    name: 'Waste',
    unit: '0.50 kg CO₂e / kg landfill waste',
    source: 'US EPA Waste Reduction Model (WARM) & GHG Reporting Program',
    notes: 'Estimated municipal solid waste adjusted for active household recycling habits.',
  },
  travel: {
    name: 'Air Travel',
    unit: 'kg CO₂e / year',
    source: 'UK DEFRA 2023 Flight Conversion Factors',
    notes: 'Estimated flight emissions based on annual passenger round-trip flight tiers.',
  },
} as const;

