import React, { useEffect } from 'react';
import './WinCelebration.css';

interface WinCelebrationProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAgain: () => void;
  score?: number;
  gameTitle?: string;
}

const WinCelebration: React.FC<WinCelebrationProps> = ({
  isOpen,
  onClose,
  onPlayAgain,
  score,
  gameTitle
}) => {

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // Future enhancement: focus management, e.g., focus the "Play Again" button
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handlePlayAgainClick = () => {
    onPlayAgain();
  };

  const handleBackToHubClick = () => {
    onClose();
  };

  const modalTitleText = gameTitle ? `You Beat ${gameTitle}!` : '🎉 You Won! 🎉';
  // Generate a more unique ID for ARIA
  const titleId = `win-celebration-title-${(gameTitle || 'general-win').replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'modal'}-${Math.random().toString(36).substring(2, 9)}`;


  return (
    <div
      className="win-celebration-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="win-celebration-content" onClick={(e) => e.stopPropagation()}>
        <span className="win-celebration-icon" role="img" aria-label="Trophy">🏆</span>
        <h1 id={titleId}>{modalTitleText}</h1>
        {score !== undefined && <p className="win-celebration-score">Final Score: {score}</p>}
        <p>Congratulations!</p>
        <div className="win-celebration-actions">
          <button className="game-button game-button-primary" onClick={handlePlayAgainClick}>
            <span><span role="img" aria-label="Restart icon">🔄</span> Play Again</span>
          </button>
          <button className="game-button game-button-secondary" onClick={handleBackToHubClick}>
            <span><span role="img" aria-label="Controller icon">🎮</span> Back to Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinCelebration;
