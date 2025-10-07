import os
import json
from datetime import datetime
from dotenv import load_dotenv
from groq import Groq
from database import SessionLocal
from models import Category
import logging

# Load environment variables
load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# Predefined categories
CATEGORIES = [
    "Groceries", "Entertainment", "Transport", "Bills", "Shopping", "Miscellaneous"
]

def categorize_expense(transcribed_text: str, user_id: int = 1) -> list:
    prompt = f"""Extract expense information from the following text:
    {transcribed_text}
    
    The text may contain multiple expenses. Extract each expense with the following fields:
    - amount (as a float)
    - description (as a string)
    - category (one of: {', '.join(CATEGORIES)})
    
    Return a JSON object with a key "expenses" that contains an array of expense objects.
    Example: {{"expenses": [{{"amount": 25.99, "description": "coffee", "category": "Groceries"}}, {{"amount": 15.0, "description": "bus fare", "category": "Transport"}}]}}"""
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        response_format={"type": "json_object"}
    )
    
    try:
        response_data = json.loads(response.choices[0].message.content)
        
        # The response should be a JSON object with an 'expenses' key
        if "expenses" not in response_data:
            raise ValueError("LLM response missing 'expenses' key")
            
        expenses_list = response_data["expenses"]
        if not isinstance(expenses_list, list):
            raise ValueError("LLM response 'expenses' is not a list")
            
        expenses = []
        for expense_data in expenses_list:
            # Validate required keys
            if not all(key in expense_data for key in ["amount", "description", "category"]):
                raise ValueError("LLM response missing required keys in an expense")
                
            category_name = expense_data["category"]
            
            # Get category ID from database
            db = SessionLocal()
            category = db.query(Category).filter(Category.name == category_name).first()
            if not category:
                # Default to Miscellaneous
                category = db.query(Category).filter(Category.name == "Miscellaneous").first()
                if not category:
                    raise ValueError("Miscellaneous category not found")
                logging.warning(f"Category '{category_name}' not found. Using 'Miscellaneous'")
                
            expenses.append({
                "user_id": user_id,
                "amount": expense_data["amount"],
                "description": expense_data["description"],
                "category_id": category.id,
                "created_at": datetime.now().isoformat()
            })
        
        return expenses
    except (json.JSONDecodeError, KeyError, ValueError, TypeError) as e:
        raise ValueError(f"Failed to parse LLM response: {str(e)}")
