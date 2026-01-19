import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from './api';
import { Task as BaseTask, TaskStatus } from '../../../shared/schema';

type Task = BaseTask & {
  policyNumber?: string;
};

export type Role = "admin" | "employee";

export interface User {
  id: string;
  username: string;
  role: Role;
  name: string;
  avatar?: string;
}


export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: "assignment" | "status" | "system";
}

interface StoreContextType {
  user: User | null;
  users: User[];
  tasks: Task[];
  notifications: Notification[];
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, "id">) => void;
  addTask: (task: Omit<Task, "id" | "creatorId">) => Promise<void>;
  updateTaskStatus: (taskId: string, status: Task["status"]) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const MOCK_USERS: User[] = [
  { id: "1", username: "admin", role: "admin", name: "Anand (Admin)", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin" },
  { id: "2", username: "jurgern", role: "employee", name: "Jurgern", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jurgern" },
  { id: "3", username: "marion", role: "employee", name: "Marion", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=marion" },
  { id: "4", username: "jesse", role: "employee", name: "Jesse", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jesse" },
  { id: "5", username: "brian", role: "employee", name: "Brian", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=brian" },
  { id: "6", username: "julius", role: "employee", name: "Julius", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=julius" },
  { id: "7", username: "dominic", role: "employee", name: "Dominic", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dominic" },
];

const MOCK_TASKS: Task[] = [
  { 
    id: "1", 
    title: "Life Policy Renewal", 
    description: "Process renewal for client James Omondi", 
    dueDate: new Date(), 
    assignedTo: "2", 
    createdBy: "1", 
    status: "IN_PROGRESS", 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    policyNumber: "POL-2024-001" 
  },
  { 
    id: "2", 
    title: "New Client Meeting", 
    description: "Initial consultation for comprehensive auto insurance", 
    dueDate: new Date(), 
    assignedTo: "3", 
    createdBy: "1", 
    status: "PENDING", 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    policyNumber: "PENDING" 
  },
  { 
    id: "3", 
    title: "Claims Processing", 
    description: "Review accident report and assess damages", 
    dueDate: new Date(Date.now() + 86400000), 
    assignedTo: "2", 
    createdBy: "2", 
    status: "COMPLETED", 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    policyNumber: "CLM-8823" 
  },
  { 
    id: "4", 
    title: "Quarterly Sales Review", 
    description: "Review Q3 performance metrics", 
    dueDate: new Date(Date.now() + 172800000), 
    assignedTo: "4", 
    createdBy: "1", 
    status: "PENDING", 
    createdAt: new Date(), 
    updatedAt: new Date(), 
    policyNumber: "" 
  },
  { 
    id: "5", 
    title: "Health Policy Audit", 
    description: "Audit pending health insurance claims for Q2", 
    dueDate: new Date(Date.now() + 86400000 * 2), 
    assignedTo: "5", 
    createdBy: "1", 
    status: "PENDING", 
    createdAt: new Date(), 
    updatedAt: new Date(),
    policyNumber: "AUDIT-2024-Q2"
  },
  { 
    id: "6", 
    title: "Client Onboarding - Sarah K.", 
    description: "Complete KYC documents and finalize policy signing", 
    dueDate: new Date(Date.now() + 86400000 * 3), 
    assignedTo: "6", 
    createdBy: "1", 
    status: "IN_PROGRESS", 
    createdAt: new Date(), 
    updatedAt: new Date(),
    policyNumber: "NEW-2024-001"
  },
  { 
    id: "7", 
    title: "Vehicle Inspection Report", 
    description: "Upload inspection photos for claimant #4421", 
    dueDate: new Date(Date.now() - 86400000), 
    assignedTo: "7", 
    createdBy: "1", 
    status: "COMPLETED", 
    createdAt: new Date(), 
    updatedAt: new Date(),
    policyNumber: "VEH-4421"
  },
];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  
  // Initialize state from localStorage if available, otherwise use mocks
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("simia_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem("simia_users");
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("simia_tasks");
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem("simia_notifications");
    return saved ? JSON.parse(saved) : [];
  });

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("simia_tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Save users to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("simia_users", JSON.stringify(users));
  }, [users]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("simia_notifications", JSON.stringify(notifications));
  }, [notifications]);

  const login = async (username: string, password: string) => {
    try {
      console.log('Attempting login with username:', username);
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json().catch(e => {
        console.error('Failed to parse login response:', e);
        return { error: 'Invalid response from server' };
      });
      
      console.log('Login response data:', data);

      if (response.ok) {
        if (data.user) {
          const userData = {
            id: data.user.id,
            username: data.user.username,
            name: data.user.name || username,
            role: data.user.role || 'employee',
            avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
          };
          
          console.log('User data to store:', userData);
          
          // The server sends token directly in the response
          const authToken = data.token;
          console.log('Auth token found:', authToken ? 'Yes' : 'No');
          
          if (authToken) {
            console.log('Saving token using api.setAuthToken');
            api.setAuthToken(authToken);
          } else {
            console.warn('No authentication token found in login response');
            console.log('Full response data:', data);
          }
          
          // Update the users list if this is a new user
          setUsers(prevUsers => {
            const existingUser = prevUsers.find(u => u.id === userData.id);
            if (!existingUser) {
              return [...prevUsers, userData];
            }
            return prevUsers;
          });
          
          // Set the current user and save to localStorage
          setUser(userData);
          localStorage.setItem('simia_user', JSON.stringify(userData));
          
          // Verify token was saved
          const savedToken = localStorage.getItem('token');
          console.log('Token saved to localStorage:', savedToken ? 'Yes' : 'No');
          
          toast({
            title: "Login Successful",
            description: `Welcome back, ${userData.name}!`,
          });
        } else {
          throw new Error('User data not found in response');
        }
      } else {
        throw new Error(data.error || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
      throw error;
    }
  };

  // Load tasks from API on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks = await api.getTasks();
        // Transform tasks to match the frontend format
        const formattedTasks = tasks.map((task: any) => ({
          ...task,
          id: task.id,
          date: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          assigneeId: task.assignedTo,
          creatorId: task.createdBy,
          status: task.status.toLowerCase().replace('_', '-') as Task['status'],
        }));
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Failed to load tasks', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load tasks. Using local data instead.",
        });
      }
    };

    if (user) {
      loadTasks();
    }
  }, [user]);

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  const addUser = (newUser: Omit<User, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const userWithId = { ...newUser, id, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUser.username}` };
    setUsers(prev => [...prev, userWithId]);
    
    // Add welcome notification for the new user
    const notification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: id,
      message: "Welcome to SIMIA Portal! Your account has been created.",
      read: false,
      createdAt: new Date().toISOString(),
      type: "system"
    };
    setNotifications(prev => [notification, ...prev]);
    
    toast({
      title: "User Created",
      description: `${newUser.name} has been added to the team.`,
    });
  };

  const addTask = async (task: Omit<Task, "id" | "creatorId">) => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('simia_user') || 'null');
    
    console.log('Current token:', token ? 'Token exists' : 'No token found');
    console.log('Current user:', currentUser);
    
    if (!token || !currentUser) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to create tasks",
      });
      throw new Error('Not authenticated');
    }

    // Convert the task to match the backend schema
    const taskToSend = {
      title: task.title,
      description: task.description || '',
      status: task.status.toUpperCase().replace('-', '_') as TaskStatus,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
      assignedTo: task.assignedTo,
      createdBy: currentUser.id, // Ensure createdBy is set from the current user
      // Include additional fields if they exist
      ...((task as any).policyNumber && { policyNumber: (task as any).policyNumber }),
      ...((task as any).amount && { amount: (task as any).amount }),
    };

    console.log('Sending task to server:', taskToSend);
    
    // Send the task to the API
    const response = await fetch('http://localhost:5001/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include',
      body: JSON.stringify(taskToSend)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { message: errorText };
      }
      
      console.error('Task creation failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      
      if (response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem('token'); // Clear invalid token
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        });
        // Clear the invalid token
        localStorage.removeItem('token');
        // Optionally redirect to login
        // window.location.href = '/login';
      }
      
      throw new Error(errorData.error || `Failed to create task (${response.status} ${response.statusText})`);
    }
    
    const newTask = await response.json();
    console.log('Task created successfully:', newTask);
    
    // Update local state with the new task
    const formattedTask = {
      ...newTask,
      id: newTask.id,
      date: newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : '',
      assigneeId: newTask.assignedTo,
      creatorId: newTask.createdBy,
      status: (newTask.status || 'PENDING').toLowerCase().replace('_', '-') as Task['status'],
    };
    
    setTasks(prev => {
      const currentTasks = Array.isArray(prev) ? prev : [];
      return [...currentTasks, formattedTask];
    });
    
    // Create notification if assignee exists
    if (task.assignedTo) {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        userId: task.assignedTo,
        message: `New task assigned: ${task.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        type: "assignment"
      };
      setNotifications(prev => Array.isArray(prev) ? [notification, ...prev] : [notification]);
    }
    
    toast({
      title: "Task Created",
      description: `${task.title} has been created.`,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to create task. Please try again.",
    });
    throw error;
  }
};

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(prev => {
      if (!Array.isArray(prev)) return [];
      
      const updatedTasks = prev.map(task => {
        if (task.id === taskId) {
          // If the status is changing, create a notification
          if (task.status !== status && user && task.assignedTo && task.assignedTo !== user.id) {
            const notification: Notification = {
              id: Math.random().toString(36).substr(2, 9),
              userId: task.assignedTo,
              message: `Task status updated to ${status}: ${task.title}`,
              read: false,
              createdAt: new Date().toISOString(),
              type: "status" as const
            };
            setNotifications(prevNotifications => [notification, ...prevNotifications]);
          }
          return { ...task, status };
        }
        return task;
      });
      
      return updatedTasks;
    });
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => n.userId === user.id ? { ...n, read: true } : n));
  };

  return (
    <StoreContext.Provider value={{ 
      user, users, tasks, notifications, 
      login, logout, addUser, addTask, updateTaskStatus, 
      markNotificationAsRead, markAllNotificationsAsRead 
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
