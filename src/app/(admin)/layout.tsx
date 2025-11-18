'use client';

import { SidebarWithLogo } from '@/components/admin/sidebar';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

// Skeleton Loading Component
const SidebarSkeleton = () => (
  <div className="w-64 bg-gray-100 p-4 h-screen animate-pulse">
    <div className="h-45  bg-gray-300 rounded-full mb-6" />
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-9 bg-gray-300 rounded mb-3" />
    ))}
  </div>
);

const MainSkeleton = () => (
  <div className="flex-1 p-6 bg-gray-50 animate-pulse">
    <div className="h-8 w-1/3 bg-gray-300 rounded mb-6" />
    {/* {[...Array(5)].map((_, i) => (
      <div key={i} className="h-5 bg-gray-200 rounded mb-3" />
    ))} */}
    <div className="h-64 bg-gray-200 rounded mt-6" />
    <div className="h-64 bg-gray-200 rounded mt-6" />
  </div>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
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
        toast.error('Token expired', {
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
        toast.error('Token invalid', {
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
      {/* Sidebar */}
      {loading ? <SidebarSkeleton /> : <SidebarWithLogo />}

      {/* Main Content */}
      <main className="transition-all duration-300 bg-gray-50 overflow-y-auto w-full">
        {loading ? <MainSkeleton /> : children}
      </main>
    </div>
  );
};

export default AdminLayout;
