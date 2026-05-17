import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function PUT(request) {
  try {
    const decoded = await getUserFromRequest(request);
    if (!decoded) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const updates = await request.json();
    const allowedFields = ['name', 'phone', 'address'];
    const safeUpdates = {};
    for (const key of allowedFields) {
      if (updates[key] !== undefined) safeUpdates[key] = updates[key];
    }
    safeUpdates.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('users')
      .update(safeUpdates)
      .eq('id', decoded.id)
      .select('id, name, email, phone, address, role, created_at')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
