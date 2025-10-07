from sqlalchemy import Column, Integer, String, Numeric, Float, ForeignKey, DateTime, Boolean, Text, func, Enum as SqlEnum, TIMESTAMP, text, UniqueConstraint, Index, JSON
from sqlalchemy import Enum as SAEnum
# from sqlalchemy.dialects.postgresql import ENUM
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship
from enum import Enum as PyEnum
import datetime
from sqlalchemy import text, inspect
from sqlalchemy.orm import declarative_base, Session

from .db.session import Base

# enums below
class RoleEnum(str, PyEnum):
    USER = "user"
    MERCHANT = "merchant"

class FeatureEnum(str, PyEnum):
    WALLET = "wallet"
    VOICE_PAY = "voice-pay"
    FACE_PAY = "face-pay"
    CHAT_PAY = "chat-pay"
    TRANSFER = "transfer"

class TransactionTypeEnum(str,PyEnum):
    DEBIT = "debit"
    CREDIT = "credit"

class TransactionStatusEnum(str, PyEnum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"
    REVERSED = "reversed"
    PROBABLE_SCAM = "probable_scam"

class NotificationTypeEnum(str, PyEnum):
    GENERAL = "general"
    WALLET = "wallet"
    SECURITY = "security"

# models below
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(255))
    last_name = Column(String(255))
    username = Column(String(25), nullable=False, unique=True)
    email = Column(String(100), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    # balance = Column(Numeric(15, 2), nullable=False, server_default=text("0.00"))
    allow_face_payments = Column(Boolean, nullable=False, server_default=text("1"))
    allow_voice_payments = Column(Boolean, nullable=False, server_default=text("1"))
    allow_whatsapp_payments = Column(Boolean, nullable=False, server_default=text("1"))
    allow_telegram_payments = Column(Boolean, nullable=False, server_default=text("1"))
    always_confirm_payment = Column(Boolean, nullable=False, server_default=text("1"))
    pin_hash = Column(String(255))
    virtual_account_number = Column(String(25))
    virtual_account_bank = Column(String(50))
    virtual_account_name = Column(String(50))
    virtual_account_reference = Column(String(255))
    latitude = Column(String(255), nullable=False)
    longitude = Column(String(255), nullable=False)
    # role = Column(Enum(RoleEnum, name="role_enum"), nullable=False, server_default="user")
    role = Column(SAEnum(RoleEnum), nullable=False, server_default="user")
    # encoded_face = Column(ARRAY(Float))
    # encoded_voice = Column(ARRAY(Float))
    encoded_face = Column(JSON)
    encoded_voice = Column(JSON)
    phone_number = Column(String(15), index=True)
    last_login = Column(Integer, nullable=False)
    last_ip = Column(String(100))
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
    updated_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    wallet = relationship("Wallet", back_populates="user", uselist=False)
    # transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    jwt_tokens = relationship("JWT", back_populates="user", cascade="all, delete-orphan")


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    sender_wallet_id = Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    receiver_wallet_id =  Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE", onupdate="CASCADE"), index=True)
    reference = Column(String(255), nullable=False, unique=True)
    amount = Column(Numeric(15, 2), nullable=False)
    # feature = Column(Enum(FeatureEnum, name="feature_enum"), nullable=False)
    feature = Column(SAEnum(FeatureEnum), nullable=False)
    # type = Column(Enum(TransactionTypeEnum, name="type_enum"), nullable=False, index=True)
    type = Column(SAEnum(TransactionTypeEnum), nullable=False, index=True)
    status = Column(SAEnum(TransactionStatusEnum), nullable=False, server_default="pending", index=True)
    description = Column(Text)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), index=True)
    updated_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

    # user = relationship("User", back_populates="transactions")
    notifications = relationship("Notification", back_populates="transaction", cascade="all, delete-orphan")
    sender_wallet = relationship("Wallet", foreign_keys=[sender_wallet_id], back_populates="sent_transactions")
    receiver_wallet = relationship("Wallet", foreign_keys=[receiver_wallet_id], back_populates="received_transactions")

class Wallet(Base):
    __tablename__ = "wallets"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    balance = Column(Numeric(15, 2), nullable=False, server_default=text("0.00"))
    currency = Column(String(3), default="NGN")
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="wallet")
    sent_transactions = relationship("Transaction", foreign_keys=[Transaction.sender_wallet_id], back_populates="sender_wallet")
    received_transactions = relationship("Transaction", foreign_keys=[Transaction.receiver_wallet_id], back_populates="receiver_wallet")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    content = Column(Text, nullable=False)
    type = Column(SAEnum(NotificationTypeEnum), nullable=False)
    transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="SET NULL", onupdate="CASCADE"), index=True)
    is_read = Column(Boolean, nullable=False, server_default=text("0"))
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), index=True)

    user = relationship("User", back_populates="notifications")
    transaction = relationship("Transaction", back_populates="notifications")

class JWT(Base):
    __tablename__ = "jwt"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    token = Column(Text)
    expires_at = Column(TIMESTAMP, nullable=False, index=True)
    created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())

    user = relationship("User", back_populates="jwt_tokens")

    __table_args__ = (
        UniqueConstraint("token"),
    )



















# from sqlalchemy import Column, Integer, String, Numeric, Float, ForeignKey, DateTime, Boolean, Text, func, Enum as SqlEnum, TIMESTAMP, text, UniqueConstraint, Index, JSON
# from sqlalchemy import Enum
# # from sqlalchemy.dialects.postgresql import ENUM
# from sqlalchemy.dialects.postgresql import ARRAY
# from sqlalchemy.orm import relationship
# from enum import Enum
# import datetime
# from sqlalchemy import text, inspect
# from sqlalchemy.orm import declarative_base, Session

# from .db.session import Base

# #enums below
# class RoleEnum(str): 
#     USER = "user" 
#     MERCHANT = "merchant"

# class FeatureEnum(str):
#     WALLET = "wallet"
#     VOICE_PAY = "voice-pay"
#     FACE_PAY = "face-pay"
#     CHAT_PAY = "chat-pay"
#     TRANSFER = "transfer"

# class TransactionTypeEnum(str):
#     DEBIT = "debit"
#     CREDIT = "credit"

# class TransactionStatusEnum(str):
#     PENDING = "pending"
#     SUCCESSFUL = "successful"
#     FAILED = "failed"
#     REVERSED = "reversed"
#     PROBABLE_SCAM = "probable_scam"

# class NotificationTypeEnum(str):
#     GENERAL = "general"
#     WALLET = "wallet"
#     SECURITY = "security"

# #models below
# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     first_name = Column(String(255))
#     last_name = Column(String(255))
#     username = Column(String(25), nullable=False, unique=True)
#     email = Column(String(100), nullable=False, unique=True)
#     password_hash = Column(String(255), nullable=False)
#     # balance = Column(Numeric(15, 2), nullable=False, server_default=text("0.00"))
#     allow_face_payments = Column(Boolean, nullable=False, server_default=text("1"))
#     allow_voice_payments = Column(Boolean, nullable=False, server_default=text("1"))
#     allow_whatsapp_payments = Column(Boolean, nullable=False, server_default=text("1"))
#     allow_telegram_payments = Column(Boolean, nullable=False, server_default=text("1"))
#     always_confirm_payment = Column(Boolean, nullable=False, server_default=text("1"))
#     pin_hash = Column(String(255))
#     virtual_account_number = Column(String(25))
#     virtual_account_bank = Column(String(50))
#     virtual_account_name = Column(String(50))
#     virtual_account_reference = Column(String(255))
#     latitude = Column(String(255), nullable=False)
#     longitude = Column(String(255), nullable=False)
#     role = Column(SqlEnum(RoleEnum.USER, RoleEnum.MERCHANT, name="role_enum"), nullable=False, server_default="user")
#     # encoded_face = Column(ARRAY(Float))
#     # encoded_voice = Column(ARRAY(Float))
#     encoded_face = Column(JSON)
#     encoded_voice = Column(JSON)
#     phone_number = Column(String(15), index=True)
#     last_login = Column(Integer, nullable=False)
#     last_ip = Column(String(100))
#     created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())
#     updated_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

#     wallet = relationship("Wallet", back_populates="user", uselist=False)
#     # transactions = relationship("Transaction", back_populates="user", cascade="all, delete-orphan")
#     notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
#     jwt_tokens = relationship("JWT", back_populates="user", cascade="all, delete-orphan")

# class Wallet(Base):
#     __tablename__ = "wallets"
#     id = Column(Integer, primary_key=True)
#     user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
#     balance = Column(Numeric(15, 2), nullable=False, server_default=text("0.00"))
#     currency = Column(String(3), default="NGN")
#     updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

#     user = relationship("User", back_populates="wallet")
#     sent_transactions = relationship("Transaction", foreign_keys=[lambda: Transaction.sender_wallet_id], back_populates="sender_wallet")
#     received_transactions = relationship("Transaction", foreign_keys=[lambda: Transaction.receiver_wallet_id], back_populates="receiver_wallet")

# class Transaction(Base):
#     __tablename__ = "transactions"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     sender_wallet_id = Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
#     receiver_wallet_id =  Column(Integer, ForeignKey("wallets.id", ondelete="CASCADE", onupdate="CASCADE"), index=True)
#     reference = Column(String(255), nullable=False, unique=True)
#     amount = Column(Numeric(15, 2), nullable=False)
#     feature = Column(SqlEnum(
#         FeatureEnum.WALLET,
#         FeatureEnum.VOICE_PAY,
#         FeatureEnum.FACE_PAY,
#         FeatureEnum.CHAT_PAY,
#         FeatureEnum.TRANSFER,
#         name="feature_enum"
#     ), nullable=False)
#     type = Column(SqlEnum(TransactionTypeEnum.DEBIT, TransactionTypeEnum.CREDIT, name="type_enum"), nullable=False, index=True)
#     status = Column(SqlEnum(
#         TransactionStatusEnum.PENDING,
#         TransactionStatusEnum.SUCCESSFUL,
#         TransactionStatusEnum.FAILED,
#         TransactionStatusEnum.REVERSED,
#         TransactionStatusEnum.PROBABLE_SCAM,
#         name="status_enum"
#     ), nullable=False, server_default="pending", index=True)
#     description = Column(Text)
#     created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), index=True)
#     updated_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), onupdate=func.current_timestamp())

#     # user = relationship("User", back_populates="transactions")
#     notifications = relationship("Notification", back_populates="transaction", cascade="all, delete-orphan")
#     sender_wallet = relationship("Wallet", foreign_keys=[sender_wallet_id], back_populates="sent_transactions")
#     receiver_wallet = relationship("Wallet", foreign_keys=[receiver_wallet_id], back_populates="received_transactions")



# class Notification(Base):
#     __tablename__ = "notifications"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
#     content = Column(Text, nullable=False)
#     type = Column(SqlEnum(NotificationTypeEnum.GENERAL, NotificationTypeEnum.WALLET, NotificationTypeEnum.SECURITY, name="notification_enum"), nullable=False)
#     transaction_id = Column(Integer, ForeignKey("transactions.id", ondelete="SET NULL", onupdate="CASCADE"), index=True)
#     is_read = Column(Boolean, nullable=False, server_default=text("0"))
#     created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp(), index=True)

#     user = relationship("User", back_populates="notifications")
#     transaction = relationship("Transaction", back_populates="notifications")


# class JWT(Base):
#     __tablename__ = "jwt"

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
#     token = Column(Text)
#     expires_at = Column(TIMESTAMP, nullable=False, index=True)
#     created_at = Column(TIMESTAMP, nullable=False, server_default=func.current_timestamp())

#     user = relationship("User", back_populates="jwt_tokens")

#     __table_args__ = (
#         UniqueConstraint("token"),
#     )
