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
import re
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


@app.route('/api/profile', methods=['GET', 'PUT'])
def profile_endpoint():
    auth_error = require_auth()
    if auth_error:
        return auth_error
    if request.method == 'GET':
        try:
            profile = db_service.get_profile(request.user_id)
            return jsonify({'profile': profile}) if profile else (jsonify({'error': 'Profile not found'}), 404)
        except Exception:
            app.logger.exception('Loading profile failed')
            return jsonify({'error': 'Unable to load profile'}), 500

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({'error': 'Request body must be JSON'}), 400
    allowed = {'name', 'email', 'location', 'status', 'tagline', 'avatarUrl', 'settings', 'interests'}
    if set(data) - allowed:
        return jsonify({'error': 'Unknown profile fields'}), 400
    text_limits = {'name': 100, 'email': 254, 'location': 120, 'status': 120, 'tagline': 240, 'avatarUrl': 500}
    for key, limit in text_limits.items():
        if key in data and (not isinstance(data[key], str) or len(data[key].strip()) > limit):
            return jsonify({'error': f'{key} must be text up to {limit} characters'}), 400
    if 'name' in data and not data['name'].strip():
        return jsonify({'error': 'Name is required'}), 400
    if 'email' in data:
        import re
        data['email'] = data['email'].strip().lower()
        if not re.match(r'^[^\s@]+@[^\s@]+\.[^\s@]+$', data['email']):
            return jsonify({'error': 'Invalid email address'}), 400
    if 'settings' in data:
        settings = data['settings']
        if not isinstance(settings, dict) or set(settings) != {'emailDigest', 'reductionReminders', 'darkMode', 'units'}:
            return jsonify({'error': 'Invalid profile settings'}), 400
        if any(not isinstance(settings[key], bool) for key in ('emailDigest', 'reductionReminders', 'darkMode')) or settings['units'] not in ('metric', 'imperial'):
            return jsonify({'error': 'Invalid profile settings'}), 400
    valid_interests = {'climate_action', 'energy', 'waste', 'transport', 'water', 'food'}
    if 'interests' in data and (not isinstance(data['interests'], list) or len(data['interests']) > 6 or any(not isinstance(item, str) or item not in valid_interests for item in data['interests']) or len(set(data['interests'])) != len(data['interests'])):
        return jsonify({'error': 'Invalid sustainability interests'}), 400
    for key in text_limits:
        if key in data:
            data[key] = data[key].strip()
    try:
        profile = db_service.update_profile(request.user_id, data)
        return jsonify({'profile': profile})
    except IntegrityError:
        return jsonify({'error': 'Email already registered'}), 409
    except LookupError:
        return jsonify({'error': 'Profile not found'}), 404
    except Exception:
        app.logger.exception('Saving profile failed')
        return jsonify({'error': 'Unable to save profile'}), 500


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
# ── Rule-Based Sustainability Assistant ─────────────────────────

@app.route('/api/assistant', methods=['POST'])
def assistant():
    limited = enforce_rate_limit('assistant', 30, 60)
    if limited:
        return limited
    data = request.get_json(silent=True)
    if not isinstance(data, dict) or not isinstance(data.get('message'), str):
        return jsonify({'error': 'Message is required'}), 400

    message = data['message'].strip()
    if not message:
        return jsonify({'error': 'Message cannot be empty'}), 400
    if len(message) > 2000:
        return jsonify({'error': 'Message is too long'}), 400
    normalized = re.sub(r"[^a-z0-9 ]+", " ", message.lower())
    normalized = re.sub(r"\s+", " ", normalized).strip()
    if len(normalized) < 2:
        return jsonify({'error': 'Please enter a little more detail.'}), 400

    topics = {
        'food': (r'\bfood\b', r'\bdiet\b', r'\bmeal\w*\b', r'\bmeat\b', r'\bleftover\w*\b', r'\bcompost\w*\b'),
        'energy': (r'\belectric\w*\b', r'\benergy\b', r'\bpower\b', r'\bappliance\w*\b', r'\bheating\b', r'\bcooling\b', r'\blight\w*\b'),
        'transport': (r'\btransport\w*\b', r'\btravel\b', r'\bcommut\w*\b', r'\bflight\w*\b', r'\bcar\b', r'\bbus\b', r'\btrain\b', r'\bbik\w*\b', r'\bdriv\w*\b'),
        'waste': (r'\bwaste\b', r'\brecycl\w*\b', r'\blandfill\b', r'\bplastic\w*\b', r'\btrash\b', r'\bpackaging\b', r'\breus\w*\b'),
        'water': (r'\bwater\b', r'\bshower\w*\b', r'\bleak\w*\b', r'\bfaucet\w*\b', r'\btap\b'),
        'footprint': (r'\bfootprint\b', r'\bcarbon\b', r'\bemission\w*\b', r'\bco2\b', r'\bcalculate\w*\b', r'\bscore\b'),
        'climate': (r'\bclimate\b', r'\bglobal warming\b', r'\bgreenhouse gas\w*\b', r'\bsustainab\w*\b'),
    }
    scores = {topic: sum(len(re.findall(pattern, normalized)) for pattern in patterns) for topic, patterns in topics.items()}
    specific_topics = ('food', 'energy', 'transport', 'waste', 'water')
    specific_topic = max(specific_topics, key=lambda item: scores[item])
    general_topics = ('footprint', 'climate')
    general_topic = max(general_topics, key=lambda item: scores[item])
    if scores[specific_topic] > 0:
        topic = specific_topic
    elif scores[general_topic] > 0:
        topic = general_topic
    else:
        topic = 'unknown'
    if normalized in {'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening'}:
        topic = 'greeting'

    replies = {
        'greeting': "Hi, I’m AURA. I can share practical tips about food, home energy, transport, waste, water use, and your EcoTrack estimates. What would you like help with?",
        'food': "Try planning meals around what you already have, storing food so it lasts, and freezing extra portions. If you eat animal products, replacing some meals with plant-based options can also reduce food-related emissions. Start with one change that fits your routine.",
        'energy': "Start by checking the largest uses in your home, such as heating, cooling, water heating, and older appliances. LEDs and switching off equipment you do not need can help; the best actions depend on your home and local electricity supply.",
        'transport': "For trips where it is practical, combine errands, use public transport, carpool, walk, or cycle. For air travel, consider whether a trip can be avoided or replaced; EcoTrack’s flight categories are approximate estimates.",
        'waste': "Prioritize reducing and reusing before recycling. Avoid disposable items where practical, sort materials according to your local recycling rules, and use composting if a suitable local service is available.",
        'water': "Look for leaks, use efficient fixtures where available, and reduce hot-water use when practical. Water and energy systems differ by location, so follow your local utility’s guidance for the most relevant steps.",
        'footprint': "EcoTrack calculates an approximate annual estimate from the activity details you enter. Its factors combine sources and assumptions, so the result is best used to compare your own estimates over time, not as an audited emissions report.",
        'climate': "Climate impacts are influenced by many connected systems. For personal actions, focus on changes you can sustain in transport, home energy, food, and waste. EcoTrack’s tips and calculations are simplified guidance, not a complete climate assessment.",
        'unknown': "I’m AURA, a rule-based sustainability assistant. I can help with food, home energy, transport, waste, water use, and EcoTrack’s footprint estimates. Try asking about one of those topics.",
    }
    reply = replies[topic]

    # Add only the signed-in user's own saved numeric context; never trust a client-selected user ID.
    user_id = session.get('user_id')
    context_used = False
    interest_names = {
        'food': 'food', 'energy': 'energy', 'transport': 'transport',
        'waste': 'waste', 'water': 'water', 'climate_action': 'climate action',
    }
    category_fields = {'food': 'food', 'energy': 'electricity', 'transport': 'transportation', 'waste': 'waste'}
    if user_id:
        try:
            profile = db_service.get_profile(user_id)
            selected_interests = (profile or {}).get('interests', [])
            matching_interest = interest_names.get(topic)
            if matching_interest and any(interest_names.get(item) == matching_interest for item in selected_interests):
                reply += f" Since {matching_interest} is one of your selected interests, you can focus on one small change in that area this week."
                context_used = True

            field = category_fields.get(topic)
            if field:
                footprint = db_service.get_latest_footprint(user_id)
                if footprint:
                    reply += f" Your latest saved estimate attributes {footprint[field]:.2f} tonnes CO₂e/year to this category. Treat that as an approximate comparison, not a measured value."
                    context_used = True
        except Exception:
            app.logger.exception('Loading assistant context failed')

    return jsonify({'reply': reply, 'mode': 'rule-based', 'context_used': context_used})


if __name__ == '__main__':
    load_model()
    host = os.environ.get('HOST', '0.0.0.0')
    port = int(os.environ.get('PORT', 5001))
    print(f'Model + database loaded. Starting Flask server on {host}:{port}...')
    app.run(host=host, port=port, debug=False)
