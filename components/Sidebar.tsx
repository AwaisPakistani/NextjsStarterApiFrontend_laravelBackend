'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
    const pathname       = usePathname();
    const { logout, user } = useAuth();

    const navItems = [
        { href: '/dashboard',   label: 'Dashboard',   icon: '📊' },
        { href: '/roles',       label: 'Roles',       icon: '🔑' },
        { href: '/permissions', label: 'Permissions', icon: '🛡️' },
        { href: '/modules', label: 'Modules', icon: '📊' },

    ];

    return (
        <div
            className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark"
            style={{ width: '260px', minHeight: '100vh' }}
        >
            {/* Logo */}
            <Link
                href="/dashboard"
                className="d-flex align-items-center mb-3 text-white text-decoration-none"
            >
                <span className="fs-4 fw-bold">🚀 LaravelApp</span>
            </Link>
            <hr />

            {/* User Info */}
            <div className="mb-3 px-2">
                <div className="d-flex align-items-center gap-2">
                    <div
                        className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                        style={{ width: 40, height: 40, minWidth: 40 }}
                    >
                        <span className="text-white fw-bold">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                        <div className="fw-semibold text-truncate">{user?.name}</div>
                        <small className="text-muted text-truncate d-block">
                            {user?.email}
                        </small>
                    </div>
                </div>
            </div>
            <hr />

            {/* Nav Links */}
            <ul className="nav nav-pills flex-column mb-auto gap-1">
                {navItems.map((item) => (
                    <li key={item.href} className="nav-item">
                        <Link
                            href={item.href}
                            className={`nav-link d-flex align-items-center gap-2 text-white
                                ${pathname === item.href
                                    ? 'active bg-primary'
                                    : 'hover-bg-secondary'
                                }`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.label}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <hr />

            {/* Logout Button */}
            <button
                onClick={logout}
                className="btn btn-outline-danger w-100"
            >
                🚪 Logout
            </button>
        </div>
    );
}