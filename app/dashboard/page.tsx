'use client';

import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
    const { user } = useAuth();

    const stats = [
        { label: 'Total Users',       value: '1,240', icon: '👥', color: 'primary' },
        { label: 'Total Roles',       value: '8',     icon: '🔑', color: 'success' },
        { label: 'Total Permissions', value: '24',    icon: '🛡️', color: 'warning' },
        { label: 'Active Sessions',   value: '3',     icon: '🟢', color: 'info'    },
    ];

    return (
        <AuthGuard>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Dashboard</h2>
                    <p className="text-muted">Welcome back, <strong>{user?.name}</strong> 👋</p>
                </div>
                <div className="badge bg-primary fs-6 px-3 py-2">
                    {user?.roles?.[0] || 'User'}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="col-md-3">
                        <div className={`card border-0 shadow-sm border-start border-${stat.color} border-4`}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-muted small mb-1">{stat.label}</p>
                                        <h3 className="fw-bold mb-0">{stat.value}</h3>
                                    </div>
                                    <span style={{ fontSize: '2rem' }}>{stat.icon}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
             {/* <div className="row g-4 mb-4">
               
                    <div className="col-md-3">
                        <div className={`card border-0 shadow-sm border-start border-primary border-4`}>
                            <div className="card-body">
                                <div className="d-flex justify-content-between align-items-center">
                                   - <div>
                                        <p className="text-muted small mb-1">Total Users</p>
                                        <h3 className="fw-bold mb-0">{user?.roles}</h3>
                                    </div>
                                    <span style={{ fontSize: '2rem' }}></span>
                                </div>
                            </div>
                        </div>
                    </div>
               
            </div> */}

            {/* User Info Card */}
            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-semibold">
                            👤 Profile Info
                        </div>
                        <div className="card-body">
                            <table className="table table-borderless">
                                <tbody>
                                    <tr>
                                        <td className="text-muted">Name</td>
                                        <td><strong>{user?.name}</strong></td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Email</td>
                                        <td><strong>{user?.email}</strong></td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Roles</td>
                                        <td>
                                            {user?.roles?.length
                                                ? user.roles.map((r) => (
                                                    <span key={r} className="badge bg-primary me-1">{r}</span>
                                                ))
                                                : <span className="badge bg-secondary">No roles</span>
                                            }
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-muted">Permissions</td>
                                        <td>
                                            {user?.permissions?.length
                                                ? user.permissions.map((p) => (
                                                    <span key={p} className="badge bg-success me-1">{p}</span>
                                                ))
                                                : <span className="badge bg-secondary">No permissions</span>
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
        
    );
}