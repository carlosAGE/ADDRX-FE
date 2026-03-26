import type { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { loading, loggedIn } = useAuth();

  if (loading) return null;

  if (!loggedIn) {
    window.location.href = '/admin';
    return null;
  }

  return <>{children}</>;
}
