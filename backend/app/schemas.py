from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, constr, conint


# Base schema that is inherited by other schemas
class BaseSchema(BaseModel):
    """
    BaseSchema represents the base structure for data models with optional id and created_at fields.
    id: An optional integer representing the unique identifier of the object.
    created_at: An optional datetime stamp recording when the object was created.

    Config:
        Config class enables ORM mode, allowing FastAPI to automatically read and convert SQLAlchemy models to JSON format.
    """
    id: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True  # Allows FastAPI to read SQLAlchemy models and convert them to JSON


# Card Schema
class CardBase(BaseModel):
    """
    Class representing a general card model with basic attributes.

    Attributes:
        name (str): The name of the card.
        description (Optional[str]): A brief description of the card. Default is None.
        price (float): The price of the card.
        quantity (int): The number of cards available.
    """
    name: str
    description: Optional[str] = None
    price: float
    quantity: int


class CardCreate(BaseModel):
    """
    CardCreate class for creating a card object

    Attributes:
      name: Name of the card with a minimum length of 1 character
      description: Description of the card with a minimum length of 1 character
      price: Price of the card as a float
      quantity: Quantity of the card with a minimum value of 1
      image_url: URL of the image representing the card, default is None

    Config:
      Enabling ORM mode to support object-relational mapping
    """
    name: constr(min_length=1)
    description: constr(min_length=1)
    price: float
    quantity: conint(ge=1)
    image_url: str = None

    class Config:
        orm_mode = True


class CardRead(CardBase, BaseSchema):
    """
    Represents a card entity with associated order items and reviews.

    Attributes:
        id (int): Unique identifier for the card.
        order_items (Optional[List['OrderItemRead']]): List of order items associated with the card.
        reviews (Optional[List['ReviewRead']]): List of reviews associated with the card.
        image_url (str): URL for the image of the card.
    """
    id: int
    order_items: Optional[List['OrderItemRead']] = []
    reviews: Optional[List['ReviewRead']] = []
    image_url: str = None


# User Schema
class UserBase(BaseModel):
    """
    Represents the base model for a user, holding basic information and status properties.

    Attributes:
        username (str): A string representing the username of the user.
        email (EmailStr): A valid email address of the user.
        avatar_url (Optional[str]): URL/path to the user’s avatar image; optional, defaults to None.
        is_active (Optional[bool]): Indicates if the user is currently active. Defaults to True.
        is_admin (bool): Indicates if the user has administrative privileges. Defaults to False.

    Class Config:
        orm_mode (bool): Enables compatibility with ORMs by allowing the model to read data even if it is not a dict.
    """
    username: str
    email: EmailStr
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = True
    is_admin: bool = False

    class Config:
        orm_mode = True


class UserCreate(UserBase):
    """
         class UserCreate(UserBase):
    username: str
    email: EmailStr
    password: str
        Plaintext password used only during the registration process.
    """
    username: str
    email: EmailStr
    password: str  # Not hashed password; only used for registration


class UserRead(UserBase, BaseSchema):
    """
        UserRead

        A class representing a user with additional details about their orders, reviews, and feedbacks.

        Inherits from:
            UserBase
            BaseSchema

        Attributes:
            id (int): The unique identifier for the user.
            orders (Optional[List[OrderRead]]): A list of orders associated with the user.
            reviews (Optional[List[ReviewRead]]): A list of reviews provided by the user.
            given_feedbacks (Optional[List[UserReviewRead]]): A list of feedbacks given by the user.
            received_feedbacks (Optional[List[UserReviewRead]]): A list of feedbacks received by the user.
    """
    id: int
    orders: Optional[List['OrderRead']] = []
    reviews: Optional[List['ReviewRead']] = []
    given_feedbacks: Optional[List['UserReviewRead']] = []
    received_feedbacks: Optional[List['UserReviewRead']] = []

#User Login Schema
class UserLogin(BaseModel):
    """
    UserLogin class is a Pydantic model used for validating and parsing login data. This includes an email and a password.

    Attributes:
        email (EmailStr): User's email address.
        password (str): User's password.
    """
    email: EmailStr
    password: str

class AvatarResponse(BaseModel):
    avatar_url: Optional[str]

# Order Schema
class OrderBase(BaseModel):
    """
    Class representing an order in the system.
    Derived from the BaseModel class.

    Attributes
    ----------
    user_id : int
        The unique identifier of the user who placed the order.
    total_price : float
        The total price of the order.
    """
    user_id: int
    total_price: float


class OrderCreate(OrderBase):
    """
        This class represents the creation of an order.

        It inherits from the OrderBase class and is used
        to define the structure and attributes necessary
        for creating a new order in the system.
    """
    pass


class OrderRead(OrderBase, BaseSchema):
    """
        Represents a read-only view of an order, extending base order attributes.

        Attributes:
        - id: The unique identifier of the order.
        - user: The user associated with the order.
        - order_items: A list of items associated with the order, can be empty.
    """
    id: int
    user: UserRead
    order_items: Optional[List['OrderItemRead']] = []


# OrderItem Schema
class OrderItemBase(BaseModel):
    """
        A class representing the base attributes of an order item.

        Attributes
        ----------
        order_id : int
            The unique identifier of the order.
        card_id : int
            The unique identifier of the card in the order.
        quantity : int
            The number of units of the card in the order.
        price : float
            The price of a single unit of the card in the order.
    """
    order_id: int
    card_id: int
    quantity: int
    price: float


class OrderItemCreate(OrderItemBase):
    """
    Class OrderItemCreate inherits from OrderItemBase.
    Used for creating a new order item with initial data and validations.
    """
    pass


class OrderItemRead(OrderItemBase, BaseSchema):
    """
    Class OrderItemRead

    Represents an item of an order within the system. Inherits properties from both OrderItemBase and BaseSchema classes.

    Attributes
    ----------
    id : int
        Unique identifier for the order item
    order : Optional[OrderRead], optional
        Represents the order to which this item belongs (default is None)
    card : Optional[CardRead], optional
        Represents the card associated with this order item (default is None)
    """
    id: int
    order: Optional[OrderRead] = None
    card: Optional[CardRead] = None


# Review Schema
class ReviewBase(BaseModel):
    """
    Represents the base model for a review.

        Attributes
        ----------
        user_id : int
            The ID of the user who wrote the review.
        card_id : int
            The ID of the card being reviewed.
        rating : int
            The rating given to the card.
        comment : Optional[str], optional
            An optional comment about the card, by default None.
    """
    user_id: int
    card_id: int
    rating: int
    comment: Optional[str] = None


class ReviewCreate(ReviewBase):
    """
    Class for creating a new review by inheriting from ReviewBase. This class can be used to create instances that represent new reviews in the system.
    """
    pass


class ReviewRead(ReviewBase, BaseSchema):
    """
        class ReviewRead(ReviewBase, BaseSchema):

        id: int
        user: UserRead
        card: CardRead

        Represents a read-only review retrieved from the database.

        Attributes:
        id (int): Unique identifier for the review.
        user (UserRead): The user who wrote the review.
        card (CardRead): The card that is being reviewed.
    """
    id: int
    user: UserRead
    card: CardRead


# UserReview Schema
class UserReviewBase(BaseModel):
    """
        UserReviewBase

        A base model representing a user's review, containing essential fields
        for identifying the reviewed user, the reviewer, and the review details.

        Attributes
        ----------
        reviewed_user_id : int
            The ID of the user who is being reviewed.
        reviewer_id : int
            The ID of the user who is providing the review.
        rating : int
            Numerical rating given to the reviewed user.
        comment : Optional[str], optional
            Optional textual comment about the review.
        content : str
            Detailed content of the review.
    """
    reviewed_user_id: int
    reviewer_id: int
    rating: int
    comment: Optional[str] = None
    content: str


class UserReviewCreate(UserReviewBase):
    """
        A class for creating a user review entry. Inherits from UserReviewBase.

        This class is used to create a new user review based on the base review attributes defined in UserReviewBase.
    """
    pass


class UserReviewRead(UserReviewBase, BaseSchema):
    """
        Represents a review written by one user for another user. Inherits from UserReviewBase and BaseSchema.

        Attributes:
        id (int): Unique identifier for the review.
        reviewed_user (UserRead): The user who is being reviewed.
        reviewer (UserRead): The user who wrote the review.
    """
    id: int
    reviewed_user: UserRead
    reviewer: UserRead

class Token(BaseModel):
    """
    Token class is a data model representing an authentication token.

    Attributes:
        access_token (str): The access token used for authentication.
        refresh_token (str): The token used to refresh the access token.
        token_type (str): The type of the token, usually "bearer".
    """
    access_token: str
    refresh_token: str
    token_type: str  # Usually "bearer"

class TokenData(BaseModel):
    """
    Class representing token data.

    Attributes:
        email (str): User's email address.
    """
    email: str

# Here is the necessary Config so you can refer to related models within the schemas
CardRead.update_forward_refs()
OrderRead.update_forward_refs()
OrderItemRead.update_forward_refs()
ReviewRead.update_forward_refs()
UserReviewRead.update_forward_refs()