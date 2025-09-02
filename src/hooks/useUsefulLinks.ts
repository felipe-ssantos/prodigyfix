// src/hooks/useUsefulLinks.ts
import { useState, useEffect } from "react";
import { getUsefulLinks } from "../services/usefulLinks";
import { UsefulLink } from "../types/usefulLinks"; // Importação adicionada

export const useUsefulLinks = (theme?: string) => {
  const [links, setLinks] = useState<Record<string, UsefulLink[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const linksData = await getUsefulLinks(theme);
        setLinks(linksData);
        setError(null);
      } catch (err) {
        setError("Erro ao carregar links úteis");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [theme]);

  return { links, loading, error };
};
