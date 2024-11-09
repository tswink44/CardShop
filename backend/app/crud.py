from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app import models
from backend.app.models import Card, User, Order, OrderItem, Review, UserReview
from backend.app.schemas import CardCreate, UserCreate, OrderCreate, OrderItemCreate, ReviewCreate, UserReviewCreate
from backend.app.utils import hash_password, verify_password


# --------------------- CRUD Operations for Card --------------------- #

def create_card(db: Session, card: CardCreate, image_url: str):
    db_card = Card(
        name=card.name,
        description=card.description,
        price=card.price,
        quantity=card.quantity,
        image_url=image_url,
    )
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card

def get_card(db: Session, card_id: int):
    return db.query(models.Card).filter(models.Card.id == card_id).first()

def get_cards(db: Session, skip: int = 0, limit: int = 10):
    return db.query(Card).offset(skip).limit(limit).all()


def update_card(db: Session, card_id: int, image_url: str, card_data: CardCreate) -> Optional[Card]:
    db_card = db.query(Card).filter(Card.id == card_id).first()


    if db_card:
        for key, value in card_data.dict(exclude_unset=True).items():
            setattr(db_card, key, value)

        if image_url:
            db_card.image_url = image_url

        db.commit()

        db.refresh(db_card)

    return db_card


def delete_card(db: Session, card_id: int) -> bool:
    card = db.query(Card).filter(Card.id == card_id).first()
    if card:
        db.delete(card)
        db.commit()
        return True
    return False


# --------------------- CRUD Operations for User --------------------- #

def create_user(db: Session, user: UserCreate) -> User:
    hashed_password = hash_password(user.password)  # Hash the password
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password  # Store the hashed password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int) -> Optional[User]:
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[User]:
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, user_data: UserCreate) -> Optional[User]:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        for key, value in user_data.dict(exclude_unset=True).items():
            setattr(db_user, key, value)
        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# --------------------- CRUD Operation for Authentication --------------------- #
def authenticate_user(db: Session, email: str, password: str):
    # Fetch the user from the DB
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False

    # Verify the password with the hash
    if not verify_password(password, user.hashed_password):
        return False

    return user







# --------------------- CRUD Operations for Order --------------------- #

def create_order(db: Session, order: OrderCreate) -> Order:
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id).first()


def get_orders(db: Session, skip: int = 0, limit: int = 10) -> List[Order]:
    return db.query(Order).offset(skip).limit(limit).all()


def update_order(db: Session, order_id: int, order_data: OrderCreate) -> Optional[Order]:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        for key, value in order_data.dict(exclude_unset=True).items():
            setattr(db_order, key, value)
        db.commit()
        db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int) -> bool:
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False


# --------------------- CRUD Operations for OrderItem --------------------- #

def create_order_item(db: Session, order_item: OrderItemCreate) -> OrderItem:
    db_order_item = OrderItem(**order_item.dict())
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item


def get_order_items(db: Session, order_id: int) -> List[OrderItem]:
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


def delete_order_item(db: Session, order_item_id: int) -> bool:
    db_order_item = db.query(OrderItem).filter(OrderItem.id == order_item_id).first()
    if db_order_item:
        db.delete(db_order_item)
        db.commit()
        return True
    return False

# ---------------------   TO DO ---------------------------------------- #
# --------------------- CRUD Operations for Review --------------------- #

# def create_review(db: Session, review: ReviewCreate) -> Review:
#     db_review = Review(**review.dict())
#     db.add(db_review)
#     db.commit()
#     db.refresh(db_review)
#     return db_review
#
#
# def get_review(db: Session, review_id: int) -> Optional[Review]:
#     return db.query(Review).filter(Review.id == review_id).first()
#
#
# def get_reviews(db: Session, card_id: int) -> List[Review]:
#     return db.query(Review).filter(Review.card_id == card_id).all()
#
#
# def delete_review(db: Session, review_id: int) -> bool:
#     db_review = db.query(Review).filter(Review.id == review_id).first()
#     if db_review:
#         db.delete(db_review)
#         db.commit()
#         return True
#     return False
#
#
# # --------------------- CRUD Operations for UserReview --------------------- #
#
# def create_user_review(db: Session, user_review: UserReviewCreate) -> UserReview:
#     db_user_review = UserReview(**user_review.dict())
#     db.add(db_user_review)
#     db.commit()
#     db.refresh(db_user_review)
#     return db_user_review
#
#
# def get_user_review(db: Session, user_review_id: int) -> Optional[UserReview]:
#     return db.query(UserReview).filter(UserReview.id == user_review_id).first()
#
#
# def get_user_reviews(db: Session, reviewed_user_id: int) -> List[UserReview]:
#     return db.query(UserReview).filter(UserReview.reviewed_user_id == reviewed_user_id).all()
#
#
# def delete_user_review(db: Session, user_review_id: int) -> bool:
#     db_user_review = db.query(UserReview).filter(UserReview.id == user_review_id).first()
#     if db_user_review:
#         db.delete(db_user_review)
#         db.commit()
#         return True
#     return False