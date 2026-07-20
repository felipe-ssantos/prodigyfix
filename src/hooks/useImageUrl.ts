import { useState, useEffect } from "react";

interface UseImageUrlReturn {
  imageUrl: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
  clearCache: () => void;
}

export const useImageUrl = (
  imageName: string | undefined,
): UseImageUrlReturn => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageName || imageName.trim() === "") {
      setImageUrl("");
      setError(null);
      return;
    }

    // URL Cloudinary
    if (imageName.startsWith("http")) {
      setImageUrl(imageName);
      setError(null);
      return;
    }

    setImageUrl("");
    setError("Imagem indisponível - reenvie a capa deste tutorial");
  }, [imageName]);

  return {
    imageUrl,
    loading: false,
    error,
    retry: () => {},
    clearCache: () => {},
  };
};

export const usePrefetchImages = (imageNames: string[]) => {
  useEffect(() => {
    imageNames
      .filter((name) => name && name.startsWith("http"))
      .forEach((url) => {
        const img = new Image();
        img.src = url;
      });
  }, [imageNames]);
};

export const cleanExpiredCache = (): number => 0;

interface CacheStats {
  totalCached: number;
  expired: number;
  totalSize: number;
}

export const useImageCacheStats = () => {
  const [stats] = useState<CacheStats>({
    totalCached: 0,
    expired: 0,
    totalSize: 0,
  });
  return stats;
};
