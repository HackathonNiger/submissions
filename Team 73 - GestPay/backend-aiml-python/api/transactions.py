from fastapi import APIRouter, Depends, HTTPException, Header, Response, status
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime

from ..db.session import SessionLocal
from ..scopes import transaction_scopes
from .. import schemas
from .auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/transactions", response_model=schemas.TransactionsResponse)
def get_transactions(
    db: Session = Depends(get_db),
    response: Response = None,
    current_user=Depends(get_current_user)
):
    transactions = transaction_scopes.get_transactions_by_user(db, current_user.id)

    if not transactions:
        response.status_code = status.HTTP_200_OK
        return schemas.TransactionsResponse(
            success=True,
            message="No transactions found",
            data=[]
        )

    # data = [schemas.TransactionData.model_validate(txn) for txn in transactions]


    data = [
        schemas.TransactionData(
            description=txn.description if hasattr(txn, 'description') else None,
            amount=Decimal(str(txn.amount)),
            type=txn.type,
            date=str(txn.updated_at),
            reference=txn.reference,
            status=txn.status,
            feature=txn.feature
        )
        for txn in transactions
    ]


    response.status_code = status.HTTP_200_OK
    return schemas.TransactionsResponse(
        success=True,
        message="Successful",
        data=data
    )
