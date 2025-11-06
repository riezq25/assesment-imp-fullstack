export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  blogs_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  image?: string;
  category_id: string;
  category?: Category;
  created_by?: string;
  updated_by?: string;
  creator?: User;
  editor?: User;
  published_at?: string;
  created_at: string;
  updated_at: string;
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
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total_data: number;
  };
}
