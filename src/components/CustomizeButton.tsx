import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Scissors } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CustomizeButtonProps {
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  label?: string;
}

const CustomizeButton: React.FC<CustomizeButtonProps> = ({
  onClick,
  className = '',
  variant = 'primary',
  label = 'Customize Now'
}) => {
  const buttonClasses = cn(
    'flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
    variant === 'primary' 
      ? 'bg-[#8b6e4f] text-white hover:bg-[#6d573a] hover:shadow-lg' 
      : 'bg-white text-[#8b6e4f] border border-[#8b6e4f] hover:bg-[#f9f7f3]',
    className
  );

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={buttonClasses}
      onClick={onClick}
    >
      <Scissors size={18} />
      <span>{label}</span>
    </motion.button>
  );
};

export default CustomizeButton;