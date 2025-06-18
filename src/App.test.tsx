// src/App.test.tsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // To wrap App
import { vi, describe, test, expect, beforeEach } from 'vitest';

// 1. Define the mock function instances and shared variables for tests FIRST
const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
const mockSignInWithPopupFn = vi.fn(); // Renamed to avoid confusion
const mockSignOutFn = vi.fn();
let capturedOnAuthStateChangedCallback: ((user: any) => void) | null = null;

// 2. Now, mock 'firebase/auth' using these pre-defined functions
vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();
  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((auth: any, callback: (user: any) => void) => {
      capturedOnAuthStateChangedCallback = callback;
      return vi.fn(); // Return a mock unsubscribe function
    }),
    signInWithPopup: mockSignInWithPopupFn, // Use the function defined above
    signOut: mockSignOutFn, // Use the function defined above
    GoogleAuthProvider: vi.fn().mockImplementation(() => ({})),
  };
});

// Mock Login component (remains the same)
vi.mock('./components/Login', () => ({
  default: () => <div data-testid="login-component">Login Component Mock</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    // Reset mocks and callback before each test
    mockSignInWithPopupFn.mockClear().mockResolvedValue({ user: mockUser });
    mockSignOutFn.mockClear().mockResolvedValue(undefined);
    capturedOnAuthStateChangedCallback = null;
  });

  // Test cases remain largely the same but use the new mock variable names
  // (e.g., capturedOnAuthStateChangedCallback, mockSignInWithPopupFn, mockSignOutFn)

  test('shows loading screen initially when onAuthStateChanged has not yet fired', () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    expect(screen.getByText('Loading Application...')).toBeInTheDocument();
  });

  test('shows Login page and Login button in header when not authenticated after loading', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(null);
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
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => {
      expect(screen.getByText(`Hi, ${mockUser.displayName}`)).toBeInTheDocument();
      expect(screen.getByText('🎲 Gaming Hub')).toBeInTheDocument();
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
    act(() => {
      if (capturedOnAuthStateChangedCallback) capturedOnAuthStateChangedCallback(null);
    });
    await waitFor(() => expect(screen.getByTestId('login-component')).toBeInTheDocument());

    const loginHeaderButton = screen.getByRole('button', { name: /Login with Google/i });
    await act(async () => {
      await userEvent.click(loginHeaderButton);
    });
    expect(mockSignInWithPopupFn).toHaveBeenCalledTimes(1); // Use updated mock name
  });

  test('Logout button calls signOut', async () => {
    render(
      <AuthProvider>
        <App />
      </AuthProvider>
    );
    act(() => {
      if (capturedOnAuthStateChangedCallback) capturedOnAuthStateChangedCallback(mockUser);
    });
    await waitFor(() => expect(screen.getByText(`Hi, ${mockUser.displayName}`)).toBeInTheDocument());

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await act(async () => {
      await userEvent.click(logoutButton);
    });
    expect(mockSignOutFn).toHaveBeenCalledTimes(1); // Use updated mock name
  });
});
