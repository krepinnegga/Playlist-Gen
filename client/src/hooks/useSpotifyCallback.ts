import { useEffect, useState, useCallback, useRef } from 'react';
import { useUserStore } from '../store';
import axiosInstance from '../services/Config';
import type { AxiosError } from 'axios';

export function useSpotifyCallback() {
  const { setUserData } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasExecuted = useRef(false); // Track execution

  const getCodeFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
  };

  const code = getCodeFromUrl();

  const handleCallback = useCallback(async () => {
    if (!code || hasExecuted.current) return; // Skip if already executed
    hasExecuted.current = true; // Mark as executed

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
        window.history.pushState({}, '', '/'); // Clean URL once
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
    }
  }, [setUserData, code]);

  // Run once on mount if code exists
  useEffect(() => {
    if (code) handleCallback();
  }, [code, handleCallback]);

  return { loading, error, setError };
}
