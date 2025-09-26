import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';

    if (!query.trim()) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const products = await searchProducts(query, category);
    
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Search products error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
