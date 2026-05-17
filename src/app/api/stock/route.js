import { NextResponse } from 'next/server';
import { supabase, createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data: stock, error } = await supabase
      .from('stock')
      .select('*, products(name, category, image_url)')
      .order('product_id', { ascending: true });

    if (error) {
      console.error('Fetch stock error:', error);
      return NextResponse.json({ error: 'Failed to fetch stock' }, { status: 500 });
    }

    return NextResponse.json({ stock });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { stockItems } = await request.json(); // Array of { id, quantity }

    if (!Array.isArray(stockItems) || stockItems.length === 0) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const supabaseAdmin = createServerClient();
    
    // Update stock sequentially or using bulk upsert
    // For simplicity, update each one
    for (const item of stockItems) {
      await supabaseAdmin
        .from('stock')
        .update({ quantity: item.quantity, last_restocked: new Date().toISOString() })
        .eq('id', item.id);
    }

    return NextResponse.json({ message: 'Stock updated successfully' });
  } catch (err) {
    console.error('Update stock error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
