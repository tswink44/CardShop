import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from databases import Database
from dotenv import load_dotenv


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")


if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    connect_args = {}


engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


Base = declarative_base()


async_database = Database(DATABASE_URL)


def initialize_database():
    """
    Initializes the database by creating all the tables defined in the models.

    :return: None
    """

    Base.metadata.create_all(bind=engine)


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