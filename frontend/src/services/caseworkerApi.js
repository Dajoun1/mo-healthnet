﻿import api from './api';

export const caseworkerApi = {
    getAllApplications: async () => {
        const response = await api.get('/api/caseworker/applications');
        return response.data;
    },
    getApplicationById: async (applicationId) => {
        const response = await api.get(`/api/caseworker/applications/${applicationId}`);
        return response.data;
    },
    updateApplicationStatus: async (applicationId, status, reviewedBy, reviewNotes = '') => {
        const response = await api.put(`/api/caseworker/applications/${applicationId}/status`, { status, reviewedBy, reviewNotes });
        return response.data;
    },
    getStatistics: async () => {
        const response = await api.get('/api/caseworker/statistics');
        return response.data;
    }
};
