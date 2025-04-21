// src/hooks/useApi.ts
import {useState, useCallback} from "react";
import {useAuth} from "@/context/AuthContext";
import {apiServer} from "@/lib/serverApi";


// Hook-based version for client-side use
export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {getToken, signOut} = useAuth();

  const server = apiServer(getToken, signOut);

  const wrapRequest = useCallback(
      async <T>(fn: () => Promise<T>): Promise<T> => {
        setLoading(true);
        setError(null);
        try
        {
          const result = await fn();
          return result;
        } catch (err)
        {
          setError(err instanceof Error ? err.message : "An unknown error occurred");
          throw err;
        } finally
        {
          setLoading(false);
        }
      },
      [getToken, signOut]
  );

  const get = useCallback(async <T>(url: string) => wrapRequest(() => server.get<T>(url)), [wrapRequest]);
  const post = useCallback(async <T, D = unknown>(url: string, data?: D) => wrapRequest(() => server.post<T>(url, data)), [wrapRequest]);
  const put = useCallback(async <T, D = unknown>(url: string, data?: D) => wrapRequest(() => server.put<T>(url, data)), [wrapRequest]);
  const del = useCallback(async <T>(url: string) => wrapRequest(() => server.del<T>(url)), [wrapRequest]);

  return {get, post, put, del, loading, error};
};

