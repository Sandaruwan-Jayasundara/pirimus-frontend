// protected-route.tsx
'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/context/AuthContext';

// Utility to get cookie by name
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[]; // Array of roles that can access this route
}

export default function ProtectedRoute({children, allowedRoles}: ProtectedRouteProps) {
  const {isAuthenticated, isLoading, user} = useAuth();
  const router = useRouter();

  useEffect(() => {
    const token = getCookie('token'); // Check for token in cookies

    if (isLoading) return; // Wait until loading is complete

    if (!token)
    {
      // If no token or not authenticated, redirect to log in
      router.push('/login');
    } else if (user && !allowedRoles.includes(user?.role as string))
    {
      // If authenticated but role is not allowed, redirect to unauthorized
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles]);

  if (isLoading)
  {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return isAuthenticated && user && allowedRoles.includes(user.role as string) ? (
    <div className="w-full h-screen">
      {children}
    </div>
  ) : null;
  
  
}