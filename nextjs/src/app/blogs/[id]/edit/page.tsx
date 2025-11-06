'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { blogService } from '@/services/blogService';
import { Blog, Category } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.id) {
      fetchBlogAndCategories();
    }
  }, [params.id]);

  const fetchBlogAndCategories = async () => {
    try {
      const [blogResponse, categoriesResponse] = await Promise.all([
        blogService.getBlogBySlug(String(params.slug)),
        blogService.getCategories(),
      ]);

      const blogData = blogResponse.data;
      setBlog(blogData);
      setTitle(blogData.title);
      setContent(blogData.content);
      setExcerpt(blogData.excerpt || '');
      setCategoryId(String(blogData.category_id));
      setCategories(categoriesResponse.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await blogService.updateBlog(Number(params.id), {
        title,
        content,
        excerpt,
        category_id: Number(categoryId),
      });
      router.push(`/blogs/${params.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update blog post');
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user || !blog) {
    return null;
  }

  if (blog.user_id !== user.id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="alert alert-error">
          <span>You are not authorized to edit this blog post</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Edit Blog Post</h1>

        <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Category</span>
              </label>
              <select
                className="select select-bordered"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Excerpt (Optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Brief summary of your blog post"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-64"
                placeholder="Write your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="card-actions justify-end mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <span className="loading loading-spinner"></span> : 'Update Post'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
