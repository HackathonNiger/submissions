from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .services.setup_service import initialize_faiss, add_embedding_to_index
from .api import auth, user, dashboard, transactions, wallet, biometric
from .db.session import engine, Base, get_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    #first create all the db models
    Base.metadata.create_all(bind=engine)
    print("Database tables created")

    #second, initialize faisswhat 
    initialize_faiss()
    print("Faiss index initialized")
    
    yield

    print("Terminating backend...")


app = FastAPI(title="GestPay-Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(user.router)
app.include_router(dashboard.router)
app.include_router(transactions.router)
app.include_router(wallet.router)
app.include_router(biometric.router)

