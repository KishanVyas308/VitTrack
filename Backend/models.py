from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, LargeBinary
from sqlalchemy.orm import relationship
from database import Base
import datetime
import uuid

def generate_uuid():
    return uuid.uuid4().bytes

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    expenses = relationship("Expense", back_populates="user")

class Category(Base):
    __tablename__ = "categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    expenses = relationship("Expense", back_populates="category")

class Expense(Base):
    __tablename__ = "expenses"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    description = Column(String)
    category_id = Column(Integer, ForeignKey("categories.id"))
    created_at = Column(DateTime, default=datetime.datetime.now())
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")
