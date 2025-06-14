import React, { useEffect } from 'react';
import './WinCelebration.css';

interface WinCelebrationProps {
  onClose: () => void;
}

const WinCelebration: React.FC<WinCelebrationProps> = ({ onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="win-celebration-overlay" onClick={onClose}>
      <div className="win-celebration-content">
        <h1>🎉 You Won! 🎉</h1>
        {/* Placeholder for GIF/animation - using text for now */}
        <p style={{ fontSize: '2em', margin: '20px 0' }}>🎆 FIREWORKS! 🎆</p>
        <p>Congratulations!</p>
        <p style={{ fontSize: '0.8em', marginTop: '20px', color: 'var(--subtle-text-color)' }}>(Click to dismiss or wait 5 seconds)</p>
      </div>
    </div>
  );
};

export default WinCelebration;
