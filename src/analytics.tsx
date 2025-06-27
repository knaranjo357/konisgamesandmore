// src/analytics.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function AnalyticsListener() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.gtag) {
      window.gtag('config', 'G-9QWK2RNY9K', {
        page_path: pathname,
      });
    }
  }, [pathname]);
  return null;
}
