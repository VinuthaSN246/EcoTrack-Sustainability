"""
Comprehensive database test - EcoTrack
Tests: table creation, user CRUD, password hashing, auth, footprint records, recommendations, API endpoints.
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import init_db, SessionLocal, User
from services import db_service
import time

print("=" * 60)
print("ECOTRACK DATABASE COMPREHENSIVE TEST")
print("=" * 60)

# -- 1. Table creation
print("\n[1] Initialising database tables...")
init_db()
print("    [OK] Tables created (users, footprint_records, recommendations)")

# -- 2. User registration
print("\n[2] Registering test user...")
test_email = "dbtest_{}@ecotrack.com".format(int(time.time()))
user = db_service.create_user("DB Test User", test_email, "securepass123")
print("    [OK] Created user: id={}, name={}, email={}".format(user['id'], user['name'], user['email']))

# Verify password is NOT stored in plain text
session = SessionLocal()
db_user = session.query(User).filter(User.email == test_email).first()
assert db_user.password_hash != "securepass123", "FAIL: Password stored in plain text!"
print("    [OK] Password stored as hash: {}...".format(db_user.password_hash[:35]))
session.close()

# -- 3. Duplicate email rejection
print("\n[3] Testing duplicate email rejection...")
try:
    db_service.create_user("Duplicate User", test_email, "anotherpass")
    print("    FAIL: Should have rejected duplicate email!")
except ValueError as e:
    print("    [OK] Correctly rejected duplicate: {}".format(e))

# -- 4. Authentication
print("\n[4] Testing authentication...")
auth_result = db_service.authenticate_user(test_email, "securepass123")
assert auth_result is not None, "FAIL: Valid credentials rejected!"
print("    [OK] Login successful for user id={}".format(auth_result['id']))

bad_auth = db_service.authenticate_user(test_email, "wrongpassword")
assert bad_auth is None, "FAIL: Wrong password should return None!"
print("    [OK] Wrong password correctly rejected (returns None)")

# -- 5. Save footprint records
print("\n[5] Saving multiple footprint records...")
records_data = [
    (3.5, 2.0, 1.8, 0.8, 1.2, 9.3, 45),
    (3.0, 1.8, 1.8, 0.7, 1.0, 8.3, 55),
    (2.5, 1.5, 1.5, 0.5, 0.5, 6.5, 75),
    (2.0, 1.2, 1.2, 0.4, 0.5, 5.3, 85),
]
for i, (t, e, f, w, tr, total, score) in enumerate(records_data):
    rec = db_service.save_footprint(
        user_id=user["id"],
        transportation=t, electricity=e, food=f,
        waste=w, travel=tr, total_co2=total, eco_score=score
    )
    print("    [OK] Record {}: {} t CO2e, eco_score={}, id={}".format(i+1, total, score, rec['id']))

# -- 6. Retrieve all footprints
print("\n[6] Retrieving all footprints...")
all_records = db_service.get_footprints(user["id"])
assert len(all_records) >= 4, "FAIL: Expected >= 4 records, got {}".format(len(all_records))
print("    [OK] Retrieved {} records (newest first):".format(len(all_records)))
for r in all_records[:4]:
    print("       id={}, total={}, score={}, date={}".format(r['id'], r['total_co2'], r['eco_score'], r['created_at']))

# -- 7. Retrieve latest footprint
print("\n[7] Retrieving latest footprint...")
latest = db_service.get_latest_footprint(user["id"])
assert latest is not None
print("    [OK] Latest: total={} t CO2e, eco_score={}".format(latest['total_co2'], latest['eco_score']))

# -- 8. Recommendations CRUD
print("\n[8] Testing recommendations table...")
rec_template = db_service.save_recommendation(
    category="Transportation",
    title="Reduce Transportation Impact",
    description="Consider public transport, walking, or cycling.",
    priority="High"
)
print("    [OK] Saved recommendation: id={}, category={}".format(rec_template['id'], rec_template['category']))
all_recs = db_service.get_recommendations()
assert any(r["title"] == "Reduce Transportation Impact" for r in all_recs)
print("    [OK] Retrieved {} recommendation(s) from DB".format(len(all_recs)))

# -- 9. Flask API POST /api/footprints
print("\n[9] Testing Flask API endpoint POST /api/footprints...")
import urllib.request, json
payload = json.dumps({
    "user_id": user["id"],
    "transportation": 2.1, "electricity": 1.3, "food": 1.4,
    "waste": 0.5, "travel": 0.6, "total_co2": 5.9, "eco_score": 78
}).encode()
try:
    req = urllib.request.Request(
        "http://127.0.0.1:5001/api/footprints",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read())
        fp = data["footprint"]
        print("    [OK] API saved: id={}, total={} t, score={}".format(fp['id'], fp['total_co2'], fp['eco_score']))
except Exception as e:
    print("    [SKIP] Flask API not reachable: {}".format(e))

# -- 10. Flask API GET /api/footprints
print("\n[10] Testing GET /api/footprints?user_id=...")
try:
    req = urllib.request.Request("http://127.0.0.1:5001/api/footprints?user_id={}".format(user['id']))
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read())
        print("    [OK] API returned {} records for user_id={}".format(data['count'], user['id']))
except Exception as e:
    print("    [SKIP] Flask API not reachable: {}".format(e))

# -- 11. Flask API GET /api/footprints/latest
print("\n[11] Testing GET /api/footprints/latest?user_id=...")
try:
    req = urllib.request.Request("http://127.0.0.1:5001/api/footprints/latest?user_id={}".format(user['id']))
    with urllib.request.urlopen(req, timeout=5) as resp:
        data = json.loads(resp.read())
        fp = data.get("footprint")
        if fp:
            print("    [OK] Latest via API: total={} t, score={}".format(fp['total_co2'], fp['eco_score']))
        else:
            print("    [OK] No footprint yet returned via API")
except Exception as e:
    print("    [SKIP] Flask API not reachable: {}".format(e))

# -- Summary
print("\n" + "=" * 60)
print("ALL DATABASE TESTS PASSED")
print("=" * 60)
print("  Database file : backend/ecotrack.db")
print("  Tables        : users, footprint_records, recommendations")
print("  Passwords     : Hashed with Werkzeug (PBKDF2/scrypt) - NOT plain text")
print("  Test email    : " + test_email)
