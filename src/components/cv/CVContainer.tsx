import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CVContent } from './CVContent';
import { CVToolbar } from './CVToolbar';
import { CVSidebar } from './CVSidebar';
import { cn } from '@/lib/utils';

export const CVContainer = ({ initialData }: { initialData: any }) => {
  const [zoom, setZoom] = useState(0.95);
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

  const handlePrint = async () => {
    const element = ref.current;
    if (!element) return;

    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              body {
                width: 210mm;
                min-height: 297mm;
                background-color: ${isDark ? '#1a1a1a' : '#ffffff'};
                color: ${isDark ? '#e2e8f0' : '#000000'};
                font-family: system-ui, -apple-system, sans-serif;
                padding: 40px 50px;
              }
              header {
                border-bottom: 2px solid ${isDark ? '#ffffff' : '#000000'};
                padding-bottom: 16px;
                margin-bottom: 24px;
              }
              h1, h2, h3, h4 {
                color: ${isDark ? '#ffffff' : '#000000'};
                font-weight: bold;
              }
              h1 { font-size: 32px; }
              h2 { font-size: 18px; }
              h3 { font-size: 20px; }
              h4 { font-size: 16px; }
              section {
                margin-bottom: 24px;
              }
              ul {
                list-style-type: disc;
                margin-left: 16px;
              }
              a {
                color: ${isDark ? '#60a5fa' : '#2563eb'};
                text-decoration: underline;
              }
              div {
                margin-bottom: 4px;
              }
            </style>
          </head>
          <body>
            ${element.innerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: isDark ? '#1a1a1a' : '#ffffff'
      });

      document.body.removeChild(iframe);

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('CV.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleReset = () => {
    setZoom(0.95);
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
