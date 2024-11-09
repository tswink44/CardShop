import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from dotenv import load_dotenv

# Load environment variables from a .env file if it exists
load_dotenv()

# Fetch the database URL from environment variables (default to SQLite if not provided)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# If using SQLite, we need specific connection arguments
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}  # SQLite-specific setting
else:
    connect_args = {}

# Initialize SQLAlchemy synchronous engine & session
engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Initialize the base class for models
Base = declarative_base()

# Initialize the asynchronous database connection using 'databases'
async_database = Database(DATABASE_URL)


def initialize_database():
    """
    Initializes the database by creating all the tables defined in the models.

    :return: None
    """
    # Import your models here before creating the tables
    import backend.app.models  # Ensure all models are imported
    Base.metadata.create_all(bind=engine)

# Dependency injection for FastAPI routes to get the database session
def get_db():
    """
    Database dependency generator for FastAPI.

    This function provides a session to the database, ensuring that the session
    is properly closed after use. It uses Python's context management to yield
    a database session and guarantees that the connection is closed properly
    even if an error occurs.

    :return: A database session from `SessionLocal()`
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Optional Async startup and shutdown events for FastAPI (only if you're using async)
async def connect_async_database():
    """
    Asynchronously connects to a database using an async database connection.

    :return: None
    """
    await async_database.connect()


async def disconnect_async_database():
    """
    Disconnects from the asynchronous database.

    :return: None
    """
    await async_database.disconnect()