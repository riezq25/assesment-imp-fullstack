'use client';

import { useEffect, useState } from 'react';
import { blogService } from '@/services/blogService';
import { Blog } from '@/types';
import Link from 'next/link';

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogService.getBlogs(currentPage);
      setBlogs(response.data);
      setLastPage(response.last_page);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  if (loading && currentPage === 1) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        <Link href="/blogs/create" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="card-body">
              <h2 className="card-title">{blog.title}</h2>
              {blog.excerpt && (
                <p className="text-base-content/70 line-clamp-3">{blog.excerpt}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                {blog.category && (
                  <Link href={`/categories/${blog.category.id}`}>
                    <div className="badge badge-primary">{blog.category.name}</div>
                  </Link>
                )}
              </div>
              <div className="card-actions justify-between items-center mt-4">
                <div className="text-sm text-base-content/60">
                  By {blog.user?.name || 'Unknown'}
                </div>
                <Link href={`/blogs/${blog.id}`} className="btn btn-sm btn-outline">
                  Read More
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {blogs.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-xl text-base-content/70">No blog posts found</p>
          <Link href="/blogs/create" className="btn btn-primary mt-4">
            Create First Post
          </Link>
        </div>
      )}

      {lastPage > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              «
            </button>
            <button className="join-item btn">
              Page {currentPage} of {lastPage}
            </button>
            <button
              className="join-item btn"
              onClick={() => setCurrentPage(p => Math.min(lastPage, p + 1))}
              disabled={currentPage === lastPage || loading}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
