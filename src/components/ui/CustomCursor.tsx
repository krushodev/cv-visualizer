'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CustomCursor.css';

interface CustomCursorProps {
  children?: React.ReactNode;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ children }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hoverText, setHoverText] = useState('');
  const [isSidebarBullet, setIsSidebarBullet] = useState(false);

  useEffect(() => {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      const target = e.target as HTMLElement;
      const clickable =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-hover="true"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select') ||
        target.classList.contains('cursor-pointer') ||
        target.onclick !== null;

      setIsHovering(!!clickable);

      if (clickable) {
        const isCard = target.closest('[data-card="true"]') || target.closest('.project-card') || target.closest('.card');
        const sidebarBullet = target.closest('.fixed.right-5') || target.closest('[data-sidebar="true"]') || target.closest('.vertical-navbar');

        setIsSidebarBullet(!!sidebarBullet);

        if (isCard) {
          setHoverText('view');
        } else {
          setHoverText('');
        }
      } else {
        setIsSidebarBullet(false);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="custom-cursor enhanced-cursor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: isHovering ? (hoverText ? 1.3 : isSidebarBullet ? 0.6 : 1.15) : 1,
              opacity: 1,
              x: position.x - (isHovering ? (hoverText ? 30 : isSidebarBullet ? 14 : 26) : 20),
              y: position.y - (isHovering ? (hoverText ? 30 : isSidebarBullet ? 14 : 26) : 20)
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
              mass: 1
            }}
            style={{
              backgroundColor: isHovering && hoverText ? 'rgba(200, 195, 188, 0.9)' : 'rgba(145, 145, 145, 0.299)',
              width: isHovering ? (hoverText ? '60px' : isSidebarBullet ? '28px' : '52px') : '40px',
              height: isHovering ? (hoverText ? '60px' : isSidebarBullet ? '28px' : '52px') : '40px'
            }}
          >
            <motion.span
              className="cursor-text"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isHovering && hoverText ? 1 : 0,
                scale: isHovering && hoverText ? 1 : 0.8
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {hoverText}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default CustomCursor;
