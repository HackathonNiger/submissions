from sqlalchemy.orm import Session
from .. import models

def create_jwt(db: Session, user_id: int, token: str, expires_at: str):
    jwt_entry = models.JWT(
        user_id=user_id,
        token=token,
        expires_at=expires_at
    )
    db.add(jwt_entry)
    db.commit()
    db.refresh(jwt_entry)