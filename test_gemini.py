#!/usr/bin/env python3
"""
Test script to verify Gemini fallback functionality
"""
import requests
import json

# Test the chat endpoint with a query that should trigger Gemini fallback
def test_gemini_fallback():
    # Login with existing user
    login_data = {
        "email": "testuser@example.com",
        "password": "testpass123"
    }
    
    # Login user
    try:
        login_response = requests.post(
            "http://localhost:8001/auth/login",
            json=login_data
        )
        if login_response.status_code == 200:
            token = login_response.json()["access_token"]
            print("✅ User logged in successfully")
        else:
            print(f"❌ Login failed: {login_response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    # Test chat with a query that should have low confidence (trigger Gemini)
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 1: A complex mental health query that might have low confidence
    test_queries = [
        "I'm feeling overwhelmed with my work situation and having trouble finding balance",
        "What's the weather like today?",  # Should be redirected to mental health
        "Can you help me understand my complex feelings about relationships?",
        "How do I fix my computer?"  # Should be redirected
    ]
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n🔍 Test {i}: '{query}'")
        
        chat_data = {"message": query}
        
        try:
            response = requests.post(
                "http://localhost:8001/chat",
                json=chat_data,
                headers=headers
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"✅ Intent: {result['intent']}")
                print(f"✅ Confidence: {result['confidence']}")
                print(f"✅ Response: {result['response'][:100]}...")
                
                if result['intent'] in ['gemini_fallback', 'redirect_to_mental_health']:
                    print("🎯 Gemini fallback triggered successfully!")
                else:
                    print("📝 Standard intent classification used")
            else:
                print(f"❌ Chat failed: {response.status_code} - {response.text}")
                
        except Exception as e:
            print(f"❌ Chat error: {e}")

if __name__ == "__main__":
    print("🧠 Testing Melvis Gemini Fallback Integration")
    print("=" * 50)
    test_gemini_fallback()
