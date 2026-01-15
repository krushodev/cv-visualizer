import { useState, useEffect } from 'react';
import { FaCube, FaMoon, FaSun } from 'react-icons/fa';
import { HiOutlineViewGrid } from 'react-icons/hi';

interface CVSidebarProps {
  is3D: boolean;
  setIs3D: (val: boolean) => void;
}

export const CVSidebar = ({ is3D, setIs3D }: CVSidebarProps) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const handleThemeClick = () => {
    const currentlyDark = document.documentElement.classList.contains('dark');

    if (currentlyDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleIs3DClick = () => {
    setIs3D(!is3D);
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[9998]">
      <div className="flex flex-col items-center gap-2 p-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm">
        <button
          type="button"
          onClick={handleIs3DClick}
          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
            is3D ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={is3D ? 'Vista plana' : 'Vista 3D'}
        >
          {is3D ? <FaCube className="w-4 h-4" /> : <HiOutlineViewGrid className="w-4 h-4" />}
        </button>

        <div className="w-5 h-px bg-neutral-200 dark:bg-neutral-700" />

        <button
          type="button"
          onClick={handleThemeClick}
          className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors cursor-pointer ${
            isDark ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
          title={isDark ? 'Tema claro' : 'Tema oscuro'}
        >
          {isDark ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
