import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const classes = `btn btn-primary btn-${size} ${fullWidth ? 'btn-full' : ''} ${className}`;
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;
