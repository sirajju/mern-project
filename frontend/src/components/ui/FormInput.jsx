import React, { forwardRef, useMemo, memo } from 'react';

const FormInput = memo(forwardRef(({
  label,
  type = 'text',
  placeholder,
  icon,
  error,
  helpText,
  className = '',
  inputGroupClassName = '',
  required = false,
  ...props
}, ref) => {
  const inputId = useMemo(() => 
    props.id || props.name || `input-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    [props.id, props.name]
  );

  const inputClassName = useMemo(() => 
    `form-control ${error ? 'is-invalid' : ''}`,
    [error]
  );

  const containerClassName = useMemo(() => 
    `mb-3 ${className}`,
    [className]
  );

  const groupClassName = useMemo(() => 
    `input-group ${inputGroupClassName}`,
    [inputGroupClassName]
  );

  const labelElement = useMemo(() => {
    if (!label) return null;
    return (
      <label htmlFor={inputId} className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
    );
  }, [label, inputId, required]);

  const inputElement = useMemo(() => (
    <input
      ref={ref}
      type={type}
      className={inputClassName}
      id={inputId}
      placeholder={placeholder}
      required={required}
      {...props}
    />
  ), [ref, type, inputClassName, inputId, placeholder, required, props]);

  const errorElement = useMemo(() => {
    if (!error) return null;
    return <div className="invalid-feedback">{error}</div>;
  }, [error]);

  const helpElement = useMemo(() => {
    if (!helpText || error) return null;
    return <div className="form-text">{helpText}</div>;
  }, [helpText, error]);

  return (
    <div className={containerClassName}>
      {labelElement}
      
      {icon ? (
        <div className={groupClassName}>
          <span className="input-group-text">
            <i className={icon}></i>
          </span>
          {inputElement}
          {errorElement}
        </div>
      ) : (
        <>
          {inputElement}
          {errorElement}
        </>
      )}
      
      {helpElement}
    </div>
  );
}));

FormInput.displayName = 'FormInput';

export default FormInput;