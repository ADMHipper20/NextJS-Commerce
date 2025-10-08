'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirect to home
        router.push('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #eee1ba 0%, #fffaf2 70%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#fff',
        padding: '2rem',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#894e3f', 
            fontSize: '28px', 
            fontWeight: 600, 
            margin: '0 0 8px 0',
            letterSpacing: '1px'
          }}>
            Welcome Back
          </h1>
          <p style={{ color: '#9c634f', margin: 0 }}>
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#894e3f', 
              fontWeight: 600, 
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e6c98c',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#7a4a3d',
                background: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#9c634f'}
              onBlur={(e) => e.target.style.borderColor = '#e6c98c'}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#894e3f', 
              fontWeight: 600, 
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #e6c98c',
                borderRadius: '8px',
                fontSize: '16px',
                color: '#7a4a3d',
                background: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#9c634f'}
              onBlur={(e) => e.target.style.borderColor = '#e6c98c'}
            />
          </div>

          {error && (
            <div style={{
              background: '#ffe6e6',
              color: '#d32f2f',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px',
              background: isLoading ? '#b9a39e' : '#9c634f',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              letterSpacing: '0.5px'
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#9c634f', margin: '0 0 8px 0' }}>
            {"Don't have an account? "}{''}
            <Link href="/register" style={{ 
              color: '#894e3f', 
              textDecoration: 'none', 
              fontWeight: 600 
            }}>
              Sign up
            </Link>
          </p>
          <Link href="/" style={{ 
            color: '#9c634f', 
            textDecoration: 'none', 
            fontSize: '14px' 
          }}>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
