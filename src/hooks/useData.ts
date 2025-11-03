import React from 'react';

export function useData<T>(fetcher: () => Promise<T>) {
  const [data, setData] = React.useState<T | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const refetch = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetcher();
      setData(result);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, isLoading, refetch };
}