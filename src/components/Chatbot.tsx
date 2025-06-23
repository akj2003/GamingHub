import React, { useState, useEffect, useRef } from 'react';
import './Chatbot.css';

// Updated Chat Bubble Icon (Speech Bubble with Tail)
const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
);

// Define types for keyword responses
type GameResponses = {
  [keyword: string]: string;
};

type ChatKeywordsData = {
  general: GameResponses;
  tictactoe?: GameResponses;
  ludo?: GameResponses;
  sudoku?: GameResponses;
  chess?: GameResponses;
  memory?: GameResponses;
  hangman?: GameResponses;
  minesweeper?: GameResponses;
  // Add other games as needed
};

// Initial keyword data (to be expanded in the next step)
const chatKeywords: ChatKeywordsData = {
  general: {
    'hello': 'Hello there! How can I help you with the games?',
    'hi': 'Hi! Ask me about how to play a specific game.',
    'bye': 'Goodbye! Have fun playing!',
    'help': 'You can ask me about rules, how to play, or winning conditions for any game. For example, "how to play tic tac toe?" or "tell me about ludo".',
  },
  tictactoe: {
    'how to play': "Players take turns marking a square in a 3x3 grid. The first to get three of their marks in a row (horizontal, vertical, or diagonal) wins. If all squares are filled and no one wins, it's a draw.",
    'rules': "Players take turns marking a square in a 3x3 grid. The first to get three of their marks in a row (horizontal, vertical, or diagonal) wins. If all squares are filled and no one wins, it's a draw.",
    'start': "To start Tic-Tac-Toe, one player chooses 'X' and the other 'O'. Decide who goes first and take turns marking empty squares on the 3x3 grid.",
    'win': "You win by getting three of your marks (X or O) in a horizontal, vertical, or diagonal line.",
    'winner': "The winner is the first player to get three of their marks in a continuous line (up, down, across, or diagonally).",
    'draw': "A game is a draw if all nine squares are filled, but no player has three marks in a row.",
    'tie': "A game is a tie (or draw) if all squares are filled and no player has achieved three in a row.",
    'x': "One player uses 'X' as their mark.",
    'o': "The other player uses 'O' as their mark.",
    'marks': "Players use 'X' and 'O' to mark the squares.",
    'grid': "Tic-Tac-Toe is played on a 3x3 grid of squares.",
    'turn': "Players take turns placing their mark on an empty square.",
  },
  ludo: {
    'how to play': "Ludo (Mini) is a simplified board game. Players select the number of participants (2-4), then take turns rolling a single die. Move your token along the linear board according to the dice roll. Be the first to land exactly on step 20 to win! You must roll the exact number required; you cannot overshoot the final space.",
    'rules': "1. Select number of players (2, 3, or 4). 2. Players take turns rolling a six-sided die. 3. Move your token forward by the number of spaces shown on the die. 4. To win, your token must land exactly on the final space (position 20). 5. If your roll would take you past the final space, you forfeit your move for that turn.",
    'dice': "You roll a standard six-sided die each turn. The number rolled indicates how many spaces you can move your token.",
    'token': "Each player controls one token on the board. The token's position is shown below your player name.",
    'board': "The Ludo (Mini) game is played on a linear board with 20 steps or spaces.",
    'win': "To win Ludo (Mini), be the first player to move your token exactly onto the 20th space. You must roll the exact number needed to land on space 20. If you roll a number that would take you beyond space 20, you do not move.",
    'players': "You can select to play with 2, 3, or 4 players before starting a new game. Use the 'Change Players' button to go back to the selection screen.",
    'move': "After rolling the die, your token automatically moves forward that many spaces, unless the move would take you past the 20th space.",
    'exact roll': "Yes, you need to roll the exact number to land on the 20th space to win. For example, if you are on space 18, you need to roll a 2 to win. Rolling a 3 or more means you don't move that turn.",
    'overshoot': "No, you cannot overshoot the final space (20). If your dice roll is too high, your token stays in its current position for that turn."
  },
  sudoku: {
    'how to play': "Sudoku (4x4) is a logic puzzle. Fill the 4x4 grid so that each row, each column, and each of the four 2x2 subgrids (also called boxes or regions) contain all of the digits from 1 to 4 without repetition. Some cells are pre-filled and cannot be changed.",
    'rules': "The goal is to fill the 4x4 grid with digits 1-4. Each digit must appear exactly once in each row, each column, and each 2x2 subgrid. Click an empty cell, then click a number button (1-4) to place it.",
    'grid': "This version of Sudoku is played on a 4x4 grid, which is divided into four 2x2 subgrids.",
    'numbers': "You need to place the digits 1, 2, 3, and 4 in the empty cells according to the rules.",
    'difficulty': "You can select Easy, Medium, or Hard difficulty before starting. This changes the number of pre-filled cells.",
    'select cell': "To place a number, first click on an empty cell in the grid to select it. The selected cell will be highlighted.",
    'place number': "After selecting an empty cell, click one of the number buttons (1-4) below the grid to place that number into the selected cell.",
    'initial cells': "Cells that are already filled with numbers when the game starts are part of the puzzle and cannot be changed.",
    'win': "You win Sudoku by correctly filling all empty cells according to the rules: each row, column, and 2x2 subgrid must contain each digit from 1 to 4 exactly once.",
    'mistake': "The game doesn't prevent you from making mistakes before the final solution is checked. Double-check your placements to ensure all rules are followed for rows, columns, and 2x2 subgrids."
  },
  chess: {
    'how to play': "Chess (Mini 4x4) is a simplified version of chess. Players take turns moving their pieces. The goal is to capture the opponent's King. White moves first.",
    'rules': "Each piece moves differently. Pawns move one step forward (and capture diagonally forward). Rooks move any number of clear squares horizontally or vertically. Kings move one square in any direction. Capture the opponent's King to win.",
    'pieces': "There are Pawns (♙♟️), Rooks (♖♜), and Kings (♔♚). Each player starts with 2 Pawns, 1 Rook, and 1 King in this mini version.",
    'pawn': "Pawns (♙♟️) move one step forward. They capture one step diagonally forward. They cannot move backward.",
    'rook': "Rooks (♖♜) move any number of clear squares horizontally or vertically. They cannot jump over other pieces.",
    'king': "Kings (♔♚) move one square in any direction (horizontally, vertically, or diagonally). The King is the most important piece; if it's captured, you lose.",
    'move': "To move a piece, first click on one of your pieces. Valid destination squares will typically not be highlighted, but you can click an empty square or an opponent's piece square to attempt a move. If the move is invalid, a message will appear.",
    'capture': "You capture an opponent's piece by moving one of your pieces onto the square occupied by the opponent's piece. The captured piece is removed from the board.",
    'win': "You win the game by capturing the opponent's King. There is no check or checkmate in this simplified version; capturing the King ends the game immediately.",
    'turn': "Players alternate turns, starting with White. You can only move your own pieces on your turn."
  },
  memory: {
    'how to play': "Memory Game involves finding matching pairs of cards. Click to flip two cards at a time. If they match, they stay face up. If not, they flip back down. The goal is to match all pairs.",
    'rules': "Flip two cards. If their values (e.g., letters or symbols) match, they remain revealed. If they don't match, they will flip back over after a short delay. Continue until all pairs are found.",
    'cards': "The game uses a set of cards, with each card value appearing on two cards (a pair). Initially, all cards are face down.",
    'flip': "Click on a face-down card to flip it over and reveal its value. You can flip up to two cards at a time.",
    'match': "A match occurs if the two cards you flip have the same value (e.g., two 'A's). Matched pairs stay face up.",
    'no match': "If the two flipped cards do not match, they will automatically flip back face down after a brief moment.",
    'win': "You win the Memory Game when you have successfully matched all pairs of cards on the board.",
    'moves': "The game counts the number of turns (pairs of cards flipped) you take. Try to win in as few moves as possible!"
  },
  hangman: {
    'how to play': "Hangman is a word guessing game. One player (the computer in this case) thinks of a word, and the other player tries to guess it by suggesting letters within a certain number of guesses.",
    'rules': "Guess letters one at a time to try and figure out the hidden word. Each incorrect guess adds a part to the hangman figure. If the figure is completed (6 incorrect guesses), you lose. Guess all letters in the word before that to win.",
    'guess letter': "You can guess a letter by clicking on the on-screen keyboard buttons or by typing a letter into the input field and pressing Enter or the 'Guess' button.",
    'incorrect guess': "Each time you guess a letter that is not in the word, a part of the hangman figure is drawn. You have 6 incorrect guesses before you lose.",
    'correct guess': "If you guess a letter that is in the word, it will be revealed in its correct position(s) in the word display.",
    'word': "The hidden word is displayed as a series of underscores, one for each letter. Correctly guessed letters fill in these blanks.",
    'win': "You win Hangman by guessing all the letters in the hidden word before the hangman figure is fully drawn (before 6 incorrect guesses).",
    'lose': "You lose if the hangman figure is completed (after 6 incorrect guesses) before you've guessed all the letters in the word. The word will then be revealed.",
    'guesses left': "The game typically shows how many incorrect guesses you've made out of the allowed 6. The hangman figure itself also indicates this.",
    'new word': "You can start a new game with a new word by clicking the 'New Word' or 'Restart Game' button."
  },
  minesweeper: {
    'how to play': "Minesweeper is a puzzle game where you try to clear a board containing hidden 'mines' without detonating any of them. Click on cells to reveal them. If a cell contains a mine, you lose! If it's empty, it will show the number of mines in its adjacent cells (including diagonals).",
    'rules': "Click cells to reveal them. Numbers on revealed cells indicate how many mines are adjacent. Use logic to deduce which cells are safe and which contain mines. You can flag cells you suspect contain mines. Win by revealing all non-mine cells.",
    'reveal cell': "Click on a hidden cell to reveal it. If it's a mine, the game is over. If it's safe, it will either be blank (meaning no adjacent mines) or show a number (1-8) indicating adjacent mines.",
    'mine': "Mines are hidden bombs on the grid. Clicking a mine ends the game. The goal is to reveal all cells that are NOT mines.",
    'flag': "If you suspect a cell contains a mine, you can toggle 'Flag Mode' and then click the cell to place a flag (🚩) on it. This is a reminder and also prevents accidental clicking. Click again in flag mode to unflag.",
    'flag mode': "Use the 'Toggle Flag' button to switch between reveal mode and flag mode. In flag mode, clicking a cell will place or remove a flag.",
    'number': "A number on a revealed cell tells you how many mines are directly adjacent to that cell (horizontally, vertically, or diagonally in the 8 surrounding cells).",
    'empty cell': "If you reveal an empty cell (no number), it means there are no mines adjacent to it. The game will automatically clear all other connected empty cells and their numbered neighbors.",
    'win': "You win Minesweeper by revealing all the safe (non-mine) cells on the board. You don't necessarily have to flag all mines, just clear all safe cells.",
    'lose': "You lose if you click on a cell that contains a mine.",
    'counter': "The counter usually shows the total number of mines on the board minus the number of flags you've placed. This can help you keep track."
  }
};


export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatbotProps {
  currentGame?: keyof Omit<ChatKeywordsData, 'general'>; // Optional: current game context
}

const Chatbot: React.FC<ChatbotProps> = ({ currentGame }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase().trim();
    let response = "I'm sorry, I'm not sure how to help with that. Try asking for 'help' or about a specific game like 'how to play tic tac toe?'."; // Default fallback

    // Check current game specific keywords first
    if (currentGame && chatKeywords[currentGame]) {
      const gameSpecificResponses = chatKeywords[currentGame] as GameResponses;
      for (const keyword in gameSpecificResponses) {
        if (lowerInput.includes(keyword)) {
          return gameSpecificResponses[keyword];
        }
      }
    }

    // Check general keywords if no game-specific match or no current game
    for (const keyword in chatKeywords.general) {
      if (lowerInput.includes(keyword)) {
        return chatKeywords.general[keyword];
      }
    }

    // A simple way to detect if a game name is mentioned if no specific keywords are found
    // This will be improved when more game content is added
    const gameNames: (keyof Omit<ChatKeywordsData, 'general'>)[] = ['tictactoe', 'ludo', 'sudoku', 'chess', 'memory', 'hangman', 'minesweeper'];
    for (const name of gameNames) {
        if (lowerInput.includes(name)) {
            return `Ah, you're asking about ${name}! What would you like to know? (e.g., 'rules for ${name}', 'how to win ${name}')`;
        }
    }

    return response;
  };

  const handleSendMessage = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString() + '-user',
      text: userInput,
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Simulate bot thinking and then respond
    setTimeout(() => {
      const botResponseText = getBotResponse(userInput);
      const botMessage: Message = {
        id: Date.now().toString() + '-bot',
        text: botResponseText,
        sender: 'bot',
      };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 500);

    setUserInput('');
  };

  useEffect(() => {
    if (isOpen) {
        setMessages([{id: 'initial-bot', text: "Hi! I'm the GameBot. Ask me how to play a game!", sender: 'bot'}]);
    } else {
        setMessages([]); // Clear messages when closing
    }
  }, [isOpen]);


  if (!isOpen) {
    return (
      <button className="chatbot-toggle-button open" onClick={() => setIsOpen(true)} aria-label="Open Chat" data-testid="chatbot-toggle-button">
        <ChatIcon />
      </button>
    );
  }

  return (
    <div className="chatbot-window" data-testid="chatbot-window">
      <div className="chatbot-header" data-testid="chatbot-header">
        <h3>GameBot Helper</h3>
        <button className="chatbot-close-button" onClick={() => setIsOpen(false)} aria-label="Close Chat" data-testid="chatbot-close-button">
          <CloseIcon />
        </button>
      </div>
      <div className="chatbot-messages" data-testid="chatbot-messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`} data-testid={`message-${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-form" onSubmit={handleSendMessage} data-testid="chatbot-input-form">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about a game..."
          aria-label="Chat input"
          data-testid="chatbot-input"
        />
        <button type="submit" data-testid="chatbot-send-button">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
