import React from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * ProtectedRoute component.
 * If the user is authenticated (token exists in AuthContext), it renders the children.
 * Otherwise, it renders the fallback (e.g., the LoginScreen).
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = null,
}) => {
  const { token } = useAuth();

  if (!token) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
