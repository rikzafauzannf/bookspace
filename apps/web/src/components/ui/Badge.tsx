import React from 'react';

type BadgeVariant = 'available' | 'trade' | 'rented' | 'rent' | 'pending' | 'success' | 'warning';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'available',
  className = '',
}) => {
  const variants = {
    available: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    trade: 'bg-amber-50 text-amber-900 border-amber-200',
    rented: 'bg-gray-100 text-gray-700 border-gray-200',
    rent: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    pending: 'bg-orange-50 text-orange-800 border-orange-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    warning: 'bg-red-50 text-red-800 border-red-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
