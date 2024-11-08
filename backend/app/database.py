from databases import Database
import os
import psycopg2
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Constants
DATABASE_URL = "sqlite:///./test.db"
CONNECT_ARGS = {"check_same_thread": False}

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, connect_args=CONNECT_ARGS)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
database = Database(DATABASE_URL)


# Initialize the database and create all tables
def initialize_database():
    import app.models  # Ensure all models are imported for creating table metadata
    Base.metadata.create_all(bind=engine)

# ***** Optional Database initialization logic *****
# @app.on_event("startup")
# async def startup():
#     initialize_database()
#     await database.connect()
