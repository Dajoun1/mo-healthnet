
import api from './api';

export const adminApi = {

    //  Get all users with pagination and sorting

    getAllUsers: async (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') => {
        try {
            const response = await api.get('/api/admin/users', {
                params: { page, size, sortBy, sortDir }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch users' };
        }
    },

    //   Search users by name or email
    searchUsers: async (term, page = 0, size = 10) => {
        try {
            const response = await api.get('/api/admin/users/search', {
                params: { term, page, size }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to search users' };
        }
    },

    //   Get user by ID
    getUserById: async (userId) => {
        try {
            const response = await api.get(`/api/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch user' };
        }
    },

    //   Get users by role with pagination
    getUsersByRole: async (role, page = 0, size = 10) => {
        try {
            const response = await api.get(`/api/admin/users/role/${role}`, {
                params: { page, size }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch users by role' };
        }
    },


    //  Get users by status

    getUsersByStatus: async (status) => {
        try {
            const response = await api.get(`/api/admin/users/status/${status}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch users by status' };
        }
    },


    //   Update user role

    updateUserRole: async (userId, role) => {
        try {
            const response = await api.put(`/api/admin/users/${userId}/role`, { role });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user role' };
        }
    },


    //   Update user status

    updateUserStatus: async (userId, status) => {
        try {
            const response = await api.put(`/api/admin/users/${userId}/status`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user status' };
        }
    },

    //  Delete user
    deleteUser: async (userId) => {
        try {
            const response = await api.delete(`/api/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to delete user' };
        }
    },

    //   Update user information (name and email)

    updateUserInfo: async (userId, userData) => {
        try {
            const response = await api.put(`/api/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user info' };
        }
    },

    //  Get user statistics for dashboard

    getStatistics: async () => {
        try {
            const response = await api.get('/api/admin/statistics');
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch statistics' };
        }
    },


    //  Bulk update user statuses

    bulkUpdateStatus: async (userIds, status) => {
        try {
            const response = await api.put('/api/admin/users/bulk-status', { userIds, status });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update user statuses' };
        }
    }
};