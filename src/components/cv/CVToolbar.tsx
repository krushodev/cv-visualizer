import { FaSearchPlus, FaSearchMinus, FaDownload, FaRedo } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CVToolbarProps {
  zoom: number;
  setZoom: (zoom: number) => void;
  onPrint: () => void;
  onReset: () => void;
}

export const CVToolbar = ({ zoom, setZoom, onPrint, onReset }: CVToolbarProps) => {
  const iconClass = 'w-4 h-4';
  const btnClass = 'p-3 hover:bg-white/10 rounded-lg transition-all active:scale-95 text-slate-400 hover:text-white flex items-center justify-center relative group';

  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 px-2 py-2 bg-[#1a1a1a]/90 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-black/50 text-white">
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => setZoom(Math.max(0.4, zoom - 0.1))} className={btnClass} title="Zoom Out">
            <FaSearchMinus className={iconClass} />
          </button>
          <span className="w-12 text-center text-xs font-mono font-medium text-slate-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom(Math.min(1.5, zoom + 0.1))} className={btnClass} title="Zoom In">
            <FaSearchPlus className={iconClass} />
          </button>
        </div>

        <div className="flex items-center gap-1 pl-2">
          <button onClick={onReset} className={btnClass} title="Resetear Vista">
            <FaRedo className={iconClass} />
          </button>
          <button onClick={onPrint} className={cn(btnClass, 'text-green-400 hover:text-green-300')} title="Descargar PDF">
            <FaDownload className={iconClass} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
