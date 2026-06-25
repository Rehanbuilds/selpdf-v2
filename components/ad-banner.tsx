'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  key_id: string;
  width: number;
  height: number;
  format?: 'iframe';
}

export function AdBanner({ key_id, width, height, format = 'iframe' }: AdBannerProps) {
  useEffect(() => {
    // Dynamically inject Adsterra script
    const script = document.createElement('script');
    
    // Set atOptions configuration
    (window as any).atOptions = {
      key: key_id,
      format: format,
      height: height,
      width: width,
      params: {},
    };
    
    // Load the invoke script
    script.src = `https://www.highperformanceformat.com/${key_id}/invoke.js`;
    script.async = true;
    
    const adContainer = document.getElementById(`adsterra-${key_id}`);
    if (adContainer) {
      adContainer.appendChild(script);
    }
    
    return () => {
      // Cleanup
      if (adContainer && script.parentNode === adContainer) {
        adContainer.removeChild(script);
      }
    };
  }, [key_id, width, height, format]);

  return (
    <div id={`adsterra-${key_id}`} className="flex justify-center items-center py-4">
      {/* Ad will be injected here by the Adsterra script */}
    </div>
  );
}
