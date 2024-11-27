import axios from 'axios';

// Function to get CSRF token from cookies
function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Function to get session ID from cookies
function getSessionId() {
  const name = 'sessionid';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': getCsrfToken(),
  }
});

// Add request interceptor to update CSRF token and session ID before each request
api.interceptors.request.use(config => {
  const csrfToken = getCsrfToken();
  const sessionId = getSessionId();

  if (csrfToken) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  
  if (sessionId) {
    config.headers['Cookie'] = `sessionid=${sessionId}`;
  }

  return config;
});

// Add response interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Return the error instead of throwing it
    return Promise.reject({
      message: error.response?.data?.message || 
               error.response?.data?.detail || 
               'An unexpected error occurred'
    });
  }
);

export interface LoginResponse {
  message: string;
}

export interface RegisterResponse {
  message?: string;
  username?: string[];
  email?: string[];
}

export interface LogoutResponse {
  message?: string;
  detail?: string;
}

export interface Machine {
  pk: number;
  name: string;
  password: string;
  status: string;
  cpuCores: number;
  ram: number;
  ssd: number;
  ipv4: string;
  ipv6: string | null;
  bandwidth: number;
  operatingSystem: string;
}

export interface BookingResponse {
  id: number;
  machine: number;
  bookedUntil: string;
  bookedFrom: string;
  booked: boolean;
}

export const auth = {
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post<LoginResponse>('/users/loginn/', formData);
    return response.data;
  },

  register: async (username: string, email: string, password: string, password2: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password2', password2);
    const response = await api.post<RegisterResponse>('/users/registerr/', formData);
    return response.data;
  },

  logout: async () => {
    const response = await api.get<LogoutResponse>('/users/logoutt/');
    return response.data;
  }
};

export const machines = {
  getAll: async () => {
    const response = await api.get<Machine[]>('/machines/');
    return response.data;
  },

  getMyMachines: async () => {
    const response = await api.get<Machine[]>('/machines/my/');
    return response.data;
  },

  getAvailable: async (start: string, end: string) => {
    const response = await api.get<Machine[]>('/machines/available/', {
      params: { start, end }
    });
    return response.data;
  },

  book: async (pk: number, start: string, end: string) => {
    const response = await api.get<BookingResponse>(`/machines/${pk}/book/`, {
      params: { start, end }
    });
    return response.data;
  },

  reinstall: async (pk: number) => {
    const response = await api.get<{ message: string }>(`/machines/${pk}/reinstall/`);
    return response.data;
  }
};