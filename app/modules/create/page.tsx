'use client';

import AuthGuard from '@/components/AuthGuard';
import { moduleservice } from '@/services/moduleService';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

interface ModuleOption {
    value: number;
    label: string;
}

export default function CreateModulePage() {
    const router                                      = useRouter();
    const [moduleName, setModuleName]                 = useState('');
    const [moduleOptions, setModuleOptions]           = useState<ModuleOption[]>([]);
    const [selectedParent, setSelectedParent]         = useState<ModuleOption | null>(null);
    const [loading, setLoading]                       = useState(true);
    const [loadingModules, setLoadingModules]         = useState(false);
    const [saving, setSaving]                         = useState(false);
    const [error, setError]                           = useState('');
    const [success, setSuccess]                       = useState('');

    useEffect(() => {
        fetchParentModules();
    }, []);

    // ✅ Fix 1 — correctly map API response to options
    const fetchParentModules = async () => {
        setLoadingModules(true);
        setLoading(true);
        try {
            const response = await moduleservice.getParentModules();
            console.log('📥 Parent modules:', response);

            // ✅ Fix 2 — map array to {value, label} for react-select
            const options = response.data.map((m: any) => ({
                value: m.id,
                label: m.name,
            }));
            setModuleOptions(options);

        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load modules');
        } finally {
            setLoadingModules(false);
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!moduleName.trim()) {
            setError('Module name is required!');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await moduleservice.createModule({
                name:      moduleName,
                parent_id: selectedParent?.value || null, // ✅ Fix 3 — send parent_id not parent
            });
            setSuccess('✅ Module created successfully!');
            setTimeout(() => router.push('/modules'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create module');
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
                        <p className="text-muted">Loading...</p>
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
                    <h2 className="fw-bold mb-0">➕ Create Module</h2>
                    <p className="text-muted">Add a new module to the system</p>
                </div>
                <button
                    className="btn btn-outline-secondary"
                    onClick={() => router.push('/modules')}
                >
                    ← Back to Modules
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

            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white fw-semibold">
                            📦 Module Details
                        </div>
                        <div className="card-body">

                            {/* Parent Module Select */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold">
                                    Parent Module
                                    <span className="text-muted fw-normal ms-1">(optional)</span>
                                </label>
                                <Select
                                    options={moduleOptions}       // ✅ Fix 4 — use moduleOptions not parent
                                    value={selectedParent}
                                    onChange={(option) => setSelectedParent(option)}
                                    isLoading={loadingModules}
                                    isClearable
                                    isSearchable
                                    placeholder={
                                        loadingModules
                                            ? '⏳ Loading modules...'
                                            : '🔍 Search parent module...'
                                    }
                                    noOptionsMessage={() => 'No modules found'}
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (base, state) => ({
                                            ...base,
                                            minHeight: '48px',
                                            fontSize: '1rem',
                                            borderColor: state.isFocused ? '#0d6efd' : '#dee2e6',
                                            boxShadow: state.isFocused
                                                ? '0 0 0 0.25rem rgba(13,110,253,.25)'
                                                : 'none',
                                            '&:hover': { borderColor: '#0d6efd' },
                                        }),
                                        option: (base, state) => ({
                                            ...base,
                                            backgroundColor: state.isSelected
                                                ? '#0d6efd'
                                                : state.isFocused
                                                ? '#e8f0fe'
                                                : 'white',
                                            color: state.isSelected ? 'white' : '#212529',
                                            cursor: 'pointer',
                                        }),
                                        placeholder: (base) => ({
                                            ...base,
                                            color: '#9ca3af',
                                        }),
                                        clearIndicator: (base) => ({
                                            ...base,
                                            cursor: 'pointer',
                                            color: '#dc3545',
                                            '&:hover': { color: '#dc3545' },
                                        }),
                                    }}
                                />
                                {/* Show selected */}
                                {selectedParent && (
                                    <small className="text-muted mt-1 d-block">
                                        Selected: <span className="badge bg-primary">{selectedParent.label}</span>
                                    </small>
                                )}
                            </div>

                            {/* Module Name */}
                            <div className="mb-4">
                                <label className="form-label fw-semibold">Module Name</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    value={moduleName}
                                    onChange={(e) => setModuleName(e.target.value)}
                                    placeholder="e.g. Posts"
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving
                                    ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</>
                                    : '💾 Create Module'
                                }
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    );
}