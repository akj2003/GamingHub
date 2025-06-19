import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color,
  text 
}) => {

  const spinnerStyle = {
    width: size === 'small' ? '24px' : size === 'large' ? '64px' : '40px',
    height: size === 'small' ? '24px' : size === 'large' ? '64px' : '40px',
    border: `3px solid ${color ? `${color}30` : 'rgba(102, 126, 234, 0.3)'}`,
    borderTop: `3px solid ${color || 'var(--primary-color)'}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: text ? '0 auto 1rem' : '1rem auto'
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div style={spinnerStyle} />
      {text && (
        <p className="text-center text-gray-400 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;