import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-semibold text-brand-wood">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full min-h-[44px] px-4 py-2.5 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-wood transition-all ${
            error ? 'border-brand-error focus:ring-brand-error' : 'border-brand-border'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-brand-error font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-brand-muted">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
