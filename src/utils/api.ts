import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8000';

// Configure axios to include auth token in requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure axios to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, clear auth data and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth-related interfaces
export interface User {
  id: number;
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  fullname: string;
  password: string;
  confirm_password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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
  session_id: string;
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


export const handleSignup = async (fullname: string, email: string, password: string, confirmPassword: string): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
  try {
    const signupData: SignupRequest = {
      email,
      fullname,
      password,
      confirm_password: confirmPassword
    };
    
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/register`, signupData);
    
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, error: 'Registration failed' };
  } catch (error: any) {
    console.error('Signup error:', error);
    const errorMessage = error.response?.data?.detail || 'Registration failed';
    return { success: false, error: errorMessage };
  }
};

export const handleLogin = async (email: string, password: string): Promise<{ success: boolean; data?: AuthResponse; error?: string }> => {
  try {
    const loginData: LoginRequest = { email, password };
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/auth/login`, loginData);
    
    if (response.status === 200) {
      return { success: true, data: response.data };
    }
    return { success: false, error: 'Login failed' };
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.detail || 'Invalid email or password';
    return { success: false, error: errorMessage };
  }
};
export const handleLogout = (): void => {
  clearAuthData();
  window.location.href = '/login';
};

export const getUserData = (): User | null => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUserData();
  return !!(token && user);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const setAuthData = (authResponse: AuthResponse): void => {
  localStorage.setItem('auth_token', authResponse.access_token);
  localStorage.setItem('user_data', JSON.stringify(authResponse.user));
};

export const clearAuthData = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
};