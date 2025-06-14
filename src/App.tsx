import { useState, useEffect } from 'react';
import './App.css';
import WinCelebration from './components/WinCelebration'; // Import WinCelebration
// Importing styles for the app
function GamingPage() {
  const [score, setScore] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentShape, setCurrentShape] = useState<string>('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [step, setStep] = useState<'color' | 'shape' | 'win'>('color');
  const [showCelebration, setShowCelebration] = useState(false);

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
    // Color options
    const shuffledColors = [...colorList]
      .filter((c) => c !== answerColor)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    shuffledColors.push(answerColor);
    setColorOptions(shuffledColors.sort(() => 0.5 - Math.random()));
    // Shape options
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
  }

  // On mount, start the first round
  useEffect(() => {
    newRound();
    // eslint-disable-next-line
  }, []);

  function handleColorGuess(color: string) {
    if (color === currentColor) {
      setScore((prev) => {
        const newScore = prev + 1;
        if (newScore >= 10) {
          setStep('win');
          setMessage('🏆 You win! Congratulations!');
          setShowCelebration(true); // Show celebration on win
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
          setShowCelebration(true); // Show celebration on win
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
        // viewBox adjusted slightly for star points
        return <svg width={size} height={size} viewBox="0 0 50 50" style={commonSvgStyle}><polygon points="25,2 31,18 48,18 34,29 39,46 25,36 11,46 16,29 2,18 19,18" fill={color} /></svg>;
      case 'hexagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={color} /></svg>;
      case 'rectangle':
        return <div style={{ width: size * 1.5, height: size * 0.75, background: color, margin: '0 auto' }} />; // Adjusted height for better proportion
      case 'oval':
        return <div style={{ width: size * 1.25, height: size * 0.8, background: color, borderRadius: '50%', margin: '0 auto' }} />; // Adjusted for better proportion
      case 'diamond':
        // Diamond can be a rotated square. Using div for simplicity.
        return <div style={{ ...commonDivStyle, transform: 'rotate(45deg)' }} />;
      case 'pentagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,5 95,35 80,95 20,95 5,35" fill={color} /></svg>;
      case 'heptagon':
        // Heptagon points can be complex, using a reasonable approximation for a small icon
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="50,5 89,25 95,65 68,95 32,95 5,65 11,25" fill={color} /></svg>;
      case 'octagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill={color} /></svg>;
      case 'cross':
        // Using path for a filled cross
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><path d="M30,10 L70,10 L70,30 L90,30 L90,70 L70,70 L70,90 L30,90 L30,70 L10,70 L10,30 L30,30 Z" fill={color} /></svg>;
      case 'arrow':
        // Simple right-pointing arrow using path
        return <svg width={size} height={size} viewBox="0 0 100 100" style={commonSvgStyle}><path d="M5,35 L60,35 L60,15 L95,50 L60,85 L60,65 L5,65 Z" fill={color} /></svg>;
      case 'heart':
        // Heart shape using path
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
      {showCelebration && <WinCelebration onClose={() => setShowCelebration(false)} />}
      <div className="game-card" style={{ maxWidth: 420 }}>
        <h1>🎨 Shape & Color Game</h1>
        <p className="score-text"> {/* Score text 'b' tag color is handled by .game-card .score-text b in App.css */}
        Score: <b>{score}</b> / 10
      </p>
      {step !== 'win' && (
        <button
          className="game-button game-button-secondary mb-2" // Using secondary for restart
          onClick={restartGame}
        >
          Restart
        </button>
      )}
      {step === 'color' && (
        <>
          <div className="mt-2 mb-1" style={{ fontSize: '1.2em', fontWeight: 600, color: 'var(--text-color)' }}>
            Identify the color:
            {/* Background 'currentColor' is dynamic from game state, not theme palette */}
            <span className="gaming-page-color-display" style={{ background: currentColor }} />
          </div>
          <div className="gaming-page-options-container">
            {colorOptions.map((color) => (
              <button
                key={color}
                className="gaming-page-option-button"
                style={{
                  background: color,
                  // Updated contrast logic for new colors
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
            {/* renderShape uses dynamic colors from game state */}
            <div style={{ marginTop: 16 }}>{renderShape(currentShape, currentColor)}</div>
          </div>
          <div className="gaming-page-options-container">
            {shapeOptions.map((shape) => (
              <button
                key={shape}
                className="gaming-page-option-button" // Default styling from App.css (light bg, dark text)
                onClick={() => handleShapeGuess(shape)}
              >
                {shape.charAt(0).toUpperCase() + shape.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
      {step === 'win' && (
        <div className="gaming-page-win-message"> {/* Uses --success-color from App.css */}
          🏆 You win! Congratulations!<br />
          <button
            className="game-button game-button-primary mt-2" // Primary (success) button for Play Again
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      )}
      {/* Message color uses theme variables for success/error */}
      {message && <p className="gaming-page-message" style={{ color: message.includes('win') ? 'var(--success-color)' : message.includes('Try again') || message.includes('Invalid') ? 'var(--error-color)' : 'var(--text-color)' }}>{message}</p>}
    </div>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState(false);

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
    const win = calculateWinner(newBoard);
    if (win) {
      setWinner(win);
      setShowCelebration(true); // Show celebration on win
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
    setShowCelebration(false); // Hide celebration on restart
  }

  return (
    <>
      {showCelebration && winner && <WinCelebration onClose={() => setShowCelebration(false)} />}
      <div className="game-card" style={{ maxWidth: 500 }}>
        <h2>Tic-Tac-Toe</h2>
        <div className="tictactoe-grid">
        {board.map((cell, idx) => (
          <button
            key={idx}
            className={`tictactoe-cell ${cell === 'X' ? 'x' : cell === 'O' ? 'o' : ''}`} // .x and .o classes handle themed colors from App.css
            // Dynamic outline for emphasis, using theme colors
            style={{ outline: cell && (winner || draw) ? `2px solid var(--success-color)` : cell && !winner && !draw && !board[idx] ? `2px solid var(--secondary-color)`: undefined }}
            onClick={() => handleClick(idx)}
            disabled={!!cell || !!winner}
            aria-label={`Tic-Tac-Toe cell ${idx + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>
      {/* Status message uses theme colors */}
      <div className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.3em', color: winner ? 'var(--success-color)' : draw ? 'var(--error-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
        {winner ? `Winner: ${winner}` : draw ? 'Draw!' : `Next: ${xIsNext ? 'X' : 'O'}`}
      </div>
      <button className="game-button game-button-secondary" onClick={restart}> {/* Restart is secondary */}
        Restart
      </button>
    </div>
  );
}

function Ludo() {
  const [numPlayers, setNumPlayers] = useState<number>(4);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [positions, setPositions] = useState<number[]>(Array(4).fill(0));
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [dice, setDice] = useState<number | null>(null); // For final roll value
  const [winner, setWinner] = useState<number | null>(null);
  const boardSize = 20;

  const [isRolling, setIsRolling] = useState<boolean>(false); // For animation
  const [displayDice, setDisplayDice] = useState<number | null>(null); // For animation
  const [justMovedPlayer, setJustMovedPlayer] = useState<number | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const playerColors = ['#e53935', '#43a047', '#1e88e5', '#fbc02d'];
  const playerNames = ['Red', 'Green', 'Blue', 'Yellow'];

  function handlePlayerSelect(selectedNum: number) {
    setNumPlayers(selectedNum);
    restart(selectedNum);
  }

  function restart(selectedNumPlayersToUse?: number) {
    const playersToSetup = selectedNumPlayersToUse || numPlayers;
    if (selectedNumPlayersToUse) {
        setNumPlayers(playersToSetup);
    }
    setPositions(Array(4).fill(0));
    setCurrentPlayer(0);
    setDice(null);
    setWinner(null);
    setShowCelebration(false);
    setJustMovedPlayer(null); // Reset for token animation
    setIsRolling(false);     // Reset for dice animation
    setDisplayDice(null);  // Reset for dice animation
    setGameStarted(true);
  }

  useEffect(() => {
    if (gameStarted && !isRolling && winner === null) {
      setDisplayDice(null);
      setDice(null);
    }
  }, [currentPlayer, isRolling, winner, gameStarted, numPlayers]);

  function rollDice() {
    if (winner !== null || isRolling) return; // Combined guards

    setIsRolling(true);
    setDisplayDice(null); // Clear previous display dice if any

    let rollCount = 0;
    const animationDuration = 800; // ms
    const singleRollAnimationTime = 80; // ms
    const maxRollCount = animationDuration / singleRollAnimationTime;

    const rollAnimationInterval = setInterval(() => {
      setDisplayDice(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      if (rollCount >= maxRollCount) {
        clearInterval(rollAnimationInterval);

        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDice(finalRoll); // Set the actual dice value
        const movedPlayer = currentPlayer;


        setPositions((prev) => { // Using prev from user's base, will be updatedPositionsArray if using my full version
          const newPos = [...prev];
          if (newPos[movedPlayer] + finalRoll <= boardSize) {
            newPos[movedPlayer] += finalRoll;
          }
          if (newPos[movedPlayer] === boardSize) {
            setWinner(movedPlayer);
            setShowCelebration(true);
          }
          return newPos;
        });

        setJustMovedPlayer(movedPlayer);
        setTimeout(() => setJustMovedPlayer(null), 500);

        // Simplified turn change logic for THIS STEP as per subtask, using numPlayers
        const gameJustWon = (positions[movedPlayer] + finalRoll) === boardSize;
        if (!gameJustWon && winner === null) {
             setCurrentPlayer((prev) => (prev + 1) % numPlayers);
        }

        setIsRolling(false);
      }
    }, singleRollAnimationTime);
  }

  if (!gameStarted) {
    return (
      <div className="game-card" style={{ maxWidth: 700, borderRadius: 24 }}>
        <h2>Ludo (Mini) - Select Players</h2>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1em', margin: '2em 0' }}>
          {[2, 3, 4].map(num => (
            <button
              key={num}
              className="game-button game-button-primary"
              style={{minWidth: '150px', fontSize: '1.1em'}}
              onClick={() => handlePlayerSelect(num)}
            >
              {num} Players
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      {showCelebration && winner !== null && <WinCelebration onClose={() => setShowCelebration(false)} />}
      <div className="game-card" style={{ maxWidth: 700, borderRadius: 24 }}>
        <h2>Ludo (Mini - {numPlayers} Players)</h2>
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
          <div className="ludo-board">
            {[...Array(4)].map((_, row) => (
              <div key={row} className="ludo-board-row">
                {[...Array(5)].map((_, col) => {
                  const i = row * 5 + col;
                  const playerHere = positions.findIndex((p, playerIdx) => playerIdx < numPlayers && p === i);
                  return (
                    <div key={col} className={`ludo-board-cell ${playerHere !== -1 ? 'ludo-board-cell-player' : ''}`} style={{ background: playerHere !== -1 ? playerColors[playerHere] : undefined, borderColor: playerHere !== -1 ? playerColors[playerHere] : 'var(--border-color)', boxShadow: playerHere !== -1 ? `0 1px 4px ${playerColors[playerHere]}99` : undefined }} />
                  );
                })}
              </div>
            ))}
          </div>
          {/* Dice Display Area */}
          <div className="mt-1 mb-1" style={{ fontSize: '1.1em', color: 'var(--text-color)', fontWeight: 600, minHeight: '1.5em' }}>
            {winner !== null ? (
              <span style={{ color: playerColors[winner], fontWeight: 800 }}>{playerNames[winner]} wins!</span>
            ) : (
              <>
                {isRolling && displayDice !== null && <span style={{ fontSize: '1.5em', fontWeight: 700, color: 'var(--secondary-color)' }}>⚅ {displayDice}</span>}
                {!isRolling && dice !== null && <span>Dice: <b style={{ fontSize: '1.2em', color: 'var(--primary-color)' }}>{dice}</b> | </span>}
                {!isRolling && currentPlayer < numPlayers && <span style={{ color: playerColors[currentPlayer], fontWeight: 700}}>{playerNames[currentPlayer]}'s turn</span>}
                {isRolling && currentPlayer < numPlayers && <span style={{ color: playerColors[currentPlayer], fontWeight: 700}}>Rolling for {playerNames[currentPlayer]}...</span>}
              </>
            )}
          </div>
          {/* Roll Dice Button */}
          <button
            className={`game-button mb-1 ${winner !== null || isRolling ? '' : 'game-button-special'}`}
            style={{ background: winner !== null || isRolling ? 'var(--disabled-bg-color)' : undefined, cursor: isRolling ? 'wait' : (winner !== null ? 'not-allowed' : 'pointer') }}
            onClick={rollDice}
            disabled={winner !== null || isRolling}
          >
            {isRolling ? 'Rolling...' : winner !== null ? 'Game Over' : 'Roll Dice'}
          </button>
          <button
            className="game-button game-button-secondary"
            onClick={() => restart()}
          >
            Restart Game
          </button>
          <button
            className="game-button game-button-secondary mt-1"
            onClick={() => {
              setGameStarted(false);
            }}
            style={{background: 'var(--error-color)', color: 'var(--button-text-color)', borderColor: 'var(--error-color)'}}
          >
            Change Players
          </button>
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

  const getCurrentInitialBoard = () => sudokuBoards[difficulty];

  useEffect(() => {
    // Reset board when difficulty changes
    setBoard(getCurrentInitialBoard().map(row => [...row]));
    setSelected(null);
    setMessage('');
    setCompleted(false);
    setShowCelebration(false); // Also hide celebration when difficulty changes
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
    // Check for completion
    if (JSON.stringify(newBoard) === JSON.stringify(sudokuSolution)) {
      setCompleted(true);
      setMessage('🎉 Sudoku Completed!');
      setShowCelebration(true); // Show celebration on completion
    } else {
      setMessage('');
    }
  }

  function restart() {
    setBoard(getCurrentInitialBoard().map(row => [...row]));
    setSelected(null);
    setMessage('');
    setCompleted(false);
    setShowCelebration(false); // Hide celebration on restart
  }

  const handleDifficultyChange = (newDifficulty: SudokuDifficulty) => {
    setDifficulty(newDifficulty); // This will trigger the useEffect to reset the board
  };

  return (
    <>
      {showCelebration && completed && <WinCelebration onClose={() => setShowCelebration(false)} />}
      <div className="game-card" style={{ maxWidth: 420, borderRadius: 20 }}> {/* Retained maxWidth and specific borderRadius */}
        <h2>Sudoku (4x4)</h2>
        <div className="sudoku-difficulty-selector mb-2" style={{ display: 'flex', justifyContent: 'center', gap: '0.5em' }}>
        {(['Easy', 'Medium', 'Hard'] as SudokuDifficulty[]).map(level => (
          <button
            key={level}
            className={`game-button game-button-secondary ${difficulty === level ? 'game-button-active' : ''}`}
            style={difficulty === level ? { backgroundColor: 'var(--primary-color)', color: 'var(--button-text-color)', borderColor: 'var(--primary-color)'} : {}}
            onClick={() => handleDifficultyChange(level)}
          >
            {level}
          </button>
        ))}
      </div>
      <div className="sudoku-grid">
        {board.map((row: number[], rIdx: number) =>
          row.map((cell: number, cIdx: number) => (
            <button
              key={rIdx + '-' + cIdx}
              className={`
                sudoku-cell
                ${getCurrentInitialBoard()[rIdx][cIdx] !== 0 ? 'sudoku-cell-initial' : ''}
                ${selected && selected[0] === rIdx && selected[1] === cIdx ? 'sudoku-cell-selected' : ''}
              `}
              style={{
                // All styling for cells (initial, selected, default) is now handled by CSS classes
                // using the new color palette. Outline is part of .sudoku-cell-selected
              }}
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
            className="sudoku-input-button" // Already uses themed colors from App.css
            onClick={() => handleNumberInput(num)}
            disabled={completed}
          >
            {num}
          </button>
        ))}
      </div>
      {/* Status message uses theme colors */}
      <div className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.1em', color: completed ? 'var(--success-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
        {message}
      </div>
      {/* Restart is secondary. Unique gradient removed for theme consistency. */}
      <button className="game-button game-button-secondary" onClick={restart}>
        Restart
      </button>
    </div>
  );
}

function Chess() {
  // 4x4 Chess Mini with Rooks, Pawns, and Kings
  const initialBoardSetup = {
    standard: [
      ['bR', 'bK', '', 'bP'],
      ['bP', '', '', ''],
      ['', '', '', 'wP'],
      ['wP', '', 'wK', 'wR'],
    ]
    // Could add other setups here later if desired
  };
  const [board, setBoard] = useState<string[][]>(initialBoardSetup.standard.map(row => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [message, setMessage] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  function isOwnPiece(piece: string) {
    return piece && piece[0] === turn;
  }

  function handleCellClick(row: number, col: number) {
    if (winner) return;
    const piece = board[row][col];
    if (selected) {
      const [sRow, sCol] = selected;
      if (sRow === row && sCol === col) {
        setSelected(null);
        return;
      }
      // Only allow moving own piece
      if (!isOwnPiece(board[sRow][sCol])) return;
      // Only allow moving to empty or opponent's piece
      if (isOwnPiece(piece)) return;
      // Only allow simple pawn and king moves
      const moving = board[sRow][sCol];
      let valid = false;
      if (moving[1] === 'P') {
        // Pawn: move forward or capture
        const dir = moving[0] === 'w' ? -1 : 1;
        if (col === sCol && row === sRow + dir && !piece) valid = true; // Move one step forward
        if (Math.abs(col - sCol) === 1 && row === sRow + dir && piece && piece[0] !== moving[0]) valid = true; // Capture diagonally
      } else if (moving[1] === 'K') {
        // King: move one square any direction
        if (Math.abs(row - sRow) <= 1 && Math.abs(col - sCol) <= 1 && (row !== sRow || col !== sCol)) valid = true;
      } else if (moving[1] === 'R') { // Rook logic
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
          } else { // isVertical
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
            // Target square must be empty or opponent's piece (already checked by !isOwnPiece(piece) before this block)
            valid = true;
          }
        }
      }

      if (valid) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = moving;
        newBoard[sRow][sCol] = '';
        setBoard(newBoard);
        setSelected(null);
        setTurn(turn === 'w' ? 'b' : 'w');
        setMessage('');
        // Check for win
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
      if (piece && isOwnPiece(piece)) setSelected([row, col]);
    }
  }

  function restart() {
    setBoard(initialBoardSetup.standard.map(row => [...row])); // Corrected reference
    setSelected(null);
    setTurn('w');
    setMessage('');
    setWinner(null);
    setShowCelebration(false); // Hide celebration on restart
  }

  function renderPiece(piece: string) {
    if (!piece) return null;
    if (piece[1] === 'K') return piece[0] === 'w' ? '♔' : '♚';
    if (piece[1] === 'P') return piece[0] === 'w' ? '♙' : '♟';
    if (piece[1] === 'R') return piece[0] === 'w' ? '♖' : '♜'; // Added Rook
    return null;
  }

  return (
    <>
      {showCelebration && winner && <WinCelebration onClose={() => setShowCelebration(false)} />}
      <div className="game-card" style={{ maxWidth: 420, borderRadius: 20 }}> {/* Retained maxWidth and specific borderRadius */}
        <h2>Chess (Mini 4x4)</h2>
        <div className="chess-grid">
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isSel = selected && selected[0] === rIdx && selected[1] === cIdx;
            // const isLight = (rIdx + cIdx) % 2 === 0; // isLight logic is in CSS now via .chess-cell-light/dark
            return (
              <button
                key={rIdx + '-' + cIdx}
                className={`
                  chess-cell
                  ${(rIdx + cIdx) % 2 === 0 ? 'chess-cell-light' : 'chess-cell-dark'}
                  ${isSel ? 'chess-cell-selected' : ''}
                  ${cell && cell[0] === 'w' ? 'chess-piece-white' : cell ? 'chess-piece-black' : ''}
                `}
                style={{
                  // Cell backgrounds (light/dark), piece colors, and selection styles are handled by CSS classes.
                  // The .chess-cell-selected class now includes a themed border.
                }}
                onClick={() => handleCellClick(rIdx, cIdx)}
                aria-label={`Chess cell ${rIdx + 1},${cIdx + 1}`}
                disabled={!!winner}
              >
                {renderPiece(cell)}
              </button>
            );
          })
        )}
      </div>
      {/* Status message uses theme colors */}
      <div className="mt-1 mb-1" style={{ fontWeight: 600, fontSize: '1.1em', color: winner ? 'var(--success-color)' : 'var(--text-color)', letterSpacing: 0.5 }}>
        {winner ? `${winner} wins!` : message || `${turn === 'w' ? 'White' : 'Black'}'s turn`}
      </div>
      {/* Restart is secondary. Unique gradient removed. */}
      <button className="game-button game-button-secondary" onClick={restart}>
        Restart
      </button>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<'color-shape' | 'tictactoe' | 'ludo' | 'sudoku' | 'chess'>('color-shape');
  // Function to check if dark theme is preferred by user or explicitly set
  // For this refactor, we assume a light theme focus, so dynamic theme switching logic is minimal.
  const isEffectivelyLightTheme = () => {
    // Example: return !document.body.classList.contains('dark-theme');
    // For now, as no theme switcher exists, we assume light theme for gradient application.
    return true;
  };

  return (
    <div id="root" className="app-container">
      {/* Decorative SVGs use CSS variables for fill, set in App.css */}
      <svg className="decorative-svg-1" width="380" height="380" viewBox="0 0 380 380"><circle cx="190" cy="190" r="190" /></svg>
      <svg className="decorative-svg-2" width="350" height="350" viewBox="0 0 350 350"><circle cx="175" cy="175" r="175" /></svg>
      <svg className="decorative-svg-3" width="280" height="280" viewBox="0 0 280 280"><circle cx="140" cy="140" r="140" /></svg>
      <header className="app-header">
        <h1>
          🎲 Gaming Hub
        </h1>
        <p>
          Enjoy a collection of classic and modern games with a beautiful, immersive UI!
        </p>
        <nav>
          {/* Active nav buttons use themed gradients. Non-active buttons use standard .nav-button styling from App.css */}
          <button
            className={`nav-button ${game === 'color-shape' ? 'nav-button-active' : ''}`}
            style={game === 'color-shape' && isEffectivelyLightTheme() ? { background: 'linear-gradient(90deg, var(--primary-color), var(--success-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : {}}
            onClick={() => setGame('color-shape')}
            aria-label="Play Shape & Color Game"
          >
            Shape & Color Game
          </button>
          <button
            className={`nav-button ${game === 'tictactoe' ? 'nav-button-active' : ''}`}
            style={game === 'tictactoe' && isEffectivelyLightTheme() ? { background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : {}}
            onClick={() => setGame('tictactoe')}
            aria-label="Play Tic-Tac-Toe"
          >
            Tic-Tac-Toe
          </button>
          <button
            className={`nav-button ${game === 'ludo' ? 'nav-button-active' : ''}`}
            style={game === 'ludo' && isEffectivelyLightTheme() ? { background: 'linear-gradient(90deg, var(--primary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : {}}
            onClick={() => setGame('ludo')}
            aria-label="Play Ludo"
          >
            Ludo (Mini)
          </button>
          <button
            className={`nav-button ${game === 'sudoku' ? 'nav-button-active' : ''}`}
            style={game === 'sudoku' && isEffectivelyLightTheme() ? { background: 'linear-gradient(90deg, var(--secondary-color), var(--error-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : {}}
            onClick={() => setGame('sudoku')}
            aria-label="Play Sudoku"
          >
            Sudoku (4x4)
          </button>
          <button
            className={`nav-button ${game === 'chess' ? 'nav-button-active' : ''}`}
            style={game === 'chess' && isEffectivelyLightTheme() ? { background: 'linear-gradient(90deg, var(--primary-color), var(--text-color))', color: 'var(--button-text-color)', borderColor: 'transparent' } : {}}
            onClick={() => setGame('chess')}
            aria-label="Play Chess"
          >
            Chess (Mini)
          </button>
        </nav>
      </header>
      <main className="app-main">
        {game === 'color-shape' ? <GamingPage /> : game === 'tictactoe' ? <TicTacToe /> : game === 'ludo' ? <Ludo /> : game === 'sudoku' ? <Sudoku /> : <Chess />}
      </main>
      <footer className="app-footer">
        &copy; {new Date().getFullYear()} <span className="brand-text">Gaming Hub</span> &mdash; Built with <span className="tech-text">Vite + React</span>
      </footer>
    </div>
  );
}

export default App;
