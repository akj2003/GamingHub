import React from 'react';

interface GameCardProps {
  title: string;
  description: string;
  icon?: string;
  isActive?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  description,
  icon,
  isActive = false,
  onClick,
  children,
  className = ''
}) => {
  return (
    <div 
      className={`game-card hover-lift ${isActive ? 'glow' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {icon && (
        <div className="game-card-icon" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {icon}
        </div>
      )}
      
      <h2 className="text-gradient">{title}</h2>
      
      <p>{description}</p>
      
      {children}
    </div>
  );
};

export default GameCard;