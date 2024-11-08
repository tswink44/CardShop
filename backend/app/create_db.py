from backend.app.database import Base, engine

# This will create all tables in the database if they don't already exist
Base.metadata.create_all(bind=engine)