/// <reference types="vitest/globals" />
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // To wrap App
import { vi } from 'vitest';

// Declare variables that will hold the mock functions.
// These will be populated by the vi.mock factory.
let mockSignInWithPopupFn: ReturnType<typeof vi.fn>;
let mockSignOutFn: ReturnType<typeof vi.fn>;
let capturedOnAuthStateChangedCallback: ((user: any) => void) | null = null;

const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>();

  // Create the mock functions INSIDE the factory
  const signInPopupInstance = vi.fn();
  const signOutInstance = vi.fn();

  // Assign them to the module-scoped variables
  mockSignInWithPopupFn = signInPopupInstance;
  mockSignOutFn = signOutInstance;

  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth: any, callback: (user: any) => void) => {
      capturedOnAuthStateChangedCallback = callback;
      return vi.fn();
    }),
    signInWithPopup: signInPopupInstance,
    signOut: signOutInstance,
    GoogleAuthProvider: vi.fn().mockImplementation(() => ({})),
  };
});

// Mock Login component (remains the same)
vi.mock('./components/Login', () => ({
  default: () => <div data-testid="login-component">Login Component Mock</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    mockSignInWithPopupFn.mockClear().mockResolvedValue({ user: mockUser });
    mockSignOutFn.mockClear().mockResolvedValue(undefined);
    capturedOnAuthStateChangedCallback = null;
  });

  // Test cases remain the same as they already use the module-scoped variable names.
  // Ensure they correctly use `mockSignInWithPopupFn` and `mockSignOutFn`.

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
    expect(mockSignInWithPopupFn).toHaveBeenCalledTimes(1);
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
    expect(mockSignOutFn).toHaveBeenCalledTimes(1);
  });
});
