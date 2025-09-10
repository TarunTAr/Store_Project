// src/services/auth.service.js
// Minimal stub so authSlice / components can import without failing.
// Replace HTTP calls with real API later.

const authService = {
  login: async (credentials) => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 200));
    // Return a fake response — replace with fetch/axios to real API
    return {
      token: 'fake.jwt.token',
      user: { id: 1, name: 'Demo User', email: 'demo@example.com', role: 'USER' }
    };
  },

  logout: async () => {
    // clear client state if needed
    return true;
  },

  getProfile: async () => {
    return { id: 1, name: 'Demo User', email: 'demo@example.com', role: 'USER' };
  }
};

export default authService;
