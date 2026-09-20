"""
EcoTrack database models — SQLAlchemy ORM definitions.

Tables:
  users              — registered users (name, email, password_hash)
  footprint_records  — saved carbon footprint calculations per user
  recommendations    — recommendation templates (category, title, description, priority)
"""

import os
from datetime import datetime, timezone

from sqlalchemy import (
    create_engine, Column, Integer, String, Float, DateTime,
    ForeignKey, Text,
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ecotrack.db')
DB_URL = os.environ.get("DATABASE_URL") or f"sqlite:///{DB_PATH}"

engine = create_engine(DB_URL, echo=False, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine, autoflush=True)
Base = declarative_base()


def get_db():
    """Dependency-style session generator for Flask routes."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()


def init_db():
    """Create all tables if they don't exist."""
    Base.metadata.create_all(bind=engine)


# ── Models ───────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    footprints = relationship("FootprintRecord", back_populates="user", cascade="all, delete-orphan")


class FootprintRecord(Base):
    __tablename__ = "footprint_records"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    transportation = Column(Float, nullable=False, default=0)
    electricity = Column(Float, nullable=False, default=0)
    food = Column(Float, nullable=False, default=0)
    waste = Column(Float, nullable=False, default=0)
    travel = Column(Float, nullable=False, default=0)
    total_co2 = Column(Float, nullable=False, default=0)
    eco_score = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="footprints")


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    category = Column(String(50), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    priority = Column(String(20), nullable=False, default="Medium")
