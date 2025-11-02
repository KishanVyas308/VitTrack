from database import Base, engine
from models import User, Category, Expense  # Import models to register them with Base
from seed_categories import seed_categories

# Drop all existing tables and recreate them (WARNING: This deletes all data!)
print("Dropping existing tables...")
Base.metadata.drop_all(bind=engine)

# Create all tables with new schema
print("Creating tables with new schema...")
Base.metadata.create_all(bind=engine)

# Seed categories
print("Seeding categories...")
seed_categories()

print("Database initialized successfully!")
