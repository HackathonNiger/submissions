from fastapi import APIRouter, Depends, HTTPException, Header, Response, status
from sqlalchemy.orm import Session
from decimal import Decimal

from ..db.session import SessionLocal
from ..scopes import user_scopes
from .. import schemas
from .. import models
from .auth import get_current_user

router = APIRouter(prefix="/user", tags=["user"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/me", response_model = schemas.UserResponse)
def get_user_me(user = Depends(get_current_user), db: Session = Depends(get_db), response: Response = None):
    # data = schemas.LoginResponseData.model_validate(user)

    # db_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user.id).first()
    # data.balance = db_wallet.balance if db_wallet else 0.00

   
    db_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user.id).first()
    
    data = schemas.LoginResponseData(
        email=user.email,
        balance=db_wallet.balance
    )   
   

    response.status_code = status.HTTP_200_OK

    return schemas.LoginResponse(
        success=True,
        message="Your information",
        token=None,
        data=data
    )

@router.get("/{userId}", response_model = schemas.UserResponse)
def get_user_by_id(userId: int, db: Session = Depends(get_db), response: Response = None):
    user = user_scopes.get_user_by_id(db=db, user_id=userId)

    if not user:
        response.status_code = status.HTTP_404_NOT_FOUND
        return schemas.LoginResponse(
            success=False,
            message=f"User with ID {userId} not found",
            token=None,
            data=None
        )

    # data = schemas.LoginResponseData.model_validate(user)

    # db_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user.id).first()
    # data.balance = db_wallet.balance if db_wallet else 0.00

    db_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user.id).first()
    
    data = schemas.LoginResponseData(
        email=user.email,
        balance=db_wallet.balance
    )   
   

    response.status_code = status.HTTP_200_OK

    return schemas.LoginResponse(
        success=True,
        message=f"Information for user with ID {userId}",
        token=None,
        data=data
    )

