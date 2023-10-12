import React from 'react';

interface PricingBadgeProps {
  plan: string;
}

const PricingBadge: React.FC<PricingBadgeProps> = ({ plan }) => {
  const badgeColors: { [key: string]: string} = {
    'Free Plan - Starter': 'bg-green-500 text-white',
    'Basic Plan - Growth': 'bg-purple-500 text-white',
    'Pro Plan - Premium': 'bg-yellow-500 text-gray-800',
  };

  const badgeColor = badgeColors[plan] || 'bg-gray-400 text-gray-800';

  return (
    <span className={`inline-block px-2 py-1 rounded-full ${badgeColor}`}>
      {plan}
    </span>
  );
};

export default PricingBadge;
