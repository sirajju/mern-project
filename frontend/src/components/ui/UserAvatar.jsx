import React from 'react';

const UserAvatar = ({ 
  user, 
  size = 'md', // xs, sm, md, lg, xl
  variant = 'circle', // circle, rounded, square
  showName = false,
  showEmail = false,
  className = ''
}) => {
  const getSizeClasses = () => {
    const sizes = {
      xs: { width: '32px', height: '32px', fontSize: '0.75rem' },
      sm: { width: '40px', height: '40px', fontSize: '1rem' },
      md: { width: '60px', height: '60px', fontSize: '1.5rem' },
      lg: { width: '80px', height: '80px', fontSize: '2rem' },
      xl: { width: '120px', height: '120px', fontSize: '3rem' }
    };
    return sizes[size] || sizes.md;
  };

  const getVariantClass = () => {
    switch (variant) {
      case 'rounded': return 'rounded';
      case 'square': return 'rounded-0';
      default: return 'rounded-circle';
    }
  };

  const sizeStyle = getSizeClasses();
  const variantClass = getVariantClass();
  
  const avatarElement = user?.avatar ? (
    <img
      src={user.avatar}
      alt={user?.name || 'User'}
      className={`${variantClass} ${className}`}
      style={sizeStyle}
    />
  ) : (
    <div
      className={`bg-primary d-flex align-items-center justify-content-center text-white ${variantClass} ${className}`}
      style={sizeStyle}
    >
      <span style={{ fontSize: sizeStyle.fontSize }}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>
  );

  if (!showName && !showEmail) {
    return avatarElement;
  }

  return (
    <div className="d-flex align-items-center">
      {avatarElement}
      {(showName || showEmail) && (
        <div className="ms-3">
          {showName && user?.name && <h6 className="mb-0">{user.name}</h6>}
          {showEmail && user?.email && (
            <p className="text-muted mb-0 small">{user.email}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;