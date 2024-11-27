export interface Server {
  id: string;
  ram: number;
  cpu: number;
  ipv4: string;
  os: string;
  ssd: number;
  status: 'available' | 'booked';
  usage?: {
    cpu: number;
    ram: number;
    network: number;
    disk: number;
  };
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}