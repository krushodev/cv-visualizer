import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CVContent } from './CVContent';
import { CVToolbar } from './CVToolbar';
import { LanguagePicker } from '@/components/ui/LanguagePicker';
import { LanguageProvider, useLanguage } from '@/contexts/LanguageContext';
import CustomCursor from '@/components/ui/CustomCursor';
import { cn } from '@/lib/utils';

const CVContainerInner = () => {
  const { cvData } = useLanguage();
  const [zoom, setZoom] = useState(1.0);
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
    const newTheme = !currentlyDark;

    if (newTheme) {
      document.documentElement.classList.add('dark');
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

      // Detect language from CV data
      const isEnglish = cvData.profile.summary.includes('Experienced in creating efficient');
      const langSuffix = isEnglish ? 'EN' : 'ES';
      const fileName = `CV_IGNACIO_KRUCHOWSKI_${langSuffix}.pdf`;

      // Create an iframe to isolate from Tailwind's oklab colors
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.left = '-9999px';
      iframe.style.top = '0';
      iframe.style.width = '210mm';
      iframe.style.height = '297mm';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) throw new Error('Could not access iframe document');

      // Always use light theme colors for PDF
      const bgColor = '#ffffff';
      const textColor = '#000000';
      const headingColor = '#000000';
      const mutedColor = '#000000';
      const linkColor = '#2563eb';
      const borderColor = '#000000';
      const sectionBorderColor = '#000000';

      // Keywords to highlight in bold
      const keywords = [
        'React',
        'Next.js',
        'TypeScript',
        'Redux',
        'HTML5',
        'CSS3',
        'Astro',
        'React Native',
        'Expo',
        'Expo Go',
        'Node.js',
        'Express.js',
        'Python',
        'FastAPI',
        'NestJS',
        'Docker',
        'AWS',
        'MongoDB',
        'PostgreSQL',
        'Git',
        'LangGraph',
        'LLMs',
        'UX'
      ];

      const highlightText = (text: string) => {
        let result = text;
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'g');
          result = result.replace(regex, `<strong>${keyword}</strong>`);
        });
        return result;
      };

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap" rel="stylesheet">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                width: 210mm;
                min-height: 297mm;
                background-color: ${bgColor};
                color: ${textColor};
                font-family: 'Lato', system-ui, -apple-system, sans-serif;
                padding: 40px 50px;
                font-size: 13px;
                line-height: 1.5;
              }
              header {
                border-bottom: 2px solid ${borderColor};
                padding-bottom: 16px;
                margin-bottom: 24px;
              }
              h1 {
                font-size: 32px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: -0.025em;
                color: ${headingColor};
                margin-bottom: 4px;
              }
              h2 {
                font-size: 18px;
                font-weight: 400;
                color: ${mutedColor};
                letter-spacing: 0.05em;
              }
              .section-title {
                font-size: 20px;
                font-weight: 700;
                text-transform: uppercase;
                color: ${headingColor};
                padding-bottom: 8px;
                margin-bottom: 16px;
                border-bottom: 1px solid ${sectionBorderColor};
              }
              h4 {
                font-size: 16px;
                font-weight: 700;
                color: ${headingColor};
                margin-bottom: 2px;
              }
              .summary { margin-bottom: 24px; }
              .summary p { margin-bottom: 12px; }
              section { margin-bottom: 24px; }
              .exp-item { margin-bottom: 20px; }
              .exp-period { font-size: 12px; color: #4b5563; margin-bottom: 8px; }
              ul { list-style-type: disc; margin-left: 16px; margin-top: 8px; }
              li { margin-bottom: 4px; }
              a { color: ${linkColor}; text-decoration: none; }
              a:hover { text-decoration: underline; }
              .contact-item { margin-bottom: 4px; }
              .contact-label { font-weight: 500; }
              strong { font-weight: 700; }
              .edu-item { margin-bottom: 8px; }
              .edu-info { font-size: 13px; color: ${textColor}; }
            </style>
          </head>
          <body>
            <header>
              <h1>${cvData.profile.name}</h1>
              <h2>${cvData.profile.role}</h2>
            </header>
            
            <div class="summary">
              ${cvData.profile.summary
                .split('\n\n')
                .map((p: string) => `<p>${highlightText(p)}</p>`)
                .join('')}
            </div>

            <section>
              <div class="section-title">${isEnglish ? 'EXPERIENCE' : 'EXPERIENCIA'}</div>
              ${cvData.experience
                .map(
                  (exp: any) => `
                <div class="exp-item">
                  <h4>${exp.company} | ${exp.role}</h4>
                  <div class="exp-period">${exp.period}</div>
                  <ul>
                    ${exp.bullets.map((b: string) => `<li>${highlightText(b)}</li>`).join('')}
                  </ul>
                </div>
              `
                )
                .join('')}
            </section>

            <section>
              <div class="section-title">${isEnglish ? 'EDUCATION' : 'EDUCACIÓN'}</div>
              ${cvData.education
                .map(
                  (edu: any) => `
                <div class="edu-item">
                  <h4>${edu.degree}</h4>
                  <div class="edu-info">${edu.institution} ${edu.period}</div>
                </div>
              `
                )
                .join('')}
            </section>

            <section>
              <div class="section-title">${isEnglish ? 'CONTACT' : 'CONTACTO'}</div>
              <div class="contact-item"><span class="contact-label">Email:</span> <a href="mailto:${cvData.profile.email}">${cvData.profile.email}</a></div>
              <div class="contact-item"><span class="contact-label">LinkedIn:</span> <a href="https://${cvData.profile.linkedin}" target="_blank">${cvData.profile.linkedin}</a></div>
              <div class="contact-item"><span class="contact-label">GitHub:</span> <a href="https://${cvData.profile.github}" target="_blank">${cvData.profile.github}</a></div>
            </section>
          </body>
        </html>
      `);
      iframeDoc.close();

      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(iframeDoc.body, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: bgColor
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
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleReset = () => {
    setZoom(1.0);
    setIs3D(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="min-h-screen w-full bg-[#e5e5e5] dark:bg-[#09090b] flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden relative">
      <CustomCursor />
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #808080 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      ></div>

      <LanguagePicker />

      <CVToolbar zoom={zoom} setZoom={setZoom} onPrint={handlePrint} onReset={handleReset} onToggleTheme={toggleTheme} isDark={isDark} is3D={is3D} setIs3D={handleSetIs3D} />

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

          <CVContent data={cvData} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export const CVContainer = () => {
  return (
    <LanguageProvider>
      <CVContainerInner />
    </LanguageProvider>
  );
};
