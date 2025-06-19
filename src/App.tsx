import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import InteractiveBackground from './components/InteractiveBackground';
import GameCard from './components/GameCard';
import WinCelebration from './components/WinCelebration';
import InstructionsModal from './components/InstructionsModal';
import './App.css';

// Game Components (simplified for this example)
const TicTacToeGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;
    
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setShowCelebration(true);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setShowCelebration(false);
  };

  return (
    <GameCard
      title="Tic Tac Toe"
      description="Classic strategy game for two players"
      icon="🎯"
    >
      <div className="tictactoe-grid">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`tictactoe-cell ${cell ? cell.toLowerCase() : ''}`}
            onClick={() => handleClick(index)}
            disabled={!!cell || !!winner}
          >
            {cell}
          </button>
        ))}
      </div>
      
      <div className="game-status">
        {winner ? (
          <p>Winner: <strong>{winner}</strong></p>
        ) : (
          <p>Next player: <strong>{isXNext ? 'X' : 'O'}</strong></p>
        )}
      </div>
      
      <div className="game-actions">
        <button className="game-button game-button-secondary" onClick={onBack}>
          Back to Hub
        </button>
        <button className="game-button" onClick={resetGame}>
          New Game
        </button>
        <button className="game-button game-button-special" onClick={() => setShowInstructions(true)}>
          Instructions
        </button>
      </div>

      <WinCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={resetGame}
        gameTitle="Tic Tac Toe"
      />

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="Tic Tac Toe Instructions"
      >
        <h3>How to Play</h3>
        <ul>
          <li>Players take turns placing X's and O's on the grid</li>
          <li>First player to get 3 in a row (horizontal, vertical, or diagonal) wins</li>
          <li>If all squares are filled with no winner, it's a tie</li>
        </ul>
        <h3>Strategy Tips</h3>
        <ul>
          <li>Try to control the center square</li>
          <li>Block your opponent's winning moves</li>
          <li>Look for opportunities to create multiple winning paths</li>
        </ul>
      </InstructionsModal>
    </GameCard>
  );
};

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameCard
      title="Memory Game"
      description="Match pairs of cards to test your memory"
      icon="🧠"
    >
      <p>Memory game coming soon!</p>
      <button className="game-button game-button-secondary" onClick={onBack}>
        Back to Hub
      </button>
    </GameCard>
  );
};

const HangmanGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameCard
      title="Hangman"
      description="Guess the word before the drawing is complete"
      icon="🎪"
    >
      <p>Hangman game coming soon!</p>
      <button className="game-button game-button-secondary" onClick={onBack}>
        Back to Hub
      </button>
    </GameCard>
  );
};

const MinesweeperGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <GameCard
      title="Minesweeper"
      description="Clear the field without hitting any mines"
      icon="💣"
    >
      <p>Minesweeper game coming soon!</p>
      <button className="game-button game-button-secondary" onClick={onBack}>
        Back to Hub
      </button>
    </GameCard>
  );
};

type GameType = 'hub' | 'tictactoe' | 'memory' | 'hangman' | 'minesweeper';

function App() {
  const { currentUser, loading, logout } = useAuth();
  const [currentGame, setCurrentGame] = useState<GameType>('hub');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!currentUser) {
    return <Login />;
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'tictactoe':
        return <TicTacToeGame onBack={() => setCurrentGame('hub')} />;
      case 'memory':
        return <MemoryGame onBack={() => setCurrentGame('hub')} />;
      case 'hangman':
        return <HangmanGame onBack={() => setCurrentGame('hub')} />;
      case 'minesweeper':
        return <MinesweeperGame onBack={() => setCurrentGame('hub')} />;
      default:
        return (
          <div className="game-hub">
            <GameCard
              title="Welcome to Gaming Hub!"
              description="Choose your favorite game to start playing"
              icon="🎮"
            >
              <div className="game-grid" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '1rem', 
                width: '100%',
                maxWidth: '800px'
              }}>
                <GameCard
                  title="Tic Tac Toe"
                  description="Classic strategy game"
                  icon="🎯"
                  onClick={() => setCurrentGame('tictactoe')}
                  className="hover-lift"
                />
                <GameCard
                  title="Memory Game"
                  description="Test your memory skills"
                  icon="🧠"
                  onClick={() => setCurrentGame('memory')}
                  className="hover-lift"
                />
                <GameCard
                  title="Hangman"
                  description="Guess the hidden word"
                  icon="🎪"
                  onClick={() => setCurrentGame('hangman')}
                  className="hover-lift"
                />
                <GameCard
                  title="Minesweeper"
                  description="Clear the minefield"
                  icon="💣"
                  onClick={() => setCurrentGame('minesweeper')}
                  className="hover-lift"
                />
              </div>
            </GameCard>
          </div>
        );
    }
  };

  return (
    <div className="app-container">
      <InteractiveBackground />
      
      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      <header className="app-header">
        <h1>Gaming Station</h1>
        <p>Your ultimate destination for classic games and entertainment</p>
        
        <nav>
          <button 
            className={`nav-button ${currentGame === 'hub' ? 'nav-button-active' : ''}`}
            onClick={() => setCurrentGame('hub')}
          >
            🏠 Game Hub
          </button>
          <button 
            className={`nav-button ${currentGame === 'tictactoe' ? 'nav-button-active' : ''}`}
            onClick={() => setCurrentGame('tictactoe')}
          >
            🎯 Tic Tac Toe
          </button>
          <button 
            className={`nav-button ${currentGame === 'memory' ? 'nav-button-active' : ''}`}
            onClick={() => setCurrentGame('memory')}
          >
            🧠 Memory
          </button>
          <button 
            className={`nav-button ${currentGame === 'hangman' ? 'nav-button-active' : ''}`}
            onClick={() => setCurrentGame('hangman')}
          >
            🎪 Hangman
          </button>
          <button 
            className={`nav-button ${currentGame === 'minesweeper' ? 'nav-button-active' : ''}`}
            onClick={() => setCurrentGame('minesweeper')}
          >
            💣 Minesweeper
          </button>
          <button 
            className="nav-button game-button-secondary"
            onClick={logout}
          >
            🚪 Logout
          </button>
        </nav>
      </header>

      <main className="app-main">
        {renderGame()}
      </main>

      <footer className="app-footer">
        <p>
          Built with ❤️ using <span className="tech-text">React</span> & <span className="tech-text">TypeScript</span> | 
          <span className="brand-text"> Gaming Station</span> © 2024
        </p>
      </footer>
    </div>
  );
}

export default App;