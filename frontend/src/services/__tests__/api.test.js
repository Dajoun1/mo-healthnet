import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../api';
import api from '../api';

// Mock axios
vi.mock('axios', () => ({
    default: {
        create: vi.fn(() => ({
            post: vi.fn(),
            interceptors: {
                request: { use: vi.fn() },
                response: { use: vi.fn() },
            },
        })),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    describe('login', () => {
        it('successfully logs in and stores token and user', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'password' };
            const mockResponse = {
                data: {
                    token: 'fake-token',
                    user: { id: 1, email: 'test@test.com' },
                },
            };

            // Mock the post request
            api.post = vi.fn().mockResolvedValue(mockResponse);

            const result = await authService.login(mockCredentials);

            expect(api.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
            expect(localStorage.getItem('token')).toBe('fake-token');
            expect(JSON.parse(localStorage.getItem('user'))).toEqual(mockResponse.data.user);
            expect(result).toEqual(mockResponse.data);
        });

        it('throws error when login fails', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'wrong' };
            const mockError = {
                response: {
                    data: { message: 'Invalid credentials' },
                },
            };

            api.post = vi.fn().mockRejectedValue(mockError);

            await expect(authService.login(mockCredentials)).rejects.toEqual({
                message: 'Invalid credentials',
            });
            expect(localStorage.getItem('token')).toBeNull();
        });

        it('handles network errors', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'password' };

            api.post = vi.fn().mockRejectedValue(new Error('Network Error'));

            await expect(authService.login(mockCredentials)).rejects.toEqual({
                message: 'Login failed',
            });
        });
    });

    describe('logout', () => {
        it('removes token and user from localStorage', () => {
            // Set items first
            localStorage.setItem('token', 'fake-token');
            localStorage.setItem('user', JSON.stringify({ id: 1 }));

            authService.logout();

            expect(localStorage.getItem('token')).toBeNull();
            expect(localStorage.getItem('user')).toBeNull();
        });
    });

    describe('getCurrentUser', () => {
        it('returns user from localStorage', () => {
            const mockUser = { id: 1, email: 'test@test.com' };
            localStorage.setItem('user', JSON.stringify(mockUser));

            const user = authService.getCurrentUser();

            expect(user).toEqual(mockUser);
        });

        it('returns null when no user in localStorage', () => {
            const user = authService.getCurrentUser();
            expect(user).toBeNull();
        });

        it('returns null when localStorage has invalid JSON', () => {
            localStorage.setItem('user', 'invalid-json');

            const user = authService.getCurrentUser();
            expect(user).toBeNull();
        });
    });

    describe('isAuthenticated', () => {
        it('returns true when token exists', () => {
            localStorage.setItem('token', 'fake-token');

            expect(authService.isAuthenticated()).toBe(true);
        });

        it('returns false when no token exists', () => {
            expect(authService.isAuthenticated()).toBe(false);
        });
    });
});