import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import BootstrapClient from '@/components/BootstrapClient';

export const metadata: Metadata = {
    title: 'Laravel Starter App',
    description: 'Laravel + Next.js Starter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    {children}
                    <BootstrapClient />
                </AuthProvider>
            </body>
        </html>
    );
}