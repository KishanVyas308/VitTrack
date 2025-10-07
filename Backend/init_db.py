from database import Base, engine, Column, Integer, String, DateTime, datetime
from seed_categories import seed_categories

# Create all tables
Base.metadata.create_all(bind=engine)

# Seed categories
seed_categories()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, unique=True, nullable=True)
    name = Column(String)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.now)
