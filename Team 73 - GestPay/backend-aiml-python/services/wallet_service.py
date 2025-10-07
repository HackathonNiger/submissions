from sqlalchemy.orm import Session
from decimal import Decimal

from ..scopes import wallet_scopes, transaction_scopes, user_scopes
from .. import models

def get_wallet(db: Session, user_id: int):
    return wallet_scopes.get_wallet_by_user_id(db, user_id)

def transfer(db: Session, from_user_id: int, to_email: str, amount: Decimal):
    #perform in a DB transaction and lock both wallets
    to_user = user_scopes.get_user_by_email(db, to_email)
    if not to_user:
        raise ValueError("Destination user not found")
    from_wallet = wallet_scopes.get_wallet_by_user_id(db, from_user_id)
    to_wallet = wallet_scopes.get_wallet_by_user_id(db, to_user.id)

    if from_wallet.id == to_wallet.id:
        raise ValueError("Cannot transfer to same wallet")

    with db.begin():  #begin transaction
        #lock rows
        fw = db.query(models.Wallet).filter(models.Wallet.id == from_wallet.id).with_for_update().one()
        tw = db.query(models.Wallet).filter(models.Wallet.id == to_wallet.id).with_for_update().one()

        if fw.balance < amount:
            raise ValueError("Insufficient funds")
        fw.balance = fw.balance - amount
        tw.balance = tw.balance + amount
        db.add(fw); db.add(tw)

        #create tx records
        transaction_scopes.create_transaction(db, wallet_id=fw.id, t_type="transfer_out", amount=amount, status="success")
        transaction_scopes.create_transaction(db, wallet_id=tw.id, t_type="transfer_in", amount=amount, status="success")
    return True
