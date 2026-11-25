import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import Base, engine
from services import db_service


def register(client, email='test@example.com'):
    return client.post('/api/auth/register', json={
        'name': 'Test User', 'email': email, 'password': 'secure-password-123',
    })


def test_footprint_api_requires_login_and_scopes_data_to_session():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    client = app.test_client()
    response = register(client)
    assert response.status_code == 201
    user_id = response.get_json()['user']['id']

    anonymous = app.test_client()
    assert anonymous.get('/api/footprints').status_code == 401
    assert anonymous.post('/api/footprints', json={}).status_code == 401

    other = db_service.create_user('Other User', 'other@example.com', 'different-password-123')
    other_client = app.test_client()
    login = other_client.post('/api/auth/login', json={
        'email': other['email'], 'password': 'different-password-123',
    })
    assert login.status_code == 200
    assert other_client.get('/api/footprints').get_json()['count'] == 0

    payload = {
        'user_id': other['id'],  # ignored; owner must come from session
        'transportation': 2.5, 'electricity': 1.4, 'food': 1.2,
        'waste': 0.5, 'travel': 0.8, 'total_co2': 6.4, 'eco_score': 76,
    }
    saved = client.post('/api/footprints', json=payload)
    assert saved.status_code == 201
    assert saved.get_json()['footprint']['user_id'] == user_id
    assert client.get('/api/footprints').get_json()['count'] == 1
    assert other_client.get('/api/footprints').get_json()['count'] == 0
    assert client.get('/api/footprints/latest').get_json()['footprint']['user_id'] == user_id
    Base.metadata.drop_all(bind=engine)


def test_auth_validation_and_logout():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    client = app.test_client()
    assert client.post('/api/auth/register', json={
        'name': 'Short Password', 'email': 'short@example.com', 'password': 'tiny',
    }).status_code == 400
    assert register(client).status_code == 201
    assert client.post('/api/auth/logout').status_code == 200
    assert client.get('/api/footprints').status_code == 401
    Base.metadata.drop_all(bind=engine)


def test_footprint_input_validation():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    client = app.test_client()
    assert register(client).status_code == 201
    payload = {
        'transportation': 1, 'electricity': 1, 'food': 1, 'waste': 1,
        'travel': 1, 'total_co2': 5, 'eco_score': 101,
    }
    assert client.post('/api/footprints', json=payload).status_code == 400
    Base.metadata.drop_all(bind=engine)
    payload['eco_score'] = 50
    payload['total_co2'] = float('inf')
    assert client.post('/api/footprints', json=payload).status_code == 400


def test_predict_rejects_out_of_range_input():
    client = app.test_client()
    payload = {
        'transport_type': 'Car', 'daily_distance_km': -1,
        'travel_days_per_week': 5, 'electricity_kwh_month': 100,
        'diet_type': 'Mixed', 'food_waste_frequency': 'Sometimes',
        'waste_kg_week': 3, 'recycling_frequency': 'Often', 'flights_per_year': '0',
    }
    assert client.post('/api/predict', json=payload).status_code == 400


def run_tests():
    from app import _rate_events
    for test in (test_footprint_api_requires_login_and_scopes_data_to_session,
                 test_auth_validation_and_logout, test_footprint_input_validation,
                 test_predict_rejects_out_of_range_input):
        _rate_events.clear()
        app.config.update(TESTING=True, SECRET_KEY='test-secret')
        test()


if __name__ == '__main__':
    run_tests()
