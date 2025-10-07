from fastapi import APIRouter, Depends, HTTPException, Header, Response, status
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime, timezone

from ..db import session
from ..scopes import wallet_scopes
from .. import schemas
from .auth import get_current_user

router = APIRouter(prefix="/wallet", tags=["wallet"])

@router.post("/send-money", response_model=schemas.SendMoneyResponse)
def send_money(
    request: schemas.SendMoneyRequest,
    db: Session = Depends(session.get_db),
    response: Response = None,
    current_user=Depends(get_current_user)
):
    reference, message = wallet_scopes.send_money(
        db=db,
        sender_id=current_user.id,
        amount=request.amount,
        payment_type=request.payment_type,
        phone_number=request.phone_number,
        bank_code=request.bank_code,
        bank_account_number=request.bank_account_number,
        description=request.description
    )

    if not reference:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return schemas.SendMoneyResponse(success=False, message=message)

    response.status_code = status.HTTP_200_OK
    return schemas.SendMoneyResponse(success=True, message=message, reference=reference)