from sqlalchemy import create_engine, MetaData, Column, Integer, String, Text, DateTime, Float, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, Session, relationship
from sqlalchemy.sql import func
from datetime import datetime
import os

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./melvis.db")

# Create engine
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Create sessionmaker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create base class
Base = declarative_base()

# Database models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user")
    assessments = relationship("Assessment", back_populates="user")

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    session_id = Column(String(255), nullable=True)  # For grouping related messages
    user_message = Column(Text, nullable=False)
    bot_response = Column(Text, nullable=False)
    intent = Column(String(50), nullable=False)
    confidence = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="conversations")

class Assessment(Base):
    __tablename__ = "assessments"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_1 = Column(Integer, nullable=False)  # Little interest or pleasure in doing things
    question_2 = Column(Integer, nullable=False)  # Feeling down, depressed, or hopeless
    question_3 = Column(Integer, nullable=False)  # Feeling nervous, anxious, or on edge
    question_4 = Column(Integer, nullable=False)  # Not being able to stop or control worrying
    question_5 = Column(Integer, nullable=False)  # Trouble falling or staying asleep
    question_6 = Column(Integer, nullable=False)  # Feeling tired or having little energy
    question_7 = Column(Integer, nullable=False)  # Trouble concentrating on things
    question_8 = Column(Integer, nullable=False)  # Feeling overwhelmed by daily tasks
    total_score = Column(Integer, nullable=False)
    risk_level = Column(String(20), nullable=False)  # low, moderate, high
    recommendations = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    user = relationship("User", back_populates="assessments")

class VideoRecommendation(Base):
    __tablename__ = "video_recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String(255), nullable=False)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    thumbnail_url = Column(String(500), nullable=True)
    youtube_url = Column(String(500), nullable=False)
    channel_name = Column(String(255), nullable=True)
    intent_category = Column(String(50), nullable=False)
    keywords = Column(Text, nullable=True)  # JSON string of keywords
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create tables
def create_tables():
    Base.metadata.create_all(bind=engine)

# Initialize database
def init_db():
    create_tables()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
