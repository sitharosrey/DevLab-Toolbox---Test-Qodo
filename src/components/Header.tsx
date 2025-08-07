'use client';

import { Bars3Icon, SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 h-16">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center">
          <button
            type="button"
            className="lg:hidden rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300"
            onClick={onMenuClick}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="ml-2 lg:ml-0 text-xl font-bold text-gray-900 dark:text-white">
            DevLab Toolbox
          </h1>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-300 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </button>
      </div>
    </header>
  );
}