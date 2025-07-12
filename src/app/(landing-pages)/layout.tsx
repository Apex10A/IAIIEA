"use client"
import PublicLayout from '@/layout/MainLayout';
import Header from '@/components/layout/header/page';
import Footer from '@/components/layout/footer/page';

export default function PublicPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <PublicLayout>
            <main>{children}</main>
        </PublicLayout>
    );
}