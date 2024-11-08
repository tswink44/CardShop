from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.schemas import UserReview
from app.database import Base



class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)

    # Relationships
    order_items = relationship("OrderItem", back_populates="card")
    reviews = relationship("Review", back_populates="card")  # New relationship to reviews


#User Model

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    # Relationships
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    given_reviews = relationship("UserReview", foreign_keys="[UserReview.reviewer_id]", back_populates="reviewer")
    received_reviews = relationship("UserReview", foreign_keys="[UserReview.reviewed_user_id]",
                                    back_populates="reviewed_user")


class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    total_price = Column(Float)
    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")


class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    quantity = Column(Integer)
    price = Column(Float)
    # Relationships
    order = relationship("Order", back_populates="order_items")
    card = relationship("Card", back_populates="order_items")


class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    # Relationships
    user = relationship("User", back_populates="reviews")
    card = relationship("Card", back_populates="reviews")


class UserReview(Base):
    __tablename__ = "user_reviews"
    id = Column(Integer, primary_key=True, index=True)
    reviewed_user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    content = Column(String, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    # Relationships
    reviewer = relationship("User", foreign_keys="[reviewer_id]", back_populates="given_reviews")
    reviewed_user = relationship("User", foreign_keys="[reviewed_user_id]", back_populates="received_reviews")


