import React from 'react';
import './FloatingActionButton.css';

interface FloatingActionButtonProps {
  email: string;
  subject: string;
  body?: string;
  buttonText?: string; // Optional text for the button
}

const EmailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  email,
  subject,
  body = '',
  buttonText = '',
}) => {
  const handleFabClick = () => {
    let mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    if (body) {
      mailtoLink += `&body=${encodeURIComponent(body)}`;
    }
    window.location.href = mailtoLink;
  };

  return (
    <button
      className="fab-contact-us"
      onClick={handleFabClick}
      title="Contact Us" // Tooltip for accessibility
      aria-label={buttonText}
    >
      <EmailIcon />
      <span className="fab-text">{buttonText}</span>
    </button>
  );
};

export default FloatingActionButton;
