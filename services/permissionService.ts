import api from '@/lib/axios';

export interface Permission {
    id: number;
    name: string;
    group?: string;
}

export const permissionService = {
    async getPermissions() {
        const response = await api.get('/permissions');
        return response.data;
    },

    async getRolePermissions(roleId: number) {
        const response = await api.get(`/roles/${roleId}`);
        return response.data;
    },

    async updateRolePermissions(roleId: number, data: { name: string; permissions: string[] }) {
        const response = await api.put(`/roles/${roleId}`, data);
        return response.data;
    },
};