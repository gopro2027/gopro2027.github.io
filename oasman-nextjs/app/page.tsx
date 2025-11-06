'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    window.location.replace('/oasman/docs/');
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting to /oasman/docs/...</p>
    </div>
  );
}
