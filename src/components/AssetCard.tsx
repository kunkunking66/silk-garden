import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Star, Award, Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. 在 Props 中增加 theme 属性
interface AssetCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colorClass?: string;
  onClick?: () => void;
  theme?: 'dark' | 'light'; // 新增 theme 属性
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  title, 
  value, 
  icon, 
  colorClass = 'bg-[#8b6e4f]',
  onClick,
  theme // 接收 theme 属性
}) => {
  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      // 2. 根据 theme 动态改变背景色和阴影
      className={cn(
        theme === 'dark' ? 'bg-gray-800' : 'bg-white', // 动态背景色
        "rounded-xl shadow-md p-6 flex items-center gap-4 cursor-pointer", 
        onClick && (theme === 'dark' ? "hover:bg-gray-700" : "hover:shadow-lg transition-all")
      )}
      onClick={onClick}
    >
      <div className={`${colorClass} text-white p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        {/* 3. 根据 theme 动态改变文字颜色 */}
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</p>
        <h3 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
      </div>
    </motion.div>
  );
};

// 4. 更新所有衍生组件，让它们也能接收和传递 theme 属性
export const BalanceCard: React.FC<Omit<AssetCardProps, 'icon' | 'value'> & { balance: string }> = ({ 
  title, 
  balance, 
  colorClass, 
  onClick,
  theme
}) => (
  <AssetCard 
    title={title} 
    value={balance} 
    icon={<CreditCard size={24} />} 
    colorClass={colorClass} 
    onClick={onClick} 
    theme={theme}
  />
);

export const PointsCard: React.FC<Omit<AssetCardProps, 'icon' | 'value'> & { points: string }> = ({ 
  title, 
  points, 
  colorClass, 
  onClick,
  theme
}) => (
  <AssetCard 
    title={title} 
    value={points} 
    icon={<Star size={24} />} 
    colorClass={colorClass} 
    onClick={onClick} 
    theme={theme}
  />
);

export const MembershipCard: React.FC<Omit<AssetCardProps, 'icon' | 'value'> & { level: string }> = ({ 
  title, 
  level, 
  colorClass, 
  onClick,
  theme
}) => (
  <AssetCard 
    title={title} 
    value={level} 
    icon={<Award size={24} />} 
    colorClass={colorClass} 
    onClick={onClick} 
    theme={theme}
  />
);

export const CouponsCard: React.FC<Omit<AssetCardProps, 'icon' | 'value'> & { count: string }> = ({ 
  title, 
  count, 
  colorClass, 
  onClick,
  theme
}) => (
  <AssetCard 
    title={title} 
    value={count} 
    icon={<Gift size={24} />} 
    colorClass={colorClass} 
    onClick={onClick} 
    theme={theme}
  />
);

export default AssetCard;