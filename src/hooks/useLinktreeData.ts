/**
 * Custom hook for loading linktree data from data.json
 */

import { useEffect, useState } from 'react';
import { loadLinktreeData } from '../services/dataLoader';
import type { LinktreeData } from '../services/types';

interface UseLinktreeDataReturn {
  data: LinktreeData | null;
  loading: boolean;
  error: string | null;
}

export function useLinktreeData(): UseLinktreeDataReturn {
  const [data, setData] = useState<LinktreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const linktreeData = await loadLinktreeData();

        if (isMounted) {
          setData(linktreeData);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load linktree data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
