import { NextResponse, type NextRequest } from 'next/server';

/**
 * HTTP Basic Auth over the /admin area.
 *
 * Deliberately not a hand-rolled session layer — there are no cookies, no
 * tokens and no expiry logic to get wrong. The browser holds the credentials
 * and re-sends them; this only ever compares two strings.
 */
export function proxy(request: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;

  // Fail closed: with no credentials configured, the area stays shut rather
  // than falling open.
  if (!expectedUser || !expectedPassword) {
    return new NextResponse('Admin access is not configured.', { status: 503 });
  }

  const header = request.headers.get('authorization');

  if (header?.startsWith('Basic ')) {
    const decoded = safeDecode(header.slice('Basic '.length));
    const separator = decoded.indexOf(':');

    if (separator !== -1) {
      const user = decoded.slice(0, separator);
      const password = decoded.slice(separator + 1);

      // Both compared every time so the response time does not reveal
      // whether it was the username or the password that was wrong.
      const userOk = timingSafeEqual(user, expectedUser);
      const passwordOk = timingSafeEqual(password, expectedPassword);

      if (userOk && passwordOk) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="RVR Media admin", charset="UTF-8"',
    },
  });
}

function safeDecode(value: string): string {
  try {
    return atob(value);
  } catch {
    return '';
  }
}

/** Compares without leaking length or position through timing. */
function timingSafeEqual(a: string, b: string): boolean {
  let mismatch = a.length === b.length ? 0 : 1;
  const length = Math.max(a.length, b.length);

  for (let index = 0; index < length; index += 1) {
    mismatch |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return mismatch === 0;
}

export const config = {
  matcher: ['/admin/:path*'],
};
