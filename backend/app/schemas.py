from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class ConfigMixin:
    class Config:
        orm_mode = True


class BaseSchema(BaseModel):
    class Config:
        orm_mode = True


class CardBase(BaseSchema):
    name: str
    description: Optional[str] = None
    price: float


class CardCreate(CardBase):
    quantity: int


class Card(CardBase, ConfigMixin):
    id: int
    quantity: int


class UserBase(BaseSchema):
    username: str
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserBase, ConfigMixin):
    id: int
    is_active: bool


class OrderBase(BaseSchema):
    total_price: float


class OrderCreate(OrderBase):
    pass


class Order(OrderBase, ConfigMixin):
    id: int
    user_id: int
    created_at: datetime


class ReviewBase(BaseSchema):
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    card_id: int


class Review(ReviewBase, ConfigMixin):
    id: int
    user_id: int
    card_id: int
    created_at: datetime


class UserReviewBase(BaseSchema):
    rating: int
    comment: Optional[str] = None


class UserReviewCreate(UserReviewBase):
    reviewed_user_id: int


class UserReview(UserReviewBase, ConfigMixin):
    id: int
    reviewer_id: int
    reviewed_user_id: int
    created_at: datetime
