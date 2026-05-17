import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, address, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Auth check error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
