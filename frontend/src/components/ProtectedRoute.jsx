import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute = ({ children, roleRequired }) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      window.location.hash = '#/login';
    } else if (roleRequired && user.role !== roleRequired) {
      window.location.hash = '#/';
    }
  }, [user, isLoading, roleRequired]);

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[50vh] gap-3 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-stone-900" />
        <div className="text-sm font-extrabold text-stone-850 font-display">Verifying credentials...</div>
      </div>
    );
  }

  if (!user || (roleRequired && user.role !== roleRequired)) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
