import api from '@/lib/axios';

export interface Module {
    id: number;
    parent_id:number;
    name: string;
}

export const moduleservice = {
    async getModules(page: number = 1, search: string = '') {
        const params: Record<string, any> = { page };
        
        if (search.trim()) {
            params.search = search;
        }
        
        const response = await api.get('/modules', { params });
        return response.data;
    },
   

    // Get single Module
    async getModule(id: number) {
        const response = await api.get(`/modules/${id}`);
        return response.data;
    },
    // Get Parent Modules
    async getParentModules(){
      const response = await api.get('/parentModules');
      return response.data;
    },

    // Create module
    async createModule(data: { name: string }) {
        const response = await api.post('/modules', data);
        return response.data;
    },

    // Update role
    async updateModule(id: number, data: { name: string }) {
        const response = await api.put(`/modules/${id}`, data);
        return response.data;
    },

    // Delete role
    async deleteModule(id: number) {
        const response = await api.delete(`/modules/${id}`);
        return response.data;
    },
};