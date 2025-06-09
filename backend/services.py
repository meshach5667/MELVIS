from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from database import Conversation, Assessment, VideoRecommendation, User

class ConversationService:
    """Service for managing chat conversations"""
    
    @staticmethod
    def create_conversation(
        db: Session,
        user_id: int,
        user_message: str,
        bot_response: str,
        intent: str,
        confidence: float,
        session_id: Optional[str] = None
    ) -> Conversation:
        """Create a new conversation entry"""
        if not session_id:
            session_id = str(uuid.uuid4())
        
        conversation = Conversation(
            user_id=user_id,
            session_id=session_id,
            user_message=user_message,
            bot_response=bot_response,
            intent=intent,
            confidence=confidence
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)
        return conversation
    
    @staticmethod
    def get_user_conversations(
        db: Session,
        user_id: int,
        limit: int = 50,
        session_id: Optional[str] = None
    ) -> List[Conversation]:
        """Get conversation history for a user"""
        query = db.query(Conversation).filter(Conversation.user_id == user_id)
        
        if session_id:
            query = query.filter(Conversation.session_id == session_id)
        
        return query.order_by(Conversation.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_conversation_sessions(db: Session, user_id: int) -> List[str]:
        """Get all conversation session IDs for a user"""
        sessions = db.query(Conversation.session_id).filter(
            Conversation.user_id == user_id
        ).distinct().all()
        return [session[0] for session in sessions if session[0]]

class AssessmentService:
    """Service for managing mental health assessments"""
    
    @staticmethod
    def create_assessment(
        db: Session,
        user_id: int,
        answers: Dict[str, int]
    ) -> Assessment:
        """Create a new assessment entry"""
        total_score = sum(answers.values())
        risk_level = AssessmentService._calculate_risk_level(total_score)
        recommendations = AssessmentService._generate_recommendations(total_score, risk_level)
        
        assessment = Assessment(
            user_id=user_id,
            question_1=answers.get('question_1', 0),
            question_2=answers.get('question_2', 0),
            question_3=answers.get('question_3', 0),
            question_4=answers.get('question_4', 0),
            question_5=answers.get('question_5', 0),
            question_6=answers.get('question_6', 0),
            question_7=answers.get('question_7', 0),
            question_8=answers.get('question_8', 0),
            total_score=total_score,
            risk_level=risk_level,
            recommendations=recommendations
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)
        return assessment
    
    @staticmethod
    def get_user_assessments(
        db: Session,
        user_id: int,
        limit: int = 10
    ) -> List[Assessment]:
        """Get assessment history for a user"""
        return db.query(Assessment).filter(
            Assessment.user_id == user_id
        ).order_by(Assessment.created_at.desc()).limit(limit).all()
    
    @staticmethod
    def get_latest_assessment(db: Session, user_id: int) -> Optional[Assessment]:
        """Get the most recent assessment for a user"""
        return db.query(Assessment).filter(
            Assessment.user_id == user_id
        ).order_by(Assessment.created_at.desc()).first()
    
    @staticmethod
    def _calculate_risk_level(total_score: int) -> str:
        """Calculate risk level based on total score"""
        if total_score <= 8:
            return "low"
        elif total_score <= 16:
            return "moderate"
        else:
            return "high"
    
    @staticmethod
    def _generate_recommendations(total_score: int, risk_level: str) -> str:
        """Generate recommendations based on assessment results"""
        recommendations = {
            "low": "Your assessment indicates minimal symptoms. Continue practicing self-care and maintain healthy habits. Consider occasional check-ins with mental health resources.",
            "moderate": "Your assessment indicates moderate symptoms. Consider speaking with a mental health professional for guidance. Practice stress management techniques and maintain social connections.",
            "high": "Your assessment indicates significant symptoms. We strongly recommend speaking with a mental health professional soon. Don't hesitate to reach out for support - you don't have to face this alone."
        }
        return recommendations.get(risk_level, recommendations["moderate"])

class VideoService:
    """Service for managing video recommendations"""
    
    @staticmethod
    def save_video_recommendation(
        db: Session,
        video_id: str,
        title: str,
        description: Optional[str],
        thumbnail_url: Optional[str],
        youtube_url: str,
        channel_name: Optional[str],
        intent_category: str,
        keywords: Optional[str] = None
    ) -> VideoRecommendation:
        """Save a video recommendation"""
        # Check if video already exists
        existing_video = db.query(VideoRecommendation).filter(
            VideoRecommendation.video_id == video_id
        ).first()
        
        if existing_video:
            return existing_video
        
        video = VideoRecommendation(
            video_id=video_id,
            title=title,
            description=description,
            thumbnail_url=thumbnail_url,
            youtube_url=youtube_url,
            channel_name=channel_name,
            intent_category=intent_category,
            keywords=keywords
        )
        db.add(video)
        db.commit()
        db.refresh(video)
        return video
    
    @staticmethod
    def get_videos_by_intent(
        db: Session,
        intent_category: str,
        limit: int = 10
    ) -> List[VideoRecommendation]:
        """Get video recommendations by intent category"""
        return db.query(VideoRecommendation).filter(
            VideoRecommendation.intent_category == intent_category,
            VideoRecommendation.is_active == True
        ).limit(limit).all()
    
    @staticmethod
    def search_videos(
        db: Session,
        search_term: str,
        limit: int = 10
    ) -> List[VideoRecommendation]:
        """Search videos by title or keywords"""
        return db.query(VideoRecommendation).filter(
            VideoRecommendation.is_active == True
        ).filter(
            VideoRecommendation.title.contains(search_term) |
            VideoRecommendation.keywords.contains(search_term)
        ).limit(limit).all()
