'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { blogService } from '@/services/blogService';
import { Blog } from '@/types';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchBlog();
    }
  }, [params.id]);

  const fetchBlog = async () => {
    try {
      const response = await blogService.getBlogBySlug(String(params.slug));
      setBlog(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setDeleting(true);
    try {
      await blogService.deleteBlog(Number(params.id));
      router.push('/blogs');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete blog post');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>{error || 'Blog post not found'}</span>
        </div>
        <Link href="/blogs" className="btn btn-primary mt-4">
          Back to Blogs
        </Link>
      </div>
    );
  }

  const isAuthor = user && blog.user_id === user.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="breadcrumbs text-sm mb-4">
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/blogs">Blogs</Link></li>
            <li>{blog.title}</li>
          </ul>
        </div>

        <article className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
            
            <div className="flex flex-wrap gap-4 items-center mb-6">
              {blog.category && (
                <Link href={`/categories/${blog.category.id}`}>
                  <div className="badge badge-primary badge-lg">{blog.category.name}</div>
                </Link>
              )}
              <div className="text-base-content/60">
                By {blog.user?.name || 'Unknown'}
              </div>
              {blog.created_at && (
                <div className="text-base-content/60">
                  {new Date(blog.created_at).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="divider"></div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{blog.content}</p>
            </div>

            {isAuthor && (
              <>
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <Link href={`/blogs/${blog.id}/edit`} className="btn btn-primary">
                    Edit Post
                  </Link>
                  <button
                    className="btn btn-error"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? <span className="loading loading-spinner"></span> : 'Delete Post'}
                  </button>
                </div>
              </>
            )}
          </div>
        </article>

        <div className="mt-6">
          <Link href="/blogs" className="btn btn-ghost">
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </div>
  );
}
