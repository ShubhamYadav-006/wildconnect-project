import React from 'react';

interface CardProps {
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Header: React.FC<CardProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
} = ({ className = '', onClick, style, children }) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
      style={{
        ...style,
        ...(onClick ? { cursor: 'pointer' } : {})
      }}
    >
      {children}
    </div>
  );
};

Card.Header = ({ className = '', children }) => (
  <div className={`card-header ${className}`}>
    {children}
  </div>
);

Card.Body = ({ className = '', children }) => (
  <div className={`card-body ${className}`}>
    {children}
  </div>
);

Card.Footer = ({ className = '', children }) => (
  <div className={`card-footer ${className}`}>
    {children}
  </div>
);

export default Card;
