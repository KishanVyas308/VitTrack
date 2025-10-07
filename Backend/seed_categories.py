from database import SessionLocal
from models import Category

categories = [
    "Groceries",
    "Entertainment",
    "Transport",
    "Bills",
    "Shopping",
    "Miscellaneous"
]

def seed_categories():
    db = SessionLocal()
    try:
        # Check if categories are already seeded
        existing_categories = db.query(Category).count()
        if existing_categories == len(categories):
            print("Categories already seeded.")
            return
        
        # Add each category
        for name in categories:
            category = Category(name=name)
            db.add(category)
        db.commit()
        print(f"Seeded {len(categories)} categories.")
    except Exception as e:
        print(f"Error seeding categories: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()
