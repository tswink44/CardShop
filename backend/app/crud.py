from sqlalchemy.orm import Session
from typing import List, Optional

from backend.app import models
from backend.app.models import Card, User, Order, OrderItem, Review, UserReview
from backend.app.schemas import CardCreate, UserCreate, OrderCreate, OrderItemCreate, ReviewCreate, UserReviewCreate
from backend.app.utils import hash_password, verify_password


# --------------------- CRUD Operations for Card --------------------- #

def create_card(db: Session, card: CardCreate, image_url: str):
    """
    :param db: Database session used for performing operations.
    :param card: An object containing information to create a new card.
    :param image_url: URL of the image to be associated with the card.
    :return: The newly created card object after being added to the database.
    """
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
    """
    :param db: Database session object used to interact with the database.
    :param card_id: Unique identifier for the card to be retrieved.
    :return: Card object if found, else None.
    """
    return db.query(models.Card).filter(models.Card.id == card_id).first()

def get_cards(db: Session, skip: int = 0, limit: int = 10):
    """
    :param db: Database session object used to perform database operations.
    :type db: Session
    :param skip: Number of records to skip before starting to return results.
    :type skip: int
    :param limit: Maximum number of records to return.
    :type limit: int
    :return: List of Card objects from the database based on the specified skip and limit.
    :rtype: list
    """
    return db.query(Card).offset(skip).limit(limit).all()


def update_card(db: Session, card_id: int, image_url: str, card_data: CardCreate) -> Optional[Card]:
    """
    :param db: Database session used to perform the update operation.
    :param card_id: The ID of the card to be updated.
    :param image_url: URL of the new image for the card, if any.
    :param card_data: Data to update in the card.
    :return: The updated card object if the card exists, otherwise None.
    """
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
    """
    :param db: Database session used for querying and performing actions on the database.
    :type db: Session

    :param card_id: Unique identifier of the card to be deleted.
    :type card_id: int

    :return: True if the card was successfully deleted, otherwise False.
    :rtype: bool
    """
    card = db.query(Card).filter(Card.id == card_id).first()
    if card:
        db.delete(card)
        db.commit()
        return True
    return False


# --------------------- CRUD Operations for User --------------------- #

def create_user(db: Session, user: UserCreate, avatar_url: Optional[str] = None) -> User:
    """
    :param db: Database session object.
    :param user: UserCreate object containing user details.
    :param avatar_url: Optional avatar URL for the user.
    :return: Created User object.
    """
    hashed_password = hash_password(user.password)
    db_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        avatar_url=avatar_url
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_user(db: Session, user_id: int) -> Optional[User]:
    """
    :param db: Database session used for the query
    :param user_id: Identifier of the user to retrieve
    :return: User object if found, otherwise None
    """
    return db.query(User).filter(User.id == user_id).first()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """
    :param db: Database session object used to interact with the database.
    :param email: The email address of the user to be retrieved.
    :return: The user object corresponding to the given email or None if no user is found.
    """
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 10) -> List[User]:
    """
    :param db: Database session object used for querying the database.
    :param skip: Number of records to skip from the beginning.
    :param limit: Maximum number of records to return.
    :return: List of User objects retrieved from the database.
    """
    return db.query(User).offset(skip).limit(limit).all()


def update_user(db: Session, user_id: int, user_data: UserCreate, avatar_url: Optional[str] = None) -> Optional[User]:
    """
    :param db: The database session used for querying and updating the user.
    :type db: Session

    :param user_id: The unique identifier of the user to be updated.
    :type user_id: int

    :param user_data: The data used to update the user record.
    :type user_data: UserCreate

    :param avatar_url: Optional new avatar URL for the user.
    :type avatar_url: str

    :return: The updated user object, if the user exists; otherwise, None.
    :rtype: Optional[User]
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        for key, value in user_data.dict(exclude_unset=True).items():
            setattr(db_user, key, value)

        if avatar_url:
            db_user.avatar_url = avatar_url

        db.commit()
        db.refresh(db_user)
    return db_user


def delete_user(db: Session, user_id: int) -> bool:
    """
    :param db: The SQLAlchemy session object used to interact with the database.
    :param user_id: The unique identifier of the user to be deleted.
    :return: A boolean indicating if the deletion was successful.
    """
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False

# --------------------- CRUD Operation for Authentication --------------------- #
def authenticate_user(db: Session, email: str, password: str):
    """
    :param db: The database session to use for querying the user.
    :param email: The email address of the user attempting to authenticate.
    :param password: The plain text password provided for authentication.
    :return: The user instance if authentication is successful, else False.
    """
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
    """
    :param db: SQLAlchemy session object used for database transactions.
    :param order: Pydantic model containing the order details to be created.
    :return: The created Order object after being committed to the database.
    """
    db_order = Order(**order.dict())
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order


def get_order(db: Session, order_id: int) -> Optional[Order]:
    """
    :param db: The database session used to query the orders.
    :type db: Session
    :param order_id: The unique identifier of the order to retrieve.
    :type order_id: int
    :return: The order that matches the provided `order_id` if found, otherwise None.
    :rtype: Optional[Order]
    """
    return db.query(Order).filter(Order.id == order_id).first()


def get_orders(db: Session, skip: int = 0, limit: int = 10) -> List[Order]:
    """
    :param db: Database session object for interacting with the database.
    :param skip: Number of records to skip before starting to return results.
    :param limit: Maximum number of records to return.
    :return: List of Order objects from the database.
    """
    return db.query(Order).offset(skip).limit(limit).all()


def update_order(db: Session, order_id: int, order_data: OrderCreate) -> Optional[Order]:
    """
    :param db: Database session object used to interact with the database.
    :type db: Session
    :param order_id: The unique identifier of the order to be updated.
    :type order_id: int
    :param order_data: An object containing the updated data for the order.
    :type order_data: OrderCreate
    :return: The updated order object if the order exists, otherwise None.
    :rtype: Optional[Order]
    """
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        for key, value in order_data.dict(exclude_unset=True).items():
            setattr(db_order, key, value)
        db.commit()
        db.refresh(db_order)
    return db_order


def delete_order(db: Session, order_id: int) -> bool:
    """
    :param db: Database session to interact with the database.
    :param order_id: Unique identifier of the order to delete.
    :return: True if the order was successfully deleted, False otherwise.
    """
    db_order = db.query(Order).filter(Order.id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
        return True
    return False


# --------------------- CRUD Operations for OrderItem --------------------- #

def create_order_item(db: Session, order_item: OrderItemCreate) -> OrderItem:
    """
    :param db: Database session to be used for adding the order item.
    :param order_item: Data object containing information about the order item to be created.
    :return: The newly created order item.
    """
    db_order_item = OrderItem(**order_item.dict())
    db.add(db_order_item)
    db.commit()
    db.refresh(db_order_item)
    return db_order_item


def get_order_items(db: Session, order_id: int) -> List[OrderItem]:
    """
    :param db: Database session used to perform the query.
    :param order_id: ID of the order whose items are being retrieved.
    :return: List of OrderItem objects belonging to the specified order.
    """
    return db.query(OrderItem).filter(OrderItem.order_id == order_id).all()


def delete_order_item(db: Session, order_item_id: int) -> bool:
    """
    :param db: Database session used to perform the query.
    :param order_item_id: ID of the order item to be deleted.
    :return: True if the order item was found and deleted, False otherwise.
    """
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