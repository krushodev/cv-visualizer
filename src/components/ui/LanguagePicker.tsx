import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguagePicker = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-8 right-8 z-50">
      <button
        onClick={() => setLanguage(language === 'es' ? 'en' : 'es')}
        className="text-black dark:text-white text-lg font-bold hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
      >
        {language === 'es' ? 'ES' : 'EN'}
      </button>
    </motion.div>
  );
};
