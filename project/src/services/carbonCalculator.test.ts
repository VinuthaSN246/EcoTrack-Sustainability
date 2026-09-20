import { describe, it, expect } from 'vitest';
import {
  calculateCarbon,
  mapFormData,
  calculateFromFormData,
} from './carbonCalculator';
import type { UserLifestyle, FormData } from '@/types';

describe('Carbon Calculator Engine', () => {
  it('calculates emissions for a low-impact eco lifestyle', () => {
    const lowImpact: UserLifestyle = {
      transportation: 'Bicycle',
      distance: 10,
      travelDays: 5,
      electricity: 60, // 60 kWh/mo
      food: 'Vegan',
      foodWaste: 'Rarely',
      waste: 2, // 2 kg/wk
      recycling: 'Often',
      travel: '0', // No flights
    };

    const result = calculateCarbon(lowImpact);

    // Bicycles produce 0 direct emissions
    expect(result.transportationCO2).toBe(0);

    // Electricity: 60 * 12 * 0.475 / 1000 = 0.342 -> 0.34
    expect(result.electricityCO2).toBeCloseTo(0.34, 2);

    // Food: 600 kg * 0.9 = 540 kg = 0.54 tonnes
    expect(result.foodCO2).toBeCloseTo(0.54, 2);

    // Waste: 2 * 52 * 0.5 * 0.5 / 1000 = 0.026 -> 0.03
    expect(result.wasteCO2).toBeCloseTo(0.03, 2);

    // Travel: 0 flights
    expect(result.travelCO2).toBe(0);

    // Total should be around 0.91 tonnes
    expect(result.totalCO2).toBeCloseTo(0.91, 1);
    expect(result.totalCO2).toBeLessThan(2.0);

    // Percentages sum to 100%
    const pctSum =
      result.categoryPercentages.transportation +
      result.categoryPercentages.electricity +
      result.categoryPercentages.food +
      result.categoryPercentages.waste +
      result.categoryPercentages.travel;
    expect(pctSum).toBeCloseTo(100, 0);
  });

  it('calculates emissions for an average lifestyle commuter', () => {
    const avgUser: UserLifestyle = {
      transportation: 'Car',
      distance: 20, // 20 km/day
      travelDays: 5, // 5 days/wk
      electricity: 250, // 250 kWh/mo
      food: 'Mixed',
      foodWaste: 'Sometimes',
      waste: 8, // 8 kg/wk
      recycling: 'Sometimes',
      travel: '1-2', // 1-2 flights
    };

    const result = calculateCarbon(avgUser);

    // Transport: 20 * 0.192 * 5 * 52 / 1000 = 0.9984 -> 1.00 tonnes
    expect(result.transportationCO2).toBeCloseTo(1.0, 1);

    // Electricity: 250 * 12 * 0.475 / 1000 = 1.425 -> 1.43 tonnes
    expect(result.electricityCO2).toBeCloseTo(1.43, 2);

    // Food: 1300 * 1.0 / 1000 = 1.30 tonnes
    expect(result.foodCO2).toBeCloseTo(1.3, 2);

    // Waste: 8 * 52 * 0.5 * 0.75 / 1000 = 0.156 -> 0.16 tonnes
    expect(result.wasteCO2).toBeCloseTo(0.16, 2);

    // Flights: 250 kg = 0.25 tonnes
    expect(result.travelCO2).toBeCloseTo(0.25, 2);

    // Total around 4.14 tonnes
    expect(result.totalCO2).toBeCloseTo(4.14, 1);

    // Verify all 5 categories exist in breakdown and percentages
    expect(result.categoryPercentages.transportation).toBeGreaterThan(0);
    expect(result.categoryPercentages.electricity).toBeGreaterThan(0);
    expect(result.categoryPercentages.food).toBeGreaterThan(0);
    expect(result.categoryPercentages.waste).toBeGreaterThan(0);
    expect(result.categoryPercentages.travel).toBeGreaterThan(0);
  });

  it('calculates emissions for a high-impact lifestyle', () => {
    const highImpact: UserLifestyle = {
      transportation: 'Car',
      distance: 60, // 60 km/day
      travelDays: 7,
      electricity: 600, // 600 kWh/mo
      food: 'Non-Vegetarian',
      foodWaste: 'Often',
      waste: 20, // 20 kg/wk
      recycling: 'Never',
      travel: '6+', // 6+ flights
    };

    const result = calculateCarbon(highImpact);

    // Transport: 60 * 0.192 * 7 * 52 / 1000 = 4.193 -> 4.19 tonnes
    expect(result.transportationCO2).toBeCloseTo(4.19, 1);

    // Electricity: 600 * 12 * 0.475 / 1000 = 3.42 tonnes
    expect(result.electricityCO2).toBeCloseTo(3.42, 2);

    // Food: 1700 * 1.2 / 1000 = 2.04 tonnes
    expect(result.foodCO2).toBeCloseTo(2.04, 2);

    // Waste: 20 * 52 * 0.5 * 1.0 / 1000 = 0.52 tonnes
    expect(result.wasteCO2).toBeCloseTo(0.52, 2);

    // Flights: 2000 kg = 2.00 tonnes
    expect(result.travelCO2).toBeCloseTo(2.0, 2);

    // Total: ~ 12.17 tonnes
    expect(result.totalCO2).toBeGreaterThan(10);
    expect(result.totalCO2).toBeCloseTo(12.17, 1);
  });

  it('handles edge cases with zero/blank inputs gracefully', () => {
    const zeroInput: UserLifestyle = {
      transportation: 'Walking',
      distance: 0,
      travelDays: 0,
      electricity: 0,
      food: 'Vegan',
      foodWaste: 'Rarely',
      waste: 0,
      recycling: 'Often',
      travel: '0',
    };

    const result = calculateCarbon(zeroInput);

    expect(result.transportationCO2).toBe(0);
    expect(result.electricityCO2).toBe(0);
    expect(result.wasteCO2).toBe(0);
    expect(result.travelCO2).toBe(0);
    // Only baseline food emissions remain
    expect(result.totalCO2).toBeCloseTo(0.54, 2);
  });

  it('correctly maps FormData and runs calculateFromFormData', () => {
    const form: FormData = {
      transportType: 'Train',
      dailyDistance: '30',
      travelDays: '5',
      electricity: '180',
      homeType: 'Apartment',
      dietType: 'Vegetarian',
      foodWaste: 'Rarely',
      wastePerWeek: '5',
      recycling: 'Often',
      flightsPerYear: '3-5',
    };

    const mapped = mapFormData(form);
    expect(mapped.transportation).toBe('Train');
    expect(mapped.distance).toBe(30);
    expect(mapped.travelDays).toBe(5);
    expect(mapped.electricity).toBe(180);
    expect(mapped.food).toBe('Vegetarian');
    expect(mapped.waste).toBe(5);

    const result = calculateFromFormData(form);
    expect(result.totalCO2).toBeGreaterThan(0);
    expect(result.travelCO2).toBe(0.75); // 750 kg for 3-5 flights
  });
});
