import 'server-only';

import { randomBytes } from 'node:crypto';
import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { getBucket, getR2, keys, type GalleryMeta } from './r2';

/** How long a signed image URL stays valid once handed to a browser. */
const SIGNED_URL_TTL = 60 * 60;

/** Guardrail: makes blowing past a free tier by accident structurally hard. */
export const MAX_LIVE_GALLERIES = 5;

export function createToken(): string {
  return randomBytes(12).toString('base64url');
}

export async function getMeta(token: string): Promise<GalleryMeta | null> {
  // A token from a URL becomes an object key, so keep it to the alphabet
  // randomBytes().toString('base64url') can actually produce.
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(token)) {
    return null;
  }

  try {
    const result = await getR2().send(
      new GetObjectCommand({ Bucket: getBucket(), Key: keys.meta(token) }),
    );
    const body = await result.Body?.transformToString();
    return body ? (JSON.parse(body) as GalleryMeta) : null;
  } catch {
    return null;
  }
}

export async function putMeta(meta: GalleryMeta): Promise<void> {
  await getR2().send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: keys.meta(meta.token),
      Body: JSON.stringify(meta, null, 2),
      ContentType: 'application/json',
    }),
  );
}

export async function listGalleries(): Promise<GalleryMeta[]> {
  const result = await getR2().send(
    new ListObjectsV2Command({
      Bucket: getBucket(),
      Prefix: 'galleries/',
      Delimiter: '/',
    }),
  );

  const tokens = (result.CommonPrefixes ?? [])
    .map((entry) => entry.Prefix?.split('/')[1])
    .filter((token): token is string => Boolean(token));

  const metas = await Promise.all(tokens.map((token) => getMeta(token)));

  return metas
    .filter((meta): meta is GalleryMeta => meta !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Hands back a short-lived direct URL, so the bytes never pass through Vercel. */
export async function signedUrl(key: string): Promise<string> {
  return getSignedUrl(
    getR2(),
    new GetObjectCommand({ Bucket: getBucket(), Key: key }),
    { expiresIn: SIGNED_URL_TTL },
  );
}

/** Removes every object under a gallery, in batches R2 will accept. */
export async function deleteGallery(token: string): Promise<number> {
  const bucket = getBucket();
  let deleted = 0;
  let cursor: string | undefined;

  do {
    const listed = await getR2().send(
      new ListObjectsV2Command({
        Bucket: bucket,
        Prefix: keys.prefix(token),
        ContinuationToken: cursor,
      }),
    );

    const objects = (listed.Contents ?? [])
      .map((entry) => entry.Key)
      .filter((key): key is string => Boolean(key))
      .map((Key) => ({ Key }));

    if (objects.length > 0) {
      await getR2().send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: objects },
        }),
      );
      deleted += objects.length;
    }

    cursor = listed.IsTruncated ? listed.NextContinuationToken : undefined;
  } while (cursor);

  return deleted;
}
