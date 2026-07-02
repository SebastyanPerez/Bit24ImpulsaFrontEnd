import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login as apiLogin, Usuario } from "../api/auth";
import { setClientToken } from "../api/axiosClient";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider component that provides authentication state and actions.
 * Persists token and usuario in localStorage (bit24_token, bit24_usuario).
 * Restores state from localStorage on mount so users aren't kicked on reload.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("bit24_token");
    const storedUsuario = localStorage.getItem("bit24_usuario");
    if (storedToken && storedUsuario) {
      try {
        const parsedUsuario: Usuario = JSON.parse(storedUsuario);
        setToken(storedToken);
        setUsuario(parsedUsuario);
        setClientToken(storedToken);
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem("bit24_token");
        localStorage.removeItem("bit24_usuario");
      }
    }
  }, []);

  const login = async (correo: string, password: string) => {
    try {
      const response = await apiLogin(correo, password);

      // Update local state (in-memory)
      setUsuario(response.usuario);
      setToken(response.access_token);

      // Update token in Axios request interceptor
      setClientToken(response.access_token);

      // Persist to localStorage
      localStorage.setItem("bit24_token", response.access_token);
      localStorage.setItem("bit24_usuario", JSON.stringify(response.usuario));
    } catch (error) {
      // Clear credentials on failure
      setUsuario(null);
      setToken(null);
      setClientToken(null);
      throw error;
    }
  };

  const logout = () => {
    // Clear credentials
    setUsuario(null);
    setToken(null);
    setClientToken(null);

    // Clear localStorage
    localStorage.removeItem("bit24_token");
    localStorage.removeItem("bit24_usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the AuthContext.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
