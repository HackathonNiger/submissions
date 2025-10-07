from sqlalchemy.orm import Session
from .. import models

def create_transaction(db: Session, user_id: int, t_type: str, feature: str, amount, status: str = "pending", reference: str | None = None, description: str | None = None):
    tx = models.Transaction(user_id=user_id, type=t_type, amount=amount, feature=feature, status=status, reference=reference, description=description)
    db.add(tx)
    db.flush()
    return tx

def get_by_reference(db: Session, reference: str):
    return db.query(models.Transaction).filter(models.Transaction.reference == reference).first()

def get_transactions_by_user(db: Session, user_id: int):
    return (
        db.query(models.Transaction)
        .filter(models.Transaction.sender_wallet_id == user_id)
        .order_by(models.Transaction.created_at.desc())
        .all()
    )