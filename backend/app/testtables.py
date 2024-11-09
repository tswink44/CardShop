import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.app.database import Base, get_db
from backend.app.main import app

# Update the database to use an in-memory SQLite database
DATABASE_URL = "sqlite:///./test.db"

# Create an engine and session for testing with SQLite
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override get_db to use the test session
def override_get_db():
    """
    Creates a database session for testing purposes and ensures the session is properly closed after use.

    :return: A generator that yields a database session.
    """
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override the application's get_db dependency
app.dependency_overrides[get_db] = override_get_db

# TestClient is used to interact with your FastAPI app as though you were a client
client = TestClient(app)

# Set up and tear down the database between tests
@pytest.fixture(scope="module")
def setup_database():
    """
    Setup and teardown actions for database used in tests.

    :return: None
    """
    # Create the database tables before the test suite runs
    Base.metadata.create_all(bind=engine)
    yield
    # Drop the tables after the test suite completes
    Base.metadata.drop_all(bind=engine)

# ---------------- Tests ---------------- #

def test_create_user(setup_database):
    """
    :param setup_database: Fixture to set up the database before the test case runs
    :return: None
    """
    response = client.post(
        "/users/",
        json={"username": "testuser", "email": "test@test.com", "password": "testpassword"}
    )
    print(response.json())  # Log potential error details
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser"
    assert data["email"] == "test@test.com"


def test_get_users(setup_database):
    """
    :param setup_database: Fixture that sets up the database environment for the test.
    :return: None
    """
    response = client.get("/users/")
    assert response.status_code == 200
    users = response.json()
    assert len(users) > 0  # There should be at least one user (created in the previous test)


def test_get_user(setup_database):
    """
    :param setup_database: Fixture that sets up the database before running the test.
    :return: None
    """
    # Create a new user first (or ensure one exists)
    response = client.post(
        "/users/",
        json={"username": "anotheruser", "email": "another@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    user_id = response.json()["id"]

    # Fetch that user by ID
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 200
    user = response.json()
    assert user["username"] == "anotheruser"
    assert user["email"] == "another@test.com"


def test_update_user(setup_database):
    """
    :param setup_database: Fixture for setting up the test database.
    :return: None
    """
    # Create a new user first
    response = client.post(
        "/users/",
        json={"username": "updateuser", "email": "update@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    user_id = response.json()["id"]

    # Update the user's email
    response = client.put(
        f"/users/{user_id}",
        json={"username": "updateduser", "email": "newemail@test.com", "password": "newpassword"}
    )
    assert response.status_code == 200
    updated_user = response.json()
    assert updated_user["email"] == "newemail@test.com"


def test_delete_user(setup_database):
    """
    :param setup_database: Fixture that sets up the database for testing.
    :return: None
    """
    # Create a new user to delete
    response = client.post(
        "/users/",
        json={"username": "deleteuser", "email": "delete@test.com", "password": "password123"}
    )
    assert response.status_code == 200
    user_id = response.json()["id"]

    # Delete the user
    response = client.delete(f"/users/{user_id}")
    assert response.status_code == 200
    assert response.json()["message"] == "User deleted successfully"

    # Confirm that the user no longer exists
    response = client.get(f"/users/{user_id}")
    assert response.status_code == 404

# Add more tests for other CRUD operations as needed