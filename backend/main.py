from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
import json
import re
from datetime import datetime
import httpx
from googleapiclient.discovery import build
from dotenv import load_dotenv
import nltk
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# Load environment variables
load_dotenv()

# Download required NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
except:
    pass

app = FastAPI(title="Melvis - Mental Health AI Chatbot")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

class ChatResponse(BaseModel):
    response: str
    intent: str
    confidence: float
    videos: Optional[List[Dict]] = None
    suggestions: Optional[List[str]] = None

class VideoSearchRequest(BaseModel):
    query: str
    max_results: Optional[int] = 5

# Intent classification system
class IntentClassifier:
    def __init__(self):
        self.intents = {
            "anxiety": {
                "keywords": ["anxious", "anxiety", "worried", "stress", "panic", "nervous", "overwhelmed", "fear"],
                "responses": [
                    "I understand you're feeling anxious. Anxiety is a common experience, and there are effective ways to manage it.",
                    "It sounds like you're dealing with some anxiety. Let's explore some techniques that might help you feel more grounded.",
                    "I hear that you're feeling overwhelmed. Anxiety can be challenging, but there are strategies we can discuss."
                ],
                "video_keywords": ["anxiety relief", "breathing exercises", "anxiety management", "calm anxiety"]
            },
            "depression": {
                "keywords": ["depressed", "depression", "sad", "hopeless", "empty", "down", "low mood", "worthless"],
                "responses": [
                    "I'm sorry you're feeling this way. Depression can be very difficult, but please know that you're not alone.",
                    "It takes courage to reach out when you're feeling depressed. I'm here to support you.",
                    "These feelings are valid, and it's important that you're talking about them. Let's explore some ways to help."
                ],
                "video_keywords": ["depression help", "mental health support", "overcoming depression", "depression recovery"]
            },
            "stress": {
                "keywords": ["stressed", "stress", "pressure", "overwhelmed", "burnout", "exhausted", "tired"],
                "responses": [
                    "Stress can be really challenging to manage. Let's talk about some effective stress-reduction techniques.",
                    "It sounds like you're under a lot of pressure. Stress is your body's natural response, and there are healthy ways to cope.",
                    "I understand you're feeling stressed. Let's explore some strategies to help you manage these feelings."
                ],
                "video_keywords": ["stress relief", "stress management", "relaxation techniques", "burnout recovery"]
            },
            "sleep": {
                "keywords": ["sleep", "insomnia", "tired", "exhausted", "can't sleep", "sleepless", "nightmares"],
                "responses": [
                    "Sleep issues can significantly impact your mental health. Let's discuss some strategies for better sleep hygiene.",
                    "Getting quality sleep is crucial for mental wellness. I can share some techniques that might help.",
                    "Sleep difficulties are common and treatable. Let's explore some approaches to improve your rest."
                ],
                "video_keywords": ["sleep hygiene", "insomnia help", "better sleep", "sleep meditation"]
            },
            "self_care": {
                "keywords": ["self care", "self-care", "wellness", "healthy habits", "routine", "balance"],
                "responses": [
                    "Self-care is so important for mental health. Let's explore some practices that might work for you.",
                    "Taking care of yourself is not selfish—it's necessary. What aspects of self-care interest you most?",
                    "Building healthy self-care routines can make a significant difference in how you feel."
                ],
                "video_keywords": ["self care routine", "mental health wellness", "self care tips", "healthy habits"]
            },
            "general": {
                "keywords": ["help", "support", "talk", "listen", "advice", "guidance"],
                "responses": [
                    "I'm here to listen and support you. What's on your mind today?",
                    "Thank you for reaching out. I'm here to help in whatever way I can.",
                    "I'm glad you're here. What would you like to talk about?"
                ],
                "video_keywords": ["mental health support", "emotional wellness", "self help", "mental health tips"]
            }
        }
        
        # Prepare vectorizer for intent classification
        all_texts = []
        self.intent_labels = []
        for intent, data in self.intents.items():
            for keyword in data["keywords"]:
                all_texts.append(keyword)
                self.intent_labels.append(intent)
        
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.intent_vectors = self.vectorizer.fit_transform(all_texts)

    def classify_intent(self, message: str) -> tuple:
        """Classify the intent of a message and return intent with confidence"""
        message_lower = message.lower()
        
        # Simple keyword matching first
        max_matches = 0
        best_intent = "general"
        
        for intent, data in self.intents.items():
            matches = sum(1 for keyword in data["keywords"] if keyword in message_lower)
            if matches > max_matches:
                max_matches = matches
                best_intent = intent
        
        # Use TF-IDF for more sophisticated matching
        message_vector = self.vectorizer.transform([message_lower])
        similarities = cosine_similarity(message_vector, self.intent_vectors).flatten()
        
        if len(similarities) > 0:
            max_similarity_idx = np.argmax(similarities)
            max_similarity = similarities[max_similarity_idx]
            
            if max_similarity > 0.1:  # Minimum confidence threshold
                vector_intent = self.intent_labels[max_similarity_idx]
                confidence = max_similarity
                
                # Combine keyword and vector results
                if max_matches > 0:
                    confidence = min(1.0, confidence + (max_matches * 0.1))
                    return best_intent, confidence
                else:
                    return vector_intent, confidence
        
        # Return keyword-based result with adjusted confidence
        confidence = min(1.0, max_matches * 0.2) if max_matches > 0 else 0.1
        return best_intent, confidence

    def get_response(self, intent: str) -> str:
        """Get a response for the given intent"""
        import random
        return random.choice(self.intents[intent]["responses"])

    def get_video_keywords(self, intent: str) -> List[str]:
        """Get video search keywords for the given intent"""
        return self.intents[intent]["video_keywords"]

# Initialize intent classifier
intent_classifier = IntentClassifier()

# YouTube API service
class YouTubeService:
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY")
        if self.api_key:
            self.youtube = build('youtube', 'v3', developerKey=self.api_key)
        else:
            self.youtube = None

    async def search_videos(self, query: str, max_results: int = 5) -> List[Dict]:
        """Search for YouTube videos related to mental health"""
        if not self.youtube:
            # Return mock data if no API key
            return self._get_mock_videos(query)
        
        try:
            # Add mental health context to search
            search_query = f"{query} mental health wellness mindfulness"
            
            search_response = self.youtube.search().list(
                q=search_query,
                part='id,snippet',
                maxResults=max_results,
                type='video',
                safeSearch='strict',
                videoCaption='any'
            ).execute()

            videos = []
            for item in search_response['items']:
                video = {
                    'id': item['id']['videoId'],
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'][:200] + '...',
                    'thumbnail': item['snippet']['thumbnails']['medium']['url'],
                    'url': f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    'channel': item['snippet']['channelTitle']
                }
                videos.append(video)
            
            return videos
        except Exception as e:
            print(f"YouTube API error: {e}")
            return self._get_mock_videos(query)

    def _get_mock_videos(self, query: str) -> List[Dict]:
        """Return mock video data when API is not available"""
        mock_videos = [
            {
                'id': 'mock1',
                'title': f'Understanding {query.title()}: A Guide to Mental Wellness',
                'description': f'Learn effective techniques for managing {query} and improving your mental health...',
                'thumbnail': 'https://via.placeholder.com/320x180/4A90E2/FFFFFF?text=Mental+Health+Video',
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'channel': 'Mental Health Channel'
            },
            {
                'id': 'mock2',
                'title': f'5-Minute {query.title()} Relief Meditation',
                'description': f'A quick and effective meditation to help with {query} and promote calm...',
                'thumbnail': 'https://via.placeholder.com/320x180/5BA3F5/FFFFFF?text=Meditation',
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'channel': 'Mindfulness Guide'
            },
            {
                'id': 'mock3',
                'title': f'Professional Tips for {query.title()} Management',
                'description': f'Expert advice from licensed therapists on managing {query} effectively...',
                'thumbnail': 'https://via.placeholder.com/320x180/6BB6FF/FFFFFF?text=Expert+Tips',
                'url': 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                'channel': 'Therapy Insights'
            }
        ]
        return mock_videos

# Initialize YouTube service
youtube_service = YouTubeService()

# Chat conversation storage (in production, use a database)
conversations = {}

@app.get("/")
async def root():
    return {"message": "Melvis - Mental Health AI Chatbot API"}

@app.post("/chat", response_model=ChatResponse)
async def chat(chat_message: ChatMessage):
    """Process chat message and return response with intent classification"""
    try:
        message = chat_message.message.strip()
        user_id = chat_message.user_id
        
        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        # Classify intent
        intent, confidence = intent_classifier.classify_intent(message)
        
        # Get response
        response = intent_classifier.get_response(intent)
        
        # Get relevant videos
        video_keywords = intent_classifier.get_video_keywords(intent)
        videos = []
        
        if video_keywords:
            # Use the first keyword for video search
            videos = await youtube_service.search_videos(video_keywords[0], max_results=3)
        
        # Generate follow-up suggestions
        suggestions = generate_suggestions(intent)
        
        # Store conversation (in production, use proper database)
        if user_id not in conversations:
            conversations[user_id] = []
        
        conversations[user_id].append({
            "timestamp": datetime.now().isoformat(),
            "user_message": message,
            "bot_response": response,
            "intent": intent,
            "confidence": confidence
        })
        
        return ChatResponse(
            response=response,
            intent=intent,
            confidence=confidence,
            videos=videos,
            suggestions=suggestions
        )
        
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred processing your message")

@app.post("/search-videos")
async def search_videos(request: VideoSearchRequest):
    """Search for mental health related videos"""
    try:
        videos = await youtube_service.search_videos(request.query, request.max_results)
        return {"videos": videos}
    except Exception as e:
        print(f"Video search error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred searching for videos")

@app.get("/conversation/{user_id}")
async def get_conversation(user_id: str):
    """Get conversation history for a user"""
    if user_id in conversations:
        return {"conversation": conversations[user_id]}
    return {"conversation": []}

def generate_suggestions(intent: str) -> List[str]:
    """Generate follow-up suggestions based on intent"""
    suggestions_map = {
        "anxiety": [
            "Tell me about breathing exercises",
            "What are some grounding techniques?",
            "How can I manage panic attacks?",
            "Share relaxation methods"
        ],
        "depression": [
            "What are some mood-lifting activities?",
            "How can I build a support network?",
            "Tell me about professional help options",
            "Share self-care tips for depression"
        ],
        "stress": [
            "What are quick stress relief techniques?",
            "How can I improve work-life balance?",
            "Tell me about mindfulness practices",
            "Share time management tips"
        ],
        "sleep": [
            "What is good sleep hygiene?",
            "How can I create a bedtime routine?",
            "Tell me about sleep meditation",
            "What foods help with sleep?"
        ],
        "self_care": [
            "What are daily self-care practices?",
            "How can I set healthy boundaries?",
            "Tell me about mindfulness exercises",
            "Share wellness routine ideas"
        ],
        "general": [
            "I'm feeling anxious",
            "I need help with stress",
            "I'm having trouble sleeping",
            "Tell me about self-care"
        ]
    }
    
    return suggestions_map.get(intent, suggestions_map["general"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)