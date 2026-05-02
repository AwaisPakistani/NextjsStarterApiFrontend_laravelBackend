'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Only redirect AFTER loading is complete
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated]);

    // ✅ Show spinner while checking auth — don't redirect yet!
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // ✅ After loading, if not authenticated show nothing (redirect happening)
    if (!isAuthenticated) return null;

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 d-flex flex-column" style={{ minHeight: '100vh' }}>
                <Navbar />
                <div className="p-4 bg-light flex-grow-1">
                    {children}
                </div>
            </div>
        </div>
    );
}