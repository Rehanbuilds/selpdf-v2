'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Theme:</span>
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <>
            <Moon className="size-4" />
            <span>Dark</span>
          </>
        ) : (
          <>
            <Sun className="size-4" />
            <span>Light</span>
          </>
        )}
      </button>
    </div>
  );
}
