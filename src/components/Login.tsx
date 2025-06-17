import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Adjust path if necessary
import './Login.css'; // We'll create this basic CSS file next

const Login: React.FC = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleLogin = async () => {
    if (loading) return;
    try {
      await signInWithGoogle();
      // User will be redirected or state will update via AuthContext
    } catch (error) {
      console.error("Login failed:", error);
      // Potentially display an error message to the user here
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome to Gaming Hub!</h1>
        <p className="login-subtitle">Please sign in to continue.</p>
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
