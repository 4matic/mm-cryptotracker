/**
 * Interface for objects that have a logoUrl property
 */
interface HasLogoUrl {
  logoUrl?: string;
}

/**
 * Type guard to check if an object has a logoUrl property
 */
function hasLogoUrl(obj: unknown): obj is HasLogoUrl {
  return (
    obj !== null &&
    typeof obj === 'object' &&
    'logoUrl' in obj &&
    (typeof (obj as HasLogoUrl).logoUrl === 'string' ||
      (obj as HasLogoUrl).logoUrl === undefined)
  );
}

/**
 * Type for extractor function that extracts assets from complex return types
 */
type AssetExtractor<T> = (
  result: T
) => HasLogoUrl[] | HasLogoUrl | null | undefined;

/**
 * Decorator that adds ASSETS_URL environment variable prefix to asset logoUrl
 * @param extractor Optional function to extract assets from complex return types
 */
export function AddAssetUrl<T = unknown>(extractor?: AssetExtractor<T>) {
  return function (
    target: object,
    propertyName: string | symbol,
    descriptor: PropertyDescriptor
  ): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]): Promise<T> {
      const result = await originalMethod.apply(this, args);

      // Get ASSETS_URL from environment variables
      const assetsUrl: string = process.env.ASSETS_URL || '';

      if (!result) {
        return result;
      }

      // If extractor function is provided, use it to transform the result
      if (extractor) {
        return transformWithExtractor(result, extractor, assetsUrl) as T;
      }

      // Transform single asset
      if (hasLogoUrl(result)) {
        return transformAssetUrls(result, assetsUrl) as T;
      }

      // Transform array of assets
      if (Array.isArray(result)) {
        return result.map((item: unknown) => {
          if (hasLogoUrl(item)) {
            return transformAssetUrls(item, assetsUrl);
          }
          return item;
        }) as T;
      }

      return result;
    };

    return descriptor;
  };
}

/**
 * Transforms result using custom extractor function
 */
function transformWithExtractor<T>(
  result: T,
  extractor: AssetExtractor<T>,
  assetsUrl: string
): T {
  const extracted = extractor(result);

  if (!extracted) {
    return result;
  }

  // Handle single asset
  if (hasLogoUrl(extracted) && !Array.isArray(extracted)) {
    const transformedAsset = transformAssetUrls(extracted, assetsUrl);
    return replaceExtractedAssets(result, extracted, transformedAsset);
  }

  // Handle array of assets
  if (Array.isArray(extracted)) {
    const transformedAssets = extracted.map((item) => {
      if (hasLogoUrl(item)) {
        return transformAssetUrls(item, assetsUrl);
      }
      return item;
    });
    return replaceExtractedAssets(result, extracted, transformedAssets);
  }

  return result;
}

/**
 * Replaces the extracted assets in the original result with transformed ones
 */
function replaceExtractedAssets<T>(
  originalResult: T,
  originalAssets: HasLogoUrl[] | HasLogoUrl,
  transformedAssets: HasLogoUrl[] | HasLogoUrl
): T {
  // For complex objects like { assets: Asset[], total: number }
  if (
    originalResult &&
    typeof originalResult === 'object' &&
    'assets' in originalResult &&
    Array.isArray(originalAssets)
  ) {
    return {
      ...originalResult,
      assets: transformedAssets,
    } as T;
  }

  // For direct replacement (single asset case)
  return transformedAssets as T;
}

/**
 * Transforms asset logoUrl by adding ASSETS_URL prefix
 */
function transformAssetUrls<T extends HasLogoUrl>(
  asset: T,
  assetsUrl: string
): T {
  if (!asset.logoUrl || !assetsUrl) {
    return asset;
  }

  // Don't add prefix if logoUrl is already a full URL
  if (
    asset.logoUrl.startsWith('http://') ||
    asset.logoUrl.startsWith('https://')
  ) {
    return asset;
  }

  return {
    ...asset,
    logoUrl: `${assetsUrl.replace(/\/$/, '')}/${asset.logoUrl.replace(
      /^\//,
      ''
    )}`,
  };
}
