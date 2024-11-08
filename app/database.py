from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from typing import Generator

# Define the database URL (this is for SQLite, adjust for your DB if needed)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"  # Adjust to your database URL

# Create the SQLAlchemy engine that will manage database connections
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})  # For SQLite

# Create the sessionmaker that will be used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# This is the base class for all your SQLAlchemy models (e.g., Card, User, etc.)
Base = declarative_base()

# Dependency to get the database session
def get_db() -> Generator:
    """
    This dependency provides a new database session for each request.
    It will ensure that the session is properly closed after the request.
    """
    db = SessionLocal()  # Create a new session
    try:
        yield db  # Provide the session to the route handler
    finally:
        db.close()  # Close the session when done