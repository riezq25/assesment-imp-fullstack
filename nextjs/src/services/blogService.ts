import api from '@/lib/api';
import { Blog, Category, ApiResponse, PaginatedResponse } from '@/types';

interface BlogResponse extends ApiResponse<Blog> {
  data: Blog;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total_data: number;
  };
}

export const blogService = {
  // Blog operations
  async getBlogs(page = 1, searchQuery = '', categoryId = '') {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    
    if (searchQuery) {
      params.append('q', searchQuery);
    }
    
    if (categoryId) {
      params.append('category_id', categoryId);
    }
    
    const response = await api.get<PaginatedResponse<Blog>>(`/blogs?${params.toString()}`);
    return response.data;
  },

  async getBlog(id: number) {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return response.data;
  },

  async getBlogBySlug(slug: string) {
    const response = await api.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return response.data;
  },

  async createBlog(data: Partial<Blog> | FormData, isFormData: boolean = false) {
    const config = isFormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        } 
      : {};
    
    const response = await api.post<ApiResponse<Blog>>(
      '/blogs', 
      data,
      config
    );
    return response.data;
  },

  async updateBlog(id: number, data: Partial<Blog> | FormData, isFormData: boolean = false) {
    const config = isFormData 
      ? { 
          headers: { 
            'Content-Type': 'multipart/form-data' 
          } 
        } 
      : {};
    
    const response = await api.put<ApiResponse<Blog>>(
      `/blogs/${id}`, 
      data,
      config
    );
    return response.data;
  },

  async deleteBlog(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/blogs/${id}`);
    return response.data;
  },

  async deleteBlogBySlug(slug: string) {
    const response = await api.delete<ApiResponse<null>>(`/blogs/${slug}`);
    return response.data;
  },

  // Category operations
  async getCategories() {
    const response = await api.get<{
      message: string;
      data: Category[];
      meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total_data: number;
      };
    }>('/blog-categories');
    return response.data;
  },

  async getCategory(id: number) {
    const response = await api.get<ApiResponse<Category>>(`/blog-categories/${id}`);
    return response.data;
  },
};
