import React, { useState } from 'react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  ripple?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  className = '',
  ripple = true
}) => {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    if (ripple) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const newRipple = { x, y, id: Date.now() };
      
      setRipples(prev => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 600);
    }

    onClick?.();
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return 'game-button-secondary';
      case 'glass':
        return 'btn-glass';
      case 'success':
        return 'game-button-primary';
      case 'warning':
        return 'game-button-special';
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700';
      default:
        return 'game-button';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'px-3 py-2 text-sm';
      case 'large':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-6 py-3 text-base';
    }
  };

  return (
    <button
      className={`
        ${getVariantClasses()}
        ${getSizeClasses()}
        relative overflow-hidden
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute bg-white bg-opacity-30 rounded-full animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            pointerEvents: 'none'
          }}
        />
      ))}
      
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </span>
    </button>
  );
};

export default AnimatedButton;