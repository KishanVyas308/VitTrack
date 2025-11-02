from fastapi import APIRouter, UploadFile, File, HTTPException, Body, Request
from services.speech_to_text import transcribe_audio
from services.expense_categorizer import categorize_expense
from database import SessionLocal
from models import Expense, Category, User
from schemas import ExpenseCreate, UserBase, UserCreate, UserLogin, UserSearchSchema
import os
import logging
from datetime import datetime
from pydantic import EmailStr, Field, ValidationError
import hashlib

logger = logging.getLogger(__name__)

router = APIRouter()

def hash_password(password: str) -> str:
    """Hash a password using SHA256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return hash_password(plain_password) == hashed_password

@router.post("/process_audio/")
async def process_audio(file: UploadFile = File(...), user_id: int = 1):
    db = SessionLocal()
    # Validate user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if file.filename.split('.')[-1] != "wav":
        raise HTTPException(status_code=400, detail="Only .wav files accepted")
    
    file_path = f"temp_{file.filename}"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
    
    try:
        text = transcribe_audio(file_path)
        logger.info(f"Transcribed text: {text}")
        
        # Step 2: Process text to extract expense data
        expenses_data = categorize_expense(text, user_id)
        logger.info(f"Expense data: {expenses_data}")
        
        # Step 3: Store expenses in database
        db = SessionLocal()
        db_expenses = []
        for expense_data in expenses_data:
            db_expense = Expense(
                user_id=user_id,
                amount=expense_data["amount"],
                description=expense_data["description"],
                category_id=expense_data["category_id"],
                created_at=datetime.fromisoformat(expense_data["created_at"])
            )
            db.add(db_expense)
            db_expenses.append(db_expense)
        db.commit()
        
        # Get the IDs of the newly created expenses
        expense_ids = [expense.id for expense in db_expenses]
        
        return {
            "message": f"{len(expenses_data)} expenses processed and stored successfully",
            "expense_ids": expense_ids
        }
    except Exception as e:
        logger.error(f"Error processing audio: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@router.post("/get_expenses/")
async def get_expenses(user_id: int = Body(..., embed=True)):
    db = SessionLocal()
    try:
        expenses = db.query(Expense).filter(Expense.user_id == user_id).all()
        return expenses
    finally:
        db.close()


@router.post("/expenses/")
async def create_expense(expense: ExpenseCreate):
    """Create a single expense"""
    db = SessionLocal()
    try:
        created_at = expense.created_at if expense.created_at else datetime.now()
        db_expense = Expense(
            user_id=expense.user_id,
            amount=expense.amount,
            description=expense.description,
            category_id=expense.category_id,
            created_at=created_at,
        )
        db.add(db_expense)
        db.flush()
        db.commit()
        db.refresh(db_expense)

        return {
            "id": db_expense.id,
            "user_id": db_expense.user_id,
            "amount": db_expense.amount,
            "description": db_expense.description,
            "category_id": db_expense.category_id,
            "created_at": db_expense.created_at,
        }
    finally:
        db.close()

@router.post("/users/")
async def create_user(user: UserCreate, request: Request):
    try:
        # Add raw request body logging
        raw_body = await request.body()
        logger.info(f"Raw request body: {raw_body.decode()}")
        # Add request logging for debugging
        logger.info(f"Received create user request: {user.dict(exclude={'password'})}")
        db = SessionLocal()
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user with hashed password
        db_user = User(
            name=user.name, 
            email=user.email,
            password_hash=hash_password(user.password)
        )
        db.add(db_user)
        db.flush()  # Force immediate insert to generate ID
        db.commit()
        db.refresh(db_user)
        logger.info(f"User created: ID={db_user.id}, Email={db_user.email}")
        return {
            "id": db_user.id,
            "name": db_user.name,
            "email": db_user.email,
            "created_at": db_user.created_at
        }
    except HTTPException:
        raise
    except ValidationError as e:
        logger.error(f"Validation error: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        db.close()

@router.post("/users/login/")
async def login_user(credentials: UserLogin):
    """Login endpoint with password verification"""
    db = SessionLocal()
    try:
        # Find user by email
        user = db.query(User).filter(User.email == credentials.email).first()
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Verify password
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Return user data (without password)
        return {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at
        }
    finally:
        db.close()

@router.post("/users/search/")
async def get_users(search_criteria: UserSearchSchema = Body(...)):
    db = SessionLocal()
    query = db.query(User)
    
    if search_criteria.name:
        query = query.filter(User.name.ilike(f"%{search_criteria.name}%"))
    if search_criteria.email:
        query = query.filter(User.email.ilike(f"%{search_criteria.email}%"))
        
    users = query.all()
    # Return the list of users without external_id
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "created_at": user.created_at
        }
        for user in users
    ]

@router.get("/categories/")
async def get_categories():
    """Get all available expense categories"""
    db = SessionLocal()
    try:
        categories = db.query(Category).all()
        return [
            {
                "id": category.id,
                "name": category.name
            }
            for category in categories
        ]
    finally:
        db.close()

@router.put("/expenses/{expense_id}")
async def update_expense(expense_id: int, expense: ExpenseCreate):
    """Update an existing expense"""
    db = SessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        # Update fields
        db_expense.amount = expense.amount
        db_expense.description = expense.description
        db_expense.category_id = expense.category_id
        
        db.commit()
        db.refresh(db_expense)
        
        return {
            "id": db_expense.id,
            "user_id": db_expense.user_id,
            "amount": db_expense.amount,
            "description": db_expense.description,
            "category_id": db_expense.category_id,
            "created_at": db_expense.created_at
        }
    finally:
        db.close()

@router.delete("/expenses/{expense_id}")
async def delete_expense(expense_id: int):
    """Delete an expense"""
    db = SessionLocal()
    try:
        db_expense = db.query(Expense).filter(Expense.id == expense_id).first()
        if not db_expense:
            raise HTTPException(status_code=404, detail="Expense not found")
        
        db.delete(db_expense)
        db.commit()
        
        return {"message": "Expense deleted successfully", "id": expense_id}
    finally:
        db.close()
