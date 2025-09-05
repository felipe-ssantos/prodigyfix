import { useState, useEffect, useRef } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebase";

interface CachedImage {
  url: string;
  timestamp: number;
  expiresAt: number;
}

interface FirebaseStorageError extends Error {
  code?: string;
}

// Cache global para URLs de imagens
const imageCache = new Map<string, CachedImage>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

interface UseImageUrlReturn {
  imageUrl: string;
  loading: boolean;
  error: string | null;
  retry: () => void;
  clearCache: () => void;
}

export const useImageUrl = (
  imageName: string | undefined
): UseImageUrlReturn => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const clearCache = () => {
    if (imageName) {
      imageCache.delete(imageName);
    }
  };

  const retry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
  };

  useEffect(() => {
    // Cleanup anterior
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!imageName || imageName.trim() === "") {
      setImageUrl("");
      setLoading(false);
      setError(null);
      return;
    }

    // Se já é uma URL completa, use diretamente
    if (imageName.startsWith("http")) {
      setImageUrl(imageName);
      setLoading(false);
      setError(null);
      return;
    }

    // Verificar cache primeiro
    const cached = imageCache.get(imageName);
    const now = Date.now();

    if (cached && now < cached.expiresAt) {
      setImageUrl(cached.url);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchImageUrl = async () => {
      try {
        setLoading(true);
        setError(null);

        // Criar novo AbortController
        abortControllerRef.current = new AbortController();

        const imageRef = ref(storage, `tutorials/${imageName}`);
        const url = await getDownloadURL(imageRef);

        // Verificar se a requisição não foi cancelada
        if (!abortControllerRef.current.signal.aborted) {
          // Armazenar no cache
          imageCache.set(imageName, {
            url,
            timestamp: now,
            expiresAt: now + CACHE_DURATION,
          });

          setImageUrl(url);
        }
      } catch (err: unknown) {
        if (!abortControllerRef.current?.signal.aborted) {
          console.error("Erro ao buscar URL da imagem:", err);

          // Diferentes tipos de erro
          let errorMessage = "Erro ao carregar imagem";

          if (err instanceof Error) {
            const firebaseError = err as FirebaseStorageError;

            if (firebaseError.code === "storage/object-not-found") {
              errorMessage = "Imagem não encontrada";
            } else if (firebaseError.code === "storage/unauthorized") {
              errorMessage = "Sem permissão para acessar a imagem";
            } else if (firebaseError.code === "storage/canceled") {
              errorMessage = "Download cancelado";
            } else if (firebaseError.code === "storage/unknown") {
              errorMessage = "Erro desconhecido ao carregar imagem";
            }

            // Retry automático para erros de rede (máximo 3 tentativas)
            if (
              retryCount < 3 &&
              (firebaseError.code === "storage/retry-limit-exceeded" ||
                firebaseError.message.includes("network"))
            ) {
              setTimeout(() => {
                setRetryCount((prev) => prev + 1);
              }, 1000 * (retryCount + 1)); // Backoff exponencial
            }
          }

          setError(errorMessage);
          setImageUrl("");
        }
      } finally {
        if (!abortControllerRef.current?.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchImageUrl();

    // Cleanup
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [imageName, retryCount]);

  return { imageUrl, loading, error, retry, clearCache };
};

// Hook adicional para pré-carregar imagens
export const usePrefetchImages = (imageNames: string[]) => {
  useEffect(() => {
    const prefetchImage = async (imageName: string) => {
      if (!imageName || imageName.startsWith("http")) return;

      const cached = imageCache.get(imageName);
      const now = Date.now();

      if (cached && now < cached.expiresAt) return;

      try {
        const imageRef = ref(storage, `tutorials/${imageName}`);
        const url = await getDownloadURL(imageRef);

        imageCache.set(imageName, {
          url,
          timestamp: now,
          expiresAt: now + CACHE_DURATION,
        });

        // Pré-carregar a imagem no browser
        const img = new Image();
        img.src = url;
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.warn("Falha ao pré-carregar imagem:", imageName, err);
        } else {
          console.warn(
            "Falha ao pré-carregar imagem:",
            imageName,
            "Erro desconhecido"
          );
        }
      }
    };

    imageNames.forEach((imageName) => {
      prefetchImage(imageName);
    });
  }, [imageNames]);
};

interface CacheStats {
  totalCached: number;
  expired: number;
  totalSize: number;
}

// Utilitário para limpar cache expirado
export const cleanExpiredCache = (): number => {
  const now = Date.now();
  const expiredKeys: string[] = [];

  imageCache.forEach((cached, key) => {
    if (now >= cached.expiresAt) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach((key) => {
    imageCache.delete(key);
  });

  return expiredKeys.length;
};

// Hook para estatísticas do cache
export const useImageCacheStats = () => {
  const [stats, setStats] = useState<CacheStats>({
    totalCached: 0,
    expired: 0,
    totalSize: 0,
  });

  useEffect(() => {
    const updateStats = () => {
      const now = Date.now();
      let expired = 0;

      imageCache.forEach((cached) => {
        if (now >= cached.expiresAt) {
          expired++;
        }
      });

      setStats({
        totalCached: imageCache.size,
        expired,
        totalSize: imageCache.size * 1024, // Estimativa aproximada
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 60000); // Atualizar a cada minuto

    return () => clearInterval(interval);
  }, []);

  return stats;
};
