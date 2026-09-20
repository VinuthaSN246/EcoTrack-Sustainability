export type TransportType = 'Car' | 'Motorcycle' | 'Bus' | 'Train' | 'Bicycle' | 'Walking' | 'Electric Vehicle';
export type HomeType = 'Apartment' | 'Independent House' | 'Other';
export type DietType = 'Vegetarian' | 'Vegan' | 'Non-Vegetarian' | 'Mixed';
export type FrequencyType = 'Rarely' | 'Sometimes' | 'Often';
export type RecyclingType = 'Never' | 'Sometimes' | 'Often';
export type FlightsPerYear = '0' | '1-2' | '3-5' | '6+';

export interface FormData {
  transportType: TransportType | '';
  dailyDistance: string;
  travelDays: string;
  electricity: string;
  homeType: HomeType | '';
  dietType: DietType | '';
  foodWaste: FrequencyType | '';
  wastePerWeek: string;
  recycling: RecyclingType | '';
  flightsPerYear: FlightsPerYear | '';
}

export const initialFormData: FormData = {
  transportType: '',
  dailyDistance: '',
  travelDays: '',
  electricity: '',
  homeType: '',
  dietType: '',
  foodWaste: '',
  wastePerWeek: '',
  recycling: '',
  flightsPerYear: '',
};

export interface FormErrors {
  transportType?: string;
  dailyDistance?: string;
  travelDays?: string;
  electricity?: string;
  homeType?: string;
  dietType?: string;
  foodWaste?: string;
  wastePerWeek?: string;
  recycling?: string;
  flightsPerYear?: string;
}

/** User lifestyle data — numeric/clean input to the carbon calculation */
export interface UserLifestyle {
  transportation: string;
  distance: number; // km per day
  travelDays: number; // days per week
  electricity: number; // kWh per month
  food: string; // diet type
  foodWaste: string; // food waste frequency
  waste: number; // kg per week
  recycling: string; // recycling habit
  travel: string; // flights per year category
}

/** Emissions broken down by category in tonnes CO₂e per year */
export interface CarbonBreakdown {
  transportationCO2: number;
  electricityCO2: number;
  foodCO2: number;
  wasteCO2: number;
  travelCO2: number;
}

/** Percentage contribution of each category to the total emissions */
export interface CategoryPercentages {
  transportation: number;
  electricity: number;
  food: number;
  waste: number;
  travel: number;
}

/** Full calculation result including total and category breakdown */
export interface CarbonResult extends CarbonBreakdown {
  totalCO2: number;
  categoryPercentages: CategoryPercentages;
}

