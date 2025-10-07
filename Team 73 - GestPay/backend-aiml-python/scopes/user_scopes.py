from sqlalchemy.orm import Session

from .. import models

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_phone_number(db: Session, phone_number: str):
    return db.query(models.User).filter(models.User.phone_number == phone_number).first()

def create_user(
        db: Session, 
        first_name: str, 
        last_name: str, 
        username: str | None,
        email: str, 
        password_hash: str, 
        pin_hash: str,
        virtual_account_number: str,
        virtual_account_bank: str,
        virtual_account_name: str,
        virtual_account_reference: str,
        latitude: str,
        longitude: str,
        encoded_face: list | None,
        encoded_voice: list | None,
        phone_number: str,
        last_login: int,
        last_ip: str | None,

        allow_face_payments: bool | None = True,
        allow_voice_payments: bool | None = True,
        allow_whatsapp_payments: bool | None = True,
        allow_telegram_payments: bool | None = True,
        always_confirm_payment: bool | None = True,
        role: str | None = "user"):
    
    user = models.User(
        first_name=first_name,
        last_name=last_name,
        username=username,
        email=email, 
        password_hash=password_hash,
        pin_hash=pin_hash,
        virtual_account_number=virtual_account_number,
        virtual_account_bank=virtual_account_bank,
        virtual_account_name=virtual_account_name,
        virtual_account_reference=virtual_account_reference,
        latitude=latitude,
        longitude=longitude,
        encoded_face=encoded_face,
        encoded_voice=encoded_voice,
        phone_number=phone_number,
        last_login=last_login,
        last_ip=last_ip,

        allow_face_payments=allow_face_payments,
        allow_voice_payments=allow_voice_payments,
        allow_whatsapp_payments=allow_whatsapp_payments,
        allow_telegram_payments=allow_telegram_payments,
        always_confirm_payment=always_confirm_payment,
        role=role
    )
    
    db.add(user)

    wallet = models.Wallet(user_id=user.id, balance=0.00)
    db.add(wallet)

    db.commit()
    db.refresh(user)
    return user
