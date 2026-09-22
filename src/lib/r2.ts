import { S3Client } from '@aws-sdk/client-s3';

/**
 * Cloudflare R2 speaks the S3 API, so the AWS SDK drives it directly.
 *
 * R2 is used instead of a Vercel Blob store because it charges nothing for
 * egress: a client forwarding a gallery link to twenty relatives costs the
 * same as one person opening it once.
 *
 * The client is built lazily. Next.js evaluates module top-level code during
 * `next build`, and these env vars are not present then.
 */
let client: S3Client | null = null;

export function getR2(): S3Client {
  if (client) {
    return client;
  }

  const accountId = requireEnv('R2_ACCOUNT_ID');

  client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
      secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    },
  });

  return client;
}

export function getBucket(): string {
  return requireEnv('R2_BUCKET');
}

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET,
  );
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `${name} is not set. See README for the Cloudflare R2 setup steps.`,
    );
  }
  return value;
}

// Object layout inside the bucket:
//   galleries/<token>/meta.json      gallery name, client, dates
//   galleries/<token>/thumb/<file>   ~400px grid images
//   galleries/<token>/full/<file>    ~2048px viewer images
export const keys = {
  meta: (token: string) => `galleries/${token}/meta.json`,
  thumb: (token: string, file: string) => `galleries/${token}/thumb/${file}`,
  full: (token: string, file: string) => `galleries/${token}/full/${file}`,
  prefix: (token: string) => `galleries/${token}/`,
};

export type GalleryMeta = {
  token: string;
  title: string;
  clientName: string;
  createdAt: string;
  expiresAt: string;
  /** Optional link to the full-resolution delivery (Drive, WeTransfer...). */
  downloadUrl?: string;
  /** File names, in display order. Same name in thumb/ and full/. */
  photos: string[];
};

export function isExpired(meta: GalleryMeta, now = new Date()): boolean {
  return new Date(meta.expiresAt).getTime() <= now.getTime();
}
