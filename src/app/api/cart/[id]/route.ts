import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeFromCart } from '@/lib/cart';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

const updateCartSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const cartItemId = parseInt(params.id);
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 });
    }

    const body = await request.json();
    const { quantity } = updateCartSchema.parse(body);

    const updatedItem = await updateCartItem(decoded.userId, cartItemId, quantity);
    
    if (!updatedItem) {
      return NextResponse.json(
        { message: 'Item removed from cart' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Cart item updated', cartItem: updatedItem },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Update cart item error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const cartItemId = parseInt(params.id);
    if (isNaN(cartItemId)) {
      return NextResponse.json({ error: 'Invalid cart item ID' }, { status: 400 });
    }

    const success = await removeFromCart(decoded.userId, cartItemId);
    
    if (!success) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    return NextResponse.json(
      { message: 'Item removed from cart' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove from cart error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
