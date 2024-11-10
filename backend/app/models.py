from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.database import Base

COMMON_FIELDS = {
    'id': Column(Integer, primary_key=True, index=True),
    'created_at': Column(DateTime, default=datetime.utcnow),
}


class BaseModel(Base):
    """
    BaseModel serves as an abstract base class for other models in the application.

    Attributes:
        __abstract__ (bool): Indicates that this class is abstract and should not be instantiated directly.
        id (Column): Common identifier field, typically a primary key.
        created_at (Column): Stores the creation timestamp of the record.
    """
    __abstract__ = True
    id = COMMON_FIELDS['id']
    created_at = COMMON_FIELDS['created_at']


class Card(Base):
    """
    Represents a card entity in the database.

    Attributes:
        __tablename__ (str): The name of the database table.
        id (Column): The primary key of the card entity.
        name (Column): The name of the card; indexed for optimized queries.
        description (Column): A textual description of the card.
        price (Column): The price of the card.
        quantity (Column): The available quantity of the card in stock.
        image_url (Column): The URL to an image of the card; can be null.
        order_items (relationship): A relationship to the OrderItem entity, representing items in an order.
        reviews (relationship): A relationship to the Review entity, representing reviews for the card.
    """
    __tablename__ = "cards"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    image_url = Column(String, nullable=True)
    # Relationships
    order_items = relationship("OrderItem", back_populates="card")
    reviews = relationship("Review", back_populates="card")


class User(BaseModel):
    """
    A SQLAlchemy model representing a User.

    Attributes:
        username: A unique indexed username for the user.
        email: A unique indexed email for the user.
        hashed_password: Stores the hashed password of the user.
        avatar_url: URL/path to the user’s avatar image.
        is_active: Boolean attribute denoting if the user is active or not. Default is True.
        is_admin: Boolean attribute indicating if the user has admin privileges. Default is False.
    Relationships:
        orders: A relationship to the orders placed by the user.
        reviews: A relationship to the reviews authored by the user.
        given_reviews: A relationship to the user reviews given by the user.
        received_reviews: A relationship to the user reviews received by the user.
    """
    __tablename__ = "users"
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)  # store hashed password
    avatar_url = Column(String, nullable=True)  # URL/path for the user’s avatar image
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    # Relationships
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    given_reviews = relationship("UserReview", foreign_keys="UserReview.reviewer_id", back_populates="reviewer")
    received_reviews = relationship("UserReview", foreign_keys="UserReview.reviewed_user_id",
                                    back_populates="reviewed_user")

class Order(BaseModel):
    """
    Order class represents an order in the e-commerce application.

    Attributes:
        __tablename__ (str): The name of the database table.
        user_id (Column): Foreign key referencing the id column in the users table.
        total_price (Column): The total price of the order.
        user (relationship): The relationship to the User model.
        order_items (relationship): The relationship to the OrderItem model.
    """
    __tablename__ = "orders"
    user_id = Column(Integer, ForeignKey("users.id"))
    total_price = Column(Float)
    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")


class OrderItem(BaseModel):
    """
        Represents an item within an order, storing details such as quantity and price.

        Attributes:
            __tablename__: A string representing the table name in the database.
            order_id: An integer column referencing the id of the associated order.
            card_id: An integer column referencing the id of the associated card.
            quantity: An integer column representing the quantity of the card ordered.
            price: A float column representing the price of one unit of the card.

        Relationships:
            order: A relationship to the Order model, providing access to the associated order.
            card: A relationship to the Card model, providing access to the associated card.
    """
    __tablename__ = "order_items"
    order_id = Column(Integer, ForeignKey("orders.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    quantity = Column(Integer)
    price = Column(Float)
    # Relationships
    order = relationship("Order", back_populates="order_items")
    card = relationship("Card", back_populates="order_items")


class Review(BaseModel):
    """
        Review model class representing user reviews for cards.

        Attributes:
        __tablename__ : str
            The name of the table in the database.
        user_id : sqlalchemy.Column
            Foreign key referencing the user who wrote the review.
        card_id : sqlalchemy.Column
            Foreign key referencing the card that was reviewed.
        rating : sqlalchemy.Column
            The rating given by the user.
        comment : sqlalchemy.Column, optional
            Optional comment provided by the user.

        Relationships:
        user : sqlalchemy.orm.relationship
            Relationship to the User model. Indicates the user who wrote the review.
        card : sqlalchemy.orm.relationship
            Relationship to the Card model. Indicates the card being reviewed.
    """
    __tablename__ = "reviews"
    user_id = Column(Integer, ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    # Relationships
    user = relationship("User", back_populates="reviews")
    card = relationship("Card", back_populates="reviews")


class UserReview(BaseModel):
    """
        UserReview

        This class defines a UserReview model which maps to the "user_reviews"
        table in the database. It includes details like the reviewed user,
        rating, comment, content as well as the reviewer information.

        Attributes:
            reviewed_user_id: An integer that represents the ID of the user
                              being reviewed. It is a foreign key linked
                              to the "users.id".
            rating: An integer representing the rating given by the reviewer.
            comment: A string that may contain additional comments provided
                     by the reviewer. It is optional and can be null.
            content: A string that contains the main content of the review.
                     This field is indexed for quicker search.
            reviewer_id: An integer representing the ID of the user who
                         provided the review. It is a foreign key linked
                         to the "users.id".

        Relationships:
            reviewer: Establishes a relationship to the "User" model via
                      the reviewer_id. This relationship allows access to
                      reviews given by a particular user.
            reviewed_user: Establishes a relationship to the "User" model
                           via the reviewed_user_id. This relationship allows
                           access to reviews received by a particular user.
    """
    __tablename__ = "user_reviews"
    reviewed_user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    content = Column(String, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    # Relationships
    reviewer = relationship("User", foreign_keys="UserReview.reviewer_id", back_populates="given_reviews")
    reviewed_user = relationship("User", foreign_keys="UserReview.reviewed_user_id",
                                 back_populates="received_reviews")
