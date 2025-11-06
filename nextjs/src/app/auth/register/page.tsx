'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    setError('');
    setSuccess(false);

    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting to register with:', { name, email });
      
      // Call register and get the success message
      const result = await register({ 
        name, 
        email, 
        password, 
        password_confirmation: passwordConfirmation 
      });
      
      console.log('Registration successful:', result.message);
      
      // Show success message
      setSuccess(true);
      setError('');
      
      // Show success message for 3 seconds before redirecting to login
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (err: any) {
      console.error('Registration error:', {
        error: err,
        response: err.response?.data,
        status: err.response?.status,
        message: err.message
      });
      
      // Handle validation errors
      if (err.response?.data?.errors) {
        const errorMessages = Object.values(err.response.data.errors)
          .flat()
          .join('\n');
        setError(errorMessages);
      } else {
        // Handle other errors
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           err.message || 
                           'Registration failed. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Register now!</h1>
          <p className="py-6">
            Join our community and start sharing your thoughts through blog posts.
          </p>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                placeholder="confirm password"
                className="input input-bordered"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Registration successful! Redirecting to homepage...</span>
              </div>
            )}
            <div className="form-control mt-6">
              <button className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : 'Register'}
              </button>
            </div>
            <div className="text-center mt-4">
              <span className="text-sm">Already have an account? </span>
              <Link href="/auth/login" className="link link-primary text-sm">
                Login here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
