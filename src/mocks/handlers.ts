// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

// This is a simplified mock. Actual Firebase SDK calls are more complex (often not plain HTTP).
// For onAuthStateChanged, we often need to mock the Firebase app/auth module directly
// rather than HTTP requests. MSW can mock modules too, but it's more advanced.
// For now, we'll set up basic MSW structure. Actual Firebase mocking for onAuthStateChanged
// might need to be done by directly mocking 'firebase/auth' in test files or a global setup.

// Placeholder for user state. In a real test setup, you'd manipulate this.
let mockUser: { uid: string; email: string; displayName?: string } | null = null;

// --- IMPORTANT NOTE ---
// Mocking Firebase Auth, especially onAuthStateChanged, with MSW at the network level is tricky
// because onAuthStateChanged doesn't make a predictable HTTP request that MSW can easily catch
// for its primary use case. It's a subscription to an event emitter within the Firebase SDK.
//
// A more common and effective way to test components relying on Firebase Auth is to
// mock the 'firebase/auth' module itself using Vitest/Jest's mocking capabilities
// (e.g., vi.mock or jest.mock).
//
// This MSW setup here is more illustrative of MSW's general structure.
// We will likely need to combine this with module mocks in the actual test files.

export const handlers = [
  // Example: Mocking a generic auth check endpoint (IF Firebase made one like this)
  http.get('/api/auth/status', () => {
    if (mockUser) {
      return HttpResponse.json({ loggedIn: true, user: mockUser });
    }
    return HttpResponse.json({ loggedIn: false });
  }),

  // Example: Mocking a login endpoint
  http.post('/api/auth/login', async () => {
    // In a real scenario, you might extract credentials from request.json()
    mockUser = { uid: '123', email: 'test@example.com', displayName: 'Test User' };
    // This wouldn't automatically trigger onAuthStateChanged in real Firebase.
    // That's why module mocking is often preferred for Firebase Auth.
    return HttpResponse.json(mockUser);
  }),

  http.post('/api/auth/logout', () => {
    mockUser = null;
    return HttpResponse.json({ success: true });
  }),
];

// Helper to simulate setting user for tests (won't directly trigger onAuthStateChanged)
export const setMockUser = (user: typeof mockUser) => {
  mockUser = user;
};
