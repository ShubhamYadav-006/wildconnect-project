import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  variant?: 'solid' | 'outline';
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<ButtonProps> = ({
  size = 'md',
  fullWidth = false,
  variant = 'solid',
  className = '',
  children,
  ...props
}) => {
  const btnVariant = variant === 'outline' ? 'btn-outline' : 'btn-secondary';
  const classes = `btn ${btnVariant} btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default SecondaryButton;
