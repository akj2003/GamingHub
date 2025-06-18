// src/App.test.tsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // To wrap App
import { vi, describe, test, expect, beforeEach } from 'vitest';

// --- Mock 'firebase/auth' ---
let mockOnAuthStateChangedCallback: ((user: any) => void) | null = null;
const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
const mockSignOut = vi.fn(() => Promise.resolve());
const mockSignInWithPopup = vi.fn(() => Promise.resolve({ user: mockUser }));

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual, // Spread to keep other exports like GoogleAuthProvider
    getAuth: vi.fn(() => ({
      // Mock any specific properties of the auth object if needed by AuthContext
    })),
    onAuthStateChanged: vi.fn((_auth: any, callback: (user: any) => void) => {
      mockOnAuthStateChangedCallback = callback; // Capture the callback
      // Tests will manually trigger this callback to simulate auth states
      return vi.fn(); // Return a mock unsubscribe function
    }),
    signInWithPopup: mockSignInWithPopup,
    signOut: mockSignOut,
    GoogleAuthProvider: vi.fn().mockImplementation(() => ({
      // Mock any properties of GoogleAuthProvider instance if needed
    })),
  };
});

// Mock Login component as its internals are not the focus of App.test.tsx
vi.mock('./components/Login', () => ({
  default: () => <div data-testid="login-component">Login Component Mock</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset call counts for these mocks before each test
    mockSignInWithPopup.mockClear();
    mockSignOut.mockClear();
    // Nullify the callback so each test run correctly captures the new one from AuthProvider
    mockOnAuthStateChangedCallback = null;
  });

  test('shows loading screen initially when onAuthStateChanged has not yet fired', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // At this point, AuthContext loading is true, and onAuthStateChanged mock has not called back
    expect(screen.getByText('Loading Application...')).toBeInTheDocument();
  });

  test('shows Login page and Login button in header when not authenticated after loading', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // Simulate Firebase finishing loading and finding no user
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(null);
      }
    });

    await waitFor(() => {
      expect(screen.getByTestId('login-component')).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading Application...')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login with Google/i })).toBeInTheDocument();
  });

  test('shows main app content and user info in header when authenticated after loading', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    // Simulate Firebase finishing loading and finding a user
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(mockUser);
      }
    });

    await waitFor(() => {
      expect(screen.getByText(`Hi, ${mockUser.displayName}`)).toBeInTheDocument();
      expect(screen.getByText('🎲 Gaming Hub')).toBeInTheDocument(); // Main title
    });
    expect(screen.queryByTestId('login-component')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading Application...')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('Login button in header calls signInWithGoogle', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    act(() => { // Ensure logged out state after initial load
      if (mockOnAuthStateChangedCallback) mockOnAuthStateChangedCallback(null);
    });
    await waitFor(() => expect(screen.getByTestId('login-component')).toBeInTheDocument());

    const loginHeaderButton = screen.getByRole('button', { name: /Login with Google/i });
    await act(async () => {
      await userEvent.click(loginHeaderButton);
    });
    expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
  });

  test('Logout button calls signOut', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    act(() => { // Log in the user
      if (mockOnAuthStateChangedCallback) mockOnAuthStateChangedCallback(mockUser);
    });
    await waitFor(() => expect(screen.getByText(`Hi, ${mockUser.displayName}`)).toBeInTheDocument());

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await act(async () => {
      await userEvent.click(logoutButton);
    });
    expect(mockSignOut).toHaveBeenCalledTimes(1);
  });
});
