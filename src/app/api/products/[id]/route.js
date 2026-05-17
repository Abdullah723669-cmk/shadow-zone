import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get stock info
    const { data: stock } = await supabase
      .from('stock')
      .select('*')
      .eq('product_id', id);

    // Get related products
    const { data: related } = await supabase
      .from('products')
      .select('*, stock(*)')
      .eq('category', product.category)
      .neq('id', id)
      .limit(4);

    return NextResponse.json({ product, stock: stock || [], related: related || [] });
  } catch (err) {
    console.error('Product detail error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
