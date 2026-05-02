'use client';

import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

const pageTitles: Record<string, string> = {
    '/dashboard':   '📊 Dashboard',
    '/roles':       '🔑 Roles Management',
    '/permissions': '🛡️ Permissions Management',
};

export default function Navbar() {
    const { user, logout } = useAuth();
    const pathname         = usePathname();
    const pageTitle        = pageTitles[pathname] || '🚀 LaravelApp';

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm px-4 py-2">
            <div className="container-fluid">

                {/* Page Title */}
                <span className="navbar-brand fw-bold fs-5 mb-0">
                    {pageTitle}
                </span>

                {/* Right Side */}
                <div className="d-flex align-items-center gap-3">

                    {/* Notification Bell */}
                    <button className="btn btn-light position-relative">
                        🔔
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            3
                        </span>
                    </button>

                    {/* User Dropdown */}
                    <div className="dropdown">
                        <button
                            className="btn btn-light dropdown-toggle d-flex align-items-center gap-2"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            {/* Avatar */}
                            <div
                                className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                                style={{ width: 32, height: 32, fontSize: 14 }}
                            >
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span className="d-none d-md-inline fw-semibold">
                                {user?.name}
                            </span>
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                            {/* User Info */}
                            <li className="px-3 py-2">
                                <div className="fw-bold">{user?.name}</div>
                                <small className="text-muted">{user?.email}</small>
                            </li>
                            <li><hr className="dropdown-divider" /></li>

                            {/* Roles */}
                            <li className="px-3 py-1">
                                <small className="text-muted">Roles:</small>
                                <div className="d-flex flex-wrap gap-1 mt-1">
                                    {user?.roles?.length
                                        ? user.roles.map((r) => (
                                            <span key={r} className="badge bg-primary">{r}</span>
                                        ))
                                        : <span className="badge bg-secondary">No roles</span>
                                    }
                                </div>
                            </li>
                            <li><hr className="dropdown-divider" /></li>

                            {/* Links */}
                            <li>
                                <a className="dropdown-item" href="#">
                                    👤 Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    ⚙️ Settings
                                </a>
                            </li>
                            <li><hr className="dropdown-divider" /></li>

                            {/* Logout */}
                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={logout}
                                >
                                    🚪 Logout
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </nav>
    );
}