// src/contexts/AuthContext.test.tsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { vi } from 'vitest';

// 1. Define the mock function instances and shared variables for tests FIRST
const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
const mockSignInWithPopupFn = vi.fn(); // Renamed to avoid confusion if re-imported
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

// Helper component (TestConsumerComponent) remains the same
const TestConsumerComponent = () => {
  const auth = useAuth();
  if (auth.loading) return <div>Loading...</div>;
  return (
    <div>
      {auth.currentUser ? (
        <div>
          <p>User: {auth.currentUser.displayName || auth.currentUser.email}</p>
          <button onClick={auth.logout}>Logout</button>
        </div>
      ) : (
        <button onClick={auth.signInWithGoogle}>Login with Google</button>
      )}
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    // Reset mocks and callback before each test
    mockSignInWithPopupFn.mockClear().mockResolvedValue({ user: mockUser }); // Default to successful login
    mockSignOutFn.mockClear().mockResolvedValue(undefined); // Default to successful logout
    capturedOnAuthStateChangedCallback = null;
  });

  // Test cases remain largely the same but use `mockSignInWithPopupFn`, `mockSignOutFn`,
  // and `capturedOnAuthStateChangedCallback`

  test('initial state is loading and no user', () => {
    let authHookValues: any;
    const DirectConsumer = () => {
      authHookValues = useAuth();
      return null;
    };
    render(<AuthProvider><DirectConsumer /></AuthProvider>);
    expect(authHookValues.loading).toBe(true);
    expect(authHookValues.currentUser).toBeNull();
  });

  test('sets user when onAuthStateChanged provides a user', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    // AuthProvider's internal loading state makes it render nothing until its onAuthStateChanged runs.
    // The TestConsumerComponent then shows "Loading..." from its own useAuth().loading.
    // The initial assertion for "Loading..." from TestConsumerComponent is correct.
    expect(screen.getByText('Loading...')).toBeInTheDocument();

    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(mockUser);
      }
    });

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('clears user when onAuthStateChanged provides null', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(mockUser); // Login first
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());

    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(null); // Then log out via auth state change
      }
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());
  });

  test('signInWithGoogle calls signInWithPopup and updates user on success', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    act(() => { // Ensure initial logged-out state is processed
      if (capturedOnAuthStateChangedCallback) capturedOnAuthStateChangedCallback(null);
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());

    const loginButton = screen.getByText('Login with Google');
    await act(async () => {
      await userEvent.click(loginButton);
    });

    expect(mockSignInWithPopupFn).toHaveBeenCalledTimes(1);
    // Simulate onAuthStateChanged being called by Firebase after successful popup
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());
  });

  test('logout calls signOut and clears user on success', async () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    act(() => { // Start logged in
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    expect(mockSignOutFn).toHaveBeenCalledTimes(1);
    // Simulate onAuthStateChanged being called by Firebase after successful sign out
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(null);
      }
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());
  });
});
