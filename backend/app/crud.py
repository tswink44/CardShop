from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import models, schemas
from passlib.context import CryptContext

# Constants
HASH_SCHEME = "bcrypt"

pwd_context = CryptContext(schemes=[HASH_SCHEME], deprecated="auto")


def get_password_hash(password: str) -> str:
    """Hashing password."""
    return pwd_context.hash(password)


def get_db_entity_by_id(db: Session, model, entity_id: int):
    """Retrieve an entity by its ID."""
    return db.query(model).filter(model.id == entity_id).first()


def get_db_entities(db: Session, model, skip: int = 0, limit: int = 10):
    """Retrieve entities with pagination."""
    return db.query(model).offset(skip).limit(limit).all()


def create_entity(db: Session, entity) -> None:
    """Add and commit entity to the database."""
    db.add(entity)
    db.commit()
    db.refresh(entity)


# Refactored Card Operations
def create_card(db: Session, card: schemas.CardCreate) -> models.Card:
    db_card = models.Card(**card.dict())
    create_entity(db, db_card)
    return db_card


def get_card(db: Session, card_id: int) -> Optional[models.Card]:
    return get_db_entity_by_id(db, models.Card, card_id)


def get_cards(db: Session, skip: int = 0, limit: int = 10) -> List[models.Card]:
    return get_db_entities(db, models.Card, skip, limit)


def update_card(db: Session, card_id: int, card: schemas.CardCreate) -> Optional[models.Card]:
    db_card = get_card(db, card_id)
    if db_card:
        for key, value in card.dict().items():
            setattr(db_card, key, value)
        create_entity(db, db_card)
    return db_card


def delete_card(db: Session, card_id: int) -> bool:
    return delete_entity(db, models.Card, card_id)


# Refactored User Operations
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, username=user.username, hashed_password=hashed_password)
    create_entity(db, db_user)
    return db_user


def get_user(db: Session, email: str) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[models.User]:
    return get_db_entities(db, models.User, skip, limit)


def update_user(db: Session, user_id: int, user: schemas.UserCreate) -> Optional[models.User]:
    db_user = get_db_entity_by_id(db, models.User, user_id)
    if db_user:
        for key, value in user.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        create_entity(db, db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    return delete_entity(db, models.User, user_id)


# General deletion function to reduce code duplication
def delete_entity(db: Session, model, entity_id: int) -> bool:
    entity = get_db_entity_by_id(db, model, entity_id)
    if entity:
        db.delete(entity)
        db.commit()
        return True
    return False


# Refactored Order Operations
def create_order(db: Session, order: schemas.OrderCreate, user_id: int) -> models.Order:
    db_order = models.Order(user_id=user_id, total_price=order.total_price, created_at=datetime.utcnow())
    create_entity(db, db_order)
    return db_order


def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return get_db_entity_by_id(db, models.Order, order_id)


def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 10) -> List[models.Order]:
    return db.query(models.Order).filter(models.Order.user_id == user_id).offset(skip).limit(limit).all()


# Refactored Review Operations
def create_review(db: Session, review: schemas.ReviewCreate, user_id: int) -> models.Review:
    db_review = models.Review(user_id=user_id, card_id=review.card_id, rating=review.rating,
                              comment=review.comment, created_at=datetime.utcnow())
    create_entity(db, db_review)
    return db_review


def get_reviews_by_card(db: Session, card_id: int, skip: int = 0, limit: int = 10) -> List[models.Review]:
    return db.query(models.Review).filter(models.Review.card_id == card_id).offset(skip).limit(limit).all()


def create_user_review(db: Session, review: schemas.UserReviewCreate, reviewer_id: int) -> models.UserReview:
    db_user_review = models.UserReview(
        reviewer_id=reviewer_id,
        reviewed_user_id=review.reviewed_user_id,
        rating=review.rating,
        comment=review.comment,
        created_at=datetime.utcnow()
    )
    create_entity(db, db_user_review)
    return db_user_review


def get_reviews_by_user(db: Session, reviewed_user_id: int, skip: int = 0, limit: int = 10) -> List[models.UserReview]:
    return db.query(models.UserReview).filter(models.UserReview.reviewed_user_id == reviewed_user_id).offset(
        skip).limit(limit).all()
