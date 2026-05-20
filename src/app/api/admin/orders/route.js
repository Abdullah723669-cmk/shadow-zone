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

    const { data: currentOrder, error: fetchOrderError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', order_id)
      .single();

    if (fetchOrderError || !currentOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const isTransitioningToCancelled = currentOrder.status !== 'cancelled' && status === 'cancelled';

    if (isTransitioningToCancelled) {
      // Retrieve associated order items
      const { data: orderItems, error: itemsError } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', order_id);

      if (!itemsError && orderItems) {
        for (const item of orderItems) {
          try {
            let query = supabase.from('stock').select('*').eq('product_id', item.product_id);
            if (item.size) {
              query = query.eq('size', item.size);
            } else {
              query = query.is('size', null);
            }

            let { data: stockEntry } = await query.maybeSingle();

            // Fallback: if size was requested but no size-specific stock entry exists, check for null-size entry
            if (!stockEntry && item.size) {
              const { data: fallbackEntry } = await supabase.from('stock')
                .select('*')
                .eq('product_id', item.product_id)
                .is('size', null)
                .maybeSingle();
              stockEntry = fallbackEntry;
            }

            if (stockEntry) {
              const newQty = (stockEntry.quantity || 0) + item.quantity;
              await supabase
                .from('stock')
                .update({ quantity: newQty })
                .eq('id', stockEntry.id);
            }
          } catch (stockErr) {
            console.error('Failed to increment stock for cancelled item:', item.product_id, stockErr);
          }
        }
      }
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
