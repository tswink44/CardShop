from fastapi import FastAPI, Request, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from fastapi.templating import Jinja2Templates
from starlette.responses import RedirectResponse
from app.database import SessionLocal, engine, init_db, database
from app import crud, schemas, models

# Constants
ORIGINS = ["*"]
METHODS = ["*"]
HEADERS = ["*"]
TEMPLATE_DIR = "frontend/templates/login.html"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=METHODS,
    allow_headers=HEADERS,
)

templates = Jinja2Templates(directory=TEMPLATE_DIR)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
models.Base.metadata.create_all(bind=engine)


def get_database() -> Session:
    database = SessionLocal()
    try:
        yield database
    finally:
        database.close()


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate(username: str, password: str, db: Session) -> models.User:
    user = crud.get_user_by_username(db, username=username)
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return user


@app.on_event("startup")
async def startup():
    init_db()
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    username = request.cookies.get("username")
    if username:
        return templates.TemplateResponse("home.html", {"request": request, "username": username})
    return RedirectResponse(url="/login")


@app.get("/login", response_class=HTMLResponse)
async def login_form(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@app.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...),
                db: Session = Depends(get_database)):
    user = authenticate(username=username, password=password, db=db)
    response = RedirectResponse(url="/", status_code=302)
    response.set_cookie(key="username", value=username)
    return response


@app.post("/token")
async def login_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_database)):
    user = authenticate(username=form_data.username, password=form_data.password, db=db)
    return {"access_token": user.username, "token_type": "bearer"}


# CRUD for Cards
@app.post("/cards/", response_model=schemas.Card)
def create_card(card: schemas.CardCreate, db: Session = Depends(get_database)):
    return crud.create_card(db=db, card=card)


@app.get("/cards/{card_id}", response_model=schemas.Card)
def get_card(card_id: int, db: Session = Depends(get_database)):
    db_card = crud.get_card(db=db, card_id=card_id)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@app.get("/cards/", response_model=List[schemas.Card])
def get_cards(skip: int = 0, limit: int = 10, db: Session = Depends(get_database)):
    return crud.get_cards(db=db, skip=skip, limit=limit)


@app.put("/cards/{card_id}", response_model=schemas.Card)
def update_card(card_id: int, card: schemas.CardCreate, db: Session = Depends(get_database)):
    db_card = crud.update_card(db=db, card_id=card_id, card=card)
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    return db_card


@app.delete("/cards/{card_id}", status_code=204)
def delete_card(card_id: int, db: Session = Depends(get_database)):
    success = crud.delete_card(db=db, card_id=card_id)
    if not success:
        raise HTTPException(status_code=404, detail="Card not found")
    return {"message": "Card deleted successfully"}

# Continue with similar refactoring for users, orders, and reviews
