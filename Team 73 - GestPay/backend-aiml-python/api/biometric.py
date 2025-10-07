from fastapi import APIRouter, Depends, HTTPException, Header, Response, status, Form, File, UploadFile
from sqlalchemy import func, extract
from sqlalchemy.orm import Session
from decimal import Decimal
from datetime import datetime, timezone
import uuid

from ..db.session import SessionLocal
from .. import schemas
from .. import models
from .auth import get_current_user
from ..services import biometric_service
from ..config import settings

router = APIRouter(prefix="/biometric", tags=["biometric"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/face-pay", response_model=schemas.BiometricFacePayResponse)
async def initiate_biometric_face_pay(
    phone_number: str = Form(...),
    amount: Decimal = Form(...),
    description: str = Form(None),
    face_image: UploadFile = File(...),
    latitude: str | float = Form(...),
    longitude: str | float = Form(...),
    db: Session = Depends(get_db),
    response: Response = None
):
    image_bytes = await face_image.read()
    
    #look for a facial match
    match_results = biometric_service.verify_face(image_bytes=image_bytes, db=db)

    print(match_results)

    if match_results["success"] == False:
            match match_results["status"]:
                 case 500: 
                    response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
                    return schemas.BiometricFacePayResponse(
                         success=False,
                         message=match_results["message"]
                    )
                 case 400: 
                    response.status_code = status.HTTP_400_BAD_REQUEST
                    return schemas.BiometricFacePayResponse(
                         success=False,
                         message=match_results["message"]
                    )
                 case 404: 
                    response.status_code = status.HTTP_404_NOT_FOUND
                    return schemas.BiometricFacePayResponse(
                         success=False,
                         message=match_results["message"]
                    )
    
    #get matched user from db
    user_id = match_results["user_id"]
    matched_user = db.query(models.User).filter(models.User.id == user_id).first()

    #get merchant (recipient)
    recipient = db.query(models.User).filter(models.User.phone_number == phone_number).first()
    if not recipient:
        response.status_code = status.HTTP_404_NOT_FOUND
        return schemas.BiometricFacePayResponse(
                success=False,
                message="Recipient not found"
        )

    #check if face payments are enabled by user
    if not matched_user.allow_face_payments:
        response.status_code = status.HTTP_403_FORBIDDEN
        return schemas.BiometricFacePayResponse(
                success=False,
                message="Face payments have been disabled"
        )

    #check if the user's balance is enough to complete the transaction
    if matched_user.wallet.balance < amount:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return schemas.BiometricFacePayResponse(
                success=False,
                message="Insufficient balance"
        )  

    #initiate transaction and mark as pending
    reference = f"TXN-{uuid.uuid4().hex[:10].upper()}"
    tx = models.Transaction(sender_wallet_id=matched_user.wallet.id, receiver_wallet_id=recipient.wallet.id, amount=amount, status="pending", feature="face-pay", type="debit", description=description, reference=reference)

    db.add(tx)
    db.commit()
    db.refresh(tx)

    #run geo-verification
    merchant_lat = float(latitude)
    merchant_long = float(longitude)

    user_lat = float(matched_user.latitude)
    user_long = float(matched_user.longitude)

    close_enough, distance = biometric_service.in_proximity(merchant_lat, merchant_long, user_lat, user_long, max_distance_km=settings.MAX_DISTANCE_THRESHOLD)

    if not close_enough:
        tx.status = "probable_scam"

        response.status_code = status.HTTP_202_ACCEPTED

        data = schemas.BiometricTransactionData(
            amount=amount,
            description=description,
            transaction_id=str(tx.id),
            timestamp=str(datetime.now()),
            status="probable_scam"
        )
        db.add(tx)


        notification = models.Notification(
            user_id=matched_user.id,
            # title="Probable Scam",
            content=f"A transaction was blocked from going through because your device was not within range.",
            type="security",
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notification)

        db.commit()

        return schemas.BiometricFacePayResponse(
                success=False,
                message="Location too far. Further action needed, please check your mobile app.",
                reference=reference,
                verification_required=True,
                data=data
        )

    #check if the user enabled always_confirm_payment
    if matched_user.always_confirm_payment:
        response.status_code = status.HTTP_202_ACCEPTED

        data = schemas.BiometricTransactionData(
            amount=amount,
            description=description,
            transaction_id=str(tx.id),
            timestamp=str(datetime.now()),
            status=tx.status #should be pending
        )
        db.add(tx)

        notification = models.Notification(
            user_id=matched_user.id,
            # title="Confirm payment",
            content=f"Please confirm payment.",
            type="security",
            is_read=False,
            created_at=datetime.now(timezone.utc)
        )
        db.add(notification)

        db.commit()

        return schemas.BiometricFacePayResponse(
                success=False,
                message="Confirmation needed, please check your mobile app.",
                reference=reference,
                verification_required=True,
                data=data
        )     

    #if it reaches here, then the're no restrictions. Mark the transaction as susscessful
    tx.status = "successful"
    tx.sender_wallet.balance -= tx.amount
    tx.receiver_wallet.balance += tx.amount

    response.status_code = status.HTTP_200_OK

    data = schemas.BiometricTransactionData(
        amount=amount,
        description=description,
        transaction_id=str(tx.id),
        timestamp=str(datetime.now()),
        status=tx.status #should be successful
    )
    db.add(tx)

    notification = models.Notification(
        user_id=recipient.id,
        # title="Received Payment",
        content=f"#{amount} received from {matched_user.first_name} {matched_user.last_name}",
        type="wallet",
        is_read=False,
        created_at=datetime.now(timezone.utc)
    )
    db.add(notification)

    db.commit()

    return schemas.BiometricFacePayResponse(
            success=True,
            message="Transaction successful!",
            reference=reference,
            verification_required=False,
            data=data
    )  

#this endpoint is to check the status of a transaction 
@router.post("/verify-payment", response_model=schemas.BiometricResponse)
def verify_payment(request: schemas.BiometricVerifyRequest, db: Session = Depends(get_db), response: Response = None):
    reference = request.reference
    method = request.method

    txn = db.query(models.Transaction).filter(models.Transaction.reference == reference).first()
    
    if not txn:
        response.status_code = status.HTTP_404_NOT_FOUND
        return schemas.BiometricResponse(
            success=False,
            message=f"Transaction with reference {txn} not found",
            reference=reference
        )
    
    response.status_code = status.HTTP_200_OK
    data = schemas.BiometricTransactionData(
        amount=txn.amount,
        description=txn.description,
        transaction_id=str(txn.id),
        timestamp=str(datetime.now()),
        status=txn.status 
    )

    return schemas.BiometricResponse(
        success=True, 
        message="Transaction retreived!",
        reference=reference,
        data=data
    )


@router.post("/approve-payment", response_model=schemas.BiometricResponse)
def verify_payment(request: schemas.BiometricApproveRequest, current_user=Depends(get_current_user), db: Session = Depends(get_db), response: Response = None):
    reference = request.reference
    method = request.method

    txn = db.query(models.Transaction).filter(models.Transaction.reference == reference).first()
    
    if not txn:
        response.status_code = status.HTTP_404_NOT_FOUND
        return schemas.BiometricResponse(
            success=False,
            message=f"Transaction with reference {txn} not found",
            reference=reference
        )
    

    if txn.status == "successful":
        response.status_code = status.HTTP_200_OK
        return schemas.BiometricResponse(
            success=False,
            message=f"Transaction was already successful",
            reference=reference
        )
    
    if txn.status == "pending" or txn.status == "probable_scam":
        #perform plus and minus
        #but check if the sender has enough funds as between when the txn was marked as pending/PS, the sender could have used the money for something else

        if txn.sender_wallet.balance < txn.amount:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return schemas.BiometricResponse(
                    success=False,
                    message="Insufficient balance to approve transaction",
                    reference=reference
            ) 

        txn.sender_wallet.balance -= txn.amount
        txn.receiver_wallet.balance += txn.amount

        #change the status of the transaction to successful
        txn.status = "successful"

        response.status_code = status.HTTP_200_OK
        data = schemas.BiometricTransactionData(
            amount=txn.amount,
            description=txn.description,
            transaction_id=str(txn.id),
            timestamp=str(datetime.now()),
            status=txn.status 
        )

        db.add(txn)
        db.commit()

        return schemas.BiometricResponse(
            success=True, 
            message="Transaction approved successfully!",
            reference=reference,
            data=data
        )

    
    return schemas.BiometricResponse(
        success=False, 
        message="Transaction already handled",
        reference=reference,
        data=data
    )

