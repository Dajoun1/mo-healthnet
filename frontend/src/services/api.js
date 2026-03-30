import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const normalizeRole = (role) => {
    const value = (role || '').toString().trim();
    if (!value) return null;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || '';

        // Let the sign-in form handle invalid credentials inline.
        if (status === 401 && !requestUrl.includes('/auth/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/signin';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    testLogin: async () => {
        try {
            const response = await api.get('/auth/login');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Connection failed' };
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);

            const responseUser = response.data.user || {
                role: response.data.role,
                username: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
            };

            const user = {
                ...responseUser,
                role: normalizeRole(responseUser.role),
            };

            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            localStorage.setItem('user', JSON.stringify(user));

            return {
                ...response.data,
                user,
            };
        } catch (error) {
            throw error.response?.data || { message: 'Login failed' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    register: async (registrationData) => {
        try {
            const response = await api.post('/auth/register', registrationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    completeProfile: async (profileData) => {
        try {
            const response = await api.post('/auth/complete-profile', profileData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Profile completion failed' };
        }
    },

    getCurrentUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch {
            return null;
        }
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('user') || !!localStorage.getItem('token');
    },

    // Helper to get user role
    getUserRole: () => {
        const user = authService.getCurrentUser();
        return user?.role || null;
    }
};

export default api;