from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError

import hashlib


from ..config import settings

# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

pwd_context = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    bcrypt__rounds=12,
    bcrypt__ident="2b"
)

def hash_password(password: str) -> str:
    print("PASSWORD TYPE:", type(password), "Password repr:", repr(password))
    # hashed_pw = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(password)
    # return pwd_context.hash(hashed_pw)

def verify_password(plain: str, hashed: str) -> bool:
    # hashed_pw = hashlib.sha256(plain.encode()).hexdigest()
    return pwd_context.verify(plain, hashed)
    # return pwd_context.verify(hashed_pw, hashed)


# def verify_password(plain: str, hashed: str) -> bool:
#     return pwd_context.verify(plain, hashed)

def create_access_token(subject: str, expires_minutes: int | None = None):
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(subject),
        "exp": expire,
        "iat": datetime.now(timezone.utc),  #issued at
    }

    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return token, expire

def decode_access_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except JWTError as e:
        raise ValueError(f"Invalid token: {e}")


def get_current_date() -> datetime:
    return datetime.now(timezone.utc).date()
