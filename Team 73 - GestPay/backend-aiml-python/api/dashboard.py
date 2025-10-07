from fastapi import APIRouter, Depends, HTTPException, Header, Response, status
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime

from ..db.session import SessionLocal
from .. import schemas
from .. import models
from .auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_dashboard_data(db: Session, user_id: int):
    current_month = datetime.now().month
    current_year = datetime.now().year

    #total balance
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user_id).first()
    this_month_balance = wallet.balance if wallet else 0

    #transactions this month
    monthly_transactions = (
        db.query(models.Transaction)
        .filter(
            models.Transaction.sender_wallet_id == user_id,
            extract('month', models.Transaction.created_at) == current_month,
            extract('year', models.Transaction.created_at) == current_year,
        )
        .all()
    )

    transactions_no = len(monthly_transactions)

    #total number of transactions (for percentage comparison)
    total_transactions = db.query(models.Transaction).filter(models.Transaction.sender_wallet_id == user_id).count()

    transactions_percentage = (
        (transactions_no / total_transactions * 100) if total_transactions > 0 else 0
    )

    #total amount transacted this month
    this_month_total = sum(t.amount for t in monthly_transactions if t.status == "successful")

    #compare with last month’s total
    last_month = current_month - 1 if current_month > 1 else 12
    last_month_total = (
        db.query(func.sum(models.Transaction.amount))
        .filter(
            models.Transaction.sender_wallet_id == user_id,
            extract('month', models.Transaction.created_at) == last_month,
            extract('year', models.Transaction.created_at) == current_year,
            models.Transaction.status == "successful",
        )
        .scalar()
        or 0
    )

    this_month_percentage = (
        ((this_month_total - last_month_total) / last_month_total * 100)
        if last_month_total > 0 else 100
    )

    return {
        "this_month_balance": this_month_balance,
        "this_month_percentage": this_month_percentage,
        "transactions_no": transactions_no,
        "transactions_percentage": transactions_percentage,
    }


@router.get("/dashboard", response_model=schemas.DashboardResponse)
def get_dashboard(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = get_dashboard_data(db, current_user.id)
    data["email"] = current_user.email
    return schemas.DashboardResponse(
        success=True,
        message="Successful",
        data=data
    )


