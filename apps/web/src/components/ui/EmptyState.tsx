import React from 'react';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📚',
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white border-2 border-dashed border-brand-border rounded-3xl">
      <span className="text-5xl mb-4 grayscale opacity-60">{icon}</span>
      <h3 className="font-serif text-xl font-bold text-brand-wood">{title}</h3>
      <p className="max-w-xs mx-auto mt-2 text-sm text-brand-muted leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-6 py-2.5 bg-brand-wood text-white rounded-xl text-sm font-semibold hover:bg-brand-woodHover transition-all"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
