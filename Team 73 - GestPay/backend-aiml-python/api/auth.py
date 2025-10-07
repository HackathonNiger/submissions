from fastapi import APIRouter, Depends, HTTPException, Response, status, Form, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from deepface import DeepFace
import numpy as np
from decimal import Decimal
import tempfile
import os

from ..services.setup_service import add_embedding_to_index
from ..scopes import jwt_scopes
from ..utils import security
from ..db.session import SessionLocal, get_db
from .. import models
from .. import schemas
from ..config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(db: Session = Depends(get_db), token:  str = Depends(oauth2_scheme)):
    print("AUTH HEADER:", token)
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")
    print("passed here")
    # token = authorization.split(" ")[1] if " " in authorization else authorization
    try:
        print("inside try")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print("about to print")
        print(payload)
        user_id_str: str = payload.get("sub")
        user_id = int(user_id_str)
        print("passed after inside")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except JWTError as e:
        print(f"JWTError: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


# @router.post("/signup", response_model=schemas.RegisterResponse)
# def signup(user: schemas.RegisterRequest, db: Session = Depends(get_db), response: Response = None):
#     existing = db.query(models.User).filter(models.User.email == user.email).first()
#     if existing:
#         response.status_code = status.HTTP_409_CONFLICT
#         return schemas.RegisterResponse(
#             success=False,
#             message="Signup Failed. This email is already registered",
#         )        
#     print(f"Password: {user.password}")
#     password_hash = security.hash_password(user.password)
    
#     # db_user = models.User(
#     #     first_name=user.first_name,
#     #     last_name=user.last_name,
#     #     phone_number=user.phone_number,
#     #     email=user.email,
#     #     password_hash=password_hash,
#     #     role=user.role,
#     # )
#     db_user = models.User(
#         first_name=user.first_name,
#         last_name=user.last_name,
#         username=user.username,
#         email=user.email, 
#         password_hash=password_hash,
#         pin_hash=pin_hash,
#         virtual_account_number=user.virtual_account_number,
#         virtual_account_bank=user.virtual_account_bank,
#         virtual_account_name=user.virtual_account_name,
#         virtual_account_reference=user.virtual_account_reference,
#         latitude=user.latitude,
#         longitude=user.longitude,
#         encoded_face=encoded_face,
#         encoded_voice=encoded_voice,
#         phone_number=user.phone_number,
#         last_login=user.last_login,
#         last_ip=user.last_ip,

#         allow_face_payments=user.allow_face_payments,
#         allow_voice_payments=user.allow_voice_payments,
#         allow_whatsapp_payments=user.allow_whatsapp_payments,
#         allow_telegram_payments=user.allow_telegram_payments,
#         always_confirm_payment=user.always_confirm_payment,
#         role=user.role
#     )
#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)

#     db_wallet = models.Wallet(
#         user_id=db_user.id, 
#         balance=0.00,
#         currency="NGN"
#     )
#     db.add(db_wallet)
#     db.commit()
#     db.refresh(db_wallet)


#     token, expires_at = security.create_access_token({"sub": str(db_user.id)})

#     data=schemas.RegisterResponseData.model_validate(db_user)
#     data.balance = db_wallet.balance
    
#     jwt_scopes.create_jwt(db=db_user, user_id=db_user.id, token=token, expires_at=expires_at)

#     #add newly registered user to faiss index
#     add_embedding_to_index(db_user.id, db_user.encoded_face)

#     response.headers["Authorization"] = f"Bearer {token}"
#     response.status_code = status.HTTP_201_CREATED

#     return schemas.RegisterResponse(
#         success=True,
#         message="Signup Successful",
#         token=token,
#         data=data
#     )


@router.post("/signup", response_model=schemas.RegisterResponse)
async def signup(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone_number: str = Form(...),
    role: str = Form(...),
    username: str = Form(None),
    pin: str = Form(None),
    virtual_account_number: str = Form(None),
    virtual_account_bank: str = Form(None),
    virtual_account_name: str = Form(None),
    virtual_account_reference: str = Form(None),
    latitude: str = Form(None),
    longitude: str = Form(None),
    allow_face_payments: bool = Form(True),
    allow_voice_payments: bool = Form(False),
    allow_whatsapp_payments: bool = Form(False),
    allow_telegram_payments: bool = Form(False),
    always_confirm_payment: bool = Form(True),
    face_image: UploadFile = File(None),
    voice_sample: UploadFile = File(None),
    db: Session = Depends(get_db),
    response: Response = None
):
    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        response.status_code = status.HTTP_409_CONFLICT
        return schemas.RegisterResponse(
            success=False,
            message="Signup Failed. This email is already registered"
        )

    password_hash = security.hash_password(password)
    pin_hash = security.hash_password(pin) if pin else None

    encoded_face, encoded_voice = None, None

    #for faces
    # if face_image:
    #     face_bytes = await face_image.read()
    #     with open("temp_face.jpg", "wb") as f:
    #         f.write(face_bytes)
    #     try:
    #         face_data = DeepFace.represent(img_path="temp_face.jpg", model_name="Facenet")
    #         encoded_face = np.array(face_data[0]["embedding"], dtype=np.float32).tolist()
    #     except Exception as e:
    #         print(f"Face embedding failed: {e}")
    #         encoded_face = None
    if face_image:
        face_bytes = await face_image.read()
        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tmp:
            tmp.write(face_bytes)
            tmp_path = tmp.name

        try:
            face_data = DeepFace.represent(img_path=tmp_path, model_name="Facenet")
            encoded_face = np.array(face_data[0]["embedding"], dtype=np.float32).tolist()
        except Exception as e:
            print(f"Face embedding failed: {e}")
            encoded_face = None
        finally:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)

    #for voices
    if voice_sample:
        #WIP...
        encoded_voice = None

    db_user = models.User(
        username=username,
        first_name=first_name,
        last_name=last_name,
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
        last_login=datetime.now(timezone.utc),
        last_ip=None,
        allow_face_payments=allow_face_payments,
        allow_voice_payments=allow_voice_payments,
        allow_whatsapp_payments=allow_whatsapp_payments,
        allow_telegram_payments=allow_telegram_payments,
        always_confirm_payment=always_confirm_payment,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    db_wallet = models.Wallet(
        user_id=db_user.id,
        balance=Decimal("0.00"),
        currency="NGN"
    )
    db.add(db_wallet)
    db.commit()
    db.refresh(db_wallet)

    token, expires_at = security.create_access_token(subject=str(db_user.id))

    jwt_scopes.create_jwt(db=db, user_id=db_user.id, token=token, expires_at=expires_at)

    #add embedding to faiss index
    if encoded_face:
        add_embedding_to_index(db_user.id, encoded_face)

    # data = schemas.RegisterResponseData.model_validate(db_user)
    # data.balance = db_wallet.balance

    data = schemas.RegisterResponseData(
        email=db_user.email,
        balance=db_wallet.balance,
        first_name=db_user.first_name,
        last_name=db_user.last_name,
        role=db_user.role
    )

    response.headers["Authorization"] = f"Bearer {token}"
    response.status_code = status.HTTP_201_CREATED

    return schemas.RegisterResponse(
        success=True,
        message="Signup Successful",
        token=token,
        data=data
    )

@router.post("/login", response_model=dict)
# def login(email: str = Form(..., alias="username"), password: str = Form(...), db: Session = Depends(get_db), response: Response = None):
def login(username: str = Form(...), password: str = Form(...), db: Session = Depends(get_db), response: Response = None):
    db_user = db.query(models.User).filter(models.User.email == username).first()

    if not db_user or not security.verify_password(password, db_user.password_hash):
        response.status_code = status.HTTP_401_UNAUTHORIZED
        # return schemas.LoginResponse(
        #     success=False,
        #     message="Invalid credentials, please try again.",
        #     token=None,
        #     data=None
        # )

        return {
            "success": "false",
            "message": "Invalid credentials, please try again.",
            "token": None,
            "data": None
        }

    token, expires_at = security.create_access_token(subject=str(db_user.id))

    decoded = security.decode_access_token(token)
    print(decoded)

    db_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == db_user.id).first()
    
    # data = schemas.LoginResponseData(
    #     email=db_user.email,
    #     balance=db_wallet.balance
    # )
    
    data = {
        "email": db_user.email,
        "balance": db_wallet.balance
    }

    jwt_scopes.create_jwt(db=db, user_id=db_user.id, token=token, expires_at=expires_at)

    # response.headers["Authorization"] = f"Bearer {token}"
    response.status_code = status.HTTP_200_OK

    # return schemas.LoginResponse(
    #     success=True,
    #     message="Login successful",
    #     token=token,
    #     data=data
    # )

    return {
        "access_token": token,
        "token_type": "bearer",
        "success": True,
        "message": "Login successful",
        "data": data
    }
