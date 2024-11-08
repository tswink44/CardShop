from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from app import models, schemas



# Create a new card
def create_card(db: Session, card: schemas.CardCreate) -> models.Card:
    db_card = models.Card(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

# Get a card by ID
def get_card(db: Session, card_id: int) -> Optional[models.Card]:
    return db.query(models.Card).filter(models.Card.id == card_id).first()

# Get all cards (with optional limit and offset for pagination)
def get_cards(db: Session, skip: int = 0, limit: int = 10) -> List[models.Card]:
    return db.query(models.Card).offset(skip).limit(limit).all()

# Update a card
def update_card(db: Session, card_id: int, card: schemas.CardCreate) -> Optional[models.Card]:
    db_card = get_card(db, card_id)
    if db_card:
        for key, value in card.dict().items():
            setattr(db_card, key, value)
        db.commit()
        db.refresh(db_card)
    return db_card

# Delete a card
def delete_card(db: Session, card_id: int) -> bool:
    db_card = get_card(db, card_id)
    if db_card:
        db.delete(db_card)
        db.commit()
        return True
    return False

# Create a new user
def create_user(db: Session, user: schemas.UserCreate) -> models.User:
    db_user = models.User(username=user.username, email=user.email, hashed_password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Get a user by ID
def get_user(db: Session, user_id: int) -> Optional[models.User]:
    return db.query(models.User).filter(models.User.id == user_id).first()

# Get all users
def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[models.User]:
    return db.query(models.User).offset(skip).limit(limit).all()

# Update a user
def update_user(db: Session, user_id: int, user: schemas.UserCreate) -> Optional[models.User]:
    db_user = get_user(db, user_id)
    if db_user:
        for key, value in user.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user

# Delete a user
def delete_user(db: Session, user_id: int) -> bool:
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# Create a new order
def create_order(db: Session, order: schemas.OrderCreate, user_id: int) -> models.Order:
    db_order = models.Order(user_id=user_id, total_price=order.total_price, created_at=datetime.utcnow())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

# Get an order by ID
def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.id == order_id).first()

# Get all orders for a specific user
def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 10) -> List[models.Order]:
    return db.query(models.Order).filter(models.Order.user_id == user_id).offset(skip).limit(limit).all()

# Create a new review for a card
def create_review(db: Session, review: schemas.ReviewCreate, user_id: int) -> models.Review:
    db_review = models.Review(user_id=user_id, card_id=review.card_id, rating=review.rating,
                              comment=review.comment, created_at=datetime.utcnow())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

# Get reviews for a specific card
def get_reviews_by_card(db: Session, card_id: int, skip: int = 0, limit: int = 10) -> List[models.Review]:
    return db.query(models.Review).filter(models.Review.card_id == card_id).offset(skip).limit(limit).all()

# Create a new review for a user
def create_user_review(db: Session, review: schemas.UserReviewCreate, reviewer_id: int) -> models.UserReview:
    db_user_review = models.UserReview(
        reviewer_id=reviewer_id,
        reviewed_user_id=review.reviewed_user_id,
        rating=review.rating,
        comment=review.comment,
        created_at=datetime.utcnow()
    )
    db.add(db_user_review)
    db.commit()
    db.refresh(db_user_review)
    return db_user_review

# Get reviews for a specific user
def get_reviews_by_user(db: Session, reviewed_user_id: int, skip: int = 0, limit: int = 10) -> List[models.UserReview]:
    return db.query(models.UserReview).filter(models.UserReview.reviewed_user_id == reviewed_user_id).offset(skip).limit(limit).all()

