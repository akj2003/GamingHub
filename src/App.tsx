import { useState, useEffect } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext'; // AuthProvider import removed
import WinCelebration from './components/WinCelebration';
import InstructionsModal from './components/InstructionsModal';
import Login from './components/Login';

// SVG Icon for TicTacToe
const TicTacToeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1 2a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V2zM1 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zM1 12a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2zm5 0a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2z"/>
  </svg>
);

function GamingPage() {
  const [score, setScore] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentShape, setCurrentShape] = useState<string>('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [step, setStep] = useState<'color' | 'shape' | 'win'>('color');
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const colorList = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white',
    'teal', 'lime', 'cyan', 'magenta', 'indigo', 'violet', 'maroon', 'navy', 'silver', 'gold'
  ];
  const shapeList = [
    'circle', 'square', 'triangle', 'star', 'hexagon', 'rectangle', 'oval', 'diamond',
    'pentagon', 'heptagon', 'octagon', 'cross', 'arrow', 'heart'
  ];

  function newRound() {
    const answerColor = colorList[Math.floor(Math.random() * colorList.length)];
    const answerShape = shapeList[Math.floor(Math.random() * shapeList.length)];
    const shuffledColors = [...colorList]
      .filter((c) => c !== answerColor)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    shuffledColors.push(answerColor);
    setColorOptions(shuffledColors.sort(() => 0.5 - Math.random()));
    const shuffledShapes = [...shapeList]
      .filter((s) => s !== answerShape)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    shuffledShapes.push(answerShape);
    setShapeOptions(shuffledShapes.sort(() => 0.5 - Math.random()));
    setCurrentColor(answerColor);
    setCurrentShape(answerShape);
    setMessage('');
    setStep('color');
    setShowCelebration(false);
  }

  useEffect(() => {
    newRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleColorGuess(color: string) {
    if (color === currentColor) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setStep('win');
          setMessage('🏆 You win! Congratulations!');
          setShowCelebration(true);
        } else {
          setStep('shape');
          setMessage('Correct color! Now pick the shape.');
        }
        return newScore;
      });
    } else {
      setMessage('Try again!');
    }
  }

  function handleShapeGuess(shape: string) {
    if (shape === currentShape) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setStep('win');
          setMessage('🏆 You win! Congratulations!');
          setShowCelebration(true);
        } else {
          setMessage('Correct! Next round...');
          setTimeout(newRound, 1200);
        }
        return newScore;
      });
    } else {
      setMessage('Try again!');
    }
  }

  function renderShape(shape: string, color: string) {
    const size = 60;
    const commonSvgStyle = { display: 'block', margin: '0 auto' };
    const commonDivStyle = { width: size, height: size, background: color, margin: '0 auto' };

    switch (shape) {
      case 'circle':
        return <div style={{ ...commonDivStyle, borderRadius: '50%' }} />;
      case 'square':
        return <div style={commonDivStyle} />;
      case 'triangle':
        return <div style={{ width: 0, height: 0, borderLeft: `${size / 2}px solid transparent`, borderRight: `${size / 2}px solid transparent`, borderBottom: `${size}px solid ${color}`, margin: '0 auto' }} />;
      case 'star':
        return <svg width={size} height={size} viewBox="0 0 50 50" style={commonSvgStyle}><polygon points="25,2 31,18 48,18 34,29 39,46 25,36 11,46 16,29 2,18 19,18" fill={color} /></svg>;
      case 'hexagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={color} /></svg>;
      case 'rectangle':
        return <div style={{ width: size * 1.5, height: size * 0.75, background: color, margin: '0 auto' }} />;
      case 'oval':
        return <div style={{ width: size * 1.25, height: size * 0.8, background: color, borderRadius: '50%', margin: '0 auto' }} />;
      case 'diamond':
        return <div style={{ ...commonDivStyle, transform: 'rotate(45deg)' }} />;
      case 'pentagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,5 95,35 80,95 20,95 5,35" fill={color} /></svg>;
      case 'heptagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,5 89,25 95,65 68,95 32,95 5,65 11,25" fill={color} /></svg>;
      case 'octagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill={color} /></svg>;
      case 'cross':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><path d="M30,10 L70,10 L70,30 L90,30 L90,70 L70,70 L70,90 L30,90 L30,70 L10,70 L10,30 L30,30 Z" fill={color} /></svg>;
      case 'arrow':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><path d="M5,35 L60,35 L60,15 L95,50 L60,85 L60,65 L5,65 Z" fill={color} /></svg>;
      case 'heart':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><path d="M50,30 C40,10 10,20 10,50 C10,80 50,95 50,95 C50,95 90,80 90,50 C90,20 60,10 50,30 Z" fill={color} /></svg>;
      default:
        return null;
    }
  }

  function restartGame() {
    setScore(0);
    newRound();
  }

  return (
    <>
      <WinCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restartGame}
        score={score}
        gameTitle="Shape & Color"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🎨 Shape & Color Game - Instructions"
      >
        <ul>
          <li>Identify the color of the displayed sample.</li>
          <li>If correct, you'll then need to identify the shape that matches the sample.</li>
          <li>Score 10 points to win the game!</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 420 }}>
        <h1><span role="img" aria-label="Palette icon">🎨</span> Shape & Color Game</h1>
        <p className="score-text">
          Score: <b aria-live="polite">{score}</b> / 10
        </p>
        {step !== 'win' && (
          <button
            className="game-button game-button-secondary mb-2"
            onClick={restartGame}
          >
            <span><span role="img" aria-label="Restart icon">🔄</span> Restart</span>
          </button>
        )}
         <button className="game-button game-button-secondary mb-2" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        {step === 'color' && (
          <>
            <div className="mt-2 mb-1" style={{ fontSize: '1.2em', fontWeight: 600, color: 'var(--text-color)' }}>
              Identify the color:
              <span className="gaming-page-color-display" style={{ background: currentColor }} />
            </div>
            <div className="gaming-page-options-container">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  className="gaming-page-option-button"
                  style={{
                    background: color,
                    color: ['white', 'yellow', 'pink', 'orange', 'lime', 'cyan', 'silver', 'gold', '#fdfefe', '#eaeded'].includes(color.toLowerCase()) ? 'var(--text-color)' : 'var(--button-text-color)',
                  }}
                  onClick={() => handleColorGuess(color)}
                >
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 'shape' && (
          <>
            <div className="mt-2 mb-1" style={{ fontSize: '1.2em', fontWeight: 600, color: 'var(--text-color)' }}>
              Identify the shape:
              <div style={{ marginTop: 16 }}>{renderShape(currentShape, currentColor)}</div>
            </div>
            <div className="gaming-page-options-container">
              {shapeOptions.map((shape) => (
                <button
                  key={shape}
                  className="gaming-page-option-button"
                  onClick={() => handleShapeGuess(shape)}
                >
                  {shape.charAt(0).toUpperCase() + shape.slice(1)}
                </button>
              ))}
            </div>
          </>
        )}
        {step === 'win' && (
          <div className="gaming-page-win-message">
            🏆 You win! Congratulations!<br />
            <button
              className="game-button game-button-primary mt-2"
              onClick={restartGame}
            >
              <span><span role="img" aria-label="Restart icon">🔄</span> Play Again</span>
            </button>
          </div>
        )}
        {message && <div role="status" aria-live="polite"><p className="gaming-page-message" style={{ color: message.includes('win') ? 'var(--success-color)' : message.includes('Try again') || message.includes('Invalid') ? 'var(--error-color)' : 'var(--text-color)' }}>{message}</p></div>}
      </div>
    </>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  function calculateWinner(squares: string[]) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  function handleClick(idx: number) {
    if (winner || board[idx]) return;
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    const currentWin = calculateWinner(newBoard);
    if (currentWin) {
      setWinner(currentWin);
      setShowCelebration(true);
    } else if (newBoard.every((cell) => cell)) {
      setDraw(true);
    } else {
      setXIsNext(!xIsNext);
    }
  }

  function restart() {
    setBoard(Array(9).fill(''));
    setXIsNext(true);
    setWinner(null);
    setDraw(false);
    setShowCelebration(false);
  }

  return (
    <>
      <WinCelebration
        isOpen={showCelebration && !!winner}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restart}
        gameTitle="Tic-Tac-Toe"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🏁 Tic-Tac-Toe - Instructions"
      >
        <ul>
          <li>Players take turns marking a square in a 3x3 grid.</li>
          <li>The player who first places three of their marks in a horizontal, vertical, or diagonal row wins.</li>
          <li>If all squares are filled and no one wins, the game is a draw.</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 500 }}>
        <h2><span role="img" aria-label="Chequered flag icon">🏁</span> Tic-Tac-Toe</h2>
        <div className="tictactoe-grid" role="grid">
          {board.map((cell, idx) => (
            <button
              key={idx}
              className={`tictactoe-cell ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''}`}
              style={{ outline: cell && (winner || draw) ? `2px solid var(--success-color)` : undefined }}
              onClick={() => handleClick(idx)}
              disabled={!!cell || !!winner}
              aria-label={`Tic-Tac-Toe cell ${idx + 1}`}
            >
              {cell}
            </button>
          ))}
        </div>
        <div role="status" aria-live="polite" className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.3em', color: winner ? 'var(--success-color)' : draw ? 'var(--error-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
          {winner ? `Winner: ${winner}` : draw ? 'Draw!' : `Next: ${xIsNext ? 'X' : 'O'}`}
        </div>
        <button className="game-button game-button-secondary" onClick={restart}>
          <span><span role="img" aria-label="Restart icon">🔄</span> Restart</span>
        </button>
        <button className="game-button game-button-secondary mt-1" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
      </div>
    </>
  );
}

function Ludo() {
  const [numPlayers, setNumPlayers] = useState<number>(4);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [positions, setPositions] = useState<number[]>(Array(4).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const boardSize = 20;

  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [displayDice, setDisplayDice] = useState<number | null>(null);
  const [justMovedPlayer, setJustMovedPlayer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const playerColors = ['#e53935', '#43a047', '#1e88e5', '#fbc02d'];
  const playerNames = ['Red', 'Green', 'Blue', 'Yellow'];

  function handlePlayerSelect(selectedNum: number) {
    restart(selectedNum);
  }

  function restart(selectedNumPlayersToUse?: number) {
    const playersToSetup = selectedNumPlayersToUse || numPlayers;
    setNumPlayers(playersToSetup);

    setPositions(Array(4).fill(0));
    setCurrentPlayer(0);
    setDice(null);
    setWinner(null);
    setShowCelebration(false);
    setJustMovedPlayer(null);
    setIsRolling(false);
    setDisplayDice(null);
    setGameStarted(true);
  }
  
  useEffect(() => {
    if (gameStarted && !isRolling && winner === null) {
      setDisplayDice(null);
      setDice(null);
    }
  }, [currentPlayer, isRolling, winner, gameStarted, numPlayers]);

  function rollDice() {
    if (winner !== null || isRolling) return;

    setIsRolling(true);
    setDisplayDice(null);

    let rollCount = 0;
    const animationDuration = 800;
    const singleRollAnimationTime = 80;
    const maxRollCount = animationDuration / singleRollAnimationTime;

    const rollAnimationInterval = setInterval(() => {
      setDisplayDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= maxRollCount) {
        clearInterval(rollAnimationInterval);

        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll);
        const movedPlayer = currentPlayer;

        const gameWillBeWonThisTurn = (positions[movedPlayer] + finalRoll) === boardSize;

        setPositions((previousPositions) => {
          const updatedPositionsArray = [...previousPositions];
          if (updatedPositionsArray[movedPlayer] + finalRoll <= boardSize) {
            updatedPositionsArray[movedPlayer] += finalRoll;
          }
          if (updatedPositionsArray[movedPlayer] === boardSize) {
            setWinner(movedPlayer);
            setShowCelebration(true);
          }
          return updatedPositionsArray;
        });

        setJustMovedPlayer(movedPlayer);
        setTimeout(() => setJustMovedPlayer(null), 500);

        if (!gameWillBeWonThisTurn) {
          if (winner === null) {
            setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % numPlayers);
          }
        }
        setIsRolling(false);
      }
    }, singleRollAnimationTime);
  }

  if (!gameStarted) {
    return (
      <>
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🎲 Ludo (Mini) - Instructions"
      >
        <ul>
          <li>Players take turns rolling a dice.</li>
          <li>Move your token along the linear board according to the dice roll.</li>
          <li>Be the first player to land exactly on step 20 to win! You must roll the exact number required.</li>
          <li>Number of players can be selected before starting.</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 700, borderRadius: 24 }}>
        <h2><span role="img" aria-label="Dice icon">🎲</span> Ludo (Mini) - Select Players</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', margin: '1em 0' }}>
          {[2, 3, 4].map(num => (
            <button
              key={num}
              className="game-button game-button-primary"
              style={{ minWidth: '150px', fontSize: '1.1em' }}
              onClick={() => handlePlayerSelect(num)}
            >
              <span><span role="img" aria-label="Players icon">👥</span> {num} Players</span>
            </button>
          ))}
        </div>
        <button className="game-button game-button-secondary" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
      </div>
      </>
    );
  }

  return (
    <>
      <WinCelebration
        isOpen={showCelebration && winner !== null}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restart}
        gameTitle={`Ludo (${numPlayers}P)`}
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🎲 Ludo (Mini) - Instructions"
      >
        <ul>
          <li>Players take turns rolling a dice.</li>
          <li>Move your token along the linear board according to the dice roll.</li>
          <li>Be the first player to land exactly on step 20 to win! You must roll the exact number required.</li>
          <li>Number of players can be selected before starting.</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 700, borderRadius: 24 }}>
        <h2><span role="img" aria-label="Dice icon">🎲</span> Ludo (Mini - {numPlayers} Players)</h2>
        <div className="ludo-players mb-2">
          {Array.from({ length: numPlayers }).map((_, idx) => {
            const pos = positions[idx];
            return (
              <div key={idx} className={`ludo-player-info ${currentPlayer === idx && winner === null && !isRolling ? 'ludo-player-active' : ''} ${justMovedPlayer === idx ? 'ludo-player-just-moved' : ''}`}>
                <div className="ludo-player-token" style={{ background: playerColors[idx] }}>
                  {idx + 1}
                </div>
                <div className="ludo-player-name">{playerNames[idx]}</div>
                <div className="ludo-player-pos">Pos: {pos}</div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-2 mb-2">
          <div className="ludo-board" role="grid">
            {[...Array(4)].map((_, row) => (
              <div key={row} className="ludo-board-row" role="row">
                {[...Array(5)].map((_, col) => {
                  const i = row * 5 + col;
                  const playerHere = positions.findIndex((p, playerIdx) => playerIdx < numPlayers && p === i);
                  return (
                    <div key={col} className={`ludo-board-cell ${playerHere !== -1 ? 'ludo-board-cell-player' : ''}`} style={{ background: playerHere !== -1 ? playerColors[playerHere] : undefined, borderColor: playerHere !== -1 ? playerColors[playerHere] : 'var(--border-color)', boxShadow: playerHere !== -1 ? `0 1px 4px ${playerColors[playerHere]}99` : undefined }} role="gridcell" aria-label={`Cell ${i+1}`}>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          <div role="status" aria-live="polite" className="mt-1 mb-1" style={{ fontSize: '1.1em', color: 'var(--text-color)', fontWeight: 600, minHeight: '1.5em' }}>
            {winner !== null ? (
              <span style={{ color: playerColors[winner], fontWeight: 800 }}>{playerNames[winner]} wins!</span>
            ) : (
              <>
                {isRolling && displayDice !== null && <span style={{ fontSize: '1.5em', fontWeight: 700, color: 'var(--secondary-color)' }}>⚅ {displayDice}</span>}
                {!isRolling && dice !== null && <span>Dice: <b style={{ fontSize: '1.2em', color: 'var(--primary-color)' }}>{dice}</b> | </span>}
                {!isRolling && currentPlayer < numPlayers && <span style={{ color: playerColors[currentPlayer], fontWeight: 700 }}>{playerNames[currentPlayer]}'s turn</span>}
                {isRolling && currentPlayer < numPlayers && <span style={{ color: playerColors[currentPlayer], fontWeight: 700 }}>Rolling for {playerNames[currentPlayer]}...</span>}
              </>
            )}
          </div>
          <button
            className={`game-button mb-1 ${winner !== null || isRolling ? '' : 'game-button-special'}`}
            style={{ background: winner !== null || isRolling ? 'var(--disabled-bg-color)' : undefined, cursor: isRolling ? 'wait' : (winner !== null ? 'not-allowed' : 'pointer') }}
            onClick={rollDice}
            disabled={winner !== null || isRolling}
          >
            <span><span role="img" aria-label="Dice icon">🎲</span> {isRolling ? 'Rolling...' : winner !== null ? 'Game Over' : 'Roll Dice'}</span>
          </button>
          <button
            className="game-button game-button-secondary"
            onClick={() => restart()}
          >
            <span><span role="img" aria-label="Restart icon">🔄</span> Restart Game</span>
          </button>
          <button
            className="game-button game-button-secondary mt-1"
            onClick={() => {
              setGameStarted(false);
            }}
            style={{ background: 'var(--error-color)', color: 'var(--button-text-color)', borderColor: 'var(--error-color)' }}
          >
            <span><span role="img" aria-label="Settings icon">⚙️</span> Change Players</span>
          </button>
           <button className="game-button game-button-secondary mt-1" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        </div>
      </div>
    </>
  );
}

type SudokuDifficulty = 'Easy' | 'Medium' | 'Hard';

const sudokuBoards: Record<SudokuDifficulty, number[][]> = {
  Easy: [
    [0, 0, 2, 1],
    [2, 1, 0, 0],
    [0, 0, 3, 4],
    [3, 4, 0, 0],
  ],
  Medium: [
    [4, 0, 0, 1],
    [0, 1, 0, 0],
    [0, 0, 3, 0],
    [3, 0, 0, 2],
  ],
  Hard: [
    [0, 3, 0, 0],
    [2, 0, 0, 0],
    [0, 0, 0, 4],
    [0, 0, 1, 0],
  ],
};

const sudokuSolution = [
  [4, 3, 2, 1],
  [2, 1, 4, 3],
  [1, 2, 3, 4],
  [3, 4, 1, 2],
];

function Sudoku() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>('Easy');
  const [board, setBoard] = useState<number[][]>(sudokuBoards[difficulty].map(row => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const getCurrentInitialBoard = () => sudokuBoards[difficulty];

  useEffect(() => {
    setBoard(getCurrentInitialBoard().map(row => [...row]));
    setSelected(null);
    setMessage('');
    setCompleted(false);
    setShowCelebration(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);


  function handleCellClick(row: number, col: number) {
    if (getCurrentInitialBoard()[row][col] !== 0 || completed) return;
    setSelected([row, col]);
  }

  function handleNumberInput(num: number) {
    if (!selected || completed) return;
    const [row, col] = selected;
    const newBoard = board.map(r => [...r]);
    newBoard[row][col] = num;
    setBoard(newBoard);
    setSelected(null);
    if (JSON.stringify(newBoard) === JSON.stringify(sudokuSolution)) {
      setCompleted(true);
      setMessage('🎉 Sudoku Completed!');
      setShowCelebration(true);
    } else {
      setMessage('');
    }
  }

  function restart() {
    setBoard(getCurrentInitialBoard().map(row => [...row]));
    setSelected(null);
    setMessage('');
    setCompleted(false);
    setShowCelebration(false);
  }

  const handleDifficultyChange = (newDifficulty: SudokuDifficulty) => {
    setDifficulty(newDifficulty);
  };

  return (
    <>
      <WinCelebration
        isOpen={showCelebration && completed}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restart}
        gameTitle="Sudoku (4x4)"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🔢 Sudoku (4x4) - Instructions"
      >
        <ul>
          <li>Fill the 4x4 grid.</li>
          <li>Each row, each column, and each of the four 2x2 subgrids must contain all digits from 1 to 4 without repetition.</li>
          <li>Select an empty cell, then click a number button (1-4) to place it.</li>
          <li>Pre-filled cells cannot be changed. Choose your difficulty!</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 420, borderRadius: 20 }}>
        <h2><span role="img" aria-label="Numeric input icon">🔢</span> Sudoku (4x4)</h2>
        <div className="sudoku-difficulty-selector mb-2" style={{ display: 'flex', justifyContent: 'center', gap: '0.5em' }}>
          {(['Easy', 'Medium', 'Hard'] as SudokuDifficulty[]).map(level => (
            <button
              key={level}
              className={`game-button game-button-secondary ${difficulty === level ? 'game-button-active' : ''}`}
              style={difficulty === level ? { backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)', borderColor: 'var(--primary-color)' } : {}}
              onClick={() => handleDifficultyChange(level)}
            >
              <span><span role="img" aria-label={`${level} difficulty`}>{level === 'Easy' ? '🙂' : level === 'Medium' ? '😐' : '🤔'}</span> {level}</span>
            </button>
          ))}
        </div>
        <div className="sudoku-grid" role="grid">
          {board.map((row: number[], rIdx: number) =>
            row.map((cell: number, cIdx: number) => (
              <button
                key={rIdx + '-' + cIdx}
                className={`
                  sudoku-cell
                  ${getCurrentInitialBoard()[rIdx][cIdx] !== 0 ? 'sudoku-cell-initial' : ''}
                  ${selected && selected[0] === rIdx && selected[1] === cIdx ? 'sudoku-cell-selected' : ''}
                `}
                onClick={() => handleCellClick(rIdx, cIdx)}
                disabled={getCurrentInitialBoard()[rIdx][cIdx] !== 0 || completed}
                aria-label={`Sudoku cell ${rIdx + 1},${cIdx + 1}`}
              >
                {cell !== 0 ? cell : ''}
              </button>
            ))
          )}
        </div>
        <div className="sudoku-input-buttons">
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              className="sudoku-input-button"
              onClick={() => handleNumberInput(num)}
              disabled={completed}
            >
              {num}
            </button>
          ))}
        </div>
        <div role="status" aria-live="polite" className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.1em', color: completed ? 'var(--success-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
          {message}
        </div>
        <div style={{display: 'flex', gap: '1em', justifyContent: 'center', width: '100%'}}>
          <button className="game-button game-button-secondary" onClick={restart}>
            <span><span role="img" aria-label="Restart icon">🔄</span> Restart</span>
          </button>
          <button className="game-button game-button-secondary" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        </div>
      </div>
    </>
  );
}

function Chess() {
  const initialBoardSetup = {
    standard: [
      ['bR', 'bK', '', 'bP'],
      ['bP', '', '', ''],
      ['', '', '', 'wP'],
      ['wP', '', 'wK', 'wR'],
    ]
  };
  const [board, setBoard] = useState<string[][]>(initialBoardSetup.standard.map(row => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [message, setMessage] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  function isOwnPiece(piece: string) {
    return piece && piece[0] === turn;
  }

  function handleCellClick(row: number, col: number) {
    if (winner) return;
    const pieceOnTarget = board[row][col];
    if (selected) {
      const [sRow, sCol] = selected;
      if (sRow === row && sCol === col) {
        setSelected(null);
        return;
      }
      if (!isOwnPiece(board[sRow][sCol])) return;
      if (isOwnPiece(pieceOnTarget)) return;

      const movingPiece = board[sRow][sCol];
      let valid = false;
      if (movingPiece[1] === 'P') {
        const dir = movingPiece[0] === 'w' ? -1 : 1;
        if (col === sCol && row === sRow + dir && !pieceOnTarget) valid = true;
        if (Math.abs(col - sCol) === 1 && row === sRow + dir && pieceOnTarget && pieceOnTarget[0] !== movingPiece[0]) valid = true;
      } else if (movingPiece[1] === 'K') {
        if (Math.abs(row - sRow) <= 1 && Math.abs(col - sCol) <= 1 && (row !== sRow || col !== sCol)) valid = true;
      } else if (movingPiece[1] === 'R') {
        const isHorizontal = row === sRow;
        const isVertical = col === sCol;
        if (isHorizontal || isVertical) {
          let pathClear = true;
          if (isHorizontal) {
            const startCol = Math.min(sCol, col) + 1;
            const endCol = Math.max(sCol, col);
            for (let c = startCol; c < endCol; c++) {
              if (board[row][c]) {
                pathClear = false;
                break;
              }
            }
          } else {
            const startRow = Math.min(sRow, row) + 1;
            const endRow = Math.max(sRow, row);
            for (let r = startRow; r < endRow; r++) {
              if (board[r][col]) {
                pathClear = false;
                break;
              }
            }
          }
          if (pathClear) {
            valid = true;
          }
        }
      }

      if (valid) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = movingPiece;
        newBoard[sRow][sCol] = '';
        setBoard(newBoard);
        setSelected(null);
        setTurn(turn === 'w' ? 'b' : 'w');
        setMessage('');
        let flat = newBoard.flat();
        if (!flat.includes('bK')) {
          setWinner('White');
          setShowCelebration(true);
        }
        if (!flat.includes('wK')) {
          setWinner('Black');
          setShowCelebration(true);
        }
      } else {
        setMessage('Invalid move');
        setSelected(null);
      }
    } else {
      if (pieceOnTarget && isOwnPiece(pieceOnTarget)) setSelected([row, col]);
    }
  }

  function restart() {
    setBoard(initialBoardSetup.standard.map(row => [...row]));
    setSelected(null);
    setTurn('w');
    setMessage('');
    setWinner(null);
    setShowCelebration(false);
  }

  function renderPiece(piece: string) {
    if (!piece) return null;
    if (piece[1] === 'K') return piece[0] === 'w' ? '♔' : '♚';
    if (piece[1] === 'P') return piece[0] === 'w' ? '♙' : '♟';
    if (piece[1] === 'R') return piece[0] === 'w' ? '♖' : '♜';
    return null;
  }

  return (
    <>
      <WinCelebration
        isOpen={showCelebration && !!winner}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restart}
        gameTitle="Chess (Mini 4x4)"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="♟️ Chess (Mini 4x4) - Instructions"
      >
        <ul>
          <li>This is a simplified 4x4 version of Chess.</li>
          <li>Pawns (♙♟️) move one step forward. They capture one step diagonally forward.</li>
          <li>Rooks (♖♜) move any number of clear squares horizontally or vertically.</li>
          <li>Kings (♔♚) move one square in any direction.</li>
          <li>The goal is to capture the opponent's King.</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 420, borderRadius: 20 }}>
        <h2><span role="img" aria-label="Chess pawn icon">♟️</span> Chess (Mini 4x4)</h2>
        <div className="chess-grid" role="grid">
          {board.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isSel = selected && selected[0] === rIdx && selected[1] === cIdx;
              return (
                <button
                  key={rIdx + '-' + cIdx}
                  className={`
                    chess-cell
                    ${(rIdx + cIdx) % 2 === 0 ? 'chess-cell-light' : 'chess-cell-dark'}
                    ${isSel ? 'chess-cell-selected' : ''}
                    ${cell && cell[0] === 'w' ? 'chess-piece-white' : cell ? 'chess-piece-black' : ''}
                  `}
                  onClick={() => handleCellClick(rIdx, cIdx)}
                  aria-label={`Chess cell ${rIdx + 1},${cIdx + 1}`}
                  disabled={!!winner}
                  // role="gridcell"
                >
                  {renderPiece(cell)}
                </button>
              );
            })
          )}
        </div>
        <div role="status" aria-live="polite" className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.1em', color: winner ? 'var(--success-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
          {winner ? `${winner} wins!` : message || `${turn === 'w' ? 'White' : 'Black'}'s turn`}
        </div>
        <div style={{display: 'flex', gap: '1em', justifyContent: 'center', width: '100%'}}>
          <button className="game-button game-button-secondary" onClick={restart}>
            <span><span role="img" aria-label="Restart icon">🔄</span> Restart</span>
          </button>
          <button className="game-button game-button-secondary" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        </div>
      </div>
    </>
  );
}

// Memory Game Component
const MemoryGame = () => {
  const cardValues = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const initialCards = [...cardValues, ...cardValues]
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false }));

  const [cards, setCards] = useState(initialCards);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [moves, setMoves] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardIndex, secondCardIndex] = flippedCards;
      const firstCard = cards[firstCardIndex];
      const secondCard = cards[secondCardIndex];

      if (firstCard.value === secondCard.value) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          )
        );
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prevMoves => prevMoves + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matchedPairs === cardValues.length) {
      setShowCelebration(true);
    }
  }, [matchedPairs, cardValues.length]);

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedCards(prevFlipped => [...prevFlipped, index]);
  };

  const restartGame = () => {
    setCards(
      [...cardValues, ...cardValues]
        .sort(() => Math.random() - 0.5)
        .map((value, index) => ({ id: index, value, isFlipped: false, isMatched: false }))
    );
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setShowCelebration(false);
  };

  return (
    <>
      <WinCelebration
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onPlayAgain={restartGame}
        score={moves} // Or some other score metric if desired
        gameTitle="Memory Game"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🧠 Memory Game - Instructions"
      >
        <ul>
          <li>Flip two cards at a time to find a matching pair.</li>
          <li>If the cards match, they stay face up.</li>
          <li>If they don't match, they flip back down after a short delay.</li>
          <li>Match all pairs to win the game!</li>
        </ul>
      </InstructionsModal>
      <div className="game-card" style={{ maxWidth: 500 }}>
        <h2><span role="img" aria-label="Brain icon">🧠</span> Memory Game</h2>
        <p className="score-text">Moves: <b aria-live="polite">{moves}</b></p>
        <div className="memory-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', margin: '20px 0' }}>
          {cards.map((card, index) => (
            <button
              key={card.id}
              className={`memory-card ${card.isFlipped ? 'flipped' : ''} ${card.isMatched ? 'matched' : ''}`}
              onClick={() => handleCardClick(index)}
              disabled={card.isFlipped || card.isMatched}
              style={{
                width: '80px',
                height: '80px',
                fontSize: '2em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                border: '2px solid var(--border-color)',
                borderRadius: '8px',
                background: card.isFlipped || card.isMatched ? 'var(--card-bg-flipped)' : 'var(--button-bg-color)',
                color: card.isFlipped || card.isMatched ? 'var(--text-color)' : 'transparent',
                transition: 'transform 0.3s, background-color 0.3s',
                transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              aria-label={card.isFlipped || card.isMatched ? `Card ${card.value}` : `Hidden card ${index + 1}`}
            >
              <span style={{ transform: card.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}> {/* Counter-rotate text */}
                {card.isFlipped || card.isMatched ? card.value : '?'}
              </span>
            </button>
          ))}
        </div>
        <button className="game-button game-button-secondary" onClick={restartGame}>
          <span><span role="img" aria-label="Restart icon">🔄</span> Restart</span>
        </button>
        <button className="game-button game-button-secondary mt-1" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
      </div>
    </>
  );
};

// Hangman Game Component
const HangmanGame = () => {
  const wordList = ["REACT", "JAVASCRIPT", "HANGMAN", "DEVELOPER", "COMPONENT", "TYPESCRIPT", "STYLES", "KEYBOARD"];
  const maxIncorrectGuesses = 6; // Standard Hangman has 6 parts (head, body, 2 arms, 2 legs)

  const [selectedWord, setSelectedWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [incorrectGuesses, setIncorrectGuesses] = useState(0);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const initializeGame = () => {
    const newWord = wordList[Math.floor(Math.random() * wordList.length)];
    setSelectedWord(newWord);
    setGuessedLetters([]);
    setIncorrectGuesses(0);
    setGameStatus('playing');
    setShowWinCelebration(false);
    setInputValue('');
  };

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGuess = (letter: string) => {
    const upperLetter = letter.toUpperCase();
    // Basic validation for single alphabet character
    if (!upperLetter || guessedLetters.includes(upperLetter) || gameStatus !== 'playing' || !/^[A-Z]$/.test(upperLetter)) {
      setInputValue('');
      return;
    }

    setGuessedLetters(prev => [...prev, upperLetter]);
    setInputValue('');

    if (selectedWord.includes(upperLetter)) {
      const wordIsGuessed = selectedWord.split('').every(char => [...guessedLetters, upperLetter].includes(char));
      if (wordIsGuessed) {
        setGameStatus('won');
        setShowWinCelebration(true);
      }
    } else {
      setIncorrectGuesses(prev => {
        const newIncorrectCount = prev + 1;
        if (newIncorrectCount >= maxIncorrectGuesses) {
          setGameStatus('lost');
        }
        return newIncorrectCount;
      });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only single alphabetic character, convert to uppercase
    const value = event.target.value;
    if (value.length <= 1 && /^[A-Za-z]*$/.test(value)) {
        setInputValue(value.toUpperCase());
    } else if (value === '') {
        setInputValue('');
    }
  };

  const handleInputSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (inputValue) {
      handleGuess(inputValue);
    }
  };

  const displayWord = selectedWord
    .split('')
    .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
    .join(' ');

  // SVG parts for the Hangman
  const hangmanSvgParts = [
    (key: React.Key) => <circle key={key} cx="70" cy="50" r="10" stroke="var(--text-color)" strokeWidth="2" fill="none" />, // Head
    (key: React.Key) => <line key={key} x1="70" y1="60" x2="70" y2="100" stroke="var(--text-color)" strokeWidth="2" />,   // Body
    (key: React.Key) => <line key={key} x1="70" y1="70" x2="50" y2="90" stroke="var(--text-color)" strokeWidth="2" />,   // Left Arm
    (key: React.Key) => <line key={key} x1="70" y1="70" x2="90" y2="90" stroke="var(--text-color)" strokeWidth="2" />,   // Right Arm
    (key: React.Key) => <line key={key} x1="70" y1="100" x2="50" y2="120" stroke="var(--text-color)" strokeWidth="2" />, // Left Leg
    (key: React.Key) => <line key={key} x1="70" y1="100" x2="90" y2="120" stroke="var(--text-color)" strokeWidth="2" />, // Right Leg
  ];

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

  return (
    <>
      <WinCelebration
        isOpen={showWinCelebration && gameStatus === 'won'}
        onClose={() => setShowWinCelebration(false)}
        onPlayAgain={initializeGame}
        gameTitle="Hangman"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="🤔 Hangman - Instructions"
      >
        <ul>
          <li>Guess the hidden word one letter at a time.</li>
          <li>Each incorrect guess adds a part to the hangman figure.</li>
          <li>You have {maxIncorrectGuesses} incorrect guesses before you lose.</li>
          <li>Guess all letters in the word to win!</li>
          <li>You can use the on-screen keyboard or type a letter into the input field and press Enter or Guess.</li>
        </ul>
      </InstructionsModal>

      <div className="game-card" style={{ maxWidth: 600, textAlign: 'center' }}>
        <h2><span role="img" aria-label="Thinking face icon">🤔</span> Hangman</h2>

        <svg width="140" height="160" viewBox="0 0 140 160" className="hangman-svg" style={{ margin: '10px auto', display: 'block' }}>
          {/* Gallows structure */}
          <line x1="10" y1="150" x2="100" y2="150" stroke="var(--text-color)" strokeWidth="2" /> {/* Base */}
          <line x1="30" y1="150" x2="30" y2="20" stroke="var(--text-color)" strokeWidth="2" />  {/* Post */}
          <line x1="30" y1="20" x2="70" y2="20" stroke="var(--text-color)" strokeWidth="2" />   {/* Beam */}
          <line x1="70" y1="20" x2="70" y2="40" stroke="var(--text-color)" strokeWidth="1" />   {/* Rope */}
          {/* Hangman Parts based on incorrect guesses */}
          {hangmanSvgParts.slice(0, incorrectGuesses).map((part, i) => part(`hangman-part-${i}`))}
        </svg>

        <p className="score-text" style={{ fontSize: '2em', letterSpacing: '0.1em', margin: '20px 0', fontWeight: 'bold', color: gameStatus === 'lost' ? 'var(--error-color)' : 'var(--text-color)' }}>
          {displayWord}
        </p>

        {gameStatus === 'playing' && (
          <form onSubmit={handleInputSubmit} style={{ margin: '20px 0' }}>
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              maxLength={1}
              className="game-input"
              style={{ width: '80px', height: '40px', marginRight: '10px', textAlign:'center', textTransform: 'uppercase', fontSize: '1.2em', padding: '0.5em' }}
              placeholder="Letter"
              aria-label="Guess a letter"
              disabled={gameStatus !== 'playing'}
              autoFocus
            />
            <button type="submit" className="game-button game-button-primary" style={{padding: '0.7em 1.2em', fontSize: '1em'}} disabled={gameStatus !== 'playing' || !inputValue.match(/^[A-Z]$/)}>
              <span>Guess</span>
            </button>
          </form>
        )}

        {gameStatus === 'playing' && (
          <div className="hangman-alphabet-keyboard" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px', margin: '20px 0', maxWidth: '450px', marginInline: 'auto' }}>
            {alphabet.map(letter => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guessedLetters.includes(letter) || gameStatus !== 'playing'}
                className="game-button game-button-secondary"
                style={{
                  minWidth: '40px',
                  minHeight: '40px',
                  padding: '0.5em',
                  fontSize: '1em',
                  backgroundColor: guessedLetters.includes(letter) ? (selectedWord.includes(letter) ? 'var(--success-color)' : 'var(--error-color)') : undefined,
                  color: guessedLetters.includes(letter) ? 'var(--button-text-color)' : undefined,
                  opacity: guessedLetters.includes(letter) ? 0.65 : 1,
                  borderStyle: guessedLetters.includes(letter) ? 'solid' : undefined,
                  borderColor: guessedLetters.includes(letter) ? (selectedWord.includes(letter) ? 'var(--success-color)' : 'var(--error-color)') : undefined,
                }}
              >
                {letter}
              </button>
            ))}
          </div>
        )}

        <p className="score-text" style={{fontSize: '1.1em'}}>
          Incorrect Guesses: {incorrectGuesses} / {maxIncorrectGuesses}
        </p>

        {gameStatus === 'lost' && (
          <div className="gaming-page-message mt-2" style={{ color: 'var(--error-color)', fontSize: '1.3em', fontWeight: 'bold' }}>
            😞 Game Over! The word was: <b style={{color: 'var(--primary-color)'}}>{selectedWord}</b>
          </div>
        )}
        {gameStatus === 'won' && (
           <div className="gaming-page-message mt-2" style={{ color: 'var(--success-color)', fontSize: '1.3em', fontWeight: 'bold' }}>
            🎉 Congratulations! You guessed the word!
          </div>
        )}

        <div style={{marginTop: '20px'}}>
          <button className="game-button game-button-secondary" onClick={initializeGame}>
            <span><span role="img" aria-label="Restart icon">🔄</span> {(gameStatus === 'playing' && (guessedLetters.length > 0 || incorrectGuesses > 0)) ? 'Restart Game' : 'New Word'}</span>
          </button>
          <button className="game-button game-button-secondary mt-1 ml-1" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        </div>
      </div>
    </>
  );
};

// Minesweeper Game Component
const MinesweeperGame = () => {
  const gridSize = 8;
  const numMines = 10;

  type Cell = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    adjacentMines: number;
  };

  const createEmptyGrid = (): Cell[][] =>
    Array(gridSize)
      .fill(null)
      .map(() =>
        Array(gridSize)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          }))
      );

  const [grid, setGrid] = useState<Cell[][]>(createEmptyGrid());
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [flagsPlaced, setFlagsPlaced] = useState(0);

  const initializeGrid = () => {
    let newGrid = createEmptyGrid();
    let minesPlaced = 0;
    while (minesPlaced < numMines) {
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        if (!newGrid[row][col].isMine) {
          let mineCount = 0;
          for (let rOffset = -1; rOffset <= 1; rOffset++) {
            for (let cOffset = -1; cOffset <= 1; cOffset++) {
              if (rOffset === 0 && cOffset === 0) continue;
              const newRow = row + rOffset;
              const newCol = col + cOffset;
              if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && newGrid[newRow][newCol].isMine) {
                mineCount++;
              }
            }
          }
          newGrid[row][col].adjacentMines = mineCount;
        }
      }
    }
    setGrid(newGrid);
    setGameStatus('playing');
    setShowWinCelebration(false);
    setFlagsPlaced(0);
    setFlagMode(false);
  };

  useEffect(() => {
    initializeGrid();
  }, []);

  const revealCell = (row: number, col: number, currentGrid: Cell[][]): Cell[][] => {
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize || currentGrid[row][col].isRevealed || currentGrid[row][col].isFlagged) {
      return currentGrid;
    }

    let newGrid = currentGrid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].isRevealed = true;

    if (newGrid[row][col].adjacentMines === 0 && !newGrid[row][col].isMine) {
      for (let rOffset = -1; rOffset <= 1; rOffset++) {
        for (let cOffset = -1; cOffset <= 1; cOffset++) {
          if (rOffset === 0 && cOffset === 0) continue;
          newGrid = revealCell(row + rOffset, col + cOffset, newGrid);
        }
      }
    }
    return newGrid;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameStatus !== 'playing' || grid[row][col].isRevealed) return;

    if (flagMode) {
      if (grid[row][col].isRevealed) return;
      const newGrid = grid.map(r => r.map(c => ({ ...c })));
      const cell = newGrid[row][col];
      if (!cell.isFlagged && flagsPlaced >= numMines) return; // Don't place more flags than mines

      cell.isFlagged = !cell.isFlagged;
      setFlagsPlaced(prev => prev + (cell.isFlagged ? 1 : -1));
      setGrid(newGrid);
    } else {
      if (grid[row][col].isFlagged) return;

      if (grid[row][col].isMine) {
        setGameStatus('lost');
        // Reveal all mines
        const finalGrid = grid.map(r => r.map(c => c.isMine ? { ...c, isRevealed: true } : c));
        setGrid(finalGrid);
        return;
      }

      const revealedGrid = revealCell(row, col, grid);
      setGrid(revealedGrid);

      // Check for win condition
      let revealedNonMineCells = 0;
      let totalNonMineCells = gridSize * gridSize - numMines;
      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          if (revealedGrid[r][c].isRevealed && !revealedGrid[r][c].isMine) {
            revealedNonMineCells++;
          }
        }
      }

      if (revealedNonMineCells === totalNonMineCells) {
        setGameStatus('won');
        setShowWinCelebration(true);
         // Auto-flag remaining mines on win
        const finalGridWithFlags = revealedGrid.map(r => r.map(c => c.isMine && !c.isFlagged ? { ...c, isFlagged: true } : c));
        setGrid(finalGridWithFlags);
        setFlagsPlaced(numMines);
      }
    }
  };

  const toggleFlagMode = () => {
    if (gameStatus === 'playing') {
      setFlagMode(prev => !prev);
    }
  };

  return (
    <>
      <WinCelebration
        isOpen={showWinCelebration && gameStatus === 'won'}
        onClose={() => setShowWinCelebration(false)}
        onPlayAgain={initializeGrid}
        gameTitle="Minesweeper"
      />
      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        title="💣 Minesweeper - Instructions"
      >
        <ul>
          <li>Click on a cell to reveal it.</li>
          <li>If a cell contains a mine, you lose!</li>
          <li>If a cell is empty, it will show the number of mines in its adjacent cells (including diagonals).</li>
          <li>If an empty cell has 0 adjacent mines, it will automatically clear surrounding empty cells.</li>
          <li>Use the "Toggle Flag" button to switch to flag mode. Click a cell to place or remove a flag.</li>
          <li>Flag all mines or reveal all non-mine cells to win.</li>
          <li>The counter shows remaining mines (total mines - flags placed).</li>
        </ul>
      </InstructionsModal>

      <div className="game-card" style={{ maxWidth: 500, textAlign: 'center' }}>
        <h2><span role="img" aria-label="Bomb icon">💣</span> Minesweeper</h2>

        <div className="minesweeper-controls" style={{ marginBlock: '15px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <button
            className={`game-button game-button-secondary ${flagMode ? 'game-button-active' : ''}`}
            onClick={toggleFlagMode}
            disabled={gameStatus !== 'playing'}
            style={flagMode ? { backgroundColor: 'var(--accent-color1)', color: 'var(--button-text-color)', borderColor: 'var(--accent-color1)'} : {}}
          >
            <span><span role="img" aria-label="Flag icon">🚩</span> {flagMode ? 'Flag Mode (ON)' : 'Flag Mode (OFF)'}</span>
          </button>
          <p className="score-text" style={{ margin: 0, fontSize: '1.1em' }}>
            Mines: {numMines - flagsPlaced}
          </p>
        </div>

        <div
          className="minesweeper-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '2px',
            margin: '20px auto',
            maxWidth: `${gridSize * 35}px`, // Adjust cell size if needed
            pointerEvents: gameStatus !== 'playing' ? 'none' : 'auto',
          }}
        >
          {grid.map((rowItems, rowIndex) =>
            rowItems.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`minesweeper-cell ${cell.isRevealed ? 'revealed' : ''} ${cell.isFlagged ? 'flagged' : ''} ${cell.isMine && cell.isRevealed ? 'mine' : ''}`}
                disabled={cell.isRevealed && !cell.isMine && !flagMode} // Allow clicking revealed only if it's not a mine, for potential future features like chording
                style={{
                  width: '35px',
                  height: '35px',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  backgroundColor: cell.isRevealed
                    ? (cell.isMine ? 'var(--error-color)' : 'var(--disabled-bg-color)')
                    : (cell.isFlagged ? 'var(--warning-bg-color)' : 'var(--button-bg-color)'),
                  color: cell.isRevealed && !cell.isMine && cell.adjacentMines > 0 ? `var(--mine-count-${cell.adjacentMines})` : (cell.isFlagged || (cell.isMine && cell.isRevealed) ? 'var(--button-text-color)' : 'var(--text-color)'),
                  transition: 'background-color 0.2s ease',
                }}
                aria-label={`Cell ${rowIndex + 1}, ${colIndex + 1}${cell.isFlagged ? ', Flagged' : ''}${cell.isRevealed ? (cell.isMine ? ', Mine' : `, ${cell.adjacentMines} adjacent mines`) : ', Hidden'}`}
              >
                {cell.isFlagged ? '🚩' : cell.isRevealed ? (cell.isMine ? '💣' : (cell.adjacentMines > 0 ? cell.adjacentMines : '')) : ''}
              </button>
            ))
          )}
        </div>

        {gameStatus === 'lost' && (
          <div className="gaming-page-message mt-2" style={{ color: 'var(--error-color)', fontSize: '1.3em', fontWeight: 'bold' }}>
            😞 Game Over! You hit a mine.
          </div>
        )}
        {gameStatus === 'won' && (
           <div className="gaming-page-message mt-2" style={{ color: 'var(--success-color)', fontSize: '1.3em', fontWeight: 'bold' }}>
            🎉 Congratulations! You cleared all mines!
          </div>
        )}

        <div style={{marginTop: '20px'}}>
          <button className="game-button game-button-secondary" onClick={initializeGrid}>
            <span><span role="img" aria-label="Restart icon">🔄</span> Restart Game</span>
          </button>
          <button className="game-button game-button-secondary mt-1 ml-1" onClick={() => setShowInstructions(true)}><span>❓ Instructions</span></button>
        </div>
      </div>
    </>
  );
};


function App() {
  const { currentUser, logout, loading, signInWithGoogle } = useAuth(); // signInWithGoogle added
  const [game, setGame] = useState<'color-shape' | 'tictactoe' | 'ludo' | 'sudoku' | 'chess' | 'memory' | 'hangman' | 'minesweeper'>('color-shape');
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div id="root" className="app-container">
        <header className="app-header">
          {/* Keep header controls (theme toggle, potentially placeholder for user info) */}
          <div className="header-controls" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px', gap: '15px', position: 'relative', zIndex: 10 }}>
            {/* Theme toggle can stay */}
            <button onClick={toggleTheme} className="game-button game-button-secondary theme-toggle-button" style={{ padding: '0.5em 0.8em', fontSize: '0.9em', minWidth: 'auto' }}>
              <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </div>
        </header>
        <main className="app-main" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <h2>Loading Application...</h2>
            <p>Please wait while we check your authentication status.</p>
            {/* Optional: Add a simple spinner CSS animation here if desired */}
          </div>
        </main>
        <footer className="app-footer">
          &copy; {new Date().getFullYear()} <span className="brand-text">Gaming Hub</span> &mdash; Built with <span className="tech-text">Vite + React</span>
        </footer>
      </div>
    );
  }

  // If not loading, proceed to render based on currentUser
  return (
    // AuthProvider wrapper removed
    <div id="root" className="app-container">
      <svg className="decorative-svg-1" width="380" height="380" viewBox="0 0 380 380"><circle cx="190" cy="190" r="190" /></svg>
      <svg className="decorative-svg-2" width="350" height="350" viewBox="0 0 350 350"><circle cx="175" cy="175" r="175" /></svg>
        <svg className="decorative-svg-3" width="280" height="280" viewBox="0 0 280 280"><circle cx="140" cy="140" r="140" /></svg>
        <header className="app-header">
          <div className="header-controls" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px', gap: '15px', position: 'relative', zIndex: 10 }}>
            {currentUser ? (
              <>
                <span style={{ color: 'var(--text-color)', fontSize: '0.9em' }}>
                  Hi, {currentUser.displayName || currentUser.email}!
                </span>
                <button
                  onClick={logout}
                  className="game-button game-button-secondary"
                  style={{ padding: '0.5em 1em', fontSize: '0.9em', minWidth: 'auto' }}
                  title="Logout"
                  aria-label="Logout"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={signInWithGoogle} // Call signInWithGoogle
                className="game-button google-login-button" // Can reuse class from Login.css or create a new one
                style={{ padding: '0.5em 1em', fontSize: '0.9em', minWidth: 'auto' }} // Basic styling
                title="Login with Google"
                aria-label="Login with Google"
              >
                {/* Using text, but could add SVG icon similar to Login.tsx if Login.css is imported/styles are global */}
                Login with Google
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="game-button game-button-secondary theme-toggle-button"
              style={{
                  padding: '0.5em 0.8em',
                  fontSize: '0.9em',
                  minWidth: 'auto'
                  // Removed absolute positioning
              }}
              aria-label={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              <span>{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
          </div>

          {/* Conditional part of the header and main content */}
          {currentUser ? (
            <>
              <h1>🎲 Gaming Hub</h1>
              <p>Enjoy a collection of classic and modern games with a beautiful, immersive UI!</p>
              <nav>
                <button
                  className={`nav-button ${game === 'color-shape' ? 'nav-button-active' : ''}`}
                  style={game === 'color-shape' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--success-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'color-shape' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--success-color))', color: 'var(--button-text-color)', borderColor: 'transparent'} : {}}
                  onClick={() => setGame('color-shape')}
                  aria-label="Play Shape & Color Game"
                >
                  <span><span role="img" aria-label="Palette icon">🎨</span> Shape & Color Game</span>
                </button>
                <button
                  className={`nav-button ${game === 'tictactoe' ? 'nav-button-active' : ''}`}
                  style={game === 'tictactoe' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'tictactoe' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', color: 'var(--button-text-color)', borderColor: 'transparent'} : {}}
                  onClick={() => setGame('tictactoe')}
                  aria-label="Play Tic-Tac-Toe"
                >
                  <span><TicTacToeIcon /> Tic-Tac-Toe</span>
                </button>
                <button
                  className={`nav-button ${game === 'ludo' ? 'nav-button-active' : ''}`}
                  style={game === 'ludo' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'ludo' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent'}: {}}
                  onClick={() => setGame('ludo')}
                  aria-label="Play Ludo"
                >
                  <span><span role="img" aria-label="Dice icon">🎲</span> Ludo (Mini)</span>
                </button>
                <button
                  className={`nav-button ${game === 'sudoku' ? 'nav-button-active' : ''}`}
                  style={game === 'sudoku' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--secondary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'sudoku' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--secondary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent'}: {}}
                  onClick={() => setGame('sudoku')}
                  aria-label="Play Sudoku"
                >
                  <span><span role="img" aria-label="Numeric input icon">🔢</span> Sudoku (4x4)</span>
                </button>
                <button
                  className={`nav-button ${game === 'chess' ? 'nav-button-active' : ''}`}
                  style={game === 'chess' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--text-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'chess' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--text-color))', color: 'var(--button-text-color)', borderColor: 'transparent'}: {}}
                  onClick={() => setGame('chess')}
                  aria-label="Play Chess"
                >
                  <span><span role="img" aria-label="Chess pawn icon">♟️</span> Chess (Mini)</span>
                </button>
                <button
                  className={`nav-button ${game === 'memory' ? 'nav-button-active' : ''}`}
                  style={game === 'memory' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--accent-color1), var(--accent-color2))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'memory' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--accent-color1), var(--accent-color2))', color: 'var(--button-text-color)', borderColor: 'transparent'} : {}}
                  onClick={() => setGame('memory')}
                  aria-label="Play Memory Game"
                >
                  <span><span role="img" aria-label="Brain icon">🧠</span> Memory Game</span>
                </button>
                <button
                  className={`nav-button ${game === 'hangman' ? 'nav-button-active' : ''}`}
                  style={game === 'hangman' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--warning-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'hangman' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--warning-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent'} : {}}
                  onClick={() => setGame('hangman')}
                  aria-label="Play Hangman Game"
                >
                  <span><span role="img" aria-label="Thinking face icon">🤔</span> Hangman</span>
                </button>
                <button
                  className={`nav-button ${game === 'minesweeper' ? 'nav-button-active' : ''}`}
                  style={game === 'minesweeper' && theme === 'light' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color2))', color: 'var(--button-text-color)', borderColor: 'transparent' } : game === 'minesweeper' && theme === 'dark' ? { background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color2))', color: 'var(--button-text-color)', borderColor: 'transparent'} : {}}
                  onClick={() => setGame('minesweeper')}
                  aria-label="Play Minesweeper Game"
                >
                  <span><span role="img" aria-label="Bomb icon">💣</span> Minesweeper</span>
                </button>
              </nav>
            </>
          ) : null} {/* Or some other minimal content if the header structure requires it when logged out */}
        </header>

        {currentUser ? (
          <main className="app-main">
            {game === 'color-shape' ? <GamingPage /> : game === 'tictactoe' ? <TicTacToe /> : game === 'ludo' ? <Ludo /> : game === 'sudoku' ? <Sudoku /> : game === 'chess' ? <Chess /> : game === 'memory' ? <MemoryGame /> : game === 'hangman' ? <HangmanGame /> : <MinesweeperGame />}
          </main>
        ) : (
          <main className="app-main"> {/* Use app-main for consistent styling if Login is also inside it */}
            <Login />
          </main>
        )}

        <footer className="app-footer">
          &copy; {new Date().getFullYear()} <span className="brand-text">Gaming Hub</span> &mdash; Built with <span className="tech-text">Vite + React</span>
        </footer>
      </div>
    // Closing AuthProvider wrapper removed
  );
}

export default App;
//updated code