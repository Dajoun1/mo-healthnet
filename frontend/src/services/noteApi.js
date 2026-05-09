import api from './api';

export const noteApi = {
    // Employee endpoints
    createNote: async (noteData, userId) => {
        try {
            const response = await api.post('/api/notes', noteData, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return {
                success: true,
                data: response.data,
                message: 'Note created successfully'
            };
        } catch (error) {
            console.error('Create note error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to create note',
                status: error.response?.status
            };
        }
    },

    updateNote: async (noteId, noteData, userId) => {
        try {
            const response = await api.put(`/api/notes/${noteId}`, noteData, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return {
                success: true,
                data: response.data,
                message: 'Note updated successfully'
            };
        } catch (error) {
            console.error('Update note error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to update note',
                status: error.response?.status
            };
        }
    },

    deleteNote: async (noteId, userId) => {
        try {
            await api.delete(`/api/notes/${noteId}`, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return {
                success: true,
                message: 'Note deleted successfully'
            };
        } catch (error) {
            console.error('Delete note error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to delete note',
                status: error.response?.status
            };
        }
    },

    archiveNote: async (noteId, userId) => {
        try {
            const response = await api.patch(`/api/notes/${noteId}/archive`, {}, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return {
                success: true,
                data: response.data,
                message: 'Note archived successfully'
            };
        } catch (error) {
            console.error('Archive note error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Failed to archive note',
                status: error.response?.status
            };
        }
    },

    getMyNotes: async (userId) => {
        try {
            const response = await api.get('/api/notes/employee/my-notes', {
                headers: {
                    'X-User-Id': userId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get my notes error:', error);
            throw error.response?.data || { message: 'Failed to fetch notes' };
        }
    },

    // Applicant endpoints
    getMyNotesAsApplicant: async (userId) => {
        try {
            const response = await api.get('/api/notes/applicant/my-notes', {
                headers: {
                    'X-User-Id': userId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get applicant notes error:', error);
            throw error.response?.data || { message: 'Failed to fetch notes' };
        }
    },

    getGlobalNotes: async () => {
        try {
            const response = await api.get('/api/notes/global');
            return response.data;
        } catch (error) {
            console.error('Get global notes error:', error);
            throw error.response?.data || { message: 'Failed to fetch global notes' };
        }
    },

    getNoteById: async (noteId, userId) => {
        try {
            const response = await api.get(`/api/notes/${noteId}`, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get note error:', error);
            throw error.response?.data || { message: 'Failed to fetch note' };
        }
    },

    // Validate applicant by email
    validateApplicantByEmail: async (email, userId) => {
        try {
            const response = await api.get(`/api/notes/validate-applicant/${encodeURIComponent(email)}`, {
                headers: {
                    'X-User-Id': userId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Validate applicant error:', error);
            throw error.response?.data || { message: 'Failed to validate applicant' };
        }
    }
};