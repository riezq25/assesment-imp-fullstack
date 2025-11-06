'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-24">
                  <span className="text-3xl">{user.name.charAt(0).toUpperCase()}</span>
                </div>
              </div>
              <div>
                <h2 className="card-title text-2xl">{user.name}</h2>
                <p className="text-base-content/70">{user.email}</p>
              </div>
            </div>

            <div className="divider"></div>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-semibold">Name</span>
                </label>
                <input
                  type="text"
                  value={user.name}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <input
                  type="email"
                  value={user.email}
                  className="input input-bordered w-full"
                  disabled
                />
              </div>

              {user.created_at && (
                <div>
                  <label className="label">
                    <span className="label-text font-semibold">Member Since</span>
                  </label>
                  <input
                    type="text"
                    value={new Date(user.created_at).toLocaleDateString()}
                    className="input input-bordered w-full"
                    disabled
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
