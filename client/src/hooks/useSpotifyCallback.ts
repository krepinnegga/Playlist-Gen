import { useEffect, useState, useCallback } from 'react';
import { useUserStore } from '../store';
import axiosInstance from '../services/Config';
import type { AxiosError } from 'axios';

export function useSpotifyCallback() {
  const { setUserData } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract code from URL
  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  };

  // Function to exchange code for tokens
  const handleCallback = useCallback(async () => {
    const code = getCodeFromUrl();
    if (!code) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post('/api/auth/callback', { code });
      if (response?.data) {
        setUserData({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          expiresIn: response.data.expiresIn,
        });
        // window.history.pushState({}, '', '/');
      }
    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'isAxiosError' in err &&
        (err as AxiosError).isAxiosError
      ) {
        const axiosErr = err as AxiosError<{
          error?: string;
          message?: string;
        }>;
        setError(
          axiosErr.response?.data?.error ||
            axiosErr.response?.data?.message ||
            'Failed to authenticate'
        );
      } else {
        setError('Failed to authenticate');
      }
    } finally {
      setLoading(false);
      //window.history.pushState({}, '', '/');
    }
  }, [setUserData]);

  // Optionally, auto-run on mount if code is present
  useEffect(() => {
    if (getCodeFromUrl()) {
      handleCallback();
    }
    // eslint-disable-next-line
  }, []);

  return { handleCallback, loading, error, setError };
}
