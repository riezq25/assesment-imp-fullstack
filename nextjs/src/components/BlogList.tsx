'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { blogService } from '@/services/blogService';
import { Blog, PaginatedResponse } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function BlogList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '');
  const [categoryName, setCategoryName] = useState('');
  const { user } = useAuth();

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await blogService.getBlogs(currentPage, searchQuery, categoryId);
      setBlogs(response.data);
      setTotalPages(response.meta.last_page);
      
      // If we have a category_id in the URL, fetch the category name
      if (categoryId && response.data.length > 0 && response.data[0].category) {
        setCategoryName(response.data[0].category.name);
      } else {
        setCategoryName('');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, categoryId]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.search as HTMLInputElement;
    setSearchQuery(searchInput.value);
    setCategoryId('');
    setCurrentPage(1);
    // Update URL with search query
    const params = new URLSearchParams();
    if (searchInput.value) {
      params.set('q', searchInput.value);
    }
    router.push(`/blogs?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCategoryId('');
    setCategoryName('');
    setCurrentPage(1);
    router.push('/blogs');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="form-control flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Search blog posts..."
                className="input input-bordered w-full pr-16"
                defaultValue={searchQuery}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-2">
                {searchQuery && (
                  <button 
                    type="button"
                    onClick={clearSearch}
                    className="btn btn-ghost btn-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button 
                  type="submit" 
                  className="btn btn-primary btn-square btn-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          {searchQuery && (
            <button 
              type="button" 
              onClick={clearSearch}
              className="btn btn-outline"
            >
              Clear Search
            </button>
          )}
        </form>
        {searchQuery && (
          <div className="mt-2 text-sm text-gray-600">
            Showing results for: <span className="font-semibold">{searchQuery}</span>
            <button 
              onClick={clearSearch}
              className="ml-2 text-primary hover:underline"
            >
              (clear)
            </button>
          </div>
        )}
      </div>
      
      {categoryName && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Category: {categoryName}</h2>
          <button 
            onClick={clearSearch}
            className="mt-2 text-sm text-primary hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to all posts
          </button>
        </div>
      )}
      <div className="space-y-8">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div key={blog.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <figure className="h-48 w-full overflow-hidden">
                  <img
                    src={blog.featured_image || '/placeholder.png'}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.png';
                      target.onerror = null;
                    }}
                  />
                </figure>
                <div className="card-body">
                  <div className="flex justify-between items-start mb-2">
                    <div className="badge badge-primary">{blog.category?.name}</div>
                    {blog.creator?.id === user?.id && (
                      <Link 
                        href={`/blogs/${blog.slug}/edit`} 
                        className="btn btn-sm btn-ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    )}
                  </div>
                  <h2 className="card-title">
                    <Link href={`/blogs/${blog.slug}`} className="hover:underline">
                      {blog.title}
                    </Link>
                  </h2>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <div className="avatar mr-2">
                      <div className="w-8 rounded-full">
                        {blog.creator?.avatar ? (
                          <Image
                            src={blog.creator.avatar}
                            alt={blog.creator.name || 'User'}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                            {blog.creator?.name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    </div>
                    <span>{blog.creator?.name || 'Unknown User'}</span>
                    <span className="mx-2">•</span>
                    <span>{blog.created_at ? new Date(blog.created_at).toLocaleDateString() : ''}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {searchQuery 
                ? 'No blog posts found matching your search.'
                : 'No blog posts available yet.'}
            </p>
            {searchQuery && (
              <button 
                onClick={clearSearch}
                className="mt-4 btn btn-ghost"
              >
                Clear search and show all posts
              </button>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="join">
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`join-item btn ${currentPage === pageNum ? 'btn-active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="join-item btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
