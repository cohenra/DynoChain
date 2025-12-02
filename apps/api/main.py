from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import uuid
import json
from sqlalchemy import create_engine, Column, String, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn

# --- 1. Database Setup (SQLite for MVP) ---
# We use SQLite for simplicity. The file will be created in the current directory.
SQLALCHEMY_DATABASE_URL = "sqlite:///./wms_mvp.db"

# check_same_thread=False is required for SQLite interactions within FastAPI endpoints
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- 2. Database Models ---
class ProductModel(Base):
    __tablename__ = "products"

    # We use String for ID because we generate UUIDs manually
    id = Column(String, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    name = Column(String)
    barcode = Column(String)
    
    # This is the "Smart SKU" magic. 
    # It stores the JSON object with storage rules, VAS instructions, etc.
    # In SQLite, SQLAlchemy handles serialization automatically.
    custom_attributes = Column(JSON) 

# Create the tables in the database
Base.metadata.create_all(bind=engine)

# --- 3. Pydantic Schemas (Data Validation) ---
# This defines what the Frontend MUST send to us.
class ProductCreate(BaseModel):
    sku: str
    name: str
    barcode: str
    # 'custom_attributes' receives the nested JSON object from the React form
    custom_attributes: Dict[str, Any]

class ProductResponse(ProductCreate):
    id: str

    class Config:
        orm_mode = True

# --- 4. FastAPI Application Setup ---
app = FastAPI(title="LogiSnap API")

# CRITICAL: CORS Middleware
# This allows the React app (running on port 5173) to talk to this Python API (port 8000)
# without the browser blocking the request.
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- 5. API Endpoints ---

@app.get("/")
def read_root():
    return {"status": "LogiSnap API is running and healthy"}

@app.get("/api/products", response_model=List[ProductResponse])
def get_products(db: Session = Depends(get_db)):
    """
    Fetch all products from the database.
    """
    return db.query(ProductModel).all()

@app.post("/api/products", response_model=ProductResponse)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product with dynamic attributes.
    """
    # 1. Check if SKU already exists
    existing_product = db.query(ProductModel).filter(ProductModel.sku == product.sku).first()
    if existing_product:
        raise HTTPException(status_code=400, detail="SKU already exists in the catalog")

    # 2. Generate a new UUID
    new_id = str(uuid.uuid4())

    # 3. Create the database record
    db_product = ProductModel(
        id=new_id,
        sku=product.sku,
        name=product.name,
        barcode=product.barcode,
        custom_attributes=product.custom_attributes # SQLAlchemy saves this as JSON
    )

    # 4. Save to DB
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    
    return db_product

# --- 6. Server Entry Point ---
if __name__ == "__main__":
    # Runs the server on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
