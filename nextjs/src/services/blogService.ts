import api from '@/lib/api';
import { Blog, Category, ApiResponse, PaginatedResponse } from '@/types';

export const blogService = {
  // Blog operations
  async getBlogs(page = 1) {
    const response = await api.get<PaginatedResponse<Blog>>(`/blogs?page=${page}`);
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

  async createBlog(data: Partial<Blog>) {
    const response = await api.post<ApiResponse<Blog>>('/blogs', data);
    return response.data;
  },

  async updateBlog(id: number, data: Partial<Blog>) {
    const response = await api.put<ApiResponse<Blog>>(`/blogs/${id}`, data);
    return response.data;
  },

  async deleteBlog(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/blogs/${id}`);
    return response.data;
  },

  // Category operations
  async getCategories() {
    const response = await api.get<ApiResponse<Category[]>>('/blog-categories');
    return response.data;
  },

  async getCategory(id: number) {
    const response = await api.get<ApiResponse<Category>>(`/blog-categories/${id}`);
    return response.data;
  },
};
