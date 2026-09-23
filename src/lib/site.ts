export const SITE_URL = 'https://rvrmedia.vercel.app';

export const SITE_NAME = 'RVR Media';

export const CONTACT_EMAIL = 'rvr.mediaco@gmail.com';

export const INSTAGRAM_URL = 'https://www.instagram.com/rvr_mediaco/';

export const SERVICE_AREA = 'New Jersey';

/**
 * Structured data so search engines can place the business geographically.
 *
 * ProfessionalService is a LocalBusiness subtype. There is deliberately no
 * postal address here: this is a service-area business, and inventing a
 * street address is exactly the kind of thing that gets local listings
 * penalised. areaServed carries the location signal instead.
 */
const websiteJsonLd = {
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  alternateName: 'RVR Media Co',
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#business` },
};

const localBusinessJsonLd = {
  '@type': 'ProfessionalService',
  '@id': `${SITE_URL}/#business`,
  name: SITE_NAME,
  url: SITE_URL,
  email: CONTACT_EMAIL,
  image: `${SITE_URL}/gallery/events/_DSC9302.jpg`,
  description:
    'Event, portrait, and candid lifestyle photography and videography serving all of New Jersey.',
  areaServed: {
    '@type': 'State',
    name: 'New Jersey',
  },
  sameAs: [INSTAGRAM_URL],
  knowsAbout: [
    'Event photography',
    'Wedding reception photography',
    'Graduation photography',
    'Portrait photography',
    'Videography',
    'Drone footage',
  ],
};

/**
 * Both entities in one graph.
 *
 * A bare array of objects is technically valid JSON-LD, but consumers
 * reasonably expect @context at the root — reading it off an array yields
 * undefined. @graph keeps a single root object with one @context.
 */
export const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [websiteJsonLd, localBusinessJsonLd],
};
