'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Welcome to BlogApp</h1>
          <p className="py-6">
            A simple and elegant blog platform built with Next.js and DaisyUI. 
            Share your thoughts, explore categories, and connect with other writers.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/blogs" className="btn btn-primary">
              Explore Blogs
            </Link>
            <Link href="/categories" className="btn btn-outline">
              Browse Categories
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
