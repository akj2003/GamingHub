import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if necessary
import './Login.css';

const Login: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async () => {
    if (loading) return;
    setErrorMessage(null); // Clear previous errors
    try {
      await signInWithGoogle();
      // User will be redirected or state will update via AuthContext
    } catch (error) {
      console.error("Login failed:", error);
      // Set a user-friendly error message
      if (error instanceof Error) {
        // Basic error message, can be customized based on error types
        setErrorMessage(`Login failed: ${error.message}. Please try again.`);
      } else {
        setErrorMessage("Login failed due to an unknown error. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to Gaming Hub!</h1>
        <p className="login-subtitle">Please sign in to continue.</p>
        {errorMessage && (
          <p className="login-error-message" role="alert">
            {errorMessage}
          </p>
        )}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="login-button google-login-button"
        >
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>
      </div>
    </div>
  );
};

export default Login;
