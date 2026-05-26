import { jwtVerify } from 'jose';

/**
 * Retrieves the current user session from a cookies store.
 *
 * In Next.js 16 the `cookies()` helper can only be used in server
 * components/route handlers. Importing this utility in other
 * contexts (e.g., client components) leads to a runtime error:
 * "cookies is not a function". To make the helper reusable we
 * accept a `cookiesStore` argument that should be the result of
 * `cookies()` when called from a server environment.
 *
 * @param {ReturnType<import('next/headers').cookies>} cookiesStore
 *   The cookies store obtained from `cookies()`.
 * @returns {Promise<null|object>} The JWT payload (`{ userId, role }`) or null.
 */
export async function getUserSession(cookiesStore) {
  // Support passing a Promise returned by `cookies()` in Next.js 16.
  if (cookiesStore && typeof cookiesStore.then === 'function') {
    cookiesStore = await cookiesStore;
  }

  // If no store is provided, resolve it in a server environment.
  if (!cookiesStore) {
    if (typeof window !== 'undefined') {
      return null;
    }
    try {
      const { cookies } = await import('next/headers');
      cookiesStore = await cookies();
    } catch {
      return null;
    }
  }

  const token = cookiesStore?.get('auth_token')?.value;
  if (!token) return null;

  const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'super-secret-pdp-key'
  );

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Expected shape: { userId, role }
  } catch {
    return null;
  }
}
