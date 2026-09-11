import React from 'react';

interface SectionHeaderProps {
  tagline?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  tagline,
  title,
  subtitle,
  align = 'left',
  className = ''
}) => {
  return (
    <div className={`section-header text-${align} ${className}`} style={{ marginBottom: '2.5rem' }}>
      {tagline && (
        <span style={{
          color: 'var(--color-primary)',
          fontWeight: 700,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          display: 'block',
          marginBottom: '0.5rem'
        }}>
          {tagline}
        </span>
      )}
      <h2 className="h2-title">{title}</h2>
      {subtitle && (
        <p className="text-muted" style={{ marginTop: '0.75rem', maxWidth: '38rem', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;
