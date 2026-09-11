import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
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
      <textarea
        id={id}
        ref={ref}
        className={`input-field ${error ? 'error' : ''} ${className}`}
        {...props}
      ></textarea>
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
