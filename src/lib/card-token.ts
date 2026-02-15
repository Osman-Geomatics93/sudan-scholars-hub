/**
 * Student Card Token — JWT-like HMAC-SHA256 signed tokens using Web Crypto API.
 * Zero npm dependencies. Uses NEXTAUTH_SECRET as the signing key.
 *
 * Token format: base64url(header).base64url(payload).base64url(signature)
 * Header:  { "alg": "HS256", "typ": "SCT" }  (Student Card Token)
 * Payload: { "sub": userId, "iat": unix, "exp": unix }
 */

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const;

// ─── Base64url helpers ───────────────────────────────────────────

function base64urlEncode(data: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < data.length; i++) {
    binary += String.fromCharCode(data[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function textToBase64url(text: string): string {
  return base64urlEncode(new TextEncoder().encode(text));
}

// ─── Signing key (cached in module scope) ────────────────────────

let cachedKey: CryptoKey | null = null;

async function getSigningKey(): Promise<CryptoKey> {
  if (cachedKey) return cachedKey;

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }

  cachedKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    ALGORITHM,
    false,
    ['sign', 'verify']
  );

  return cachedKey;
}

// ─── Header (static) ────────────────────────────────────────────

const HEADER = textToBase64url(JSON.stringify({ alg: 'HS256', typ: 'SCT' }));

// ─── Public API ─────────────────────────────────────────────────

/**
 * Sign a card token for the given user.
 * @param userId  The user's database ID
 * @param ttlSeconds  Token lifetime in seconds (default 900 = 15 min)
 * @returns Signed token string (header.payload.signature)
 */
export async function signCardToken(
  userId: string,
  ttlSeconds: number = 900
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId,
    iat: now,
    exp: now + ttlSeconds,
  };

  const payloadB64 = textToBase64url(JSON.stringify(payload));
  const signingInput = `${HEADER}.${payloadB64}`;

  const key = await getSigningKey();
  const signatureBytes = new Uint8Array(
    await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput))
  );

  return `${signingInput}.${base64urlEncode(signatureBytes)}`;
}

/**
 * Verify and decode a card token.
 * @returns Decoded payload if valid, or null if invalid/expired.
 */
export async function verifyCardToken(
  token: string
): Promise<{ sub: string; iat: number; exp: number } | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, signatureB64] = parts;

  // Verify signature
  const key = await getSigningKey();
  const signingInput = `${headerB64}.${payloadB64}`;
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = base64urlDecode(signatureB64);
  } catch {
    return null;
  }

  // Copy into a fresh ArrayBuffer to satisfy TypeScript's BufferSource type
  const sigBuffer = new ArrayBuffer(signatureBytes.byteLength);
  new Uint8Array(sigBuffer).set(signatureBytes);

  const valid = await crypto.subtle.verify(
    'HMAC',
    key,
    sigBuffer,
    new TextEncoder().encode(signingInput)
  );

  if (!valid) return null;

  // Decode and validate payload
  let payload: { sub: string; iat: number; exp: number };
  try {
    const decoded = new TextDecoder().decode(base64urlDecode(payloadB64));
    payload = JSON.parse(decoded);
  } catch {
    return null;
  }

  // Check required fields
  if (!payload.sub || !payload.exp || !payload.iat) return null;

  // Check expiry
  const now = Math.floor(Date.now() / 1000);
  if (now > payload.exp) return null;

  return payload;
}
