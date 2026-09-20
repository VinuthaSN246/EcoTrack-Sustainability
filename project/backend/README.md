# EcoTrack ML Backend

A Python Flask API that serves a Random Forest regression model for
predicting carbon footprint from lifestyle data.

## Architecture

```
backend/
  app.py                  — Flask API server (port 5001)
  requirements.txt        — Python dependencies
  data/
    generate_dataset.py   — Generates the synthetic training dataset
    carbon_footprint_dataset.csv — Generated dataset (5000 samples)
  model/
    train_model.py        — Trains and persists the RandomForestRegressor
    carbon_model.pkl      — Trained model (pickle)
  services/
    model_service.py      — Loads model, encodes features, runs predictions
```

## Dataset

**Source:** Synthetic, generated from established emission factors
(DEFRA 2023, IEA, EPA, Poore & Nemecek 2018).

No publicly available CSV with exactly these features (transport type,
distance, electricity, diet, waste, recycling, flights) could be
downloaded programmatically in this environment. Instead, 5,000 random
lifestyle profiles were sampled across realistic ranges and the target
(tonnes CO2e/year) was computed using the same emission-factor formula
as EcoTrack's deterministic calculator, with ~5% Gaussian noise added
to simulate measurement variation.

**Features (9):**
| Feature | Type | Range |
|---|---|---|
| transport_type | categorical | Car, Motorcycle, Bus, Train, Bicycle, Walking, Electric Vehicle |
| daily_distance_km | numerical | 0.5–80 |
| travel_days_per_week | numerical | 2–7 |
| electricity_kwh_month | numerical | 50–600 |
| diet_type | categorical | Vegan, Vegetarian, Non-Vegetarian, Mixed |
| food_waste_frequency | categorical | Rarely, Sometimes, Often |
| waste_kg_week | numerical | 1–20 |
| recycling_frequency | categorical | Never, Sometimes, Often |
| flights_per_year | categorical | 0, 1-2, 3-5, 6+ |

**Target:** `total_carbon_tonnes` (float, tonnes CO2e/year)

**Preprocessing:**
- Categorical features: one-hot encoding (pd.get_dummies)
- Numerical features: used as-is (Random Forest is scale-invariant)
- Train/test split: 80/20, random_state=42

**Limitations:**
- Synthetic dataset — no real survey noise, no unmeasured confounders,
  no regional grid variation.
- The model learns the emission-factor formula + 5% noise, so it
  approximates the deterministic calculator closely but will not
  capture real-world variability.
- Predictions outside the training feature ranges will be less reliable.

## Model

**Algorithm:** Random Forest Regression (scikit-learn)
**Parameters:** 200 trees, max_depth=12, min_samples_leaf=3
**Why Random Forest:** Captures non-linear relationships between
lifestyle inputs and emissions, handles categorical encoding well,
and provides robust predictions without deep learning complexity.

## Setup

```bash
cd backend
pip install -r requirements.txt

# 1. Generate dataset
python data/generate_dataset.py

# 2. Train model
python model/train_model.py

# 3. Start API
python app.py  # runs on port 5001
```

## API

### POST /api/predict
```json
// Request
{
  "transport_type": "Car",
  "daily_distance_km": 30,
  "travel_days_per_week": 5,
  "electricity_kwh_month": 300,
  "diet_type": "Non-Vegetarian",
  "food_waste_frequency": "Sometimes",
  "waste_kg_week": 10,
  "recycling_frequency": "Sometimes",
  "flights_per_year": "0"
}

// Response
{
  "predictedCO2": 5.12,
  "modelName": "RandomForestRegressor",
  "r2": 0.98,
  "mae": 0.08,
  "rmse": 0.12
}
```

### GET /api/health
Returns `{ "status": "ok", "model_loaded": true }`
