import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message,
  size = 'md',
  fullHeight = true
}) => {
  const spinnerSize = size === 'sm' ? 24 : size === 'md' ? 40 : 56;
  return (
    <div
      className="fade-in"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: fullHeight ? '60vh' : 'auto',
        gap: '1rem',
        padding: '2rem'
      }}
    >
      <Loader2
        size={spinnerSize}
        className="animate-spin"
        style={{ color: 'var(--color-primary)' }}
      />
      {message && (
        <p className="text-muted" style={{ margin: 0, fontWeight: 500 }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
