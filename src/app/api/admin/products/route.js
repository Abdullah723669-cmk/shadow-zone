import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

// GET all products (admin view)
export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('products')
      .select('*, stock(*)')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }

    return NextResponse.json({ products: data });
  } catch (err) {
    console.error('Admin products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// CREATE product (admin only)
export async function POST(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, original_price, category, sub_category, size, color, image_url, featured } = body;

    if (!name || !price || !category || !sub_category) {
      return NextResponse.json({ error: 'Name, price, category, and sub-category are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('products')
      .insert({
        name,
        description,
        price,
        original_price: original_price || null,
        category,
        sub_category,
        size: size || null,
        color: color || null,
        image_url: image_url || null,
        featured: featured || false,
      })
      .select()
      .single();

    if (error) {
      console.error('Product creation error:', error);
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }

    // Automatically create a stock entry for the new product
    const { error: stockError } = await supabase
      .from('stock')
      .insert({
        product_id: data.id,
        quantity: 0
      });

    if (stockError) {
      console.error('Stock creation error:', stockError);
      // We don't fail the whole request, but log the error. The admin might need to add stock manually if this fails.
    }

    return NextResponse.json({ product: data }, { status: 201 });
  } catch (err) {
    console.error('Product creation error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// UPDATE product (admin only)
export async function PUT(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }

    return NextResponse.json({ product: data });
  } catch (err) {
    console.error('Product update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE product (admin only)
export async function DELETE(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Delete associated stock first
    await supabase.from('stock').delete().eq('product_id', id);

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Product deleted' });
  } catch (err) {
    console.error('Product deletion error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
