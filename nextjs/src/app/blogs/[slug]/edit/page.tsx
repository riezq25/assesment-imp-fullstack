'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [featuredImage, setFeaturedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (params.slug) {
      fetchBlogAndCategories();
    }
  }, [params.slug]);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('excerpt', excerpt);
    formData.append('category_id', categoryId);
    if (featuredImage) {
      formData.append('featured_image', featuredImage);
    }

    try {
      await blogService.updateBlog(blog!.id, formData, true);
      router.push(`/blogs/${blog!.slug}`);
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

  if (blog.created_by !== user?.id) {
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Blog Title</legend>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter blog title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <p className="label">Required</p>
          </fieldset>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Category</legend>
              <select 
                className="select w-full"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option disabled value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <p className="label">Required</p>
            </fieldset>

            {/* Featured Image Field */}
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Featured Image</legend>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {featuredImage ? 'Change Image' : 'Upload Image'}
                </button>
                {featuredImage && (
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm text-error"
                    onClick={() => {
                      setFeaturedImage(null);
                      setPreviewImage('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="label">Optional</p>
              
              {/* Image Previews */}
              <div className="mt-2 space-y-2">
                {(previewImage || blog.featured_image) && !featuredImage && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                    <img
                      src={previewImage || blog.featured_image}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-lg border border-base-300"
                    />
                  </div>
                )}
                {previewImage && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">New Image Preview:</p>
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-lg border border-base-300"
                    />
                  </div>
                )}
              </div>
            </fieldset>
          </div>

          {/* Excerpt Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Excerpt</legend>
            <textarea
              className="textarea w-full"
              placeholder="Brief summary of your blog post"
              rows={4}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            ></textarea>
            <p className="label">A short summary of your blog post (Optional)</p>
          </fieldset>

          {/* Content Field */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Content</legend>
            <textarea
              className="textarea w-full"
              placeholder="Write your blog content here..."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
            <p className="label">Required</p>
          </fieldset>

            <div className="divider"></div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => router.back()}
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Updating...
                  </>
                ) : 'Update Post'}
              </button>
            </div>
        </form>
      </div>
    </div>
  );
}
