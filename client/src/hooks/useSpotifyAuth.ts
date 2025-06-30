import useSWR from 'swr';
import { useUserStore } from '../store';
import { serviceFetcher } from '../services/CRUD';
import { refreshToken } from '../services/Config';

export function useSpotifyAuth() {
  const { setUserData } = useUserStore();

  // SWR for login URL
  const { data, error, isLoading, mutate } = useSWR<{ url: string }>(
    '/api/auth/login',
    serviceFetcher,
    { revalidateOnFocus: false, shouldRetryOnError: false }
  );

  // Start login flow
  const login = () => {
    if (data?.url) {
      window.location.href = data.url;
    } else {
      mutate();
    }
  };

  // Refresh token handler
  const handleRefresh = async () => {
    try {
      await refreshToken();
    } catch {
      setUserData({ accessToken: undefined, expiresIn: undefined });
    }
  };

  return {
    loginUrl: data?.url,
    login,
    isLoading,
    error,
    refresh: handleRefresh,
  };
}
