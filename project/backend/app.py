"""
Flask API for EcoTrack.

Endpoints:
  ML:
    POST /api/predict           — ML-based carbon footprint prediction
    GET  /api/health            — Health check

  Auth:
    POST /api/auth/register     — Register a new user
    POST /api/auth/login        — Login and return user info

  Footprints:
    POST /api/footprints        — Save a footprint calculation
    GET  /api/footprints        — Get all footprints for a user
    GET  /api/footprints/latest — Get the latest footprint for a user

  Recommendations:
    GET  /api/recommendations   — Get stored recommendation templates
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

# Add backend/ to path so services can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.model_service import predict, load_model
from services import db_service

app = Flask(__name__)
CORS(app)


# ── Health ───────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    try:
        load_model()
        return jsonify({'status': 'ok', 'model_loaded': True})
    except Exception as e:
        return jsonify({'status': 'error', 'model_loaded': False, 'error': str(e)}), 500


# ── ML Prediction ────────────────────────────────────────────────

@app.route('/api/predict', methods=['POST', 'OPTIONS'])
def predict_endpoint():
    if request.method == 'OPTIONS':
        resp = jsonify({'ok': True})
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    required = [
        'transport_type', 'daily_distance_km', 'travel_days_per_week',
        'electricity_kwh_month', 'diet_type', 'food_waste_frequency',
        'waste_kg_week', 'recycling_frequency', 'flights_per_year',
    ]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    try:
        result = predict(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500


# ── Auth ─────────────────────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        resp = jsonify({'ok': True})
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    import re
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email address format'}), 400

    if len(password) < 6:
        return jsonify({'error': 'Password must be at least 6 characters'}), 400

    try:
        user = db_service.create_user(name, email, password)
        return jsonify({'user': user, 'message': 'Registration successful'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except Exception as e:
        return jsonify({'error': f'Registration failed: {str(e)}'}), 500


@app.route('/api/auth/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        resp = jsonify({'ok': True})
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    email = data.get('email', '').strip()
    password = data.get('password', '')

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = db_service.authenticate_user(email, password)
    if user is None:
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({'user': user, 'message': 'Login successful'})


# ── Footprints ───────────────────────────────────────────────────

@app.route('/api/footprints', methods=['POST', 'OPTIONS'])
def save_footprint():
    if request.method == 'OPTIONS':
        resp = jsonify({'ok': True})
        resp.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    user_id = data.get('user_id')
    if not user_id or not isinstance(user_id, int):
        return jsonify({'error': 'user_id (integer) is required'}), 400

    required = ['transportation', 'electricity', 'food', 'waste', 'travel', 'total_co2', 'eco_score']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    for f in required:
        val = data[f]
        if not isinstance(val, (int, float)) or isinstance(val, bool) or val < 0:
            return jsonify({'error': f'{f} must be a non-negative number'}), 400

    try:
        record = db_service.save_footprint(
            user_id=user_id,
            transportation=float(data['transportation']),
            electricity=float(data['electricity']),
            food=float(data['food']),
            waste=float(data['waste']),
            travel=float(data['travel']),
            total_co2=float(data['total_co2']),
            eco_score=int(data['eco_score']),
        )
        return jsonify({'footprint': record, 'message': 'Footprint saved'}), 201
    except Exception as e:
        return jsonify({'error': f'Save failed: {str(e)}'}), 500


@app.route('/api/footprints', methods=['GET'])
def get_footprints():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'error': 'user_id query parameter is required'}), 400

    try:
        records = db_service.get_footprints(user_id)
        return jsonify({'footprints': records, 'count': len(records)})
    except Exception as e:
        return jsonify({'error': f'Retrieval failed: {str(e)}'}), 500


@app.route('/api/footprints/latest', methods=['GET'])
def get_latest_footprint():
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({'error': 'user_id query parameter is required'}), 400

    try:
        record = db_service.get_latest_footprint(user_id)
        if record is None:
            return jsonify({'footprint': None, 'message': 'No saved footprints yet'}), 404
        return jsonify({'footprint': record})
    except Exception as e:
        return jsonify({'error': f'Retrieval failed: {str(e)}'}), 500


# ── Recommendations ──────────────────────────────────────────────

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    try:
        recs = db_service.get_recommendations()
        return jsonify({'recommendations': recs, 'count': len(recs)})
    except Exception as e:
        return jsonify({'error': f'Retrieval failed: {str(e)}'}), 500
# ── AI Assistant ─────────────────────────────────────────────────

@app.route('/api/assistant', methods=['POST', 'OPTIONS'])
def assistant():
    if request.method == 'OPTIONS':
        resp = jsonify({'ok': True})
        resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return resp

    data = request.get_json(silent=True)
    if not data or 'message' not in data:
        return jsonify({'error': 'Message is required'}), 400

    user_msg = data['message'].lower()
    
    import time
    time.sleep(1) # Simulate network delay

    # Simple rule-based responses
    if 'reduce' in user_msg and 'food' in user_msg:
        reply = "To reduce food waste, try planning your meals ahead of time, freezing leftovers, and composting organic waste. Did you know food waste accounts for about 6% of global greenhouse gas emissions?"
    elif 'electricity' in user_msg or 'energy' in user_msg:
        reply = "You can lower electricity usage by switching to LED bulbs, unplugging idle devices, and washing clothes in cold water. Adjusting your thermostat by just 1°C can save significant energy!"
    elif 'travel' in user_msg or 'flight' in user_msg or 'car' in user_msg:
        reply = "Transportation is a huge factor. Consider carpooling, taking public transit, or biking for short trips. If you must fly, look for direct flights as takeoffs and landings use the most fuel."
    elif 'recycle' in user_msg or 'waste' in user_msg:
        reply = "Recycling is great, but reducing and reusing are even better! Try to avoid single-use plastics, buy in bulk, and repair items instead of throwing them away."
    else:
        reply = "That's a great question about sustainability! While I'm just a simple demo assistant right now, I'm learning every day. Try asking me about reducing food waste, saving electricity, or sustainable travel!"

    return jsonify({'reply': reply})


if __name__ == '__main__':
    load_model()
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5001))
    print(f'Model + database loaded. Starting Flask server on {host}:{port}...')
    app.run(host=host, port=port, debug=False)
