import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../api';
import * as apiModule from '../api';

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

            apiModule.default.post = vi.fn().mockResolvedValue(mockResponse);

            const result = await authService.login(mockCredentials);

            expect(apiModule.default.post).toHaveBeenCalledWith('/auth/login', mockCredentials);
            expect(localStorage.getItem('token')).toBe('fake-token');
            // The service normalises the user object (adds role), so use objectContaining
            expect(JSON.parse(localStorage.getItem('user'))).toMatchObject({
                id: 1,
                email: 'test@test.com',
            });
            expect(result.user).toMatchObject({ id: 1, email: 'test@test.com' });
        });

        it('throws a generic error when login fails with no status', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'wrong' };
            // No response.status → falls through to the generic catch branch
            const mockError = { response: { data: { message: 'Invalid credentials' } } };

            apiModule.default.post = vi.fn().mockRejectedValue(mockError);

            await expect(authService.login(mockCredentials)).rejects.toMatchObject({
                message: 'Unable to sign in. Please try again later.',
            });
            expect(localStorage.getItem('token')).toBeNull();
        });

        it('throws a 401 error message when credentials are wrong', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'wrong' };
            const mockError = { response: { status: 401, data: {} } };

            apiModule.default.post = vi.fn().mockRejectedValue(mockError);

            await expect(authService.login(mockCredentials)).rejects.toMatchObject({
                message: 'Invalid email or password. Please try again.',
            });
        });

        it('throws a generic error on network failure', async () => {
            const mockCredentials = { email: 'test@test.com', password: 'password' };

            apiModule.default.post = vi.fn().mockRejectedValue(new Error('Network Error'));

            await expect(authService.login(mockCredentials)).rejects.toMatchObject({
                message: 'Unable to sign in. Please try again later.',
            });
        });
    });

    describe('logout', () => {
        it('removes token and user from localStorage', () => {
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
            expect(authService.getCurrentUser()).toBeNull();
        });

        it('returns null when localStorage has invalid JSON', () => {
            localStorage.setItem('user', 'invalid-json');
            expect(authService.getCurrentUser()).toBeNull();
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