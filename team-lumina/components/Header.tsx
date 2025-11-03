"use client";

import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 hover:scale-105 shadow-lg"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300 drop-shadow-md" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-400 drop-shadow-md" />
        )}
      </Button>
    </div>
  );
} 