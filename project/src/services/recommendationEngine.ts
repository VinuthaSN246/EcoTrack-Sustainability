import type { CarbonResult, UserLifestyle } from '@/services/carbonCalculator';
import { calculateCarbon, mapFormData } from '@/services/carbonCalculator';
import type { FormData } from '@/types';

/**
 * EcoTrack Recommendation Engine
 * ───────────────────────────────
 * This is a RULE-BASED recommendation engine — not a machine-learning model.
 *
 * It analyzes the user's carbon breakdown and lifestyle inputs using deterministic
 * rules: category ranking, threshold checks, and lifestyle-specific branching.
 * Each rule inspects the user's actual data (e.g. transport type, diet, recycling
 * habits, flight frequency) and produces a personalized recommendation with an
 * estimated potential impact where a defensible estimate can be derived from the
 * same emission factors used in the carbon calculator.
 *
 * No model training, no statistical inference, no neural networks are involved.
 */

export type Priority = 'High' | 'Medium' | 'Low';
export type RecommendationCategory = 'Transportation' | 'Electricity' | 'Food' | 'Waste' | 'Travel';

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  explanation: string;
  action: string;
  priority: Priority;
  estimatedImpact: number | null;
}

export interface RecommendationSummary {
  headline: string;
  recommendations: Recommendation[];
}

interface CategoryAnalysis {
  name: RecommendationCategory;
  value: number;
  percentage: number;
}

function rankCategories(result: CarbonResult): CategoryAnalysis[] {
  const cats: CategoryAnalysis[] = [
    { name: 'Transportation', value: result.transportationCO2, percentage: result.categoryPercentages.transportation },
    { name: 'Electricity', value: result.electricityCO2, percentage: result.categoryPercentages.electricity },
    { name: 'Food', value: result.foodCO2, percentage: result.categoryPercentages.food },
    { name: 'Waste', value: result.wasteCO2, percentage: result.categoryPercentages.waste },
    { name: 'Travel', value: result.travelCO2, percentage: result.categoryPercentages.travel },
  ];
  return cats.sort((a, b) => b.value - a.value);
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

// ── Transportation rules ────────────────────────────────────────

function buildTransportationRecommendations(
  lifestyle: UserLifestyle,
  co2: number,
  rank: number,
  total: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const isHighImpact = rank === 0 && co2 > 0;

  const mode = lifestyle.transportation;
  const distance = lifestyle.distance;
  const days = lifestyle.travelDays;

  // Rule: car/motorcycle users — suggest modal shift
  if (mode === 'Car' || mode === 'Motorcycle') {
    const carFactor = mode === 'Car' ? 0.192 : 0.113;
    const busFactor = 0.097;
    const potentialSavingPerKm = carFactor - busFactor;
    const annualKm = distance * days * 52;
    const estimatedSaving = round((potentialSavingPerKm * annualKm) / 1000);

    recs.push({
      id: 'transport-modal-shift',
      category: 'Transportation',
      title: 'Reduce Transportation Impact',
      explanation:
        mode === 'Car'
          ? `Your car travel produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year — ${rank === 0 ? 'your largest emission source.' : 'a significant portion of your footprint.'} Private car use has the highest per-kilometre emissions among common commuting modes.`
          : `Your motorcycle travel produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year. While more efficient than a car, it still generates direct fuel emissions.`,
      action:
        'Consider public transport, walking, cycling, or combining trips where practical. Switching part of your commute to bus or train can meaningfully lower your transport emissions.',
      priority: isHighImpact ? 'High' : 'Medium',
      estimatedImpact: estimatedSaving > 0 ? estimatedSaving : null,
    });
  }

  // Rule: high distance regardless of mode
  if (distance > 30 && (mode === 'Car' || mode === 'Motorcycle')) {
    recs.push({
      id: 'transport-reduce-distance',
      category: 'Transportation',
      title: 'Reduce Daily Travel Distance',
      explanation: `You travel an estimated ${distance} km/day for ${days} days/week. Reducing total kilometres is the most direct way to cut transport emissions.`,
      action: 'Explore carpooling, remote work days, or combining errands into fewer trips to reduce your weekly travel distance.',
      priority: 'Medium',
      estimatedImpact: round((distance * 0.05 * days * 52) / 1000),
    });
  }

  // Rule: suggest EV upgrade for car users
  if (mode === 'Car' && distance > 20) {
    const carFactor = 0.192;
    const evFactor = 0.053;
    const annualKm = distance * days * 52;
    const estimatedSaving = round(((carFactor - evFactor) * annualKm) / 1000);

    recs.push({
      id: 'transport-ev-upgrade',
      category: 'Transportation',
      title: 'Consider an Electric Vehicle',
      explanation:
        'Battery electric vehicles produce significantly lower emissions per kilometre than petrol or diesel cars, especially on cleaner electricity grids.',
      action: 'When it is time to replace your vehicle, researching electric or hybrid options could substantially reduce your transport emissions.',
      priority: 'Low',
      estimatedImpact: estimatedSaving > 0 ? estimatedSaving : null,
    });
  }

  // Rule: bus users — already lower impact, encourage further reduction
  if (mode === 'Bus' || mode === 'Train') {
    recs.push({
      id: 'transport-active-modes',
      category: 'Transportation',
      title: 'Incorporate Active Travel',
      explanation: `You already use lower-emission public transport (${mode}), producing an estimated ${co2.toFixed(2)} tonnes CO₂e/year. Walking or cycling for shorter trips can further reduce your footprint.`,
      action: 'For trips under 3 km, consider walking or cycling. This eliminates emissions entirely for those trips and improves personal health.',
      priority: 'Low',
      estimatedImpact: round((distance * 0.097 * days * 52 * 0.2) / 1000),
    });
  }

  // Rule: already zero-emission — positive reinforcement
  if (mode === 'Bicycle' || mode === 'Walking') {
    recs.push({
      id: 'transport-maintain',
      category: 'Transportation',
      title: 'Maintain Your Active Travel Habit',
      explanation: 'Your primary transport mode produces zero direct emissions — this is excellent. Maintaining this habit is one of the most impactful individual choices for reducing transport emissions.',
      action: 'Continue prioritising walking and cycling. If circumstances change, consider public transport before private car use.',
      priority: 'Low',
      estimatedImpact: null,
    });
  }

  // Fallback: if no specific rule matched but transport has emissions
  if (recs.length === 0 && co2 > 0) {
    recs.push({
      id: 'transport-general',
      category: 'Transportation',
      title: 'Reduce Transportation Impact',
      explanation: `Your transportation produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year — ${rank === 0 ? 'your largest emission source.' : 'a meaningful part of your footprint.'}`,
      action: 'Consider public transport, walking, cycling, or combining trips where practical.',
      priority: isHighImpact ? 'High' : 'Medium',
      estimatedImpact: round(co2 * 0.3),
    });
  }

  return recs;
}

// ── Electricity rules ───────────────────────────────────────────

function buildElectricityRecommendations(
  lifestyle: UserLifestyle,
  co2: number,
  rank: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const isHighImpact = rank === 0 && co2 > 0;
  const monthlyKwh = lifestyle.electricity;

  recs.push({
    id: 'electricity-reduce',
    category: 'Electricity',
    title: 'Reduce Electricity Usage',
    explanation: `Your electricity consumption produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year${monthlyKwh > 0 ? ` based on ~${monthlyKwh} kWh/month` : ''}. Reducing unnecessary consumption directly lowers these emissions.`,
    action: 'Reduce unnecessary electricity consumption and consider energy-efficient appliances. Switching to LED lighting, using smart power strips, and air-drying clothes can reduce household electricity demand.',
    priority: isHighImpact ? 'High' : 'Medium',
    estimatedImpact: round(co2 * 0.2),
  });

  // Rule: high electricity consumers
  if (monthlyKwh > 400) {
    recs.push({
      id: 'electricity-audit',
      category: 'Electricity',
      title: 'Conduct a Home Energy Audit',
      explanation: `At ~${monthlyKwh} kWh/month, your consumption is above the typical household average. Identifying where electricity is being wasted is the first step to reducing it.`,
      action: 'Review major appliances (heating, cooling, refrigeration) for efficiency. Consider a professional or DIY energy audit to find savings opportunities.',
      priority: 'Medium',
      estimatedImpact: round(co2 * 0.15),
    });
  }

  // Rule: renewable energy suggestion
  if (monthlyKwh > 100) {
    recs.push({
      id: 'electricity-renewable',
      category: 'Electricity',
      title: 'Consider Renewable Energy',
      explanation: 'Switching to a renewable electricity tariff or installing solar panels can significantly reduce the grid emission factor applied to your consumption.',
      action: 'Research green energy providers in your area, or explore rooftop solar feasibility. Even a partial renewable mix lowers your electricity emissions.',
      priority: 'Low',
      estimatedImpact: round(co2 * 0.5),
    });
  }

  return recs;
}

// ── Food rules ──────────────────────────────────────────────────

function buildFoodRecommendations(
  lifestyle: UserLifestyle,
  co2: number,
  rank: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const isHighImpact = rank === 0 && co2 > 0;
  const diet = lifestyle.food;
  const foodWaste = lifestyle.foodWaste;

  // Rule: high-impact diet types
  if (diet === 'Non-Vegetarian' || diet === 'Mixed') {
    const dietBase = diet === 'Non-Vegetarian' ? 1700 : 1300;
    const vegBase = 900;
    const estimatedSaving = round((dietBase - vegBase) / 1000);

    recs.push({
      id: 'food-diet-shift',
      category: 'Food',
      title: 'Reduce Food Impact',
      explanation: `Your ${diet.toLowerCase()} diet produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year. Animal-based foods, especially red meat and dairy, have significantly higher emissions per calorie than plant-based alternatives.`,
      action: 'Reduce food waste and consider lower-impact food choices. Incorporating more plant-based meals — even a few days per week — can meaningfully lower your dietary emissions.',
      priority: isHighImpact ? 'High' : 'Medium',
      estimatedImpact: estimatedSaving > 0 ? estimatedSaving : null,
    });
  }

  // Rule: vegetarian — suggest moving toward vegan
  if (diet === 'Vegetarian') {
    const estimatedSaving = round((900 - 600) / 1000);
    recs.push({
      id: 'food-plant-forward',
      category: 'Food',
      title: 'Move Further Toward Plant-Based',
      explanation: `Your vegetarian diet is already lower-impact than average, producing an estimated ${co2.toFixed(2)} tonnes CO₂e/year. Dairy products are the main remaining source of dietary emissions.`,
      action: 'Consider swapping some dairy products for plant-based alternatives (oat milk, plant-based yoghurts) to further reduce your food footprint.',
      priority: 'Low',
      estimatedImpact: estimatedSaving,
    });
  }

  // Rule: vegan — positive reinforcement
  if (diet === 'Vegan') {
    recs.push({
      id: 'food-maintain-vegan',
      category: 'Food',
      title: 'Maintain Your Plant-Based Diet',
      explanation: 'Your vegan diet has the lowest dietary emissions of all tracked patterns — an estimated 0.54–0.72 tonnes CO₂e/year depending on food waste.',
      action: 'Continue prioritising plant-based foods. Focus on reducing food waste to maximise the benefit of this low-emission diet.',
      priority: 'Low',
      estimatedImpact: null,
    });
  }

  // Rule: food waste
  if (foodWaste === 'Often') {
    const wasteSaving = round(co2 * 0.17);
    recs.push({
      id: 'food-waste-reduction',
      category: 'Food',
      title: 'Reduce Food Waste',
      explanation: 'You reported wasting food often. Roughly 11% of food-related emissions come from household food waste globally — reducing waste directly cuts both emissions and cost.',
      action: 'Plan meals ahead, store food properly, and use leftovers. Composting unavoidable food scraps also reduces landfill methane emissions.',
      priority: 'Medium',
      estimatedImpact: wasteSaving > 0 ? wasteSaving : null,
    });
  } else if (foodWaste === 'Sometimes') {
    recs.push({
      id: 'food-waste-improvement',
      category: 'Food',
      title: 'Further Reduce Food Waste',
      explanation: 'You sometimes waste food. Even moderate food waste contributes to your dietary emissions through unnecessary production and landfill decomposition.',
      action: 'Track what you throw away for a week to identify patterns, then adjust shopping and storage habits accordingly.',
      priority: 'Low',
      estimatedImpact: round(co2 * 0.08),
    });
  }

  // Fallback
  if (recs.length === 0 && co2 > 0) {
    recs.push({
      id: 'food-general',
      category: 'Food',
      title: 'Reduce Food Impact',
      explanation: `Your food consumption produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year — ${rank === 0 ? 'your largest emission source.' : 'a meaningful part of your footprint.'}`,
      action: 'Reduce food waste and consider lower-impact food choices.',
      priority: isHighImpact ? 'High' : 'Medium',
      estimatedImpact: round(co2 * 0.2),
    });
  }

  return recs;
}

// ── Waste rules ─────────────────────────────────────────────────

function buildWasteRecommendations(
  lifestyle: UserLifestyle,
  co2: number,
  rank: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const isHighImpact = rank === 0 && co2 > 0;
  const recycling = lifestyle.recycling;
  const wasteKg = lifestyle.waste;

  recs.push({
    id: 'waste-general',
    category: 'Waste',
    title: 'Improve Waste Management',
    explanation: `Your household waste produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year${wasteKg > 0 ? ` from ~${wasteKg} kg/week` : ''}. Most waste emissions come from organic material decomposing in landfill.`,
    action: 'Reduce single-use products, reuse materials, and improve recycling. Composting food scraps and yard waste can significantly cut landfill methane emissions.',
    priority: isHighImpact ? 'High' : 'Medium',
    estimatedImpact: round(co2 * 0.3),
  });

  // Rule: poor recycling habits
  if (recycling === 'Never' || recycling === 'Sometimes') {
    const currentMult = recycling === 'Never' ? 1.0 : 0.75;
    const potentialMult = 0.5;
    const estimatedSaving = round(co2 * (1 - potentialMult / currentMult));

    recs.push({
      id: 'waste-improve-recycling',
      category: 'Waste',
      title: recycling === 'Never' ? 'Start Recycling' : 'Recycle More Consistently',
      explanation:
        recycling === 'Never'
          ? 'You currently do not recycle. All your household waste goes to landfill, where it generates methane and CO₂ as it decomposes.'
          : 'You recycle sometimes, but consistent recycling can further reduce the share of waste sent to landfill.',
      action: 'Set up sorted bins for recyclables (paper, plastic, glass, metal) and check your local recycling guidelines. Consistent recycling can reduce waste emissions by up to 50%.',
      priority: recycling === 'Never' ? 'High' : 'Medium',
      estimatedImpact: estimatedSaving > 0 ? estimatedSaving : null,
    });
  }

  // Rule: high waste volume
  if (wasteKg > 8) {
    recs.push({
      id: 'waste-reduce-volume',
      category: 'Waste',
      title: 'Reduce Total Waste Volume',
      explanation: `At ~${wasteKg} kg/week, your waste generation is above average. The most effective way to reduce waste emissions is to produce less waste in the first place.`,
      action: 'Buy in bulk to reduce packaging, choose reusable alternatives over disposables, and repair items instead of replacing them.',
      priority: 'Medium',
      estimatedImpact: round(co2 * 0.2),
    });
  }

  return recs;
}

// ── Travel (flights) rules ──────────────────────────────────────

function buildTravelRecommendations(
  lifestyle: UserLifestyle,
  co2: number,
  rank: number,
): Recommendation[] {
  const recs: Recommendation[] = [];
  const isHighImpact = rank === 0 && co2 > 0;
  const flights = lifestyle.travel;

  if (co2 <= 0) {
    recs.push({
      id: 'travel-maintain',
      category: 'Travel',
      title: 'Maintain Low Air Travel',
      explanation: 'You reported no flights in the past year — your air travel emissions are zero. This is the lowest-impact option for travel.',
      action: 'Continue minimising air travel where possible. When you do fly, consider offsetting emissions through verified carbon offset programmes.',
      priority: 'Low',
      estimatedImpact: null,
    });
    return recs;
  }

  recs.push({
    id: 'travel-general',
    category: 'Travel',
    title: 'Reduce Travel Emissions',
    explanation: `Your air travel produces an estimated ${co2.toFixed(2)} tonnes CO₂e/year — ${rank === 0 ? 'your largest emission source.' : 'a significant part of your footprint.'} Flying is one of the most carbon-intensive activities per hour.`,
    action: 'Consider alternatives to frequent flights when practical. Trains, buses, and virtual meetings can replace many short-haul flights.',
    priority: isHighImpact ? 'High' : 'Medium',
    estimatedImpact: round(co2 * 0.4),
  });

  // Rule: frequent flyers
  if (flights === '6+' || flights === '3-5') {
    recs.push({
      id: 'travel-reduce-frequency',
      category: 'Travel',
      title: flights === '6+' ? 'Reduce Flight Frequency' : 'Moderate Flight Frequency',
      explanation:
        flights === '6+'
          ? `You take 6 or more flights per year, producing an estimated ${co2.toFixed(2)} tonnes CO₂e. This is well above the global average for air travel.`
          : `You take 3–5 flights per year, producing an estimated ${co2.toFixed(2)} tonnes CO₂e. Reducing even one or two flights can have a measurable impact.`,
      action: 'Identify flights that could be replaced by train journeys or virtual meetings. For essential flights, consider direct routes (takeoffs and landings produce the most emissions) and economy class.',
      priority: flights === '6+' ? 'High' : 'Medium',
      estimatedImpact: round(co2 * 0.3),
    });
  }

  // Rule: offset suggestion
  if (co2 > 0.5) {
    recs.push({
      id: 'travel-offset',
      category: 'Travel',
      title: 'Consider Verified Carbon Offsets',
      explanation: 'For flights you cannot avoid, verified carbon offset programmes can fund emission reductions elsewhere to compensate for your air travel emissions.',
      action: 'Look for offsets certified by recognised standards (e.g. Gold Standard, Verified Carbon Standard). Offset programmes should fund additional, permanent emission reductions — not simply tree planting alone.',
      priority: 'Low',
      estimatedImpact: null,
    });
  }

  return recs;
}

// ── Main entry point ────────────────────────────────────────────

const priorityOrder: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };

/**
 * Generate personalized sustainability recommendations from the user's
 * carbon calculation result and lifestyle data.
 *
 * The engine:
 * 1. Ranks all five emission categories from highest to lowest.
 * 2. Runs category-specific rules that inspect the user's actual lifestyle inputs.
 * 3. Assigns priority based on category rank and rule-specific thresholds.
 * 4. Estimates potential CO₂e savings using the same emission factors as the calculator.
 * 5. Returns 3–5 recommendations sorted by priority (High → Medium → Low).
 */
export function generateRecommendations(
  result: CarbonResult,
  lifestyle: UserLifestyle,
): RecommendationSummary {
  const ranked = rankCategories(result);
  const total = result.totalCO2;

  const all: Recommendation[] = [];

  for (const cat of ranked) {
    let recs: Recommendation[] = [];
    switch (cat.name) {
      case 'Transportation':
        recs = buildTransportationRecommendations(lifestyle, cat.value, ranked.indexOf(cat), total);
        break;
      case 'Electricity':
        recs = buildElectricityRecommendations(lifestyle, cat.value, ranked.indexOf(cat));
        break;
      case 'Food':
        recs = buildFoodRecommendations(lifestyle, cat.value, ranked.indexOf(cat));
        break;
      case 'Waste':
        recs = buildWasteRecommendations(lifestyle, cat.value, ranked.indexOf(cat));
        break;
      case 'Travel':
        recs = buildTravelRecommendations(lifestyle, cat.value, ranked.indexOf(cat));
        break;
    }
    all.push(...recs);
  }

  // Sort by priority (High first), then by estimated impact (descending)
  const sorted = all.sort((a, b) => {
    const pDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (pDiff !== 0) return pDiff;
    const aImpact = a.estimatedImpact ?? 0;
    const bImpact = b.estimatedImpact ?? 0;
    return bImpact - aImpact;
  });

  // Take top 5, but ensure at least 3
  const recommendations = sorted.slice(0, 5);

  const topCategory = ranked[0];
  const headline =
    total > 0
      ? `${topCategory.name} is currently your largest estimated source of emissions.`
      : 'Your estimated emissions are very low — maintain your current habits.';

  return { headline, recommendations };
}

/** Convenience: generate recommendations directly from FormData. */
export function generateRecommendationsFromFormData(data: FormData): RecommendationSummary {
  const lifestyle = mapFormData(data);
  const result = calculateCarbon(lifestyle);
  return generateRecommendations(result, lifestyle);
}
