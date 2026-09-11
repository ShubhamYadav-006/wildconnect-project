import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--color-text-muted)',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          id={id}
          ref={ref}
          className={`input-field ${error ? 'error' : ''} ${className}`}
          style={icon ? { paddingLeft: '2.75rem' } : undefined}
          {...props}
        />
      </div>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
