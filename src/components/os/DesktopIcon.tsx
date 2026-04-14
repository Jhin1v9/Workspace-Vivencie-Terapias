import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface DesktopIconProps {
  icon: LucideIcon;
  label: string;
  color: string;
  isClinico?: boolean;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon: Icon,
  label,
  color,
  isClinico = false,
  onDoubleClick,
}) => {
  return (
    <motion.div
      className="desktop-icon group"
      onDoubleClick={onDoubleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`desktop-icon-circle ${isClinico ? 'bg-slate-200/80 border-slate-300' : ''}`}>
        <Icon 
          className={`w-8 h-8 ${color} transition-all duration-300 group-hover:scale-110`} 
          strokeWidth={1.5}
        />
      </div>
      <span 
        className={`text-sm font-medium text-center transition-all duration-300 ${
          isClinico ? 'text-slate-700' : 'text-white/80 group-hover:text-white'
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
};
