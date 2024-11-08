import uvicorn
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import database, crud, schemas

app = FastAPI()


# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()



@app.get("/")
async def root():
    return {"message": "Hello World"}

#CRUD for Cards
@app.post("/cards/", response_model=schemas.Card)
def create_card(card: schemas.CardCreate, db: Session = Depends(get_db)):
    return crud.create_card(db=db, card=card)

@app.get("/cards/{card_id}", response_model=schemas.Card)
def get_card(card_id: int, db: Session = Depends(get_db)):
    db_card = crud.get_card(db=db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card

@app.get("/cards/", response_model=List[schemas.Card])
def get_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_cards(db=db, skip=skip, limit=limit)

@app.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_db)):
    db_card = crud.update_card(db=db, card_id=card_id, card=card)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card

@app.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_db)):
    success = crud.delete_card(db=db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}

#CRUD for users
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db=db, user=user)

@app.get("/users/{user_id}", response_model=schemas.User)
def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db=db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.get("/users/", response_model=List[schemas.User])
def get_users(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_users(db=db, skip=skip, limit=limit)

@app.put("/users/{user_id}", response_model=schemas.User)
def update_user(user_id: int, user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.update_user(db=db, user_id=user_id, user=user)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    success = crud.delete_user(db=db, user_id=user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

#CRUD for orders
@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_order(db=db, order=order, user_id=user_id)

@app.get("/orders/{order_id}", response_model=schemas.Order)
def get_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud.get_order(db=db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.get("/users/{user_id}/orders", response_model=List[schemas.Order])
def get_orders_by_user(user_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_orders_by_user(db=db, user_id=user_id, skip=skip, limit=limit)

#CRUD for product reviews
@app.post("/reviews/", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, user_id: int, db: Session = Depends(get_db)):
    return crud.create_review(db=db, review=review, user_id=user_id)

@app.get("/cards/{card_id}/reviews", response_model=List[schemas.Review])
def get_reviews_by_card(card_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_reviews_by_card(db=db, card_id=card_id, skip=skip, limit=limit)

#CRUD for user reviews
@app.post("/user-reviews/", response_model=schemas.UserReview)
def create_user_review(review: schemas.UserReviewCreate, reviewer_id: int, db: Session = Depends(get_db)):
    return crud.create_user_review(db=db, review=review, reviewer_id=reviewer_id)

@app.get("/users/{user_id}/reviews", response_model=List[schemas.UserReview])
def get_reviews_by_user(user_id: int, skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud.get_reviews_by_user(db=db, reviewed_user_id=user_id, skip=skip, limit=limit)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)