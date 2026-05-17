import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

// GET all orders (admin only)
export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('orders')
      .select('*, users(name, email, phone), order_items(*, products(name, image_url, category))')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Admin orders error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error('Admin orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Update order status (admin only)
export async function PUT(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { order_id, status } = await request.json();
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', order_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (err) {
    console.error('Order update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
