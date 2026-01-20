// client/src/lib/api.ts
const API_BASE_URL = '/api';

type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

// Helper function to create headers with auth token
const createHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Helper function to handle API responses
const handleResponse = async <T = any>(response: Response): Promise<T> => {
  const data: ApiResponse<T> = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    const error = new Error(data.message || 'API request failed');
    (error as any).status = response.status;
    throw error;
  }
  
  return data as T;
};

export const api = {
  // Set the authentication token
  setAuthToken(token: string) {
    localStorage.setItem('token', token);
  },

  // Clear the authentication token
  clearAuthToken() {
    localStorage.removeItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // API methods
  async getTasks() {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: createHeaders(),
      credentials: 'include' as RequestCredentials
    });
    
    return handleResponse(response);
  },

  async createTask(task: any) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: createHeaders(),
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify(task)
    });
    return handleResponse(response);
  }
};
