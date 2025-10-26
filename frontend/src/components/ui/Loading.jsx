import React from 'react';

const Loading = ({
  size = 'md',
  variant = 'primary',
  text = 'Loading...',
  fullScreen = false,
  overlay = false,
  className = '',
  style = {}
}) => {
  const sizeClasses = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  };

  const spinnerClasses = [
    'spinner-border',
    `text-${variant}`,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  const containerClasses = fullScreen
    ? 'd-flex justify-content-center align-items-center position-fixed w-100 h-100'
    : 'd-flex justify-content-center align-items-center p-4';

  const containerStyle = {
    ...(fullScreen && {
      top: 0,
      left: 0,
      zIndex: 9999,
      backgroundColor: overlay ? 'rgba(255, 255, 255, 0.8)' : 'transparent'
    }),
    ...style
  };

  return (
    <div className={containerClasses} style={containerStyle}>
      <div className="text-center">
        <div className={spinnerClasses} role="status">
          <span className="visually-hidden">{text}</span>
        </div>
        {text && !fullScreen && (
          <div className="mt-2 text-muted">
            <small>{text}</small>
          </div>
        )}
      </div>
    </div>
  );
};


export default Loading;