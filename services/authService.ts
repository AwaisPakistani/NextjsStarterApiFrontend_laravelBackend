import api from '@/lib/axios';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export const authService = {
    // Login
    async login(credentials: LoginCredentials) {
        console.log('login servive');
        const response = await api.post('/login', credentials);
        console.log(response);
        // return false;
        const { access_token } = response.data.data;
        localStorage.setItem('token', access_token);
        return response.data;
    },

    // Register
    async register(credentials: RegisterCredentials) {
        const response = await api.post('/register', credentials);
        const { access_token } = response.data.data;
        localStorage.setItem('token', access_token);
        return response.data;
    },

    // Logout
    async logout() {
        await api.post('/logout');
        localStorage.removeItem('token');
    },

    // Get profile
    async profile() {
        const response = await api.get('/profile');
        return response.data;
    },

    // Check if logged in
    isAuthenticated() {
        return !!localStorage.getItem('token');
    },
};