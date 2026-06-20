import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'middle' | 'large';
  className?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'secondary', size = 'middle', className = '', ...props }, ref) => {
    let variantClass = '';
    if (variant === 'primary')
      variantClass = 'bg-blue-600 text-white hover:bg-blue-500 border border-transparent';
    if (variant === 'secondary')
      variantClass =
        'bg-transparent text-foreground border border-border hover:border-blue-500 hover:text-blue-500';
    if (variant === 'danger')
      variantClass = 'bg-red-600 text-white hover:bg-red-500 border border-transparent';
    if (variant === 'ghost')
      variantClass = 'bg-transparent text-foreground hover:bg-slate-800 border border-transparent';

    let sizeClass = 'px-4 py-1.5 text-sm';
    if (size === 'small') sizeClass = 'px-2 py-1 text-xs';
    if (size === 'large') sizeClass = 'px-6 py-2 text-base';

    return (
      <button
        ref={ref}
        className={`rounded transition-colors disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-current ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
