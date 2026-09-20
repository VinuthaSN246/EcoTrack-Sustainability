from datetime import datetime, timedelta, timezone
from database import SessionLocal, User, FootprintRecord

def seed():
    session = SessionLocal()
    
    # Check if a user exists
    user = session.query(User).first()
    if not user:
        # Create a test user
        import werkzeug.security
        pwd_hash = werkzeug.security.generate_password_hash("password123")
        user = User(name="Test User", email="test@example.com", password_hash=pwd_hash)
        session.add(user)
        session.commit()
    
    # Delete existing footprints for this user to have a clean slate
    session.query(FootprintRecord).filter(FootprintRecord.user_id == user.id).delete()
    
    # Insert multiple historical records showing a decreasing trend
    now = datetime.now(timezone.utc)
    
    records = [
        # Record 1 (3 months ago): High footprint
        FootprintRecord(
            user_id=user.id,
            transportation=3.5, electricity=2.0, food=1.8, waste=0.8, travel=1.2,
            total_co2=9.3, eco_score=45,
            created_at=now - timedelta(days=90)
        ),
        # Record 2 (2 months ago): Slight improvement
        FootprintRecord(
            user_id=user.id,
            transportation=3.0, electricity=1.8, food=1.8, waste=0.7, travel=1.0,
            total_co2=8.3, eco_score=55,
            created_at=now - timedelta(days=60)
        ),
        # Record 3 (1 month ago): Good improvement
        FootprintRecord(
            user_id=user.id,
            transportation=2.5, electricity=1.5, food=1.5, waste=0.5, travel=0.5,
            total_co2=6.5, eco_score=75,
            created_at=now - timedelta(days=30)
        ),
        # Record 4 (Today): Best footprint!
        FootprintRecord(
            user_id=user.id,
            transportation=2.0, electricity=1.2, food=1.2, waste=0.4, travel=0.5,
            total_co2=5.3, eco_score=85,
            created_at=now
        ),
    ]
    
    session.add_all(records)
    session.commit()
    print(f"Successfully seeded 4 historical records for user '{user.email}'.")

if __name__ == "__main__":
    seed()
