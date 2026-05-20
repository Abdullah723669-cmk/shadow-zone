import { NextResponse } from 'next/server';
import { supabase, createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const supabase = createServerClient();
    let query = supabase
      .from('orders')
      .select('*, order_items(*, products(name, image_url, category))')
      .eq('user_id', decoded.id)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;

    if (error) {
      console.error('Orders fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({ orders: data });
  } catch (err) {
    console.error('Orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { items, shipping_address, payment_method } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shipping_address) {
      return NextResponse.json({ error: 'Shipping address is required' }, { status: 400 });
    }

    const total_amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const supabase = createServerClient();
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: decoded.id,
        total_amount,
        shipping_address,
        payment_method: payment_method || 'cod',
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      require('fs').appendFileSync('order_error.txt', JSON.stringify(orderError) + '\n');
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      size: item.size || null,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Order items error:', itemsError);
      require('fs').appendFileSync('order_items_error.txt', JSON.stringify(itemsError) + '\n');
      // Rollback order
      await supabase.from('orders').delete().eq('id', order.id);
      return NextResponse.json({ error: 'Failed to create order items' }, { status: 500 });
    }

    // Update stock in real-time
    for (const item of items) {
      try {
        let query = supabase.from('stock').select('*').eq('product_id', item.id);
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
            .eq('product_id', item.id)
            .is('size', null)
            .maybeSingle();
          stockEntry = fallbackEntry;
        }

        if (stockEntry) {
          const newQty = Math.max(0, (stockEntry.quantity || 0) - item.quantity);
          await supabase
            .from('stock')
            .update({ quantity: newQty })
            .eq('id', stockEntry.id);
        }
      } catch (stockErr) {
        console.error('Failed to decrement stock for item:', item.id, stockErr);
      }
    }

    return NextResponse.json({ order, message: 'Order placed successfully' }, { status: 201 });
  } catch (err) {
    console.error('Order creation error:', err);
    return NextResponse.json({ error: `Internal error: ${err.message}`, stack: err.stack }, { status: 500 });
  }
}
