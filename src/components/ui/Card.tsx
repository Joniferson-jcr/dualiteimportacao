import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  change?: string;
  changeType?: 'increase' | 'decrease';
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon, gradient, change, changeType }) => {
  const changeColor = changeType === 'increase' ? 'text-green-400' : 'text-red-400';

  return (
    <motion.div
      className="bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-5 flex items-center space-x-4"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className={cn('p-3 rounded-lg', gradient)}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
        {change && (
          <p className={`text-xs mt-1 ${changeColor}`}>{change}</p>
        )}
      </div>
    </motion.div>
  );
};
