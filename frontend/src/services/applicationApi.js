// src/services/applicationApi.js
import api from './api';

export const applicationApi = {
    /**
     * Submit application
     */
    submitApplication: async (formData) => {
        try {
            const response = await api.post('/api/example/apply', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 30000, // 30 seconds timeout for file upload
            });
            return {
                success: true,
                data: response.data,
                message: 'Application submitted successfully',
            };
        } catch (error) {
            console.error('Application submission error:', error);
            return {
                success: false,
                error: error.response?.data?.message || error.message || 'Submission failed',
                status: error.response?.status,
            };
        }
    },

    /**
     * Get application by ID
     */
    getApplication: async (applicationId) => {
        try {
            const response = await api.get(`/api/health-insurance/applications/${applicationId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch application' };
        }
    },

    /**
     * Get all applications for the authenticated user
     */
    getUserApplications: async (page = 1, limit = 10) => {
        try {
            const response = await api.get('/api/health-insurance/applications', {
                params: { page, limit },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to fetch applications' };
        }
    },

    /**
     * Update application status (admin only)
     */
    updateApplicationStatus: async (applicationId, status, notes = '') => {
        try {
            const response = await api.patch(`/api/health-insurance/applications/${applicationId}/status`, {
                status,
                notes,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Failed to update application status' };
        }
    },

    /**
     * Download proof document
     */
    downloadDocument: async (applicationId, documentId) => {
        try {
            const response = await api.get(`/api/health-insurance/applications/${applicationId}/documents/${documentId}`, {
                responseType: 'blob',
            });
            
            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document_${documentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true };
        } catch (error) {
            throw error.response?.data || { message: 'Failed to download document' };
        }
    },
};