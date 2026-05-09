'use client';

import AuthGuard from '@/components/AuthGuard';
import { moduleservice, Module } from '@/services/moduleService';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Pagination {
    current_page: number;
    last_page:    number;
    per_page:     number;
    total:        number;
}

export default function ModulesPage() {
    const router                        = useRouter();
    const [modules, setModules]         = useState<Module[]>([]);
    const [pagination, setPagination]   = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState('');
    const [search, setSearch]           = useState('');

    // ✅ Reset to page 1 when search changes
    useEffect(() => {
        const timer = setTimeout(() => {
            setCurrentPage(1);
            fetchModules(1, search);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [search]);

    // ✅ Fetch when page changes
    useEffect(() => {
        fetchModules(currentPage, search);
    }, [currentPage]);

    const fetchModules = async (page: number, search: string = '') => {
        setLoading(true);
        setError('');
        try {
             const response = await moduleservice.getModules(page, search);
            console.log('📥 Modules:', response);

            // ✅ Your API structure: response.data.data & response.data.meta
            setModules(response.data.data);
            setPagination({
                current_page: response.data.meta.current_page,
                last_page:    response.data.meta.last_page,
                per_page:     response.data.meta.per_page,
                total:        response.data.meta.total,
            });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch modules');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Delete "${name}"?`)) return;
        try {
            await moduleservice.deleteModule(id);
            fetchModules(currentPage);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to delete');
        }
    };

    return (
        <AuthGuard>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">📦 Modules</h2>
                    <p className="text-muted">
                        {pagination && `Total: ${pagination.total} modules`}
                    </p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => router.push('/modules/create')}
                >
                    + Add Module
                </button>
            </div>

            {/* Error */}
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
                        placeholder="🔍 Search modules..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="p-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="placeholder-glow mb-3">
                                    <span className="placeholder col-12 py-3 rounded" />
                                </div>
                            ))}
                        </div>
                    ) : modules.length === 0 ? (
                        <div className="text-center py-5">
                            <div style={{ fontSize: '3rem' }}>📦</div>
                            <h5 className="text-muted mt-2">No modules found</h5>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => router.push('/modules/create')}
                            >
                                + Add First Module
                            </button>
                        </div>
                    ) : (
                        <table className="table table-hover mb-0">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Slug</th>
                                    <th>Parent</th>
                                    <th>Created</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modules
                                    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()))
                                    .map((module, index) => (
                                    <tr key={module.id}>
                                        <td>
                                            {(currentPage - 1) * (pagination?.per_page || 10) + index + 1}
                                        </td>
                                        <td><strong>{module.name}</strong></td>
                                        <td><code>{module.slug}</code></td>
                                        <td>
                                            {module.parent
                                                ? <span className="badge bg-info text-dark">{module.parent.name}</span>
                                                : <span className="badge bg-secondary">None</span>
                                            }
                                        </td>
                                        <td>{module.created_at}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => router.push(`/modules/edit/${module.id}`)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-danger"
                                                onClick={() => handleDelete(module.id, module.name)}
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

                {/* ✅ Pagination Footer */}
                {pagination && pagination.last_page > 1 && (
                    <div className="card-footer bg-white d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                            Showing page {pagination.current_page} of {pagination.last_page} 
                            ({pagination.total} total)
                        </small>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                {/* Previous */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(p => p - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        ← Prev
                                    </button>
                                </li>

                                {/* Page Numbers */}
                                {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                                    .filter(page =>
                                        page === 1 ||
                                        page === pagination.last_page ||
                                        Math.abs(page - currentPage) <= 1
                                    )
                                    .map((page, idx, arr) => (
                                        <>
                                            {/* Ellipsis */}
                                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                                                <li key={`dots-${page}`} className="page-item disabled">
                                                    <span className="page-link">...</span>
                                                </li>
                                            )}
                                            <li
                                                key={page}
                                                className={`page-item ${currentPage === page ? 'active' : ''}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        </>
                                    ))
                                }

                                {/* Next */}
                                <li className={`page-item ${currentPage === pagination.last_page ? 'disabled' : ''}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(p => p + 1)}
                                        disabled={currentPage === pagination.last_page}
                                    >
                                        Next →
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </AuthGuard>
    );
}