/**
 * Transforms asset logoUrl by adding ASSETS_PUBLIC_URL prefix
 */
export function transformAssetUrl(logoUrl?: string): string | undefined {
  if (!logoUrl) {
    return logoUrl;
  }

  const assetsUrl = process.env.ASSETS_PUBLIC_URL || '';
  if (!assetsUrl) {
    return logoUrl;
  }

  // Don't add prefix if logoUrl is already a full URL
  if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
    return logoUrl;
  }

  return `${assetsUrl.replace(/\/$/, '')}/${logoUrl.replace(/^\//, '')}`;
}
