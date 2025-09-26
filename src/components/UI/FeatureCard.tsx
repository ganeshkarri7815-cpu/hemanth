import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
  status?: 'normal' | 'warning' | 'critical';
  badge?: string | number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  onClick,
  status = 'normal',
  badge
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'border-disaster-200 bg-disaster-50 hover:bg-disaster-100';
      case 'critical':
        return 'border-emergency-200 bg-emergency-50 hover:bg-emergency-100';
      default:
        return 'border-gray-200 bg-white hover:bg-gray-50';
    }
  };

  const getIconColor = () => {
    switch (status) {
      case 'warning':
        return 'text-disaster-600';
      case 'critical':
        return 'text-emergency-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${getStatusColor()}`}
      onClick={onClick}
    >
      {badge && (
        <div className="absolute -top-2 -right-2 bg-emergency-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
          {badge}
        </div>
      )}
      
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg ${status === 'critical' ? 'bg-emergency-100' : status === 'warning' ? 'bg-disaster-100' : 'bg-blue-100'}`}>
          <Icon className={`h-6 w-6 ${getIconColor()}`} />
        </div>
        
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      
      {status === 'critical' && (
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 bg-emergency-500 rounded-full animate-pulse-emergency"></div>
          <span className="text-xs text-emergency-600 font-medium">Urgent attention required</span>
        </div>
      )}
    </motion.div>
  );
};

export default FeatureCard;
