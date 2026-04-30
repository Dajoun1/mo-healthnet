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
                id: response.data.userId,
                userId: response.data.userId,
                role: response.data.role,
                username: response.data.email,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                phone: response.data.phone || "",
                streetAddress: response.data.streetAddress || "",
                city: response.data.city || "",
                state: response.data.state || "",
                zipCode: response.data.zipCode || "",
                birthDate: response.data.birthDate || "",
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
            const status = error.response?.status;
            // Never expose raw backend errors to the UI
            if (status === 401 || status === 403) {
                throw { message: 'Invalid email or password. Please try again.' };
            }
            throw { message: 'Unable to sign in. Please try again later.' };
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return { success: true, data: response.data };
        } catch (error) {
            const status = error.response?.status;
            if (status === 409) {
                throw { message: 'An account with this email already exists.' };
            }
            throw { message: 'Unable to create account. Please try again later.' };
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


export const applicationService = {
    /**
     * Submit application
     * @param {FormData} formData - The application data including file upload
     * @returns {Promise} Response from server
     */
    submitApplication: async (formData) => {
        try {
            // For FormData
            const response = await api.post('/applications/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`Upload progress: ${percentCompleted}%`);
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Application submission failed' };
        }
    },

    /**
     * Get application status by ID
     * @param {string} applicationId - The application ID
     * @returns {Promise} Application status
     */
    getApplicationStatus: async (applicationId) => {
        try {
            const response = await api.get(`/applications/${applicationId}/status`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch application status' };
        }
    },

    /**
     * Get all applications for current user
     * @returns {Promise} List of user's applications
     */
    getUserApplications: async () => {
        try {
            const response = await api.get('/applications/my-applications');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch applications' };
        }
    },

    /**
     * Withdraw an application
     * @param {string} applicationId - The application ID
     * @returns {Promise} Response
     */
    withdrawApplication: async (applicationId) => {
        try {
            const response = await api.post(`/applications/${applicationId}/withdraw`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to withdraw application' };
        }
    },
};

export default api;