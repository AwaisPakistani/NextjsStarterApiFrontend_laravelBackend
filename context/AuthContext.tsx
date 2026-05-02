'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser]       = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // ✅ starts true!
    const router                = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                // ✅ No token — stop loading, don't fetch
                setLoading(false);
                return;
            }

            try {
                const data = await authService.profile();
                setUser(data.data);
            } catch {
                // ✅ Token invalid — clear it
                localStorage.removeItem('token');
                setUser(null);
            } finally {
                // ✅ Always stop loading after check
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const data = await authService.login({ email, password });
        setUser(data.data.user);
        router.push('/dashboard');
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            logout,
            isAuthenticated: !!user,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};