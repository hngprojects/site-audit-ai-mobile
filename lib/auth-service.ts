import type { AuthResponse, SignInCredentials, SignUpCredentials } from '@/type';

/**
 * Simulates an API call for authentication
 * In a real app, this would make an HTTP request to your backend
 */

const SIMULATED_DELAY = 1500; // 1.5 seconds to simulate network delay

// Mock user database (in real app, this would be on the server)
const mockUsers: Map<string, { password: string; user: AuthResponse['user'] }> = new Map();

export const authService = {
  /**
   * Sign in with email and password
   */
  async signIn(credentials: SignInCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password } = credentials;

        // Validate input
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // Check if user exists
        const userData = mockUsers.get(email.toLowerCase());

        if (!userData) {
          reject(new Error('Invalid email or password'));
          return;
        }

        if (userData.password !== password) {
          reject(new Error('Invalid email or password'));
          return;
        }

        // Generate mock token
        const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        resolve({
          user: userData.user,
          token,
        });
      }, SIMULATED_DELAY);
    });
  },

  /**
   * Sign up with email, password, and full name
   */
  async signUp(credentials: SignUpCredentials): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const { email, password, fullName } = credentials;

        // Validate input
        if (!email || !password) {
          reject(new Error('Email and password are required'));
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          reject(new Error('Invalid email format'));
          return;
        }

        // Validate password length
        if (password.length < 6) {
          reject(new Error('Password must be at least 6 characters'));
          return;
        }

        // Check if user already exists
        if (mockUsers.has(email.toLowerCase())) {
          reject(new Error('User with this email already exists'));
          return;
        }

        // Create new user
        const newUser = {
          id: `user_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          email: email.toLowerCase(),
          fullName: fullName || '',
          createdAt: new Date().toISOString(),
        };

        // Store user in mock database
        mockUsers.set(email.toLowerCase(), {
          password,
          user: newUser,
        });

        // Generate mock token
        const token = `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`;

        resolve({
          user: newUser,
          token,
        });
      }, SIMULATED_DELAY);
    });
  },

  /**
   * Sign out (clears session)
   */
  async signOut(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  },

  /**
   * Verify token (simulate token validation)
   */
  async verifyToken(token: string): Promise<AuthResponse['user'] | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would validate the token with the server
        // For simulation, we'll just check if it's a valid format
        if (token && token.startsWith('mock_token_')) {
          // Find user by token (in real app, token would contain user info)
          // For simulation, we'll return null and let the app handle re-authentication
          resolve(null);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },
};

