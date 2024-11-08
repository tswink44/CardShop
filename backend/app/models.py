from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# Constants for commonly used fields
COMMON_FIELDS = {
    'id': Column(Integer, primary_key=True, index=True),
    'created_at': Column(DateTime, default=datetime.utcnow),
}


class BaseModel(Base):
    __abstract__ = True
    id = COMMON_FIELDS['id']
    created_at = COMMON_FIELDS['created_at']


class Card(BaseModel):
    __tablename__ = "cards"
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    quantity = Column(Integer)
    # Relationships
    order_items = relationship("OrderItem", back_populates="card")
    reviews = relationship("Review", back_populates="card")


class User(BaseModel):
    __tablename__ = "users"
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    # Relationships
    orders = relationship("Order", back_populates="user")
    reviews = relationship("Review", back_populates="user")
    given_feedbacks = relationship("UserFeedback", foreign_keys="UserFeedback.reviewer_id", back_populates="reviewer")
    received_feedbacks = relationship("UserFeedback", foreign_keys="UserFeedback.reviewed_user_id",
                                      back_populates="reviewed_user")


class Order(BaseModel):
    __tablename__ = "orders"
    user_id = Column(Integer, ForeignKey("users.id"))
    total_price = Column(Float)
    # Relationships
    user = relationship("User", back_populates="orders")
    order_items = relationship("OrderItem", back_populates="order")


class OrderItem(BaseModel):
    __tablename__ = "order_items"
    order_id = Column(Integer, ForeignKey("orders.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    quantity = Column(Integer)
    price = Column(Float)
    # Relationships
    order = relationship("Order", back_populates="order_items")
    card = relationship("Card", back_populates="order_items")


class Review(BaseModel):
    __tablename__ = "reviews"
    user_id = Column(Integer, ForeignKey("users.id"))
    card_id = Column(Integer, ForeignKey("cards.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    # Relationships
    user = relationship("User", back_populates="reviews")
    card = relationship("Card", back_populates="reviews")


class UserFeedback(BaseModel):
    __tablename__ = "user_feedbacks"
    reviewed_user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Integer)
    comment = Column(String, nullable=True)
    content = Column(String, index=True)
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    # Relationships
    reviewer = relationship("User", foreign_keys="UserFeedback.reviewer_id", back_populates="given_feedbacks")
    reviewed_user = relationship("User", foreign_keys="UserFeedback.reviewed_user_id",
                                 back_populates="received_feedbacks")
