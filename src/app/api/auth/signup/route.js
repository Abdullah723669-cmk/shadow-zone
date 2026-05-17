import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabase } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, phone } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    // Check existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: 'customer',
      })
      .select('id, name, email, phone, role, created_at')
      .single();

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
    }

    const token = signToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    const response = NextResponse.json({ user: newUser, message: 'Account created successfully' });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
