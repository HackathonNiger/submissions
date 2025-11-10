'use client';

import * as React from 'react';
import { Moon, Sun, Palette, Circle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !theme) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'system', 'custom');
    root.classList.add(theme);
  }, [theme, mounted]);

  const renderIcon = () => {
    if (!mounted) return <Circle className="h-[1.2rem] w-[1.2rem]" />;

    switch (theme) {
      case 'light':
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case 'dark':
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case 'custom':
        return <Palette className="h-[1.2rem] w-[1.2rem]" />;
      default:
        return <Circle className="h-[1.2rem] w-[1.2rem]" />;
    }
  };

  // Base classes for the button
   const buttonClasses = cn(
    'top-[20px] z-[1000] cursor-pointer right-[20px] fixed',
    // Default hover (non-custom theme)
    'hover:text-primary-dark',
    // Conditional hover for custom theme: white text, optional primary bg
    theme === 'custom' && 'hover:[color:white] hover:bg-[hsl(var(--primary))]'
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={buttonClasses}>
          {renderIcon()}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className={cn(
            'dropdown-menu-item hover:bg-primary-dark',
            theme === 'custom' && 'hover:[color:white]'
          )}
        >
          Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className={cn(
            'dropdown-menu-item hover:bg-primary-dark',
            theme === 'custom' && 'hover:[color:white]'
          )}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('custom')}
          className={cn(
            'dropdown-menu-item hover:bg-primary-dark',
            theme === 'custom' && 'hover:[color:white]'
          )}
        >
          Custom
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}