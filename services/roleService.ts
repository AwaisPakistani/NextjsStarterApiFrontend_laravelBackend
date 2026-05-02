import api from '@/lib/axios';

export interface Role {
    id: number;
    name: string;
    permissions_count?: number;
    users_count?: number;
    created_at?: string;
}

export const roleService = {
    // Get all roles
    async getRoles() {
        const response = await api.get('/roles');
        return response.data;
    },

    // Get single role
    async getRole(id: number) {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    // Create role
    async createRole(data: { name: string }) {
        const response = await api.post('/roles', data);
        return response.data;
    },

    // Update role
    async updateRole(id: number, data: { name: string }) {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },

    // Delete role
    async deleteRole(id: number) {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    },
};