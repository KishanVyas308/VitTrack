from pydantic import BaseModel, EmailStr, Field, validator
from datetime import datetime
from typing import Optional
import json

class ExpenseBase(BaseModel):
    amount: float
    description: str
    category_id: int

class ExpenseCreate(ExpenseBase):
    user_id: int
    created_at: datetime | None = None

class Expense(ExpenseCreate):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class CategoryBase(BaseModel):
    name: str

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr = Field(..., description="Valid email required")

    @validator('*', pre=True)
    def validate_json_data(cls, v):
        if isinstance(v, str):
            try:
                # Try parsing as JSON if it looks like an object/array
                if v.strip().startswith(('{', '[')):
                    json.loads(v)
            except json.JSONDecodeError:
                raise ValueError("Invalid JSON syntax in field")
        return v

class User(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

class UserSearchSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
