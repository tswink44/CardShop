from datetime import datetime, timedelta
from fastapi import HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from sqlalchemy.orm import Session
from backend.app import crud
from backend.app.database import get_db
from backend.app.schemas import UserRead

load_dotenv()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """
    :param password: The plaintext password to be hashed.
    :return: The hashed version of the input password.
    """
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    :param plain_password: The plaintext password entered by the user.
    :param hashed_password: The hashed password stored in the database.
    :return: True if the plaintext password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)

SECRET_KEY = os.getenv("SECRET_KEY","superdupersecret")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7


if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set in environment variables")

def create_access_token(data: dict):
    """
    :param data: Dictionary containing the data to encode into the JWT.
    :return: Encoded JSON Web Token as a string.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """
    :param data: Dictionary containing the payload data to be encoded in the JWT.
    :return: A JWT (JSON Web Token) as a string, which includes the encoded data and expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str, exception):
    """
    :param token: The JSON Web Token (JWT) string to be verified and decoded.
    :param exception: The exception to raise if token verification fails.
    :return: The payload extracted from the verified token.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise exception

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    :param token: The JWT passed as a Bearer token in the Authorization header.
    :param db: The database session dependency for accessing the database.
    :return: The authenticated user object if the token is valid and the user exists, otherwise raises an HTTPException.
    """
    unauthorized_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_token(token,unauthorized_exception)

    user_email = payload.get("sub")
    if user_email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = crud.get_user_by_email(db, email=user_email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return user

def check_if_admin(current_user: UserRead):
    """
    :param current_user: The current user object to check
    :type current_user: UserRead
    :return: None if the user has admin privileges
    :raises HTTPException: If the user does not have admin privileges
    """
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions.")