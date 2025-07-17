'use client';

import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check if a theme was saved before
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div className='flex flex-col items-center text-xs font-medium text-gray-600 hover:text-blue-600 transition-all duration-200'>
    <button
      onClick={toggleTheme}
      className="flex flex-col items-center text-xs font-medium text-[var(--text-secondary)] bg-[var(--bg-icon)] hover:bg-blue-100 hover:text-blue-600 transition-all duration-200 w-10 h-10 justify-center rounded-full"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <FiMoon className="w-5 h-5" />
      ) : (
        <FiSun className="w-5 h-5" />
        
      )}
    </button>
    <span className="mt-[6px] text-[var(--text-secondary)] hidden md:block">{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
    </div>
    
  );
};

export default ThemeToggle;
