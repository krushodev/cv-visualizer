'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './CustomCursor.css';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) return;

    // Hide native cursor
    document.body.style.cursor = 'none';
    document.documentElement.style.cursor = 'none';

    // Set initial cursor position
    gsap.set(cursor, {
      x: -100,
      y: -100
    });

    // Hide cursor on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      cursor.style.display = 'none';
      return;
    }

    // Mouse move handler with throttling for performance
    let throttleTimeout: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (!throttleTimeout) {
        throttleTimeout = setTimeout(() => {
          gsap.to(cursor, {
            x: e.clientX - cursor.offsetWidth / 2,
            y: e.clientY - cursor.offsetHeight / 2,
            duration: 0,
            ease: 'none',
            force3D: true
          });
          throttleTimeout = null;
        }, 16); // ~60fps (1000ms / 60)
      }
    };

    // Handle hover on interactive elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a, button, input, textarea, select') ||
        target.classList.contains('cursor-pointer') ||
        target.onclick !== null ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isClickable) {
        gsap.to(cursor, {
          width: 80,
          height: 80,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a, button, input, textarea, select') ||
        target.classList.contains('cursor-pointer') ||
        target.onclick !== null ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';

      if (isClickable) {
        gsap.to(cursor, {
          width: 40,
          height: 40,
          duration: 0.3,
          ease: 'power2.out',
          force3D: true
        });
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseEnter);
    document.addEventListener('mouseout', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseEnter);
      document.removeEventListener('mouseout', handleMouseLeave);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" />;
};

export default CustomCursor;
