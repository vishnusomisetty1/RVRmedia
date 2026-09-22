import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Client galleries are private links and the admin area is staff only;
      // neither should ever surface in search results.
      disallow: ['/admin', '/g/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
