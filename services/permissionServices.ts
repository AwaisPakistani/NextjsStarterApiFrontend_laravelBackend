import api from '@/lib/axios';

export interface Permission {
    id: number;
    name: string;
    permissions_count?: number;
    users_count?: number;
    created_at?: string;
}

export const permissionService = {
    // Get all Permissions
    async getPermissions() {
        const response = await api.get('/permissions');
        return response.data;
    },

    // Get single Permission
    async getPermission(id: number) {
        const response = await api.get(`/permissions/${id}`);
        return response.data;
    },

    async getRolePermissions(roleId: number) {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    },

    // Create Permission
    async createPermission(data: { name: string }) {
        const response = await api.post('/permissions', data);
        return response.data;
    },

    // Update Permission
    async updatePermission(id: number, data: { name: string }) {
        const response = await api.put(`/permissions/${id}`, data);
        return response.data;
    },

    async updateRolePermissions(roleId: number, data: { name: string; permissions: string[] }) {
        const response = await api.put(`/roles/${roleId}`, data);
        return response.data;
    },

    // Delete Permission
    async deletePermission(id: number) {
        const response = await api.delete(`/permissions/${id}`);
        return response.data;
    },
};