from pydantic import BaseModel, EmailStr, condecimal, Field
from decimal import Decimal
from typing import Optional, Annotated, List, Dict, Any
from enum import Enum
from datetime import datetime

#enums below
class RoleEnum(str, Enum):
    user = "user"
    merchant = "merchant"

class TransactionType(str, Enum):
    debit = "debit"
    credit = "credit"

class TransactionStatus(str, Enum):
    pending = "pending"
    successful = "successful"
    failed = "failed"
    reversed = "reversed"

class TransactionFeature(str, Enum):
    wallet = "wallet"
    voice_pay = "voice-pay"
    face_pay = "face-pay"
    chat_pay = "chat-pay"
    transfer = "transfer"


#schemas below
class LoginRequest(BaseModel):
    # email: EmailStr
    email: str
    password: str

class LoginResponseData(BaseModel):
    email: str
    balance: Decimal
    #more fields?

    model_config = {
        "from_attributes": True
    }


class LoginResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    data: Optional[LoginResponseData] = None

class RegisterRequest(BaseModel):
    username: Optional[str]
    first_name: str
    last_name: str
    phone_number: str
    email: str
    password: str
    role: RoleEnum
    business_name: Optional[str]
    business_category: Optional[str]
    business_type: Optional[str]
    business_address: Optional[str]
    business_phone: Optional[str]
    business_website: Optional[str]
    business_estimated_revenue: Optional[Decimal]
    business_description: Optional[str]


class RegisterResponseData(BaseModel):
    email: str
    balance: Decimal
    first_name: str
    last_name: str
    role: str
    #more fields?

    model_config = {
        "from_attributes": True
    }


class RegisterResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    data: Optional[RegisterResponseData] = None



class UserResponseData(BaseModel):
    email: EmailStr
    balance: Decimal
    #more fields?

    model_config = {
        "from_attributes": True
    }


class UserResponse(BaseModel):
    success: bool
    message: str
    data: UserResponseData



class DashboardData(BaseModel):
    email: EmailStr
    this_month_balance: Decimal
    this_month_percentage: float
    transactions_no: int
    transactions_percentage: float

    model_config = {
        "from_attributes": True
    }


class DashboardResponse(BaseModel):
    success: bool
    message: str
    data: DashboardData



class TransactionData(BaseModel):
    description: Optional[str]
    amount: Decimal
    type: TransactionType
    date: str
    reference: str
    status: TransactionStatus
    feature: str

    model_config = {
        "from_attributes": True
    }


class TransactionsResponse(BaseModel):
    success: bool
    message: str
    data: Optional[List[TransactionData]] = None



class SendMoneyRequest(BaseModel):
    amount: Decimal
    payment_type: str  #internal | external
    phone_number: Optional[str]
    bank_code: Optional[str]
    bank_account_number: Optional[str]
    description: Optional[str]

class SendMoneyResponse(BaseModel):
    success: bool
    message: str
    reference: Optional[str] = None



class BiometricFacePayRequest(BaseModel):
    phone_number: str
    amount: Decimal
    description: Optional[str]
    media: Dict[str, str]
    location: Dict[str, str]

class BiometricTransactionData(BaseModel):
    amount: Decimal
    description: Optional[str]
    transaction_id: str
    timestamp: str
    status: str

    model_config = {
        "from_attributes": True
    }


class BiometricFacePayResponse(BaseModel):
    success: bool
    message: str
    reference: Optional[str] = None
    data: Optional[BiometricTransactionData] = None
    verification_required: Optional[bool] = False


class BiometricVerifyRequest(BaseModel):
    reference: str
    method: str  #face | voice

class BiometricApproveRequest(BaseModel):
    reference: str
    method: str  #face | voice

class BiometricResponse(BaseModel):
    success: bool
    message: str
    reference: str
    data: Optional[BiometricTransactionData] = None