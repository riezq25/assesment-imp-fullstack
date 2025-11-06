'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { blogService } from '@/services/blogService';
import { Category, Blog } from '@/types';
import Link from 'next/link';
import api from '@/lib/api';

export default function CategoryDetailPage() {
  const params = useParams();
  const [category, setCategory] = useState<Category | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCategoryAndBlogs();
    }
  }, [params.id]);

  const fetchCategoryAndBlogs = async () => {
    try {
      const categoryResponse = await blogService.getCategory(Number(params.id));
      setCategory(categoryResponse.data);

      // Fetch blogs for this category
      const blogsResponse = await api.get<{ data: Blog[] }>(`/blogs?category_id=${params.id}`);
      setBlogs(blogsResponse.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch category details');
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

  if (error || !category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error || 'Category not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="breadcrumbs text-sm mb-4">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/categories">Categories</Link></li>
            <li>{category.name}</li>
          </ul>
        </div>
        
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-lg text-base-content/70">{category.description}</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-6">Posts in this category</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <Link href={`/blogs/${blog.slug}`} key={blog.id}>
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow cursor-pointer h-full">
              <div className="card-body">
                <h3 className="card-title">{blog.title}</h3>
                {blog.excerpt && (
                  <p className="text-base-content/70">{blog.excerpt}</p>
                )}
                <div className="card-actions justify-between items-center mt-4">
                  <div className="text-sm text-base-content/60">
                    {blog.creator?.name || 'Unknown'}
                  </div>
                  <div className="badge badge-outline">Read more</div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70">No posts in this category yet</p>
        </div>
      )}
    </div>
  );
}
