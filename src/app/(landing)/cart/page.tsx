'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image_url: string;
    kind: string;
    stock: number;
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  const loadCartItems = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/cart', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setCartItems(data.cartItems);
      } else if (response.status === 401) {
        router.push('/login');
      } else {
        setError('Failed to load cart items');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading cart.');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        if (newQuantity === 0) {
          setCartItems(items => items.filter(item => item.id !== cartItemId));
        } else {
          const data = await response.json();
          setCartItems(items => 
            items.map(item => 
              item.id === cartItemId ? data.cartItem : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`/api/cart/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCartItems(items => items.filter(item => item.id !== cartItemId));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #eee1ba 0%, #fffaf2 70%)'
      }}>
        <div style={{ color: '#894e3f', fontSize: '18px' }}>Loading cart...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #eee1ba 0%, #fffaf2 70%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ 
            color: '#894e3f', 
            fontSize: '32px', 
            fontWeight: 800, 
            margin: '0 0 8px 0',
            letterSpacing: '0.5px'
          }}>
            Your Cart
          </h1>
          <p style={{ color: '#9c634f', margin: 0 }}>
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
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

        {cartItems.length === 0 ? (
          <div style={{
            background: '#fff',
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ color: '#894e3f', marginBottom: '1rem' }}>Your cart is empty</h2>
            <p style={{ color: '#9c634f', marginBottom: '2rem' }}>
              Start adding some delicious pastries to your cart!
            </p>
            <Link href="/" style={{
              background: '#9c634f',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block'
            }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {cartItems.map((item) => (
              <div key={item.id} style={{
                background: '#fff',
                padding: '1.5rem',
                borderRadius: '12px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                display: 'grid',
                gridTemplateColumns: '100px 1fr auto',
                gap: '1rem',
                alignItems: 'center'
              }}>
                <div style={{ position: 'relative', paddingTop: '75%' }}>
                  <Image 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    fill
                    style={{
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                </div>

                <div>
                  <h3 style={{ 
                    color: '#894e3f', 
                    fontSize: '18px', 
                    fontWeight: 700, 
                    margin: '0 0 4px 0',
                    letterSpacing: '0.3px'
                  }}>
                    {item.product.name}
                  </h3>
                  <p style={{ 
                    color: '#9c634f', 
                    fontSize: '14px', 
                    margin: '0 0 8px 0' 
                  }}>
                    {item.product.kind}
                  </p>
                  <p style={{ 
                    color: '#7a4a3d', 
                    fontSize: '16px', 
                    fontWeight: 600, 
                    margin: 0 
                  }}>
                    {formatCurrency(item.product.price)} each
                  </p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '8px',
                    justifyContent: 'flex-end'
                  }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        background: item.quantity <= 1 ? '#f0f0f0' : '#f0d7a7',
                        color: item.quantity <= 1 ? '#ccc' : '#894e3f',
                        border: 'none',
                        borderRadius: '4px',
                        width: '32px',
                        height: '32px',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        fontWeight: 600
                      }}
                    >
                      -
                    </button>
                    <span style={{ 
                      color: '#894e3f', 
                      fontWeight: 600, 
                      minWidth: '24px',
                      textAlign: 'center'
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      style={{
                        background: item.quantity >= item.product.stock ? '#f0f0f0' : '#f0d7a7',
                        color: item.quantity >= item.product.stock ? '#ccc' : '#894e3f',
                        border: 'none',
                        borderRadius: '4px',
                        width: '32px',
                        height: '32px',
                        cursor: item.quantity >= item.product.stock ? 'not-allowed' : 'pointer',
                        fontSize: '18px',
                        fontWeight: 600
                      }}
                    >
                      +
                    </button>
                  </div>
                  
                  <p style={{ 
                    color: '#9c634f', 
                    fontSize: '16px', 
                    fontWeight: 700, 
                    margin: '0 0 8px 0' 
                  }}>
                    {formatCurrency(item.product.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      background: 'transparent',
                      color: '#d32f2f',
                      border: '1px solid #d32f2f',
                      borderRadius: '4px',
                      padding: '4px 8px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div style={{
              background: '#fff',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
              textAlign: 'right'
            }}>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: 800, 
                color: '#894e3f',
                marginBottom: '1rem',
                letterSpacing: '0.5px'
              }}>
                Total: {formatCurrency(totalAmount)}
              </div>
              <button style={{
                background: '#9c634f',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '14px 28px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: 'pointer',
                letterSpacing: '0.5px'
              }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
