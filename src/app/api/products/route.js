import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const sub_category = searchParams.get('sub_category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'desc';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase.from('products').select('*, stock(*)', { count: 'exact' });

    if (category) query = query.eq('category', category);
    if (sub_category) query = query.eq('sub_category', sub_category);
    if (featured === 'true') query = query.eq('featured', true);
    if (search) query = query.ilike('name', `%${search}%`);

    query = query.order(sort, { ascending: order === 'asc' });
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Products fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({ products: data, total: count });
  } catch (err) {
    console.error('Products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
