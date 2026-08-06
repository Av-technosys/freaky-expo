import { getBucketUrl } from '@/api/user';

type ImageAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export async function uploadImage(asset: ImageAsset, path: string) {
  const mimeType = asset.mimeType || 'image/jpeg';
  const presignedResponse = await getBucketUrl({
    fileName: asset.fileName || `${path}-${Date.now()}.jpg`,
    fileType: mimeType,
    path,
  });
  const presigned = presignedResponse?.data ?? presignedResponse;

  if (!presigned?.uploadUrl || !presigned?.filePath) {
    throw new Error('Unable to prepare image upload');
  }

  const localFile = await fetch(asset.uri);
  const body = await localFile.blob();
  const uploadResponse = await fetch(presigned.uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': mimeType },
    body,
  });

  if (!uploadResponse.ok) {
    throw new Error('Profile image upload failed');
  }

  return presigned.filePath as string;
}
