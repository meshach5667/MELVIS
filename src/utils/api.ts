import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  channel: string;
}

export interface ChatResponse {
  response: string;
  intent: string;
  confidence: number;
  videos?: Video[];
  suggestions?: string[];
}

export interface ChatRequest {
  message: string;
  user_id: string;
}

export interface VideoSearchRequest {
  query: string;
  max_results?: number;
}

export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    const response = await axios.post<ChatResponse>(`${API_BASE_URL}/chat`, request);
    return response.data;
  },

  async searchVideos(request: VideoSearchRequest): Promise<{ videos: Video[] }> {
    const response = await axios.post<{ videos: Video[] }>(`${API_BASE_URL}/search-videos`, request);
    return response.data;
  },

  async getConversation(userId: string): Promise<{ conversation: any[] }> {
    const response = await axios.get<{ conversation: any[] }>(`${API_BASE_URL}/conversation/${userId}`);
    return response.data;
  }
};

export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};


