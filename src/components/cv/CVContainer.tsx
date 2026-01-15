import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CVContent } from './CVContent';
import { CVToolbar } from './CVToolbar';
import { CVSidebar } from './CVSidebar';
import { cn } from '@/lib/utils';

export const CVContainer = ({ initialData }: { initialData: any }) => {
  const [zoom, setZoom] = useState(0.85);
  const [is3D, setIs3D] = useState(false);

  const handleSetIs3D = useCallback((val: boolean) => {
    setIs3D(val);
  }, []);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      return saved === 'dark';
    }
    return false;
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const shouldBeDark = savedTheme === 'dark';

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], is3D ? ['5deg', '-5deg'] : ['0deg', '0deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], is3D ? ['-5deg', '5deg'] : ['0deg', '0deg']);

  const reflectionOpacity = useTransform(mouseY, [-0.5, 0.5], [0, 0.3]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!is3D || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXFromCenter = e.clientX - rect.left - width / 2;
    const mouseYFromCenter = e.clientY - rect.top - height / 2;
    x.set(mouseXFromCenter / width);
    y.set(mouseYFromCenter / height);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleTheme = useCallback(() => {
    const currentlyDark = document.documentElement.classList.contains('dark');
    console.log('toggleTheme called, currentlyDark:', currentlyDark);
    const newTheme = !currentlyDark;
    console.log('Setting new theme to dark:', newTheme);

    if (newTheme) {
      document.documentElement.classList.add('dark');
      console.log('Added dark class');
    } else {
      document.documentElement.classList.remove('dark');
    }

    localStorage.setItem('theme', newTheme ? 'dark' : 'light');

    setIsDark(newTheme);
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setZoom(0.85);
    setIs3D(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e5e5] dark:bg-[#09090b] flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden relative">
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      <CVSidebar is3D={is3D} setIs3D={handleSetIs3D} />

      <CVToolbar zoom={zoom} setZoom={setZoom} onPrint={handlePrint} onReset={handleReset} />

      <motion.div style={{ perspective: 1200 }} className="relative py-12 z-10">
        <motion.div
          ref={ref}
          style={{
            rotateX,
            rotateY,
            scale: zoom,
            transformStyle: 'preserve-3d'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{ scale: zoom }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className={cn('relative w-[210mm] min-h-[297mm] transition-all duration-300 ease-out origin-center', is3D ? 'shadow-2xl shadow-black/40' : 'shadow-lg shadow-black/10')}
        >
          {is3D && (
            <motion.div
              style={{
                opacity: reflectionOpacity,
                background: 'linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 60%)'
              }}
              className="absolute inset-0 z-50 pointer-events-none mix-blend-overlay rounded-sm"
            />
          )}

          <CVContent data={initialData} />
        </motion.div>
      </motion.div>
    </div>
  );
};
