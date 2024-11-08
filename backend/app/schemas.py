from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, constr, conint


# Base schema that is inherited by other schemas
class BaseSchema(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True  # Allows FastAPI to read SQLAlchemy models and convert them to JSON


# Card Schema
class CardBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    quantity: int


class CardCreate(BaseModel):
    name: constr(min_length=1)  # Ensure the name is non-empty
    description: constr(min_length=1)
    price: float
    quantity: conint(ge=1)  # Ensure at least 1 quantity

    class Config:
        orm_mode = True


class CardRead(CardBase, BaseSchema):
    id: int
    order_items: Optional[List['OrderItemRead']] = []
    reviews: Optional[List['ReviewRead']] = []


# User Schema
class UserBase(BaseModel):
    username: str
    email: EmailStr
    is_active: Optional[bool] = True


class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str  # Not hashed password; only used for registration


class UserRead(UserBase, BaseSchema):
    id: int
    orders: Optional[List['OrderRead']] = []
    reviews: Optional[List['ReviewRead']] = []
    given_feedbacks: Optional[List['UserReviewRead']] = []
    received_feedbacks: Optional[List['UserReviewRead']] = []

#User Login Schema
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Order Schema
class OrderBase(BaseModel):
    user_id: int
    total_price: float


class OrderCreate(OrderBase):
    pass


class OrderRead(OrderBase, BaseSchema):
    id: int
    user: UserRead
    order_items: Optional[List['OrderItemRead']] = []


# OrderItem Schema
class OrderItemBase(BaseModel):
    order_id: int
    card_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    pass


class OrderItemRead(OrderItemBase, BaseSchema):
    id: int
    order: Optional[OrderRead] = None
    card: Optional[CardRead] = None


# Review Schema
class ReviewBase(BaseModel):
    user_id: int
    card_id: int
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase, BaseSchema):
    id: int
    user: UserRead
    card: CardRead


# UserReview Schema
class UserReviewBase(BaseModel):
    reviewed_user_id: int
    reviewer_id: int
    rating: int
    comment: Optional[str] = None
    content: str


class UserReviewCreate(UserReviewBase):
    pass


class UserReviewRead(UserReviewBase, BaseSchema):
    id: int
    reviewed_user: UserRead
    reviewer: UserRead

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str  # Usually "bearer"

class TokenData(BaseModel):
    email: str

# Here is the necessary Config so you can refer to related models within the schemas
CardRead.update_forward_refs()
OrderRead.update_forward_refs()
OrderItemRead.update_forward_refs()
ReviewRead.update_forward_refs()
UserReviewRead.update_forward_refs()