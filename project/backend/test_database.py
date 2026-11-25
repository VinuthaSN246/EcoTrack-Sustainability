import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import Base, engine, SessionLocal, User
from services import db_service


def test_users_are_normalized_and_passwords_hashed():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    user = db_service.create_user('Test User', ' Mixed@Example.com ', 'secure-password-123')
    assert user['email'] == 'mixed@example.com'
    session = SessionLocal()
    try:
        stored = session.query(User).filter_by(id=user['id']).one()
        assert stored.password_hash != 'secure-password-123'
    finally:
        session.close()
    assert db_service.authenticate_user('MIXED@example.com', 'secure-password-123') is not None
    assert db_service.authenticate_user('mixed@example.com', 'incorrect-password') is None
    Base.metadata.drop_all(bind=engine)


def test_duplicate_email_rejected():
    Base.metadata.create_all(bind=engine)
    db_service.create_user('Test User', 'duplicate@example.com', 'secure-password-123')
    try:
        db_service.create_user('Other User', 'DUPLICATE@example.com', 'another-password-123')
    except ValueError:
        pass
    else:
        raise AssertionError('Duplicate email was not rejected')
    Base.metadata.drop_all(bind=engine)


def test_sqlite_foreign_keys_enforced():
    Base.metadata.create_all(bind=engine)
    try:
        with engine.begin() as connection:
            connection.exec_driver_sql(
                'INSERT INTO footprint_records (user_id, transportation, electricity, food, waste, travel, total_co2, eco_score) VALUES (999999, 0, 0, 0, 0, 0, 0, 0)'
            )
    except Exception:
        Base.metadata.drop_all(bind=engine)
        return
    Base.metadata.drop_all(bind=engine)
    raise AssertionError('SQLite foreign key was not enforced')


def run_tests():
    test_users_are_normalized_and_passwords_hashed()
    test_duplicate_email_rejected()
    test_sqlite_foreign_keys_enforced()


if __name__ == '__main__':
    run_tests()
