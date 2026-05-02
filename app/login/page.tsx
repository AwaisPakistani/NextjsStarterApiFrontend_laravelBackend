'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const { login }               = useAuth();
    const [email, setEmail]       = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]       = useState('');
    const [loading, setLoading]   = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            console.log('Attempting login with:', { email, password });
            await login(email, password);
            console.log('Login successful');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-lg" style={{ width: '420px' }}>
                <div className="card-body p-5">

                    {/* Header */}
                    <div className="text-center mb-4">
                        <h1 className="fs-2 fw-bold text-primary">🚀 LaravelApp</h1>
                        <p className="text-muted">Sign in to your account</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="alert alert-danger d-flex align-items-center" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Email address</label>
                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-semibold">Password</label>
                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary btn-lg w-100"
                        >
                            {loading
                                ? <><span className="spinner-border spinner-border-sm me-2"/>Signing in...</>
                                : '🔐 Sign In'
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}