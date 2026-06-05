'use client';

import { useEffect, useRef } from 'react';

export function AdBanner() {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current || !adContainerRef.current) return;
    isLoaded.current = true;

    // Create the options script
    const optionsScript = document.createElement('script');
    optionsScript.type = 'text/javascript';
    optionsScript.text = `
      atOptions = {
        'key' : 'e31e212acbd467b36990550a32191f08',
        'format' : 'iframe',
        'height' : 90,
        'width' : 728,
        'params' : {}
      };
    `;

    // Create the invoke script
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://www.highperformanceformat.com/e31e212acbd467b36990550a32191f08/invoke.js';

    adContainerRef.current.appendChild(optionsScript);
    adContainerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="flex w-full items-center justify-center py-4">
      <div
        ref={adContainerRef}
        className="flex items-center justify-center overflow-hidden"
        style={{ minHeight: '90px', maxWidth: '728px', width: '100%' }}
      />
    </div>
  );
}
