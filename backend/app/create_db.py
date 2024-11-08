from app.database import Base, engine
from app.models import User, Order, Card, Review  # Import all your models here

# This will create all tables in the database if they don't already exist
Base.metadata.create_all(bind=engine)