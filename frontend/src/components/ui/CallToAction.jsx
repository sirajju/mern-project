import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = ({ 
  title, 
  subtitle, 
  primaryButton, 
  secondaryButton,
  bgVariant = 'primary', 
  className = '' 
}) => {
  const renderButton = (button, isPrimary = true) => {
    if (!button) return null;

    const baseClasses = isPrimary 
      ? `btn btn-${button.variant || 'light'} btn-lg`
      : `btn btn-outline-${button.variant || 'light'} btn-lg`;

    if (button.to) {
      return (
        <Link to={button.to} className={baseClasses}>
          {button.icon && <i className={`${button.icon} me-2`}></i>}
          {button.text}
        </Link>
      );
    }

    if (button.href) {
      return (
        <a href={button.href} className={baseClasses} target={button.target}>
          {button.icon && <i className={`${button.icon} me-2`}></i>}
          {button.text}
        </a>
      );
    }

    return (
      <button onClick={button.onClick} className={baseClasses}>
        {button.icon && <i className={`${button.icon} me-2`}></i>}
        {button.text}
      </button>
    );
  };

  return (
    <div className={`row ${className}`}>
      <div className="col-12">
        <div className={`card border-0 bg-${bgVariant} text-white`}>
          <div className="card-body text-center p-5">
            <h3 className="mb-3">{title}</h3>
            {subtitle && <p className="mb-4">{subtitle}</p>}
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {renderButton(primaryButton, true)}
              {renderButton(secondaryButton, false)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;