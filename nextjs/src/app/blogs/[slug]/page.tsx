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
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

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
      await blogService.deleteBlogBySlug(String(params.slug));
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

  const isAuthor = user && blog.created_by === user.id;
  const editUrl = `/blogs/${params.slug}/edit`;

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
          {blog.featured_image && (
            <figure className="relative w-full h-96 overflow-hidden">
              <img
                src={blog.featured_image}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </figure>
          )}
          <div className="card-body">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-bold">{blog.title}</h1>
              {isAuthor && (
                <div className="flex space-x-2">
                  <Link href={editUrl} className="btn btn-sm btn-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </Link>
                  <button 
                    className="btn btn-sm btn-error"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 items-center mb-6">
              {blog.category && (
                <Link href={`/categories/${blog.category.id}`}>
                  <div className="badge badge-primary badge-lg">{blog.category.name}</div>
                </Link>
              )}
              <div className="text-base-content/60">
                By {blog.creator?.name || 'Unknown'}
              </div>
              {(blog.published_at || blog.created_at) && (
                <div className="text-base-content/60">
                  {new Date(blog.published_at || blog.created_at!).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              )}
            </div>

            {blog.excerpt && (
              <div className="alert alert-info mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="italic">{blog.excerpt}</span>
              </div>
            )}

            {blog.image && (
              <figure className="mb-6">
                <img src={blog.image} alt={blog.title} className="rounded-lg w-full object-cover max-h-96" />
              </figure>
            )}

            <div className="divider"></div>

            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-base leading-relaxed">{blog.content}</div>
            </div>

            {isAuthor && (
              <>
                <div className="divider"></div>
                <div className="card-actions justify-end">
                  <Link href={`/blogs/${blog.slug}/edit`} className="btn btn-primary">
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
