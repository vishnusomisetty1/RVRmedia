import { NextResponse } from 'next/server';

import { getMeta, signedUrl } from '@/lib/galleries';
import { isExpired, keys } from '@/lib/r2';

type Params = { params: Promise<{ token: string; file: string }> };

/**
 * Serves one gallery image.
 *
 * Rather than streaming the bytes (which would put every megabyte through
 * Vercel's bandwidth), this checks access and then redirects to a short-lived
 * signed R2 URL. The browser pulls the file straight from Cloudflare, where
 * egress is free.
 */
export async function GET(request: Request, { params }: Params) {
  const { token, file } = await params;
  const size = new URL(request.url).searchParams.get('size') === 'full'
    ? 'full'
    : 'thumb';

  const meta = await getMeta(token);

  if (!meta || isExpired(meta)) {
    return new NextResponse('Not found', { status: 404 });
  }

  // Only files this gallery actually lists, so the key cannot be steered
  // somewhere else via the URL.
  if (!meta.photos.includes(file)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const key =
    size === 'full' ? keys.full(token, file) : keys.thumb(token, file);

  const url = await signedUrl(key);

  return NextResponse.redirect(url, {
    status: 307,
    headers: {
      // Let the browser reuse the redirect without re-invoking a function,
      // but keep it out of any shared cache since it is gallery-specific.
      'Cache-Control': 'private, max-age=3000',
    },
  });
}
