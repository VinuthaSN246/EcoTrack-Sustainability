import sys
sys.path.insert(0, '.')
from services.model_service import predict

lifestyle = {
    'transport_type': 'Car',
    'daily_distance_km': 25,
    'travel_days_per_week': 5,
    'electricity_kwh_month': 300,
    'diet_type': 'Mixed',
    'food_waste_frequency': 'Sometimes',
    'waste_kg_week': 5,
    'recycling_frequency': 'Often',
    'flights_per_year': '1-2',
}

result = predict(lifestyle)
print("=== ML Prediction Test ===")
print("Predicted CO2:", result["predictedCO2"], "tonnes/yr")
print("Model:", result["modelName"])
print("R2:", round(result["r2"], 4))
print("MAE:", round(result["mae"], 4), "t CO2e")
print("RMSE:", round(result["rmse"], 4), "t CO2e")
print("STATUS: OK")
