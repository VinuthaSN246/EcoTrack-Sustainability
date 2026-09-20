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
from datetime import datetime, timezone

from werkzeug.security import generate_password_hash, check_password_hash

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, User, FootprintRecord, Recommendation, init_db

# Ensure tables exist on import
init_db()


# ── Users ────────────────────────────────────────────────────────

def create_user(name: str, email: str, password: str) -> dict:
    """Register a new user. Raises ValueError if email already exists."""
    session = SessionLocal()
    try:
        existing = session.query(User).filter(User.email == email.lower()).first()
        if existing:
            raise ValueError("Email already registered")

        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters")
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
