'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { generateSessionSignature, SESSION_COOKIE_NAME } from '@/lib/auth';

export interface LoginState {
  error?: string;
}

function safeCompare(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  const expectedUser = process.env.ADMIN_USERNAME || 'upswarpora';
  const expectedPass = process.env.ADMIN_PASSWORD || '';

  if (!expectedPass) {
    return {
      error: 'Server configuration error: ADMIN_PASSWORD is not set in .env.local.',
    };
  }

  if (!username || !password) {
    return { error: 'Please enter both Staff ID / Username and Password.' };
  }

  const isUserValid = safeCompare(username, expectedUser);
  const isPassValid = safeCompare(password, expectedPass);

  if (!isUserValid || !isPassValid) {
    return { error: 'Invalid credentials. Access denied.' };
  }

  const signature = await generateSessionSignature();

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, signature, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect('/all-students');
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect('/login');
}