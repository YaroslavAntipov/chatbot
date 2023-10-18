import React from "react";

interface PricingBadgeProps {
  plan: string;
}

export enum PricingPlans {
  Basic = "Basic",
  Advanced = "Advanced",
  Pro = "Pro",
}

const PricingBadge: React.FC<PricingBadgeProps> = ({ plan }) => {
  const badgeColors: { [key: string]: string } = {
    [PricingPlans.Basic]: "bg-green-500 text-white",
    [PricingPlans.Advanced]: "bg-purple-500 text-white",
    [PricingPlans.Pro]: "bg-yellow-500 text-gray-800",
  };

  const badgeColor = badgeColors[plan] || "bg-gray-400 text-gray-800";

  return (
    <span className={`inline-block px-2 py-1 rounded-full ${badgeColor}`}>
      {plan}
    </span>
  );
};

export default PricingBadge;
