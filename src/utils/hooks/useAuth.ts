import { useState, useEffect } from 'react';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    } else {
      localStorage.removeItem('accessToken');
    }
  }, [accessToken]);

  return {
    accessToken,
    setAccessToken,
  };
};

export default useAuth;