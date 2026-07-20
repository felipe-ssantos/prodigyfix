import { useMemo, useEffect } from "react";

interface UseImageUrlReturn {
  imageUrl: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
  clearCache: () => void;
}

interface CacheStats {
  totalCached: number;
  expired: number;
  totalSize: number;
}

const LEGACY_IMAGE_ERROR =
  "Imagem indisponível - reenvie a capa deste tutorial";

const EMPTY_CACHE_STATS: CacheStats = {
  totalCached: 0,
  expired: 0,
  totalSize: 0,
};

const NOOP = () => {};

interface ResolvedImage {
  imageUrl: string;
  error: string | null;
}

function resolveImageUrl(imageName?: string): ResolvedImage {
  const trimmedName = imageName?.trim();

  if (!trimmedName) {
    return { imageUrl: "", error: null };
  }

  const isFullUrl = trimmedName.startsWith("http");

  if (isFullUrl) {
    return { imageUrl: trimmedName, error: null };
  }

  return { imageUrl: "", error: LEGACY_IMAGE_ERROR };
}

export function useImageUrl(imageName?: string): UseImageUrlReturn {
  const { imageUrl, error } = useMemo(
    () => resolveImageUrl(imageName),
    [imageName],
  );

  return {
    imageUrl,
    error,
    loading: false,
    retry: NOOP,
    clearCache: NOOP,
  };
}

function isPrefetchableUrl(imageName: string): boolean {
  return Boolean(imageName) && imageName.startsWith("http");
}

export function usePrefetchImages(imageNames: string[]): void {
  useEffect(() => {
    imageNames.filter(isPrefetchableUrl).forEach(preloadImage);
  }, [imageNames]);
}

function preloadImage(url: string): void {
  const img = new Image();
  img.src = url;
}

export function cleanExpiredCache(): number {
  return 0;
}

export function useImageCacheStats(): CacheStats {
  return EMPTY_CACHE_STATS;
}
