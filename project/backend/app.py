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

from flask import Flask, request, jsonify, session
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
import sys
import os
import math
import time
from collections import defaultdict, deque

# Add backend/ to path so services can be imported
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.model_service import predict, load_model
from services import db_service

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 64 * 1024
app.config.update(
    SECRET_KEY=os.environ.get('SECRET_KEY') or 'dev-only-change-this-secret',
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    SESSION_COOKIE_SECURE=os.environ.get('COOKIE_SECURE', '').lower() == 'true',
)
if not os.environ.get('SECRET_KEY') and os.environ.get('FLASK_ENV') == 'production':
    raise RuntimeError('SECRET_KEY must be configured in production')
allowed_origins = [origin.strip() for origin in os.environ.get('CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',') if origin.strip()]
CORS(app, resources={r"/api/*": {"origins": allowed_origins}}, supports_credentials=True)
_rate_events = defaultdict(deque)

def enforce_rate_limit(bucket: str, limit: int, window_seconds: int):
    now = time.monotonic()
    key = (bucket, request.remote_addr or 'unknown')
    events = _rate_events[key]
    while events and events[0] <= now - window_seconds:
        events.popleft()
    if len(events) >= limit:
        return jsonify({'error': 'Too many requests. Please try again later.'}), 429
    events.append(now)
    return None

@app.before_request
def attach_authenticated_user():
    request.user_id = session.get('user_id')

def require_auth():
    if not request.user_id:
        return jsonify({'error': 'Authentication required'}), 401
    return None


# ── Health ───────────────────────────────────────────────────────

@app.route('/api/health', methods=['GET'])
def health():
    try:
        load_model()
        model_loaded = True
    except Exception:
        app.logger.exception('Health check failed')
        model_loaded = False
    try:
        db_service.init_db()
        return jsonify({'status': 'ok' if model_loaded else 'degraded', 'model_loaded': model_loaded, 'database': 'ok'})
    except Exception:
        app.logger.exception('Database health check failed')
        return jsonify({'status': 'error', 'model_loaded': model_loaded, 'database': 'error'}), 500


# ── ML Prediction ────────────────────────────────────────────────

@app.route('/api/predict', methods=['POST'])
def predict_endpoint():
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

    numeric_ranges = {
        'daily_distance_km': (0, 500), 'travel_days_per_week': (0, 7),
        'electricity_kwh_month': (0, 10000), 'waste_kg_week': (0, 1000),
    }
    for field, (low, high) in numeric_ranges.items():
        value = data[field]
        if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not low <= value <= high:
            return jsonify({'error': f'{field} must be between {low} and {high}'}), 400
    categories = {
        'transport_type': {'Car', 'Motorcycle', 'Bus', 'Train', 'Bicycle', 'Walking', 'Electric Vehicle'},
        'diet_type': {'Vegan', 'Vegetarian', 'Non-Vegetarian', 'Mixed'},
        'food_waste_frequency': {'Rarely', 'Sometimes', 'Often'},
        'recycling_frequency': {'Never', 'Sometimes', 'Often'},
        'flights_per_year': {'0', '1-2', '3-5', '6+'},
    }
    for field, allowed in categories.items():
        if data[field] not in allowed:
            return jsonify({'error': f'Invalid {field}'}), 400

    try:
        result = predict(data)
        return jsonify(result)
    except Exception:
        app.logger.exception('Prediction failed')
        return jsonify({'error': 'Prediction failed'}), 500


# ── Auth ─────────────────────────────────────────────────────────

@app.route('/api/auth/register', methods=['POST'])
def register():
    limited = enforce_rate_limit('register', 5, 3600)
    if limited: return limited
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'Request body must be JSON'}), 400

    name = data.get('name', '')
    email = data.get('email', '')
    password = data.get('password', '')
    if not all(isinstance(v, str) for v in (name, email, password)):
        return jsonify({'error': 'Name, email, and password must be text'}), 400
    name, email = name.strip(), email.strip()
    if not name or not email or not password:
        return jsonify({'error': 'Name, email, and password are required'}), 400

    if len(name) > 100 or len(email) > 254 or len(password) > 256:
        return jsonify({'error': 'One or more fields exceed the maximum length'}), 400

    import re
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$'
    if not re.match(email_regex, email):
        return jsonify({'error': 'Invalid email address format'}), 400

    if len(password) < 12:
        return jsonify({'error': 'Password must be at least 12 characters'}), 400

    try:
        user = db_service.create_user(name, email, password)
        session['user_id'] = user['id']
        return jsonify({'user': user, 'message': 'Registration successful'}), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 409
    except IntegrityError:
        return jsonify({'error': 'Email already registered'}), 409
    except Exception:
        app.logger.exception('Registration failed')
        return jsonify({'error': 'Registration failed'}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    limited = enforce_rate_limit('login', 10, 60)
    if limited: return limited
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'Request body must be JSON'}), 400

    email = data.get('email', '')
    password = data.get('password', '')
    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({'error': 'Email and password must be text'}), 400
    email = email.strip()

    if not email or not password:
        return jsonify({'error': 'Email and password are required'}), 400

    user = db_service.authenticate_user(email, password)
    if user is None:
        return jsonify({'error': 'Invalid email or password'}), 401
    session.clear()
    session['user_id'] = user['id']
    return jsonify({'user': user, 'message': 'Login successful'})


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({'error': 'Request body exceeds the allowed size.'}), 413

@app.route('/api/auth/me', methods=['GET'])
def current_user():
    if not request.user_id:
        return jsonify({'user': None}), 200
    try:
        user = db_service.get_user(request.user_id)
    except Exception:
        app.logger.exception('Loading current user failed')
        return jsonify({'error': 'Unable to load session'}), 500
    if not user:
        session.clear()
    return jsonify({'user': user})

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logged out'})


# ── Footprints ───────────────────────────────────────────────────

@app.route('/api/footprints', methods=['POST'])
def save_footprint():
    auth_error = require_auth()
    if auth_error: return auth_error

    data = request.get_json(silent=True)
    if not data:
        return jsonify({'error': 'Request body must be JSON'}), 400

    user_id = request.user_id

    required = ['transportation', 'electricity', 'food', 'waste', 'travel', 'total_co2', 'eco_score']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing fields: {", ".join(missing)}'}), 400

    for f in required:
        val = data[f]
        if not isinstance(val, (int, float)) or isinstance(val, bool) or not math.isfinite(val) or val < 0:
            return jsonify({'error': f'{f} must be a non-negative number'}), 400
    if any(data[f] > 10000 for f in required if f != 'eco_score'):
        return jsonify({'error': 'Emission values must not exceed 10000 tonnes CO2e'}), 400
    if not isinstance(data['eco_score'], int) or isinstance(data['eco_score'], bool) or not 0 <= data['eco_score'] <= 100:
        return jsonify({'error': 'eco_score must be an integer from 0 to 100'}), 400

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
    except Exception:
        app.logger.exception('Saving footprint failed')
        return jsonify({'error': 'Save failed'}), 500


@app.route('/api/footprints', methods=['GET'])
def get_footprints():
    auth_error = require_auth()
    if auth_error: return auth_error
    user_id = request.user_id

    try:
        records = db_service.get_footprints(user_id)
        return jsonify({'footprints': records, 'count': len(records)})
    except Exception:
        app.logger.exception('Retrieving footprints failed')
        return jsonify({'error': 'Retrieval failed'}), 500


@app.route('/api/footprints/latest', methods=['GET'])
def get_latest_footprint():
    auth_error = require_auth()
    if auth_error: return auth_error
    user_id = request.user_id

    try:
        record = db_service.get_latest_footprint(user_id)
        if record is None:
            return jsonify({'footprint': None, 'message': 'No saved footprints yet'}), 404
        return jsonify({'footprint': record})
    except Exception:
        app.logger.exception('Retrieving latest footprint failed')
        return jsonify({'error': 'Retrieval failed'}), 500


# ── Recommendations ──────────────────────────────────────────────

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    try:
        recs = db_service.get_recommendations()
        return jsonify({'recommendations': recs, 'count': len(recs)})
    except Exception:
        app.logger.exception('Recommendations retrieval failed')
        return jsonify({'error': 'Retrieval failed'}), 500
# ── AI Assistant ─────────────────────────────────────────────────

@app.route('/api/assistant', methods=['POST'])
def assistant():
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not isinstance(data.get('message'), str):
        return jsonify({'error': 'Message is required'}), 400

    if len(data['message']) > 2000:
        return jsonify({'error': 'Message is too long'}), 400
    user_msg = data['message'].lower()

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
