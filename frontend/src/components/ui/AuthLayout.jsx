import React from 'react';
import { Link } from 'react-router-dom';
import FeatureList from './FeatureList';

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  leftContent, 
  rightContent, 
  showLogo = true,
  className = '' 
}) => {
  const defaultFeatures = [
    {
      icon: 'bi bi-check-circle',
      title: 'Project Tracking',
      description: 'Real-time progress monitoring'
    },
    {
      icon: 'bi bi-people',
      title: 'Team Collaboration',
      description: 'Seamless team communication'
    },
    {
      icon: 'bi bi-graph-up',
      title: 'Analytics',
      description: 'Detailed insights & reports'
    },
    {
      icon: 'bi bi-shield-check',
      title: 'Secure',
      description: 'Enterprise-grade security'
    }
  ];

  const defaultLeftContent = (
    <div className="text-center p-5 animate-slide-in-left">
      <div className="mb-4">
        <i className="bi bi-kanban display-1 mb-4"></i>
        <h2 className="display-5 fw-bold mb-4">
          Manage Projects with Ease
        </h2>
        <p className="lead mb-4">
          TaskFlow helps teams stay organized, collaborate effectively, and
          deliver projects on time.
        </p>
      </div>
      <FeatureList 
        features={defaultFeatures} 
        variant="horizontal" 
        iconBg="white" 
        className="text-start"
      />
    </div>
  );

  return (
    <div className={`min-vh-100 d-flex ${className}`}>
      <div className="col-lg-7 gradient-bg text-white d-none d-lg-flex align-items-center justify-content-center">
        {leftContent || defaultLeftContent}
      </div>

      <div className="col-lg-5 d-flex align-items-center justify-content-center p-4">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <div className="animate-slide-in-right" style={{ animationDelay: "0.1s" }}>
            {showLogo && (
              <div className="text-center mb-5">
                <Link to="/" className="text-decoration-none">
                  <h2 className="fw-bold text-gradient mb-2">
                    <i className="bi bi-layers me-2"></i>
                    TaskFlow
                  </h2>
                </Link>
                {title && <h3 className="mb-2">{title}</h3>}
                {subtitle && <p className="text-muted">{subtitle}</p>}
              </div>
            )}
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;