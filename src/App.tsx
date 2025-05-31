import { useState, useEffect } from 'react';
import './App.css';
// Importing styles for the app
function GamingPage() {
  const [score, setScore] = useState<number>(0);
  const [currentColor, setCurrentColor] = useState<string>('');
  const [currentShape, setCurrentShape] = useState<string>('');
  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [shapeOptions, setShapeOptions] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('');
  const [step, setStep] = useState<'color' | 'shape' | 'win'>('color');

  const colorList = [
    'red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'white'
  ];
  const shapeList = [
    'circle', 'square', 'triangle', 'star', 'hexagon', 'rectangle', 'oval', 'diamond'
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
    switch (shape) {
      case 'circle':
        return <div style={{ width: size, height: size, borderRadius: '50%', background: color, margin: '0 auto' }} />;
      case 'square':
        return <div style={{ width: size, height: size, background: color, margin: '0 auto' }} />;
      case 'triangle':
        return <div style={{ width: 0, height: 0, borderLeft: `${size/2}px solid transparent`, borderRight: `${size/2}px solid transparent`, borderBottom: `${size}px solid ${color}`, margin: '0 auto' }} />;
      case 'star':
        return <svg width={size} height={size} viewBox="0 0 50 50" style={{ display: 'block', margin: '0 auto' }}><polygon points="25,2 31,18 48,18 34,29 39,46 25,36 11,46 16,29 2,18 19,18" fill={color} /></svg>;
      case 'hexagon':
        return <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', margin: '0 auto' }}><polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={color} /></svg>;
      case 'rectangle':
        return <div style={{ width: size * 1.5, height: size * 0.7, background: color, margin: '0 auto' }} />;
      case 'oval':
        return <div style={{ width: size * 1.2, height: size * 0.7, background: color, borderRadius: '50%', margin: '0 auto' }} />;
      case 'diamond':
        return <div style={{ width: size, height: size, background: color, transform: 'rotate(45deg)', margin: '0 auto' }} />;
      default:
        return null;
    }
  }

  function restartGame() {
    setScore(0);
    newRound();
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2em auto', boxShadow: '0 4px 24px 0 #0002', background: '#fff', borderRadius: 16 }}>
      <h1 style={{ fontSize: '2.2em', marginBottom: 0, color: '#3f51b5', letterSpacing: 1 }}>🎨 Shape & Color Game</h1>
      <p style={{ fontSize: '1.1em', color: '#666', marginTop: 4, marginBottom: 24 }}>
        Score: <b style={{ color: '#43a047' }}>{score}</b> / 10
      </p>
      {/* Show restart button during the game */}
      {step !== 'win' && (
        <button
          style={{ marginBottom: '1.5em', background: 'linear-gradient(90deg,#e3e3e3,#f5f5f5)', color: '#222', minWidth: 120, border: '1px solid #bbb', borderRadius: 8, fontWeight: 600, fontSize: '1em', boxShadow: '0 2px 8px #0001' }}
          onClick={restartGame}
        >
          Restart
        </button>
      )}
      {step === 'color' && (
        <>
          <div style={{ margin: '1.5em 0 1em', fontSize: '1.2em', fontWeight: 600, color: '#333' }}>
            Identify the color:
            <span style={{
              display: 'inline-block',
              marginLeft: '1em',
              width: 60,
              height: 30,
              background: currentColor,
              border: '2px solid #ccc',
              borderRadius: 8,
              verticalAlign: 'middle',
              boxShadow: '0 2px 8px #0001',
            }} />
          </div>
          <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {colorOptions.map((color) => (
              <button
                key={color}
                style={{
                  background: color,
                  color: color === 'black' ? '#fff' : '#222',
                  minWidth: 90,
                  minHeight: 40,
                  border: '2px solid #bbb',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: '1em',
                  boxShadow: '0 2px 8px #0001',
                  transition: 'transform 0.1s',
                  cursor: 'pointer',
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
          <div style={{ margin: '1.5em 0 1em', fontSize: '1.2em', fontWeight: 600, color: '#333' }}>
            Identify the shape:
            <div style={{ marginTop: 16 }}>{renderShape(currentShape, currentColor)}</div>
          </div>
          <div style={{ display: 'flex', gap: '1em', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            {shapeOptions.map((shape) => (
              <button
                key={shape}
                style={{
                  background: '#f9f9f9',
                  color: '#222',
                  minWidth: 90,
                  minHeight: 40,
                  border: '2px solid #bbb',
                  borderRadius: 8,
                  fontWeight: 500,
                  fontSize: '1em',
                  boxShadow: '0 2px 8px #0001',
                  transition: 'transform 0.1s',
                  cursor: 'pointer',
                }}
                onClick={() => handleShapeGuess(shape)}
              >
                {shape.charAt(0).toUpperCase() + shape.slice(1)}
              </button>
            ))}
          </div>
        </>
      )}
      {step === 'win' && (
        <div style={{ margin: '2em 0', fontSize: '1.5em', fontWeight: 700, color: '#4caf50', textAlign: 'center' }}>
          🏆 You win! Congratulations!<br />
          <button
            style={{ marginTop: '1.5em', background: 'linear-gradient(90deg,#e3e3e3,#f5f5f5)', color: '#222', minWidth: 140, border: '1px solid #bbb', borderRadius: 8, fontWeight: 600, fontSize: '1em', boxShadow: '0 2px 8px #0001' }}
            onClick={restartGame}
          >
            Play Again
          </button>
        </div>
      )}
      {message && <p style={{ marginTop: '1.5em', fontWeight: 500, color: message.includes('win') ? '#43a047' : '#e65100', fontSize: '1.1em' }}>{message}</p>}
    </div>
  );
}

function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xIsNext, setXIsNext] = useState<boolean>(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [draw, setDraw] = useState<boolean>(false);

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
  }

  return (
    <div className="card" style={{ maxWidth: 500, margin: '2em auto', boxShadow: '0 4px 24px 0 #0002', background: '#fff', borderRadius: 16, padding: '2em 1em' }}>
      <h2 style={{ color: '#3f51b5', marginBottom: 18, fontSize: '2em', letterSpacing: 1 }}>Tic-Tac-Toe</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 110px)', gap: 18, justifyContent: 'center', margin: '1.5em auto' }}>
        {board.map((cell, idx) => (
          <button
            key={idx}
            style={{
              width: 110,
              height: 110,
              fontSize: '3.2em',
              fontWeight: 800,
              border: '3px solid #3f51b5',
              borderRadius: 18,
              background: cell === '' ? '#f5f5f5' : cell === 'X' ? '#e3f2fd' : '#fce4ec',
              color: cell === 'X' ? '#3f51b5' : cell === 'O' ? '#e65100' : '#bbb',
              cursor: cell || winner ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px #3f51b522',
              transition: 'background 0.2s, color 0.2s',
              outline: cell ? '2px solid #43a047' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => handleClick(idx)}
            disabled={!!cell || !!winner}
            aria-label={`Tic-Tac-Toe cell ${idx + 1}`}
          >
            {cell}
          </button>
        ))}
      </div>
      <div style={{ margin: '1.5em 0', fontWeight: 600, fontSize: '1.3em', color: winner ? '#43a047' : draw ? '#e65100' : '#333', letterSpacing: 0.5 }}>
        {winner ? `Winner: ${winner}` : draw ? 'Draw!' : `Next: ${xIsNext ? 'X' : 'O'}`}
      </div>
      <button style={{ background: 'linear-gradient(90deg,#e3e3e3,#f5f5f5)', color: '#222', minWidth: 140, border: '1px solid #bbb', borderRadius: 10, fontWeight: 700, fontSize: '1.1em', boxShadow: '0 2px 8px #0001', padding: '0.7em 1.2em' }} onClick={restart}>
        Restart
      </button>
    </div>
  );
}

function Ludo() {
  const [positions, setPositions] = useState<number[]>([0, 0, 0, 0]);
  const [currentPlayer, setCurrentPlayer] = useState<number>(0);
  const [dice, setDice] = useState<number | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const boardSize = 20; // Simple linear board for demo

  function rollDice() {
    if (winner !== null) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    setDice(roll);
    setPositions((prev) => {
      const newPos = [...prev];
      if (newPos[currentPlayer] + roll <= boardSize) {
        newPos[currentPlayer] += roll;
      }
      if (newPos[currentPlayer] === boardSize) {
        setWinner(currentPlayer);
      }
      return newPos;
    });
    setCurrentPlayer((prev) => (prev + 1) % 4);
  }

  function restart() {
    setPositions([0, 0, 0, 0]);
    setCurrentPlayer(0);
    setDice(null);
    setWinner(null);
  }

  const playerColors = ['#e53935', '#43a047', '#1e88e5', '#fbc02d'];
  const playerNames = ['Red', 'Green', 'Blue', 'Yellow'];

  return (
    <div className="card" style={{ maxWidth: 700, margin: '2.5em auto', boxShadow: '0 4px 24px 0 #0002', background: '#fff', borderRadius: 24, padding: '2.5em 1.5em' }}>
      <h2 style={{ color: '#3f51b5', marginBottom: 18, fontSize: '2.2em', letterSpacing: 1 }}>Ludo (Mini)</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
        {positions.map((pos, idx) => (
          <div key={idx} style={{ textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: playerColors[idx], margin: '0 auto', border: currentPlayer === idx && winner === null ? '4px solid #333' : '3px solid #bbb', boxShadow: '0 2px 8px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 26 }}>
              {idx + 1}
            </div>
            <div style={{ fontSize: 17, color: '#555', marginTop: 4 }}>{playerNames[idx]}</div>
            <div style={{ fontSize: 15, color: '#888' }}>Pos: {pos}</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '1.5em 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Board split into multiple lines, now larger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
          {[...Array(4)].map((_, row) => (
            <div key={row} style={{ display: 'flex', gap: 8 }}>
              {[...Array(5)].map((_, col) => {
                const i = row * 5 + col;
                const playerHere = positions.findIndex((p) => p === i);
                return (
                  <div key={col} style={{ width: 38, height: 38, border: '2px solid #bbb', borderRadius: 8, background: playerHere !== -1 ? playerColors[playerHere] : '#f5f5f5', margin: 2, display: 'inline-block', boxShadow: playerHere !== -1 ? '0 2px 8px #0002' : undefined }} />
                );
              })}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 18, color: '#333', marginBottom: 12, fontWeight: 600 }}>
          {winner !== null ? (
            <span style={{ color: playerColors[winner], fontWeight: 800 }}>{playerNames[winner]} wins!</span>
          ) : (
            <>
              {dice !== null && <span>Dice: <b>{dice}</b> | </span>}
              <span style={{ color: playerColors[currentPlayer], fontWeight: 700 }}>{playerNames[currentPlayer]}'s turn</span>
            </>
          )}
        </div>
        <button
          style={{ background: winner !== null ? '#3f51b5' : '#43a047', color: '#fff', minWidth: 140, border: '1px solid #bbb', borderRadius: 10, fontWeight: 700, fontSize: '1.1em', boxShadow: '0 2px 8px #0001', marginBottom: 10, padding: '0.7em 1.2em' }}
          onClick={rollDice}
          disabled={winner !== null}
        >
          {winner !== null ? 'Game Over' : 'Roll Dice'}
        </button>
        <button
          style={{ background: '#eee', color: '#222', minWidth: 140, border: '1px solid #bbb', borderRadius: 10, fontWeight: 700, fontSize: '1.1em', boxShadow: '0 2px 8px #0001', padding: '0.7em 1.2em' }}
          onClick={restart}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

function Sudoku() {
  // 4x4 Sudoku for demo (easy to play in UI)
  const initialBoard = [
    [0, 0, 2, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [3, 4, 0, 0],
  ];
  const solution = [
    [4, 3, 2, 1],
    [2, 1, 4, 3],
    [1, 2, 3, 4],
    [3, 4, 1, 2],
  ];
  const [board, setBoard] = useState<number[][]>(initialBoard.map(row => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [message, setMessage] = useState<string>('');
  const [completed, setCompleted] = useState<boolean>(false);

  function handleCellClick(row: number, col: number) {
    if (initialBoard[row][col] !== 0 || completed) return;
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
    if (JSON.stringify(newBoard) === JSON.stringify(solution)) {
      setCompleted(true);
      setMessage('🎉 Sudoku Completed!');
    } else {
      setMessage('');
    }
  }

  function restart() {
    setBoard(initialBoard.map(row => [...row]));
    setSelected(null);
    setMessage('');
    setCompleted(false);
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2em auto', boxShadow: '0 4px 24px 0 #0002', background: '#fff', borderRadius: 20, padding: '2em 1em' }}>
      <h2 style={{ color: '#3f51b5', marginBottom: 18, fontSize: '2em', letterSpacing: 1 }}>Sudoku (4x4)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 60px)', gap: 8, justifyContent: 'center', margin: '1.5em auto' }}>
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <button
              key={rIdx + '-' + cIdx}
              style={{
                width: 60,
                height: 60,
                fontSize: '1.7em',
                fontWeight: 700,
                border: selected && selected[0] === rIdx && selected[1] === cIdx ? '3px solid #43a047' : '2px solid #bbb',
                borderRadius: 10,
                background: initialBoard[rIdx][cIdx] !== 0 ? '#e0e7ff' : '#f5f5f5',
                color: initialBoard[rIdx][cIdx] !== 0 ? '#6366f1' : '#222',
                cursor: initialBoard[rIdx][cIdx] !== 0 || completed ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px #0001',
                transition: 'background 0.2s, color 0.2s',
                outline: selected && selected[0] === rIdx && selected[1] === cIdx ? '2px solid #43a047' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => handleCellClick(rIdx, cIdx)}
              aria-label={`Sudoku cell ${rIdx + 1},${cIdx + 1}`}
            >
              {cell !== 0 ? cell : ''}
            </button>
          ))
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, margin: '1em 0' }}>
        {[1, 2, 3, 4].map(num => (
          <button
            key={num}
            style={{ background: '#6366f1', color: '#fff', minWidth: 48, minHeight: 48, border: 'none', borderRadius: 8, fontWeight: 700, fontSize: '1.2em', boxShadow: '0 2px 8px #0001', cursor: completed ? 'not-allowed' : 'pointer' }}
            onClick={() => handleNumberInput(num)}
            disabled={completed}
          >
            {num}
          </button>
        ))}
      </div>
      <div style={{ margin: '1em 0', fontWeight: 600, fontSize: '1.1em', color: completed ? '#43a047' : '#333', letterSpacing: 0.5 }}>
        {message}
      </div>
      <button style={{ background: 'linear-gradient(90deg,#e0e7ff,#fbc2eb)', color: '#222', minWidth: 120, border: '1px solid #bbb', borderRadius: 10, fontWeight: 700, fontSize: '1.1em', boxShadow: '0 2px 8px #0001', padding: '0.7em 1.2em' }} onClick={restart}>
        Restart
      </button>
    </div>
  );
}

function Chess() {
  // 4x4 Chess Mini for demo (simplified, only pawns and kings)
  const initialBoard = [
    ['bK', '', '', 'bP'],
    ['', '', '', ''],
    ['', '', '', ''],
    ['wP', '', '', 'wK'],
  ];
  const [board, setBoard] = useState<string[][]>(initialBoard.map(row => [...row]));
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [message, setMessage] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);

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
        if (col === sCol && row === sRow + dir && !piece) valid = true;
        if (Math.abs(col - sCol) === 1 && row === sRow + dir && piece && piece[0] !== moving[0]) valid = true;
      } else if (moving[1] === 'K') {
        // King: move one square any direction
        if (Math.abs(row - sRow) <= 1 && Math.abs(col - sCol) <= 1 && (row !== sRow || col !== sCol)) valid = true;
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
        if (!flat.includes('bK')) setWinner('White');
        if (!flat.includes('wK')) setWinner('Black');
      } else {
        setMessage('Invalid move');
        setSelected(null);
      }
    } else {
      if (piece && isOwnPiece(piece)) setSelected([row, col]);
    }
  }

  function restart() {
    setBoard(initialBoard.map(row => [...row]));
    setSelected(null);
    setTurn('w');
    setMessage('');
    setWinner(null);
  }

  function renderPiece(piece: string) {
    if (!piece) return null;
    if (piece[1] === 'K') return piece[0] === 'w' ? '♔' : '♚';
    if (piece[1] === 'P') return piece[0] === 'w' ? '♙' : '♟';
    return null;
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '2em auto', boxShadow: '0 4px 24px 0 #0002', background: '#fff', borderRadius: 20, padding: '2em 1em' }}>
      <h2 style={{ color: '#3f51b5', marginBottom: 18, fontSize: '2em', letterSpacing: 1 }}>Chess (Mini 4x4)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 60px)', gap: 0, justifyContent: 'center', margin: '1.5em auto', border: '3px solid #6366f1', borderRadius: 10, overflow: 'hidden' }}>
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isSel = selected && selected[0] === rIdx && selected[1] === cIdx;
            const isLight = (rIdx + cIdx) % 2 === 0;
            return (
              <button
                key={rIdx + '-' + cIdx}
                style={{
                  width: 60,
                  height: 60,
                  fontSize: '2em',
                  fontWeight: 700,
                  border: isSel ? '3px solid #43a047' : 'none',
                  background: isSel ? '#e0e7ff' : isLight ? '#f5f5f5' : '#e0e7ff',
                  color: cell && cell[0] === 'w' ? '#6366f1' : '#e65100',
                  cursor: winner ? 'not-allowed' : cell && isOwnPiece(cell) ? 'pointer' : 'pointer',
                  boxShadow: '0 2px 8px #0001',
                  transition: 'background 0.2s, color 0.2s',
                  outline: isSel ? '2px solid #43a047' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
      <div style={{ margin: '1em 0', fontWeight: 600, fontSize: '1.1em', color: winner ? '#43a047' : '#333', letterSpacing: 0.5 }}>
        {winner ? `${winner} wins!` : message || `${turn === 'w' ? 'White' : 'Black'}'s turn`}
      </div>
      <button style={{ background: 'linear-gradient(90deg,#e0e7ff,#fbc2eb)', color: '#222', minWidth: 120, border: '1px solid #bbb', borderRadius: 10, fontWeight: 700, fontSize: '1.1em', boxShadow: '0 2px 8px #0001', padding: '0.7em 1.2em' }} onClick={restart}>
        Restart
      </button>
    </div>
  );
}

function App() {
  const [game, setGame] = useState<'color-shape' | 'tictactoe' | 'ludo' | 'sudoku' | 'chess'>('color-shape');
  return (
    <div id="root" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 40%, #fbc2eb 100%)',
      padding: 0,
      margin: 0,
      fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
      transition: 'background 0.5s',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Decorative SVGs for a more elegant background */}
      <svg style={{ position: 'fixed', top: -120, left: -120, zIndex: 0, opacity: 0.13 }} width="420" height="420"><circle cx="210" cy="210" r="210" fill="#a5b4fc" /></svg>
      <svg style={{ position: 'fixed', bottom: -140, right: -140, zIndex: 0, opacity: 0.10 }} width="420" height="420"><circle cx="210" cy="210" r="210" fill="#fbc2eb" /></svg>
      <svg style={{ position: 'fixed', top: 80, right: -100, zIndex: 0, opacity: 0.08 }} width="320" height="320"><circle cx="160" cy="160" r="160" fill="#f59e42" /></svg>
      <header style={{
        width: '100%',
        background: 'rgba(255,255,255,0.98)',
        boxShadow: '0 6px 32px #a5b4fc33',
        padding: '2.5em 0 1.5em',
        marginBottom: 48,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2,
      }}>
        <h1 style={{
          fontSize: '2.9em',
          background: 'linear-gradient(90deg,#6366f1,#f59e42,#f43f5e,#a5b4fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: 0,
          letterSpacing: 2,
          fontWeight: 900,
          textShadow: '0 2px 16px #a5b4fc33',
        }}>
          🎲 Gaming Hub
        </h1>
        <p style={{ color: '#555', fontSize: '1.18em', margin: '0.7em 0 0', fontWeight: 500, letterSpacing: 0.5 }}>
          Enjoy a collection of classic and modern games with a beautiful, immersive UI!
        </p>
        <nav style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 36 }}>
          <button
            style={{ background: game === 'color-shape' ? 'linear-gradient(90deg,#6366f1,#43e97b)' : '#f5f5f5', color: game === 'color-shape' ? '#fff' : '#222', minWidth: 150, border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1.12em', boxShadow: game === 'color-shape' ? '0 4px 16px #6366f133' : '0 2px 8px #0001', transition: 'all 0.2s', padding: '0.8em 1.3em', outline: game === 'color-shape' ? '2px solid #6366f1' : 'none', cursor: 'pointer', letterSpacing: 0.5 }}
            onClick={() => setGame('color-shape')}
            aria-label="Play Shape & Color Game"
          >
            Shape & Color Game
          </button>
          <button
            style={{ background: game === 'tictactoe' ? 'linear-gradient(90deg,#6366f1,#f59e42)' : '#f5f5f5', color: game === 'tictactoe' ? '#fff' : '#222', minWidth: 150, border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1.12em', boxShadow: game === 'tictactoe' ? '0 4px 16px #f59e4233' : '0 2px 8px #0001', transition: 'all 0.2s', padding: '0.8em 1.3em', outline: game === 'tictactoe' ? '2px solid #f59e42' : 'none', cursor: 'pointer', letterSpacing: 0.5 }}
            onClick={() => setGame('tictactoe')}
            aria-label="Play Tic-Tac-Toe"
          >
            Tic-Tac-Toe
          </button>
          <button
            style={{ background: game === 'ludo' ? 'linear-gradient(90deg,#6366f1,#fbc2eb)' : '#f5f5f5', color: game === 'ludo' ? '#fff' : '#222', minWidth: 150, border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1.12em', boxShadow: game === 'ludo' ? '0 4px 16px #fbc2eb33' : '0 2px 8px #0001', transition: 'all 0.2s', padding: '0.8em 1.3em', outline: game === 'ludo' ? '2px solid #fbc2eb' : 'none', cursor: 'pointer', letterSpacing: 0.5 }}
            onClick={() => setGame('ludo')}
            aria-label="Play Ludo"
          >
            Ludo (Mini)
          </button>
          <button
            style={{ background: game === 'sudoku' ? 'linear-gradient(90deg,#6366f1,#f43f5e)' : '#f5f5f5', color: game === 'sudoku' ? '#fff' : '#222', minWidth: 150, border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1.12em', boxShadow: game === 'sudoku' ? '0 4px 16px #f43f5e33' : '0 2px 8px #0001', transition: 'all 0.2s', padding: '0.8em 1.3em', outline: game === 'sudoku' ? '2px solid #f43f5e' : 'none', cursor: 'pointer', letterSpacing: 0.5 }}
            onClick={() => setGame('sudoku')}
            aria-label="Play Sudoku"
          >
            Sudoku (4x4)
          </button>
          <button
            style={{ background: game === 'chess' ? 'linear-gradient(90deg,#6366f1,#e65100)' : '#f5f5f5', color: game === 'chess' ? '#fff' : '#222', minWidth: 150, border: 'none', borderRadius: 14, fontWeight: 700, fontSize: '1.12em', boxShadow: game === 'chess' ? '0 4px 16px #e6510033' : '0 2px 8px #0001', transition: 'all 0.2s', padding: '0.8em 1.3em', outline: game === 'chess' ? '2px solid #e65100' : 'none', cursor: 'pointer', letterSpacing: 0.5 }}
            onClick={() => setGame('chess')}
            aria-label="Play Chess"
          >
            Chess (Mini)
          </button>
        </nav>
      </header>
      <main style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
        {game === 'color-shape' ? <GamingPage /> : game === 'tictactoe' ? <TicTacToe /> : game === 'ludo' ? <Ludo /> : game === 'sudoku' ? <Sudoku /> : <Chess />}
      </main>
      <footer style={{
        width: '100%',
        textAlign: 'center',
        color: '#888',
        fontSize: '1.12em',
        marginTop: 48,
        padding: '2.2em 0 1.3em',
        background: 'rgba(255,255,255,0.93)',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        boxShadow: '0 -6px 32px #a5b4fc33',
        fontWeight: 500,
        letterSpacing: 0.5,
      }}>
        &copy; {new Date().getFullYear()} <span style={{ color: '#6366f1', fontWeight: 700 }}>Gaming Hub</span> &mdash; Built with <span style={{ color: '#f59e42', fontWeight: 700 }}>Vite + React</span>
      </footer>
    </div>
  );
}

export default App;
