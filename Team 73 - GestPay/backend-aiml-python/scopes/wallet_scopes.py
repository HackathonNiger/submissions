import uuid
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime, timezone

from .. import models

def get_wallet_by_user_id(db: Session, user_id: int):
    return db.query(models.Wallet).filter(models.Wallet.user_id == user_id).first()

def get_wallet_by_id_for_update(db: Session, wallet_id: int):
    #lock for safe concurrent updates
    return db.query(models.Wallet).filter(models.Wallet.id == wallet_id).with_for_update().first()

def update_balance(db: Session, wallet: models.Wallet, new_balance):
    wallet.balance = new_balance
    db.add(wallet)
    db.flush()
    return wallet

def send_money(
    db: Session,
    sender_id: int,
    amount: Decimal,
    payment_type: str,
    phone_number: str | None = None,
    bank_code: str | None = None,
    bank_account_number: str | None = None,
    description: str | None = None,
):
    #check sender wallet
    sender_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == sender_id).first()
    if not sender_wallet or sender_wallet.balance < amount:
        return None, "Insufficient funds"

    reference = f"TXN-{uuid.uuid4().hex[:10].upper()}"
    sender_wallet.balance -= amount

    #internal transfer
    if payment_type == "internal" and phone_number:
        recipient = db.query(models.User).filter(models.User.phone_number == phone_number).first()
        if not recipient:
            return None, "Recipient not found"

        recipient_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == recipient.id).first()
        if not recipient_wallet:
            return None, "Recipient wallet not found"

        recipient_wallet.balance += amount
        txn_type = "internal"

        #create recipient transaction
        recipient_txn = models.Transaction(
            sender_wallet_id=recipient.id,
            reference=f"TXN-{uuid.uuid4().hex[:10].upper()}",
            amount=amount,
            feature="wallet",
            type="credit",
            status="successful",
            description=description or f"Received money from {sender_wallet.user.first_name if sender_wallet.user else 'another user'}",
            created_at=datetime.now(timezone.utc)
        )
        db.add(recipient_txn)

        notification = models.Notification(
            user_id=recipient.id,
            # title="Incoming Transfer",
            content=f"You just received ₦{amount} from {sender_wallet.user.first_name} {sender_wallet.user.last_name}.",
            type="wallet",
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notification)


    else:
        #external transfer
        txn_type = "external"
        #WIP...

    sender_txn = models.Transaction(
        sender_wallet_id=sender_id,
        reference=reference,
        amount=amount,
        feature="transfer",
        type="debit",
        status="successful",
        description=description or f"Transfered {amount} ({txn_type})",
        created_at=datetime.now(timezone.utc)
    )

    db.add(sender_txn)

    db.commit()
    db.refresh(sender_txn)

    return reference, "Transfer successful"