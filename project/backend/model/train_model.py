"""
Train a Random Forest regression model to predict carbon footprint
(tonnes CO2e/year) from lifestyle features.

Pipeline:
  1. Load the synthetic dataset (generate_dataset.py output).
  2. Encode categorical features with one-hot encoding.
  3. Split into train/test (80/20).
  4. Train a RandomForestRegressor with 200 trees.
  5. Evaluate: R², MAE, RMSE on the test set.
  6. Persist the model + encoder metadata as a pickle.

Limitations:
  - The dataset is synthetic (see generate_dataset.py docstring).
  - The model learns the emission-factor formula + 5% noise, so it
    approximates the deterministic calculator closely but does not
    capture real-world variability (regional grids, unmeasured
    confounders, behavioural correlations).
  - Predictions outside the training feature ranges will be less reliable.
"""

import pickle
import sys
import os

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

DATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'carbon_footprint_dataset.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'carbon_model.pkl')

CATEGORICAL_COLS = [
    'transport_type', 'diet_type', 'food_waste_frequency',
    'recycling_frequency', 'flights_per_year',
]
NUMERICAL_COLS = [
    'daily_distance_km', 'travel_days_per_week',
    'electricity_kwh_month', 'waste_kg_week',
]
TARGET_COL = 'total_carbon_tonnes'


def load_data():
    df = pd.read_csv(DATA_PATH)
    print(f'Loaded {len(df)} rows from {DATA_PATH}')
    print(f'Columns: {list(df.columns)}')
    return df


def preprocess(df):
    """One-hot encode categoricals, keep numericals as-is."""
    X_cat = pd.get_dummies(df[CATEGORICAL_COLS], prefix=CATEGORICAL_COLS)
    X_num = df[NUMERICAL_COLS].copy()
    X = pd.concat([X_num, X_cat], axis=1)
    y = df[TARGET_COL].values
    feature_columns = list(X.columns)
    return X.values, y, feature_columns


def train():
    df = load_data()
    X, y, feature_columns = preprocess(df)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    model = RandomForestRegressor(
        n_estimators=200,
        max_depth=12,
        min_samples_leaf=3,
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = math_rmse(y_test, y_pred)

    print(f'\nModel: RandomForestRegressor (200 trees, max_depth=12)')
    print(f'  R²:   {r2:.4f}')
    print(f'  MAE:  {mae:.4f} tonnes CO2e')
    print(f'  RMSE: {rmse:.4f} tonnes CO2e')
    print(f'  Features: {len(feature_columns)}')

    # Persist model + metadata
    bundle = {
        'model': model,
        'feature_columns': feature_columns,
        'categorical_cols': CATEGORICAL_COLS,
        'numerical_cols': NUMERICAL_COLS,
        'metrics': {
            'r2': float(r2),
            'mae': float(mae),
            'rmse': float(rmse),
        },
        'model_name': 'RandomForestRegressor',
        'n_estimators': 200,
    }

    with open(MODEL_PATH, 'wb') as f:
        pickle.dump(bundle, f)

    print(f'\nModel saved to {MODEL_PATH}')
    return bundle


def math_rmse(y_true, y_pred):
    return float(np.sqrt(np.mean((np.array(y_true) - np.array(y_pred)) ** 2)))


if __name__ == '__main__':
    train()
