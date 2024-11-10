import logging

from fastapi import FastAPI, Depends, HTTPException, status, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session
from typing import List
import os

# Importing CRUD, schemas, and database utilities
from backend.app import crud, schemas, models
from backend.app.crud import authenticate_user
from backend.app.database import get_db, initialize_database, connect_async_database, disconnect_async_database
from backend.app.models import User
from backend.app.schemas import UserLogin, Token, CardCreate, UserRead, AvatarResponse
from backend.app.utils import check_if_admin, create_access_token, create_refresh_token, verify_token, get_current_user

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
AVATAR_DIR = "./avatars"

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)
app.mount("/uploads", StaticFiles(directory="./uploads"), name="uploads")

if not os.path.exists(AVATAR_DIR):
    os.makedirs(AVATAR_DIR)
app.mount("/avatars", StaticFiles(directory="./avatars"), name="avatars")

# Allow CORS (Important for React frontend to communicate with the FastAPI backend)


invalid_token_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid token",
    headers={"WWW-Authenticate": "Bearer"},
)

# Create the database tables on server start
@app.on_event("startup")
async def startup():
    """
    This function runs during the startup event of the FastAPI application.
    It establishes an asynchronous connection to the database and initializes the database tables
    using the synchronous SQLAlchemy ORM engine.

    :return: None
    """
    # If using async database connection
    await connect_async_database()

    # Initialize the tables using the synchronous engine (SQLAlchemy ORM)
    initialize_database()

# Disconnect async database on shutdown
@app.on_event("shutdown")
async def shutdown():
    """
    Handles the shutdown event for the application.

    This function is called when the application is shutting down.
    It ensures that the asynchronous database connection is properly closed.

    :return: None
    """
    await disconnect_async_database()


# ---------------- Routes for Card (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/store/card/", response_model=schemas.CardRead)
async def create_card_listing(
    name: str = Form(...),  # Here, you now expect `Form` fields instead of query parameters
    description: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    image: UploadFile = File(...),  # This remains as a file
    db: Session = Depends(get_db)
):
    """
    :param name: The name of the card listing.
    :param description: A detailed description of the card listing.
    :param price: The price of the card listing.
    :param quantity: The available quantity of the card listing.
    :param image: The image file associated with the card listing.
    :param db: Database session dependency.
    :return: The newly created card listing object.

    """
    # Save the uploaded file to the server
    file_location = f"{UPLOAD_DIR}/{image.filename}"

    try:
        with open(file_location, "wb+") as file_object:
            file_object.write(image.file.read())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")

    # Build the image URL path (relative to the server)
    image_url = f"/uploads/{image.filename}"

    # Create the card listing in the database
    new_card = crud.create_card(
        db=db,
        card=schemas.CardCreate(
            name=name,
            description=description,
            price=price,
            quantity=quantity
        ),
        image_url=image_url
    )

    return new_card


@app.get("/store/cards/", response_model=List[schemas.CardRead])
def get_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    :param skip: The number of records to skip from the beginning.
    :param limit: The maximum number of records to return.
    :param db: Database session dependency.
    :return: A list of CardRead schema models.
    """
    return crud.get_cards(db=db, skip=skip, limit=limit)

@app.get("/store/card/{card_id}", response_model=schemas.CardRead)
def get_card(card_id: int, db: Session = Depends(get_db)):
    """
    :param card_id: The unique identifier of the card to retrieve.
    :param db: The database session dependency.
    :return: The card data if found, otherwise raises an HTTPException with status code 404.
    """
    card = crud.get_card(db=db, card_id=card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@app.put("/cards/{card_id}", response_model=schemas.CardRead)
def update_card(
        card_id: int,
        name: str = Form(...),
        description: str = Form(...),
        price: float = Form(...),
        quantity: int = Form(...),
        image: UploadFile = File(None),  # Image is optional
        db: Session = Depends(get_db),
        current_user: models.User = Depends(get_current_user)  # Ensure admin-only access
):
    """
    :param card_id: Identifier of the card to be updated
    :param name: Updated name of the card
    :param description: Updated description of the card
    :param price: Updated price of the card
    :param quantity: Updated quantity of the card in stock
    :param image: Optional updated image file for the card
    :param db: Database session dependency
    :param current_user: The current authenticated user, should be an admin
    :return: Returns the updated card information

    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions to edit the listing.")

    # Fetch existing card from the database
    card = crud.get_card(db=db, card_id=card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    # Handle image upload if a new image has been uploaded
    if image is not None:
        # Save the new image if it is provided (replace the existing one)
        file_location = f"{UPLOAD_DIR}/{image.filename}"
        try:
            with open(file_location, "wb+") as file_object:
                file_object.write(image.file.read())
            image_url = f"/uploads/{image.filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save image: {str(e)}")
    else:
        # Keep the original image if no new image is uploaded
        image_url = card.image_url

    # Update the card in the database
    updated_card = crud.update_card(
        db,
        card_id=card_id,
        card_data=schemas.CardCreate(
            name=name,
            description=description,
            price=price,
            quantity=quantity
        ),
        image_url=image_url
    )

    if updated_card is None:
        raise HTTPException(status_code=404, detail="Failed to update card")

    return updated_card


@app.delete("/cards/{card_id}")
def delete_card(card_id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    :param card_id: The ID of the card to be deleted.
    :param current_user: The currently authenticated user.
    :param db: The database session.
    :return: A success message if the card is deleted successfully.

    """
    if not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Not enough permissions to delete the listing.")


    db_card = crud.get_card(db=db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")


    success = crud.delete_card(db=db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Failed to delete card")

    return {"message": "Card deleted successfully"}


# ---------------- Routes for User (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/users/", response_model=schemas.UserRead,status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    :param user: The user information to create a new user, defined by schemas.UserCreate.
    :param db: Database session dependency, provided by FastAPI's Depends function.
    :return: The created user information, structured as schemas.UserRead, or raises an HTTPException if the email is already registered.
    """
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/me", response_model=schemas.UserRead)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    """
    :param current_user: The user object of the currently authenticated user.
    :return: The user object of the currently authenticated user.
    """
    return current_user


@app.get("/users/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    """
    :param user_id: The ID of the user to retrieve.
    :type user_id: int
    :param db: The database session dependency.
    :type db: Session
    :return: The user object if found.
    :rtype: schemas.UserRead
    :raises HTTPException: If the user is not found, a 404 error is raised.
    """
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.put("/users/{user_id}", response_model=schemas.UserRead)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    :param user_id: The ID of the user to be updated.
    :type user_id: int

    :param user: The user data for updating the user.
    :type user: schemas.UserCreate

    :param db: Database session dependency.
    :type db: Session

    :return: The updated user data if successful.
    :rtype: schemas.UserRead

    :raises HTTPException: If the user with the provided ID is not found.
    """
    updated_user = crud.update_user(db=db, user_id=user_id, user_data=user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    """
    :param user_id: The ID of the user to be deleted
    :type user_id: int
    :param db: Database session dependency
    :type db: Session
    :return: A message indicating the user was deleted successfully
    :rtype: dict
    :raises HTTPException: If the user is not found
    """
    success = crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}



# @app.post("/upload-avatar")
# async def upload_avatar(
#         file: UploadFile = File(...),
#         db: Session = Depends(get_db),
#         current_user: User = Depends(get_current_user)
# ):
#     """
#     Upload and save the user's avatar.
#     """
#     logging.info("Upload avatar called")
#     # Ensure current_user is retrieved correctly
#     if not current_user:
#         logging.error("Failed to retrieve current user")
#         raise HTTPException(status_code=401, detail="Not authenticated")
#     logging.info(f"User {current_user.id} authenticated")
#
#     # Limit file type to image
#     if file.content_type not in ["image/jpeg", "image/png"]:
#         raise HTTPException(status_code=400, detail="Invalid file type")
#     # Define a unique filepath for avatar
#     file_location = os.path.join(UPLOAD_DIR, f"user_{current_user.id}.png")
#     # Save the file
#     with open(file_location, "wb+") as file_object:
#         file_object.write(file.file.read())
#     # Update user record with avatar URL
#     current_user.avatar_url = f"/avatars/user_{current_user.id}.png"
#     db.commit()
#     db.refresh(current_user)
#
#     logging.info(f"Avatar uploaded for user {current_user.id}")
#     return {"avatar_url": current_user.avatar_url}
#
#
# # Route to serve the avatar
# @app.get("/users/{user_id}/avatar", response_class=FileResponse)
# async def get_user_avatar(user_id: int, db: Session = Depends(get_db)):
#     """
#     Return the avatar image for the given user.
#     """
#     user = db.query(User).filter(User.id == user_id).first()
#
#     if not user or not user.avatar_url:
#         raise HTTPException(status_code=404, detail="User or avatar not found")
#
#     avatar_path = os.path.join(UPLOAD_DIR, f"user_{user_id}.png")
#     if os.path.exists(avatar_path):
#         return FileResponse(avatar_path)
#     else:
#         raise HTTPException(status_code=404, detail="Avatar file not found")



# ---------------- Routes for User Authentication (Synchronous CRUD with SQLAlchemy ORM) ---------------- #
@app.post("/login/", response_model=Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    :param user_credentials: User credential information containing username and password required for authentication.
    :type user_credentials: OAuth2PasswordRequestForm
    :param db: Database session dependency to interact with the database.
    :type db: Session
    :return: A dictionary containing the access token, refresh token, and token type.
    :rtype: dict
    """
    # Authenticate user and verify the password (not shown here)
    authenticated_user = authenticate_user(db, user_credentials.username, user_credentials.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    # Generate both access and refresh tokens
    access_token = create_access_token(data={"sub": authenticated_user.email})
    refresh_token = create_refresh_token(data={"sub": authenticated_user.email})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


# Route to refresh token
@app.post("/token/refresh", response_model=Token)
def refresh_token(refresh_token: str):
    """
    :param refresh_token: The refresh token used to obtain a new access token.
    :return: A dictionary containing the new access token, the same refresh token, and the token type (bearer).
    """
    # Verify the refresh token
    payload = verify_token(refresh_token, invalid_token_exception)

    if not payload:
        raise invalid_token_exception

    # Issue a new access token
    new_access_token = create_access_token(data={"sub": payload["sub"]})

    return {"access_token": new_access_token, "refresh_token": refresh_token, "token_type": "bearer"}

# ---------------- Routes for Order (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/orders/", response_model=schemas.OrderRead)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    :param order: An instance of schemas.OrderCreate containing the details of the order to be created.
    :param db: SQLAlchemy Session dependency used for accessing the database.
    :return: The newly created order as an instance of schemas.OrderRead.
    """
    return crud.create_order(db=db, order=order)


@app.get("/orders/", response_model=List[schemas.OrderRead])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    """
    :param skip: The number of records to skip before starting to return results.
    :param limit: The maximum number of records to return.
    :param db: Database session dependency.
    :return: A list of orders retrieved from the database.
    """
    return crud.get_orders(db=db, skip=skip, limit=limit)


@app.get("/orders/{order_id}", response_model=schemas.OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    """
    :param order_id: The ID of the order to retrieve.
    :param db: Database session dependency.
    :return: The order details if found.
    """
    order = crud.get_order(db=db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.put("/orders/{order_id}", response_model=schemas.OrderRead)
def update_order(order_id: int, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    """
    :param order_id: The ID of the order to update.
    :param order: The data for the order to be updated, represented by schemas.OrderCreate.
    :param db: Database session dependency.
    :return: The updated order.
    """
    updated_order = crud.update_order(db=db, order_id=order_id, order_data=order)
    if updated_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated_order


@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    """
    :param order_id: The ID of the order to be deleted
    :param db: Database session dependency
    :return: A message indicating the successful deletion of the order
    """
    success = crud.delete_order(db=db, order_id=order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}


# ---------------- Routes for Review (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/reviews/", response_model=schemas.ReviewRead)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    """
    :param review: The review data to create a new review, validated against schemas.ReviewCreate.
    :param db: Database session dependency, provided by FastAPI's Depends mechanism.
    :return: The created review object as per schemas.ReviewRead.
    """
    return crud.create_review(db=db, review=review)


@app.get("/reviews/{review_id}", response_model=schemas.ReviewRead)
def read_review(review_id: int, db: Session = Depends(get_db)):
    """
    :param review_id: The ID of the review to retrieve
    :param db: The database session dependency
    :return: The retrieved review

    """
    review = crud.get_review(db=db, review_id=review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@app.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    """
    :param review_id: The unique identifier of the review to be deleted.
    :param db: The database session dependency.
    :return: A JSON response indicating the outcome of the delete operation.
    """
    success = crud.delete_review(db=db, review_id=review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}


# ---------------- Routes for UserReview (Feedback) ---------------- #

@app.post("/userreviews/", response_model=schemas.UserReviewRead)
def create_user_review(user_review: schemas.UserReviewCreate, db: Session = Depends(get_db)):
    """
    :param user_review: The user review data from the request body that follows the UserReviewCreate schema.
    :param db: Database session dependency used for performing database operations.
    :return: The newly created user review object following the UserReviewRead schema.
    """
    return crud.create_user_review(db=db, user_review=user_review)


@app.get("/userreviews/{user_review_id}", response_model=schemas.UserReviewRead)
def read_user_review(user_review_id: int, db: Session = Depends(get_db)):
    """
    :param user_review_id: The unique identifier of the user review to be fetched.
    :param db: The database session dependency.
    :return: The user review data corresponding to the given user_review_id.
    """
    user_review = crud.get_user_review(db=db, user_review_id=user_review_id)
    if user_review is None:
        raise HTTPException(status_code=404, detail="UserReview not found")
    return user_review


@app.delete("/userreviews/{user_review_id}")
def delete_user_review(user_review_id: int, db: Session = Depends(get_db)):
    """
    :param user_review_id: The ID of the user review to delete.
    :type user_review_id: int
    :param db: Database session dependency.
    :type db: Session
    :return: A confirmation message indicating the user review was deleted.
    :rtype: dict
    """
    success = crud.delete_user_review(db=db, user_review_id=user_review_id)
    if not success:
        raise HTTPException(status_code=404, detail="UserReview not found")
    return {"message": "UserReview deleted successfully"}