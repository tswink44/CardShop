from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

"""
CardBase: Base schema for shared attributes between request and response.
CardCreate: Extends CardBase for creating a new card, requiring quantity.
Card: The full schema with id and quantity included for responses.

"""
class CardBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float

class CardCreate(CardBase):
    quantity: int

class Card(CardBase):
    id: int
    quantity: int

    class Config:
        orm_mode = True
"""
UserBase: Shared attributes for user details.
UserCreate: Adds a password field for user creation.
User: The full schema with id and is_active for responses.
"""
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        orm_mode = True

"""
OrderBase: Contains the basic attributes for an order.
OrderCreate: Inherits OrderBase with no additional fields.
Order: The full schema with id, user_id, and created_at for responses.
"""
class OrderBase(BaseModel):
    total_price: float

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

"""
ReviewBase: Shared attributes for a review.
ReviewCreate: Extends ReviewBase with card_id for creating a new review.
Review: The full schema with id, user_id, card_id, and created_at for responses.
"""
class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    card_id: int

class Review(ReviewBase):
    id: int
    user_id: int
    card_id: int
    created_at: datetime

    class Config:
        orm_mode = True

"""
UserReviewBase: Contains basic attributes for a user-to-user review.
UserReviewCreate: Extends UserReviewBase to include reviewed_user_id for creating a new user review.
UserReview: The full schema with id, reviewer_id, reviewed_user_id, and created_at for responses.
"""

class UserReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class UserReviewCreate(UserReviewBase):
    reviewed_user_id: int

class UserReview(UserReviewBase):
    id: int
    reviewer_id: int
    reviewed_user_id: int
    created_at: datetime

    class Config:
        orm_mode = True
