import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'shadow-zone-secret';

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request) {
  // Try cookie header from request first
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/token=([^;]+)/);
  if (match) return match[1];

  // Try authorization header
  const authHeader = request.headers.get('authorization') || '';
  if (authHeader.startsWith('Bearer ')) return authHeader.slice(7);

  return null;
}

export async function getUserFromRequest(request) {
  // Method 1: Use Next.js cookies() API (most reliable)
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');
    if (tokenCookie?.value) {
      const decoded = verifyToken(tokenCookie.value);
      if (decoded) return decoded;
    }
  } catch {
    // cookies() may not be available in all contexts
  }

  // Method 2: Parse from request headers (fallback)
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}
