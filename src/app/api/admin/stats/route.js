import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Total products
    const { count: totalProducts } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });

    // Total customers
    const { count: totalCustomers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'customer');

    // Revenue from delivered orders
    const { data: deliveredOrders } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('status', 'delivered');

    const totalRevenue = (deliveredOrders || []).reduce(
      (sum, o) => sum + parseFloat(o.total_amount || 0), 0
    );

    // Pending orders count
    const { count: pendingOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Recent orders
    const { data: recentOrders } = await supabase
      .from('orders')
      .select('*, users(name, email)')
      .order('created_at', { ascending: false })
      .limit(5);

    // Orders by status
    const { data: allOrders } = await supabase
      .from('orders')
      .select('status');

    const statusCounts = {};
    (allOrders || []).forEach(o => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // Products by category
    const { data: allProducts } = await supabase
      .from('products')
      .select('category');

    const categoryCounts = {};
    (allProducts || []).forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    return NextResponse.json({
      stats: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalRevenue,
        pendingOrders,
        statusCounts,
        categoryCounts,
      },
      recentOrders: recentOrders || [],
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
