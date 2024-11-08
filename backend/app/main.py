from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Importing CRUD, schemas, and database utilities
from backend.app import crud, schemas, models
from backend.app.crud import authenticate_user
from backend.app.database import get_db, initialize_database, connect_async_database, disconnect_async_database
from backend.app.schemas import UserLogin

# Initialize FastAPI app
app = FastAPI()

# Allow CORS (Important for React frontend to communicate with the FastAPI backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create the database tables on server start
@app.on_event("startup")
async def startup():
    # If using async database connection
    await connect_async_database()

    # Initialize the tables using the synchronous engine (SQLAlchemy ORM)
    initialize_database()

# Disconnect async database on shutdown
@app.on_event("shutdown")
async def shutdown():
    await disconnect_async_database()


# ---------------- Routes for Card (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/cards/", response_model=schemas.CardRead)
def create_card(card: schemas.CardCreate, db: Session = Depends(get_db)):
    return crud.create_card(db=db, card=card)


@app.get("/cards/", response_model=List[schemas.CardRead])
def read_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    cards = crud.get_cards(db=db, skip=skip, limit=limit)
    return cards


@app.get("/cards/{card_id}", response_model=schemas.CardRead)
def read_card(card_id: int, db: Session = Depends(get_db)):
    card = crud.get_card(db=db, card_id=card_id)
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return card


@app.put("/cards/{card_id}", response_model=schemas.CardRead)
def update_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    updated_card = crud.update_card(db=db, card_id=card_id, card_data=card)
    if updated_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return updated_card


@app.delete("/cards/{card_id}")
def delete_card(card_id: int, db: Session = Depends(get_db)):
    success = crud.delete_card(db=db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}


# ---------------- Routes for User (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/users/", response_model=schemas.UserRead)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.UserRead])
def read_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)


@app.get("/users/{user_id}", response_model=schemas.UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.put("/users/{user_id}", response_model=schemas.UserRead)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    updated_user = crud.update_user(db=db, user_id=user_id, user_data=user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# ---------------- Routes for User Authentication (Synchronous CRUD with SQLAlchemy ORM) ---------------- #
@app.post("/login/")
def login(user: UserLogin, db: Session = Depends(get_db)):
    authenticated_user = authenticate_user(db, user.email, user.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {"message": "Login successful"}


# ---------------- Routes for Order (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/orders/", response_model=schemas.OrderRead)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order)


@app.get("/orders/", response_model=List[schemas.OrderRead])
def read_orders(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_orders(db=db, skip=skip, limit=limit)


@app.get("/orders/{order_id}", response_model=schemas.OrderRead)
def read_order(order_id: int, db: Session = Depends(get_db)):
    order = crud.get_order(db=db, order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@app.put("/orders/{order_id}", response_model=schemas.OrderRead)
def update_order(order_id: int, order: schemas.OrderCreate, db: Session = Depends(get_db)):
    updated_order = crud.update_order(db=db, order_id=order_id, order_data=order)
    if updated_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated_order


@app.delete("/orders/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    success = crud.delete_order(db=db, order_id=order_id)
    if not success:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}


# ---------------- Routes for Review (Synchronous CRUD with SQLAlchemy ORM) ---------------- #

@app.post("/reviews/", response_model=schemas.ReviewRead)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db)):
    return crud.create_review(db=db, review=review)


@app.get("/reviews/{review_id}", response_model=schemas.ReviewRead)
def read_review(review_id: int, db: Session = Depends(get_db)):
    review = crud.get_review(db=db, review_id=review_id)
    if review is None:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@app.delete("/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db)):
    success = crud.delete_review(db=db, review_id=review_id)
    if not success:
        raise HTTPException(status_code=404, detail="Review not found")
    return {"message": "Review deleted successfully"}


# ---------------- Routes for UserReview (Feedback) ---------------- #

@app.post("/userreviews/", response_model=schemas.UserReviewRead)
def create_user_review(user_review: schemas.UserReviewCreate, db: Session = Depends(get_db)):
    return crud.create_user_review(db=db, user_review=user_review)


@app.get("/userreviews/{user_review_id}", response_model=schemas.UserReviewRead)
def read_user_review(user_review_id: int, db: Session = Depends(get_db)):
    user_review = crud.get_user_review(db=db, user_review_id=user_review_id)
    if user_review is None:
        raise HTTPException(status_code=404, detail="UserReview not found")
    return user_review


@app.delete("/userreviews/{user_review_id}")
def delete_user_review(user_review_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user_review(db=db, user_review_id=user_review_id)
    if not success:
        raise HTTPException(status_code=404, detail="UserReview not found")
    return {"message": "UserReview deleted successfully"}