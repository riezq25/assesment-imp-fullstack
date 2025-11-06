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
          <Link href={`/categories/${category.id}`} key={category.id}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer">
              <div className="card-body">
                <h2 className="card-title">{category.name}</h2>
                {category.description && (
                  <p className="text-base-content/70">{category.description}</p>
                )}
                <div className="card-actions justify-end">
                  <div className="badge badge-primary">View Posts</div>
                </div>
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
