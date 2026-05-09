'use client';

import AuthGuard from '@/components/AuthGuard';
import { roleService } from '@/services/roleService';
import { permissionService, Permission } from '@/services/permissionServices';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditRolePage() {
    const router                          = useRouter();
    const params                          = useParams();
    const roleId                          = Number(params.id);

    const [roleName, setRoleName]         = useState('');
    const [permissions, setPermissions]   = useState<Permission[]>([]);
    const [selected, setSelected]         = useState<string[]>([]);
    const [search, setSearch]             = useState('');
    const [loading, setLoading]           = useState(true);
    const [saving, setSaving]             = useState(false);
    const [error, setError]               = useState('');
    const [success, setSuccess]           = useState('');

    // ✅ Fetch role + permissions on load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch all permissions and role data in parallel
            const [permissionsRes, roleRes] = await Promise.all([
                permissionService.getPermissions(),
                permissionService.getRolePermissions(roleId),
            ]);

            console.log('📥 Permissions:', permissionsRes);
            console.log('📥 Role:', roleRes);

            const allPermissions = permissionsRes.data || permissionsRes;
            const roleData       = roleRes.data || roleRes;

            setPermissions(allPermissions);
            setRoleName(roleData.name);

            // Set already assigned permissions
            const assignedPermissions = roleData.permissions?.map(
                (p: Permission) => p.name
            ) || [];
            setSelected(assignedPermissions);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    // ✅ Group permissions by category
    const grouped = permissions
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
        .reduce((acc: Record<string, Permission[]>, perm) => {
            // Extract group from permission name e.g. "view users" → "Users"
            const group = perm.group
                ?? perm.name.split(' ').pop()!
                    .charAt(0).toUpperCase() + perm.name.split(' ').pop()!.slice(1);
            if (!acc[group]) acc[group] = [];
            acc[group].push(perm);
            return acc;
        }, {});

    // ✅ Toggle single permission
    const togglePermission = (name: string) => {
        setSelected(prev =>
            prev.includes(name)
                ? prev.filter(p => p !== name)
                : [...prev, name]
        );
    };

    // ✅ Toggle entire group
    const toggleGroup = (groupPerms: Permission[]) => {
        const groupNames    = groupPerms.map(p => p.name);
        const allSelected   = groupNames.every(n => selected.includes(n));
        if (allSelected) {
            setSelected(prev => prev.filter(p => !groupNames.includes(p)));
        } else {
            setSelected(prev => [...new Set([...prev, ...groupNames])]);
        }
    };

    // ✅ Select / Deselect all
    const toggleAll = () => {
        if (selected.length === permissions.length) {
            setSelected([]);
        } else {
            setSelected(permissions.map(p => p.name));
        }
    };

    // ✅ Save role
    const handleSave = async () => {
        if (!roleName.trim()) {
            setError('Role name is required!');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await permissionService.updateRolePermissions(roleId, {
                name:        roleName,
                permissions: selected,
            });
            setSuccess('✅ Role updated successfully!');
            setTimeout(() => router.push('/roles'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update role');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <AuthGuard>
                <div className="d-flex justify-content-center align-items-center py-5">
                    <div className="text-center">
                        <div className="spinner-border text-primary mb-3" role="status" />
                        <p className="text-muted">Loading role data...</p>
                    </div>
                </div>
            </AuthGuard>
        );
    }

    return (
        <AuthGuard>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">✏️ Edit Role</h2>
                    <p className="text-muted">Update role name and assign permissions</p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => router.push('/roles')}
                >
                    ← Back to Roles
                </button>
            </div>

            {/* Alerts */}
            {error && (
                <div className="alert alert-danger alert-dismissible">
                    ⚠️ {error}
                    <button className="btn-close" onClick={() => setError('')} />
                </div>
            )}
            {success && (
                <div className="alert alert-success">
                    {success}
                </div>
            )}

            <div className="row g-4">

                {/* Left — Role Name */}
                <div className="col-md-4">
                    <div className="card shadow-sm border-0 sticky-top" style={{ top: '1rem' }}>
                        <div className="card-header bg-white fw-semibold">
                            🔑 Role Details
                        </div>
                        <div className="card-body">
                            <label className="form-label fw-semibold">Role Name</label>
                            <input
                                type="text"
                                className="form-control form-control-lg"
                                value={roleName}
                                onChange={(e) => setRoleName(e.target.value)}
                                placeholder="e.g. Manager"
                            />

                            {/* Summary */}
                            <div className="mt-4 p-3 bg-light rounded">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Total Permissions</span>
                                    <span className="badge bg-secondary">
                                        {permissions.length}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Selected</span>
                                    <span className="badge bg-primary">
                                        {selected.length}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className="progress mt-3" style={{ height: 6 }}>
                                    <div
                                        className="progress-bar bg-primary"
                                        style={{
                                            width: permissions.length
                                                ? `${(selected.length / permissions.length) * 100}%`
                                                : '0%'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                className="btn btn-primary w-100 mt-4"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                    : '💾 Save Changes'
                                }
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right — Permissions */}
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="fw-semibold">🛡️ Permissions</span>
                                <button
                                    className="btn btn-sm btn-outline-primary"
                                    onClick={toggleAll}
                                >
                                    {selected.length === permissions.length
                                        ? '✗ Deselect All'
                                        : '✓ Select All'
                                    }
                                </button>
                            </div>
                            {/* Search */}
                            <input
                                type="text"
                                className="form-control"
                                placeholder="🔍 Search permissions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="card-body">
                            {Object.keys(grouped).length === 0 ? (
                                <div className="text-center py-4 text-muted">
                                    No permissions found
                                </div>
                            ) : (
                                Object.entries(grouped).map(([group, groupPerms]) => {
                                    const groupNames  = groupPerms.map(p => p.name);
                                    const allChecked  = groupNames.every(n => selected.includes(n));
                                    const someChecked = groupNames.some(n => selected.includes(n));

                                    return (
                                        <div key={group} className="mb-4">
                                            {/* Group Header */}
                                            <div className="d-flex align-items-center justify-content-between bg-light rounded p-2 mb-2">
                                                <div className="d-flex align-items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input mt-0"
                                                        checked={allChecked}
                                                        ref={el => {
                                                            if (el) el.indeterminate = someChecked && !allChecked;
                                                        }}
                                                        onChange={() => toggleGroup(groupPerms)}
                                                    />
                                                    <span className="fw-semibold text-capitalize">
                                                        {group}
                                                    </span>
                                                </div>
                                                <span className="badge bg-secondary">
                                                    {groupNames.filter(n => selected.includes(n)).length}/{groupPerms.length}
                                                </span>
                                            </div>

                                            {/* Permissions Grid */}
                                            <div className="row g-2 ps-3">
                                                {groupPerms.map(perm => (
                                                    <div key={perm.id} className="col-md-6">
                                                        <div
                                                            className={`form-check border rounded p-2 cursor-pointer
                                                                ${selected.includes(perm.name)
                                                                    ? 'border-primary bg-primary bg-opacity-10'
                                                                    : 'border-light'
                                                                }`}
                                                            onClick={() => togglePermission(perm.name)}
                                                            style={{ cursor: 'pointer' }}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={selected.includes(perm.name)}
                                                                onChange={() => togglePermission(perm.name)}
                                                                onClick={e => e.stopPropagation()}
                                                            />
                                                            <label
                                                                className="form-check-label ms-1 text-capitalize"
                                                                style={{ cursor: 'pointer' }}
                                                            >
                                                                <code className="text-primary">
                                                                    {perm.name}
                                                                </code>
                                                            </label>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}