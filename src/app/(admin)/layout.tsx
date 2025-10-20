'use client';

import { SidebarWithLogo } from '@/components/admin/sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (!token) {
        router.push('/login');
        toast.error('Token verification failed', {
          className: 'bg-red-500 text-white',
        });
        return;
      }

      setLoading(true);
      function parseJwt(token: string) {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        } catch {
          return null;
        }
      }

      const decodedToken = parseJwt(token);
      if (!decodedToken) {
        localStorage.removeItem('accessToken');
        router.push('/');
        return;
      }

      const { exp } = decodedToken;
      const now = Math.floor(Date.now() / 1000);
      if (exp < now) {
        localStorage.removeItem('accessToken');
        router.push('/login');
        toast.error('Token verification failed', {
          className: 'bg-red-500 text-white',
        });
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-token`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status !== 200) {
        localStorage.removeItem('accessToken');
        router.push('/');
        toast.error('Token verification failed', {
          className: 'bg-red-500 text-white',
        });
        return;
      }

      setLoading(false);
    };
    checkAdminAuth();
  }, [router]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar sticky di kiri */}
      <SidebarWithLogo />

      {/* Main content di kanan */}
      <main className="px-5 py-4 bg-gray-50 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
