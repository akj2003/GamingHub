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
      <button className="chatbot-toggle-button open" onClick={() => setIsOpen(true)} aria-label="Open Chat">
        <ChatIcon />
      </button>
    );
  }

  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <h3>GameBot Helper</h3>
        <button className="chatbot-close-button" onClick={() => setIsOpen(false)} aria-label="Close Chat">
          <CloseIcon />
        </button>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message message-${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="chatbot-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about a game..."
          aria-label="Chat input"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chatbot;
