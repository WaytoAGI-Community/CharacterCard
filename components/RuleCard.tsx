import React from 'react';
import { RuleCard as RuleCardType } from '../types';

interface Props {
  rule: RuleCardType;
}

const RuleCard: React.FC<Props> = ({ rule }) => {
  const getBorderColor = () => {
    switch (rule.type) {
      case 'CONSTRAINT': return 'border-red-800';
      case 'BONUS': return 'border-green-700';
      case 'RISK': return 'border-orange-600';
      case 'REALITY': return 'border-purple-800';
      default: return 'border-gray-800';
    }
  };

  const getIcon = () => {
    switch (rule.type) {
      case 'CONSTRAINT': return 'fa-lock';
      case 'BONUS': return 'fa-gift';
      case 'RISK': return 'fa-dice-d20';
      case 'REALITY': return 'fa-scale-balanced';
    }
  };

  return (
    <div className={`
      relative w-full mb-3 bg-[#F5DEB3] rounded-lg p-3 border-l-4 shadow-md 
      transform hover:-translate-y-1 transition-transform duration-300
      ${getBorderColor()}
    `}>
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-bold text-[#4a0404] text-sm uppercase tracking-wider">{rule.title}</h4>
        <i className={`fa-solid ${getIcon()} text-[#8B4513] opacity-50`}></i>
      </div>
      <p className="text-xs text-[#5c4033] leading-snug">{rule.description}</p>
      {rule.type === 'REALITY' && (
         <div className="absolute -right-1 -top-1 w-3 h-3 bg-purple-600 rounded-full animate-pulse"></div>
      )}
    </div>
  );
};

export default RuleCard;
