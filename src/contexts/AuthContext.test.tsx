// src/contexts/AuthContext.test.tsx
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
import { beforeEach, describe, expect, test, vi } from 'vitest'; // Vitest's utility for mocking

// --- Mock 'firebase/auth' ---
// This is the core of testing AuthContext
let mockOnAuthStateChangedCallback: ((user: any) => void) | null = null;
const mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
const mockSignOut = vi.fn(() => Promise.resolve());
const mockSignInWithPopup = vi.fn(() => Promise.resolve({ user: mockUser }));

vi.mock('firebase/auth', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/auth')>(); // Import actual types
  return {
    ...actual, // Spread actual to keep other exports like GoogleAuthProvider
    getAuth: vi.fn(() => ({
      // Mock whatever getAuth() returns that your AuthContext uses, if any beyond onAuthStateChanged itself
    })),
    onAuthStateChanged: vi.fn((_: any, callback: (user: any) => void) => {
      mockOnAuthStateChangedCallback = callback; // Store the callback
      // Simulate initial state (no user, then Firebase initializes)
      // In a real scenario, Firebase might take a moment, then call this.
      // For testing, we often trigger it manually.
      // setTimeout(() => callback(null), 0); // Initial call with null
      return vi.fn(); // Return a mock unsubscribe function
    }),
    signInWithPopup: mockSignInWithPopup,
    signOut: mockSignOut,
    // Ensure GoogleAuthProvider is available if your code instantiates it directly
    GoogleAuthProvider: vi.fn().mockImplementation(() => ({
        // providerId: 'google.com' // Example property
    })),
  };
});

// Helper component to consume and display context values
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
    vi.clearAllMocks();
    mockOnAuthStateChangedCallback = null;
    // Default to no user logged in for onAuthStateChanged for most tests
    // We will manually trigger it with a user or null as needed.
  });

  test('initial state is loading and no user', () => {
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    // AuthProvider initially sets loading to true.
    // The TestConsumerComponent will render "Loading..." because AuthProvider's children
    // are only rendered when its own loading state (from onAuthStateChanged) is false.
    // However, the useAuth() hook itself provides its own loading state.
    // Let's refine this to check the hook's direct output.

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
    expect(screen.getByText('Loading...')).toBeInTheDocument(); // Initial loading state from AuthProvider

    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(mockUser);
      }
    });

    await waitFor(() => {
      expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument();
    });
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('clears user when onAuthStateChanged provides null', async () => {
    // Start with a user
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(mockUser); // Login first
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());

    // Then log out
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(null);
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
    // Initial state: loading, then no user
    act(() => {
      if (mockOnAuthStateChangedCallback) mockOnAuthStateChangedCallback(null);
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());

    const loginButton = screen.getByText('Login with Google');
    await act(async () => {
      await userEvent.click(loginButton);
    });

    expect(mockSignInWithPopup).toHaveBeenCalledTimes(1);
    // After signInWithPopup, onAuthStateChanged should be triggered by Firebase
    // Simulate this:
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());
  });

  test('logout calls signOut and clears user on success', async () => {
    // Start logged in
    render(
      <AuthProvider>
        <TestConsumerComponent />
      </AuthProvider>
    );
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());

    const logoutButton = screen.getByText('Logout');
    await act(async () => {
      await userEvent.click(logoutButton);
    });

    expect(mockSignOut).toHaveBeenCalledTimes(1);
    // After signOut, onAuthStateChanged should be triggered
    act(() => {
      if (mockOnAuthStateChangedCallback) {
        mockOnAuthStateChangedCallback(null);
      }
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());
  });
});
