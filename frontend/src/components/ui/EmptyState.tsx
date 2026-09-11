import React from 'react';
import PrimaryButton from '../buttons/PrimaryButton';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div
      className="card fade-in text-center"
      style={{
        padding: '4rem 2rem',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafaf9'
      }}
    >
      <div style={{
        color: 'var(--color-text-muted)',
        marginBottom: '1.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <h3 className="h3-title" style={{ marginBottom: '0.5rem' }}>{title}</h3>
      <p className="text-muted" style={{ margin: 0, maxWidth: '24rem', marginBottom: actionText && onAction ? '1.5rem' : 0 }}>
        {description}
      </p>
      {actionText && onAction && (
        <PrimaryButton onClick={onAction} size="sm">
          {actionText}
        </PrimaryButton>
      )}
    </div>
  );
};

export default EmptyState;
