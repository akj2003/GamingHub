import React from 'react';

interface GlowingOrbProps {
  size?: number;
  color?: string;
  intensity?: number;
  className?: string;
  animate?: boolean;
}

const GlowingOrb: React.FC<GlowingOrbProps> = ({
  size = 100,
  color = '#667eea',
  intensity = 0.5,
  className = '',
  animate = true
}) => {
  const orbStyle = {
    width: size,
    height: size,
    background: `radial-gradient(circle, ${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
    borderRadius: '50%',
    filter: `blur(${size * 0.1}px)`,
    animation: animate ? 'pulse 3s ease-in-out infinite' : 'none'
  };

  return (
    <div 
      className={`absolute pointer-events-none ${className}`}
      style={orbStyle}
    />
  );
};

export default GlowingOrb;