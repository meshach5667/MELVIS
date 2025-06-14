# Melvis - Mental Health AI Chatbot 🧠

A compassionate AI chatbot designed to provide mental health support, featuring intent-based conversations and YouTube video recommendations.

## Features

-  **Intent-Based Chat**: Advanced natural language understanding to classify user intent (anxiety, depression, stress, sleep, self-care)
-  **Gemini AI Fallback**: Intelligent responses for complex queries when intent classification confidence is low
-  **Mental Health Focused**: Strict filtering ensures all AI responses are mental health related
-  **YouTube Integration**: Curated mental health videos based on conversation context
-  **Beautiful Blue Theme**: Calming, therapeutic UI design
-  **Real-time Chat**: Smooth, responsive conversation experience
-  **Responsive Design**: Works on desktop and mobile devices
-  **Smart Suggestions**: Context-aware follow-up suggestions

## Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Vite** for development and building

### Backend
- **FastAPI** for REST API
- **Python 3.8+**
- **NLTK** for natural language processing
- **scikit-learn** for intent classification
- **YouTube Data API v3** for video recommendations

## Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **YouTube API Key** (optional, will use mock data without it)

### Quick Start

1. **Clone and navigate to the project**:
   ```bash
   cd /Users/mac/projects/MELVIS2/Otondo-Melvis
   ```

2. **Install frontend dependencies**:
   ```bash
   npm install
   ```

3. **Install backend dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   cd ..
   ```

4. **Configure environment variables** (optional):
   ```bash
   # Edit backend/.env and add your YouTube API key
   nano backend/.env
   ```

5. **Start both servers**:
   ```bash
   ./start.sh
   ```

   Or start them separately:
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload

   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Open your browser**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## Usage

### Chat Interface
- Type your thoughts or feelings in the chat input
- Melvis will respond with supportive messages and classify your intent
- Click on suggested follow-up questions for guided conversation
- View recommended YouTube videos in the sidebar

### Intent Categories
- **Anxiety**: Worry, stress, panic, nervous feelings
- **Depression**: Sadness, hopelessness, low mood
- **Stress**: Pressure, overwhelm, burnout
- **Sleep**: Insomnia, sleep difficulties
- **Self-care**: Wellness, healthy habits, balance
- **General**: Default supportive responses

## API Endpoints

#### Chat
```bash
POST /chat
{
  "message": "I'm feeling anxious",
  "user_id": "optional_user_id"
}
```

#### Video Search
```bash
POST /search-videos
{
  "query": "anxiety relief",
  "max_results": 5
}
```

#### Conversation History
```bash
GET /conversation/{user_id}
```

## Configuration

### YouTube API Setup
1. Go to [Google Cloud Console](https://console.developers.google.com/)
2. Create a new project or select existing one
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Add the API key to `backend/.env`:
   ```
   YOUTUBE_API_KEY=your_api_key_here
   ```

### Gemini AI API Setup (Required for Fallback Responses)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key for Gemini Pro
3. Add the API key to `backend/.env`:
   ```
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

**Note**: The Gemini API provides intelligent fallback responses when the intent classification confidence is low. This ensures users always receive helpful, mental health-focused responses even for complex or unusual queries.
