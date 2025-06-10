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


<<<<<<< HEAD
export const handleLogin = async (email: string, password: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
    if (response.status === 200) {
      // Store user data in cookies or local storage
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Login error:', error);
    return false;
  }
}
// Reverted to the state before lastName was introduced
export const handleSignup = async (name: string, username: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
  try {
    const payload = {
      email,
      username,
      password,
      confirmPassword,
      first_name: name, // 'name' from frontend maps to 'first_name'
      // last_name is omitted as it was in the target state
    };
    const response = await axios.post(`${API_BASE_URL}/auth/register`, payload);
    if (response.status === 201 || response.status === 200) {
      localStorage.setItem('user', JSON.stringify(response.data.user || response.data));
      if (response.data.access_token) {
        Cookies.set('auth_token', response.data.access_token, { expires: 7 });
      }
      Cookies.set('user_data', JSON.stringify(response.data.user || response.data), { expires: 7 });
      return true;
    }
    return false;
  } catch (error: any) { // Added :any to error type
    console.error('Signup error in api.ts:', error.response ? error.response.data : error.message);
    return false;
  }
}
export const handleLogout = (): void => {
  // Clear user data from cookies or local storage
  localStorage.removeItem('user');
  // Optionally, redirect to login page
  window.location.href = '/login';
}
export const isAuthenticated = (): boolean => {
  const user = localStorage.getItem('user');
  return !!user;
}
export const getCurrentUser = (): any => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}
export const getAuthToken = (): string | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token || null : null;
}
export const setAuthToken = (token: string): void => {  
  const user = getCurrentUser();
  if (user) {
    user.token = token;
    localStorage.setItem('user', JSON.stringify(user));
  }
}
export const clearAuthData = (): void => {
  localStorage.removeItem('user');
  // Optionally, redirect to login page
  window.location.href = '/login';
}
=======
>>>>>>> parent of 2124527 (otondo melvis)
