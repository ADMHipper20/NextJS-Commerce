'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login page
        router.push('/login?message=Registration successful. Please sign in.');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
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
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#894e3f', 
            fontSize: '28px', 
            fontWeight: 800, 
            margin: '0 0 8px 0',
            letterSpacing: '0.5px'
          }}>
            Join Bloom & Crust
          </h1>
          <p style={{ color: '#9c634f', margin: 0 }}>
            Create your account to start ordering
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ 
                display: 'block', 
                color: '#894e3f', 
                fontWeight: 600, 
                marginBottom: '8px',
                letterSpacing: '0.3px',
                fontSize: '14px'
              }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
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
            <div>
              <label style={{ 
                display: 'block', 
                color: '#894e3f', 
                fontWeight: 600, 
                marginBottom: '8px',
                letterSpacing: '0.3px',
                fontSize: '14px'
              }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
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
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              color: '#894e3f', 
              fontWeight: 600, 
              marginBottom: '8px',
              letterSpacing: '0.3px'
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
              letterSpacing: '0.3px'
            }}>
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
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
              letterSpacing: '0.3px'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
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
              letterSpacing: '0.3px'
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p style={{ color: '#9c634f', margin: '0 0 8px 0' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ 
              color: '#894e3f', 
              textDecoration: 'none', 
              fontWeight: 600 
            }}>
              Sign in
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
