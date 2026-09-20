"""
Model service — loads the trained model and provides a predict() function.

Handles feature encoding (one-hot) for incoming lifestyle data so the
Flask app doesn't need to know about sklearn internals.
"""

import os
import pickle

import numpy as np
import pandas as pd

MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'model', 'carbon_model.pkl')

_model_bundle = None


def load_model():
    """Lazy-load the pickled model bundle (only once)."""
    global _model_bundle
    if _model_bundle is None:
        with open(MODEL_PATH, 'rb') as f:
            _model_bundle = pickle.load(f)
    return _model_bundle


def encode_features(lifestyle: dict, feature_columns: list, categorical_cols: list, numerical_cols: list):
    """
    One-hot encode a single lifestyle dict into the feature vector
    the model was trained on.
    """
    row = {}
    for col in numerical_cols:
        row[col] = float(lifestyle.get(col, 0))

    for col in categorical_cols:
        val = lifestyle.get(col, '')
        # Generate all one-hot columns for this categorical
        for fc in feature_columns:
            if fc.startswith(col + '_'):
                row[fc] = 1 if fc == f'{col}_{val}' else 0

    # Build vector in the exact training-column order
    vector = []
    for fc in feature_columns:
        vector.append(row.get(fc, 0))
    return np.array([vector])


def predict(lifestyle: dict) -> dict:
    """
    Predict carbon footprint from lifestyle data.

    Expected keys in lifestyle:
      transport_type, daily_distance_km, travel_days_per_week,
      electricity_kwh_month, diet_type, food_waste_frequency,
      waste_kg_week, recycling_frequency, flights_per_year

    Returns:
      {
        predictedCO2: float,
        modelName: str,
        r2: float,
        mae: float,
        rmse: float,
      }
    """
    bundle = load_model()
    model = bundle['model']
    feature_columns = bundle['feature_columns']
    categorical_cols = bundle['categorical_cols']
    numerical_cols = bundle['numerical_cols']
    metrics = bundle['metrics']

    X = encode_features(lifestyle, feature_columns, categorical_cols, numerical_cols)
    prediction = float(model.predict(X)[0])
    prediction = max(0.0, round(prediction, 2))

    return {
        'predictedCO2': prediction,
        'modelName': bundle['model_name'],
        'r2': metrics['r2'],
        'mae': metrics['mae'],
        'rmse': metrics['rmse'],
    }
