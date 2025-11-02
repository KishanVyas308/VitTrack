// API Configuration
export const API_CONFIG = {
  // Update this to your backend URL
  // For local development on physical device, use your computer's IP address
  // For iOS simulator: http://localhost:8000
  // For Android emulator: http://10.0.2.2:8000
  // For physical device: http://YOUR_IP:8000
  BASE_URL: 'http://192.168.0.100:8000',
};

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USERS: '/users/',
  USER_LOGIN: '/users/login/',
  USER_SEARCH: '/users/search/',
  
  // Expense endpoints
  PROCESS_AUDIO: '/process_audio/',
  GET_EXPENSES: '/get_expenses/',
  CREATE_EXPENSE: '/expenses/', // POST to create a new expense
  UPDATE_EXPENSE: '/expenses/',  // Will append /{id}
  DELETE_EXPENSE: '/expenses/',  // Will append /{id}
  CATEGORIES: '/categories/',
};

// Helper function to build full URL
export const buildUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
