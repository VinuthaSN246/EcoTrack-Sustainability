"""
Generate a synthetic carbon-footprint training dataset.

The dataset is synthetically generated using the SAME emission factors
that EcoTrack's deterministic calculator uses (DEFRA 2023, IEA, EPA,
Poore & Nemecek 2018). Random lifestyle combinations are sampled across
realistic ranges, and the target variable (total tonnes CO2e/year) is
computed using the calculator's formula with added Gaussian noise
(~5% std) to simulate real-world measurement variation.

This is NOT a copy of a real-world survey dataset. There is no publicly
available, downloadable CSV with exactly these features that can be
fetched programmatically in this environment. However, because the target
is derived from established emission factors, the dataset reflects
realistic relationships between lifestyle inputs and carbon emissions.

Dataset details:
  Source: Synthetic, derived from DEFRA 2023 / IEA / EPA / Poore & Nemecek 2018
  Samples: 5,000
  Features: 9 (transport_type, daily_distance_km, travel_days_per_week,
            electricity_kwh_month, diet_type, food_waste_frequency,
            waste_kg_week, recycling_frequency, flights_per_year)
  Target: total_carbon_tonnes (float, tonnes CO2e/year)
  Preprocessing: categorical encoding, handled in train_model.py
  Limitations: Synthetic — no real survey noise, no unmeasured confounders,
               no regional grid variation. Model learns the emission-factor
               formula plus noise, so it should approximate the calculator
               closely but will not capture real-world variability.
"""

import csv
import random
import math

random.seed(42)

# ── Emission factors (must match src/data/emissionFactors.ts) ──────────

TRANSPORT_FACTORS = {
    'Car': 0.192,
    'Motorcycle': 0.113,
    'Bus': 0.097,
    'Train': 0.035,
    'Bicycle': 0.0,
    'Walking': 0.0,
    'Electric Vehicle': 0.053,
}

ELECTRICITY_FACTOR = 0.475  # kg CO2e / kWh

DIET_ANNUAL = {
    'Vegan': 600,
    'Vegetarian': 900,
    'Non-Vegetarian': 1700,
    'Mixed': 1300,
}

FOOD_WASTE_MULT = {
    'Rarely': 0.9,
    'Sometimes': 1.0,
    'Often': 1.2,
}

WASTE_FACTOR = 0.5  # kg CO2e / kg waste

RECYCLING_MULT = {
    'Never': 1.0,
    'Sometimes': 0.75,
    'Often': 0.5,
}

FLIGHTS_FACTOR = {
    '0': 0,
    '1-2': 250,
    '3-5': 750,
    '6+': 2000,
}

TRANSPORT_TYPES = list(TRANSPORT_FACTORS.keys())
DIET_TYPES = list(DIET_ANNUAL.keys())
WASTE_FREQS = list(FOOD_WASTE_MULT.keys())
RECYCLING_FREQS = list(RECYCLING_MULT.keys())
FLIGHT_CATS = list(FLIGHTS_FACTOR.keys())


def sample_lifestyle():
    """Sample a random realistic lifestyle profile."""
    transport = random.choices(
        TRANSPORT_TYPES, weights=[35, 8, 15, 10, 8, 5, 19], k=1
    )[0]

    if transport in ('Bicycle', 'Walking'):
        distance = round(random.uniform(0.5, 8), 1)
        days = random.randint(2, 7)
    elif transport in ('Bus', 'Train'):
        distance = round(random.uniform(3, 40), 1)
        days = random.randint(3, 7)
    else:
        distance = round(random.uniform(5, 80), 1)
        days = random.randint(3, 7)

    electricity = round(random.uniform(50, 600), 0)
    diet = random.choices(DIET_TYPES, weights=[5, 15, 50, 30], k=1)[0]
    food_waste = random.choices(WASTE_FREQS, weights=[20, 55, 25], k=1)[0]
    waste_kg = round(random.uniform(1, 20), 1)
    recycling = random.choices(RECYCLING_FREQS, weights=[20, 40, 40], k=1)[0]
    flights = random.choices(FLIGHT_CATS, weights=[40, 30, 20, 10], k=1)[0]

    return {
        'transport_type': transport,
        'daily_distance_km': distance,
        'travel_days_per_week': days,
        'electricity_kwh_month': electricity,
        'diet_type': diet,
        'food_waste_frequency': food_waste,
        'waste_kg_week': waste_kg,
        'recycling_frequency': recycling,
        'flights_per_year': flights,
    }


def calculate_emissions(lifestyle):
    """Calculate total tonnes CO2e/year — matches carbonCalculator.ts."""
    transport_rate = TRANSPORT_FACTORS[lifestyle['transport_type']]
    transport_kg = lifestyle['daily_distance_km'] * transport_rate * lifestyle['travel_days_per_week'] * 52
    transport_co2 = transport_kg / 1000

    elec_kg = lifestyle['electricity_kwh_month'] * 12 * ELECTRICITY_FACTOR
    elec_co2 = elec_kg / 1000

    diet_base = DIET_ANNUAL[lifestyle['diet_type']]
    waste_mult = FOOD_WASTE_MULT[lifestyle['food_waste_frequency']]
    food_kg = diet_base * waste_mult
    food_co2 = food_kg / 1000

    rec_mult = RECYCLING_MULT[lifestyle['recycling_frequency']]
    waste_kg_total = lifestyle['waste_kg_week'] * 52 * WASTE_FACTOR * rec_mult
    waste_co2 = waste_kg_total / 1000

    flights_kg = FLIGHTS_FACTOR[lifestyle['flights_per_year']]
    travel_co2 = flights_kg / 1000

    total = transport_co2 + elec_co2 + food_co2 + waste_co2 + travel_co2
    return round(total, 4)


def generate_dataset(n_samples=5000, output_path='backend/data/carbon_footprint_dataset.csv'):
    rows = []
    for _ in range(n_samples):
        lifestyle = sample_lifestyle()
        total = calculate_emissions(lifestyle)
        # Add Gaussian noise (~5%) to simulate real-world measurement variation
        noise = random.gauss(0, max(0.05 * total, 0.02))
        total_noisy = max(0, round(total + noise, 4))
        row = {**lifestyle, 'total_carbon_tonnes': total_noisy}
        rows.append(row)

    fieldnames = [
        'transport_type', 'daily_distance_km', 'travel_days_per_week',
        'electricity_kwh_month', 'diet_type', 'food_waste_frequency',
        'waste_kg_week', 'recycling_frequency', 'flights_per_year',
        'total_carbon_tonnes',
    ]

    with open(output_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f'Generated {n_samples} samples -> {output_path}')
    totals = [r['total_carbon_tonnes'] for r in rows]
    print(f'  Target range: {min(totals):.2f} – {max(totals):.2f} t CO2e')
    print(f'  Target mean:  {sum(totals)/len(totals):.2f} t CO2e')


if __name__ == '__main__':
    generate_dataset()
