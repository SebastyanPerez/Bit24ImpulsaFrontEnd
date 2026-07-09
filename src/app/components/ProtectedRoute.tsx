import React from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute component.
 * If the user is authenticated (token exists in AuthContext), it renders the children.
 * Otherwise, it renders the fallback (e.g., redirect to Login).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
}) => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!token) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
