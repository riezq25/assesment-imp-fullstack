'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import the BlogList component with SSR disabled
const BlogList = dynamic(() => import('@/components/BlogList'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center items-center min-h-[200px]">
      <span className="loading loading-spinner loading-lg"></span>
    </div>
  ),
});

export default function BlogsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog Posts</h1>
        <Link href="/blogs/create" className="btn btn-primary">
          Create New Post
        </Link>
      </div>
      
      <BlogList />
    </div>
  );
}
