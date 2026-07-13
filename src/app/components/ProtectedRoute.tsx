import React from "react";
import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute component.
 * If the user is authenticated (token exists in AuthContext), it renders the children (or outlet).
 * Otherwise, it renders the fallback or navigates to /login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback,
}) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <>{fallback || <Navigate to="/login" replace />}</>;
  }

  return children ? <>{children}</> : <Outlet />;
};
