"""
Database service — CRUD operations for users and footprint records.

Handles:
  - User registration with hashed passwords (Werkzeug security)
  - User authentication
  - Saving footprint records
  - Retrieving footprint history
  - Storing recommendation templates
"""

import os
import sys
import json
from datetime import datetime, timezone

from werkzeug.security import generate_password_hash, check_password_hash

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, User, UserProfile, FootprintRecord, Recommendation, init_db

# Ensure tables exist on import
init_db()


# ── Users ────────────────────────────────────────────────────────

def create_user(name: str, email: str, password: str) -> dict:
    """Register a new user. Raises ValueError if email already exists."""
    session = SessionLocal()
    try:
        email = email.lower().strip()
        existing = session.query(User).filter(User.email == email).first()
        if existing:
            raise ValueError("Email already registered")

        if len(password) < 12:
            raise ValueError("Password must be at least 12 characters")
        if not name.strip():
            raise ValueError("Name is required")

        user = User(
            name=name.strip(),
            email=email.lower().strip(),
            password_hash=generate_password_hash(password),
        )
        session.add(user)
        session.commit()
        return {"id": user.id, "name": user.name, "email": user.email}
    finally:
        session.close()


def authenticate_user(email: str, password: str) -> dict | None:
    """Verify credentials and return user dict, or None if invalid."""
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.email == email.lower().strip()).first()
        if not user or not check_password_hash(user.password_hash, password):
            return None
        return {"id": user.id, "name": user.name, "email": user.email}
    finally:
        session.close()

def get_user(user_id: int) -> dict | None:
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        return {"id": user.id, "name": user.name, "email": user.email} if user else None
    finally:
        session.close()


def get_profile(user_id: int) -> dict | None:
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == user_id).first()
        if not user:
            return None
        profile = session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        defaults = {
            "location": "", "status": "",
            "tagline": "Learning, building and growing sustainably 🌱", "avatarUrl": "",
            "settings": {"emailDigest": True, "reductionReminders": True, "darkMode": False, "units": "metric"},
            "interests": [],
        }
        if not profile:
            return {"user": {"id": user.id, "name": user.name, "email": user.email}, **defaults}
        return {
            "user": {"id": user.id, "name": user.name, "email": user.email},
            "location": profile.location, "status": profile.status,
            "tagline": profile.tagline, "avatarUrl": profile.avatar_url,
            "settings": json.loads(profile.settings_json),
            "interests": json.loads(profile.interests_json),
        }
    finally:
        session.close()


def update_profile(user_id: int, payload: dict) -> dict:
    session = SessionLocal()
    try:
        user = session.query(User).filter(User.id == user_id).with_for_update().first()
        if not user:
            raise LookupError("User not found")
        if "name" in payload:
            user.name = payload["name"]
        if "email" in payload:
            user.email = payload["email"]
        profile = session.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if profile is None:
            profile = UserProfile(user_id=user_id)
            session.add(profile)
        for key, column in (("location", "location"), ("status", "status"), ("tagline", "tagline")):
            if key in payload:
                setattr(profile, column, payload[key])
        if "avatarUrl" in payload:
            profile.avatar_url = payload["avatarUrl"]
        if "settings" in payload:
            profile.settings_json = json.dumps(payload["settings"], separators=(",", ":"))
        if "interests" in payload:
            profile.interests_json = json.dumps(payload["interests"], separators=(",", ":"))
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
    return get_profile(user_id)


# ── Footprint Records ────────────────────────────────────────────

def save_footprint(
    user_id: int,
    transportation: float,
    electricity: float,
    food: float,
    waste: float,
    travel: float,
    total_co2: float,
    eco_score: int,
) -> dict:
    """Save a footprint calculation for a user."""
    session = SessionLocal()
    try:
        record = FootprintRecord(
            user_id=user_id,
            transportation=round(float(transportation), 2),
            electricity=round(float(electricity), 2),
            food=round(float(food), 2),
            waste=round(float(waste), 2),
            travel=round(float(travel), 2),
            total_co2=round(float(total_co2), 2),
            eco_score=int(eco_score),
        )
        session.add(record)
        session.commit()
        return _footprint_to_dict(record)
    finally:
        session.close()


def get_footprints(user_id: int) -> list[dict]:
    """Get all footprint records for a user, newest first."""
    session = SessionLocal()
    try:
        records = (
            session.query(FootprintRecord)
            .filter(FootprintRecord.user_id == user_id)
            .order_by(FootprintRecord.created_at.desc())
            .all()
        )
        return [_footprint_to_dict(r) for r in records]
    finally:
        session.close()


def get_latest_footprint(user_id: int) -> dict | None:
    """Get the most recent footprint record for a user."""
    session = SessionLocal()
    try:
        record = (
            session.query(FootprintRecord)
            .filter(FootprintRecord.user_id == user_id)
            .order_by(FootprintRecord.created_at.desc())
            .first()
        )
        return _footprint_to_dict(record) if record else None
    finally:
        session.close()


# ── Recommendations ──────────────────────────────────────────────

def save_recommendation(category: str, title: str, description: str, priority: str) -> dict:
    """Store a recommendation template."""
    session = SessionLocal()
    try:
        rec = Recommendation(
            category=category,
            title=title,
            description=description,
            priority=priority,
        )
        session.add(rec)
        session.commit()
        return {
            "id": rec.id,
            "category": rec.category,
            "title": rec.title,
            "description": rec.description,
            "priority": rec.priority,
        }
    finally:
        session.close()


def get_recommendations() -> list[dict]:
    """Get all stored recommendation templates."""
    session = SessionLocal()
    try:
        recs = session.query(Recommendation).all()
        return [
            {
                "id": r.id,
                "category": r.category,
                "title": r.title,
                "description": r.description,
                "priority": r.priority,
            }
            for r in recs
        ]
    finally:
        session.close()


# ── Helpers ──────────────────────────────────────────────────────

def _footprint_to_dict(record: FootprintRecord) -> dict:
    return {
        "id": record.id,
        "user_id": record.user_id,
        "transportation": record.transportation,
        "electricity": record.electricity,
        "food": record.food,
        "waste": record.waste,
        "travel": record.travel,
        "total_co2": record.total_co2,
        "eco_score": record.eco_score,
        "created_at": record.created_at.isoformat() if record.created_at else None,
    }
