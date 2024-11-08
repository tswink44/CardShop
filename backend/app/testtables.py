import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.main import app, get_db

DATABASE_URL = "sqlite:///./test.db"  # Use SQLite for testing

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a new database session for testing
Base.metadata.create_all(bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


@pytest.fixture(scope="module")
def setup_database():
    # Set up database, this will be run once for all tests in the module
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_create_user(setup_database):
    response = client.post(
        "/users/",
        json={"username": "testuser", "email": "test@test.com", "password": "testpassword"}
    )
    print(response.json())  # Log the error details returned by the API
    assert response.status_code == 200


def test_get_users(setup_database):
    response = client.get("/users/")
    assert response.status_code == 200
    users = response.json()
    assert len(users) > 0


def test_get_user(setup_database):
    response = client.get("/users/test@test.com")
    assert response.status_code == 200
    user = response.json()
    assert user["username"] == "testuser"

# Add more tests for other CRUD operations as needed
