// client/src/lib/api.ts
import { Task as BaseTask, TaskStatus } from '../../../shared/schema';

type Task = BaseTask & {
  policyNumber?: string;
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';

type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};
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
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: createHeaders(),
      credentials: 'include' as RequestCredentials,
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },
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
  },

  updateTask: async (taskId: string, taskData: Partial<Task>) => {
    const res = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(taskData),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update task');
    }
    return res.json();
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        ...getAuthHeader(),
      },
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to fetch user');
    }
    return res.json();
  },
};
