'use client';

import AuthGuard from '@/components/AuthGuard';
import { permissionService, Permission } from '@/services/permissionService';
import { useState, useEffect } from 'react';

export default function PermissionsPage() {
    const [permissions, setPermissions]         = useState<Permission[]>([]);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState('');
    const [search, setSearch]       = useState('');
    const [showModal, setShowModal] = useState(false);
    const [newPermission, setNewPermission]     = useState('');
    const [saving, setSaving]       = useState(false);
    const [modalError, setModalError] = useState('');

    // ✅ Fetch roles on page load
    useEffect(() => {
        fetchPermissions();
    }, []);

    const fetchPermissions = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await permissionService.getPermissions();
            console.log('📥 Permissions response:', data);
            // adjust based on your API response structure
            setPermissions(data.data || data);
        } catch (err: any) {
            console.error('❌ Error fetching roles:', err);
            setError(err.response?.data?.message || 'Failed to fetch permissions');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Filter roles by search
    const filtered = permissions.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ Create role
    const handleAdd = async () => {
        if (!newPermission.trim()) return;
        setSaving(true);
        setModalError('');
        try {
            await permissionService.createPermission({ name: newPermission });
            setNewPermission('');
            setShowModal(false);
            await fetchPermissions(); // refresh list
        } catch (err: any) {
            setModalError(err.response?.data?.message || 'Failed to create role');
        } finally {
            setSaving(false);
        }
    };

    // ✅ Delete role
    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await permissionService.deletePermission(id);
            await fetchPermissions(); // refresh list
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete role');
        }
    };

    return (
        <AuthGuard>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">🔑 Permissions</h2>
                    <p className="text-muted">Manage Role Permissions</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowModal(true)}
                >
                    + Add Permission
                </button>
            </div>

            {/* Error Alert */}
            {error && (
                <div className="alert alert-danger alert-dismissible">
                    ⚠️ {error}
                    <button className="btn-close" onClick={() => setError('')} />
                </div>
            )}

            {/* Search */}
            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="🔍 Search roles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {loading ? (
                        // Loading Skeleton
                        <div className="p-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="placeholder-glow mb-3">
                                    <span className="placeholder col-12 py-3 rounded"></span>
                                </div>
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        // Empty State
                        <div className="text-center py-5">
                            <div style={{ fontSize: '3rem' }}>🔑</div>
                            <h5 className="text-muted mt-2">No roles found</h5>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => setShowModal(true)}
                            >
                                + Add First Permission
                            </button>
                        </div>
                    ) : (
                        // Roles Table
                        <table className="table table-hover mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Permission Name</th>
                                    <th>Role</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((permission, index) => (
                                    <tr key={permission.id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <span className="badge bg-primary fs-6">
                                                {permission.name}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge bg-warning text-dark">
                                                roles
                                            </span>
                                        </td>
                                        <td>
                                            {permission.created_at
                                                ? new Date(permission.created_at).toLocaleDateString()
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-outline-primary me-2">
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(permission.id, permission.name)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    
                </div>

                {/* Table Footer */}
                {!loading && filtered.length > 0 && (
                    <div className="card-footer bg-white text-muted small">
                        Showing {filtered.length} of {permissions.length} permissions
                    </div>
                )}
            </div>

            {/* Add permission Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">🔑 Add New Permission</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setModalError('');
                                        setNewPermission('');
                                    }}
                                />
                            </div>
                            <div className="modal-body">
                                {modalError && (
                                    <div className="alert alert-danger">⚠️ {modalError}</div>
                                )}
                                <label className="form-label fw-semibold">Permission Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Moderator"
                                    value={newPermission}
                                    onChange={(e) => setNewPermission(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                                    autoFocus
                                />
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowModal(false);
                                        setModalError('');
                                        setNewPermission('');
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleAdd}
                                    disabled={saving || !newPermission.trim()}
                                >
                                    {saving
                                        ? <><span className="spinner-border spinner-border-sm me-2"/>Saving...</>
                                        : '+ Add Permission'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AuthGuard>
    );
}