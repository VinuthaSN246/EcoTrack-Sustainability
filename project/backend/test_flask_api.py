"""
Flask API Test Suite - EcoTrack
Tests API endpoints using Flask's test_client:
- POST /api/auth/register & /api/auth/login
- POST /api/footprints
- GET /api/footprints
- GET /api/footprints/latest
- Input validation & error responses (400, 401, 409)
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app
from database import init_db

init_db()
client = app.test_client()

def test_api_workflow():
    print("=" * 60)
    print("ECOTRACK FLASK API ENDPOINTS TEST")
    print("=" * 60)

    # 1. Register User
    print("\n[1] Testing POST /api/auth/register...")
    reg_res = client.post('/api/auth/register', json={
        "name": "API Test User",
        "email": "apitest@ecotrack.com",
        "password": "securepassword123"
    })
    if reg_res.status_code == 409:
        print("    [INFO] User already registered, logging in...")
        login_res = client.post('/api/auth/login', json={
            "email": "apitest@ecotrack.com",
            "password": "securepassword123"
        })
        assert login_res.status_code == 200
        user_id = login_res.get_json()['user']['id']
    else:
        assert reg_res.status_code == 201, f"Expected 201, got {reg_res.status_code}"
        user_id = reg_res.get_json()['user']['id']
        print(f"    [OK] User registered successfully (user_id={user_id})")

    # 2. Test Invalid Auth
    print("\n[2] Testing Auth Validation...")
    bad_login = client.post('/api/auth/login', json={
        "email": "apitest@ecotrack.com",
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 401, "Expected 401 for wrong password"
    print("    [OK] Received 401 for invalid credentials")

    # 3. POST /api/footprints
    print("\n[3] Testing POST /api/footprints...")
    fp_payload = {
        "user_id": user_id,
        "transportation": 2.5,
        "electricity": 1.4,
        "food": 1.2,
        "waste": 0.5,
        "travel": 0.8,
        "total_co2": 6.4,
        "eco_score": 76
    }
    save_res = client.post('/api/footprints', json=fp_payload)
    assert save_res.status_code == 201, f"Expected 201, got {save_res.status_code}: {save_res.get_json()}"
    saved_fp = save_res.get_json()['footprint']
    print(f"    [OK] Saved footprint ID: {saved_fp['id']}, Total CO2: {saved_fp['total_co2']} t")

    # 4. POST /api/footprints validation check
    print("\n[4] Testing POST /api/footprints validation...")
    bad_fp = client.post('/api/footprints', json={"user_id": user_id})
    assert bad_fp.status_code == 400, "Expected 400 for missing fields"
    print("    [OK] Received 400 for missing payload fields")

    # 5. GET /api/footprints
    print(f"\n[5] Testing GET /api/footprints?user_id={user_id}...")
    get_res = client.get(f'/api/footprints?user_id={user_id}')
    assert get_res.status_code == 200, f"Expected 200, got {get_res.status_code}"
    get_data = get_res.get_json()
    assert get_data['count'] > 0
    print(f"    [OK] Retrieved {get_data['count']} records for user_id={user_id}")

    # 6. GET /api/footprints/latest
    print(f"\n[6] Testing GET /api/footprints/latest?user_id={user_id}...")
    latest_res = client.get(f'/api/footprints/latest?user_id={user_id}')
    assert latest_res.status_code == 200, f"Expected 200, got {latest_res.status_code}"
    latest_fp = latest_res.get_json()['footprint']
    assert latest_fp is not None
    print(f"    [OK] Latest footprint ID: {latest_fp['id']}, Eco Score: {latest_fp['eco_score']}")

    print("\n" + "=" * 60)
    print("ALL FLASK API ENDPOINT TESTS PASSED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == '__main__':
    test_api_workflow()
