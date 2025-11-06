'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { Category } from '@/types';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await blogService.getCategories();
      setCategories(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog Categories</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link href={`/blogs?category_id=${category.id}`} key={category.id}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer h-full">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <h2 className="card-title">{category.name}</h2>
                  {category.blogs_count !== undefined && (
                    <div className="badge badge-primary p-4">
                      {category.blogs_count} {category.blogs_count === 1 ? 'Post' : 'Posts'}
                    </div>
                  )}
                </div>
                {category.description && <p className="mt-2 text-gray-600">{category.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {categories.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70">No categories found</p>
        </div>
      )}
    </div>
  );
}
