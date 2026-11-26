import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'gmsw_session';

export async function generateSessionSignature(): Promise<string> {
  const expectedUser = process.env.ADMIN_USERNAME || 'upswarpora';
  const secret = process.env.SESSION_SECRET || 'gmsw_default_secret';

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(`${expectedUser}:authenticated`)
  );

  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token) return false;
  const expectedToken = await generateSessionSignature();
  if (token.length !== expectedToken.length) return false;

  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < token.length; i++) {
    mismatch |= token.charCodeAt(i) ^ expectedToken.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySessionToken(token);
}