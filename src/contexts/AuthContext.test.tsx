/// <reference types="vitest/globals" />
import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from './AuthContext';
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

  // Assign them to the module-scoped variables so tests can access the same instances
  mockSignInWithPopupFn = signInPopupInstance;
  mockSignOutFn = signOutInstance;

  return {
    ...actual,
    getAuth: vi.fn(() => ({})),
    onAuthStateChanged: vi.fn((_auth: any, callback: (user: any) => void) => {
      capturedOnAuthStateChangedCallback = callback;
      return vi.fn();
    }),
    signInWithPopup: signInPopupInstance, // Use the factory-scoped instance for the mock's return
    signOut: signOutInstance,           // Use the factory-scoped instance for the mock's return
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
    // It's crucial that these mock functions are defined before beforeEach runs.
    // The vi.mock factory ensures they are.
    mockSignInWithPopupFn.mockClear().mockResolvedValue({ user: mockUser });
    mockSignOutFn.mockClear().mockResolvedValue(undefined);
    capturedOnAuthStateChangedCallback = null;
  });

  // Test cases remain the same (they already use mockSignInWithPopupFn, mockSignOutFn, etc.)

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
        capturedOnAuthStateChangedCallback(mockUser);
      }
    });
    await waitFor(() => expect(screen.getByText(`User: ${mockUser.displayName}`)).toBeInTheDocument());

    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(null);
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
    act(() => {
      if (capturedOnAuthStateChangedCallback) capturedOnAuthStateChangedCallback(null);
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());

    const loginButton = screen.getByText('Login with Google');
    await act(async () => {
      await userEvent.click(loginButton);
    });

    expect(mockSignInWithPopupFn).toHaveBeenCalledTimes(1);
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
    act(() => {
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
    act(() => {
      if (capturedOnAuthStateChangedCallback) {
        capturedOnAuthStateChangedCallback(null);
      }
    });
    await waitFor(() => expect(screen.getByText('Login with Google')).toBeInTheDocument());
  });
});
