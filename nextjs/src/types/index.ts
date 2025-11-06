export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category_id: number;
  category?: Category;
  user_id: number;
  user?: User;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}
