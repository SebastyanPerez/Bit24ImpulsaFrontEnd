import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { login as apiLogin, Usuario } from "../api/auth";
import { setClientToken } from "../api/axiosClient";

const TOKEN_KEY = "bit24_token";
const USUARIO_KEY = "bit24_usuario";

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  isLoading: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  restoreSession: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function readStoredSession(): { token: string | null; usuario: Usuario | null } {
  const storedToken = localStorage.getItem(TOKEN_KEY);
  const storedUsuario = localStorage.getItem(USUARIO_KEY);

  if (!storedToken || !storedUsuario) {
    return { token: null, usuario: null };
  }

  try {
    const parsedUsuario: Usuario = JSON.parse(storedUsuario);
    return { token: storedToken, usuario: parsedUsuario };
  } catch {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    return { token: null, usuario: null };
  }
}

/**
 * AuthProvider component that provides authentication state and actions.
 * Persists token and usuario in localStorage (bit24_token, bit24_usuario).
 * Restores state from localStorage on mount so users aren't kicked on reload.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialSession = readStoredSession();

  // Set client token synchronously during initialization so first render API calls are authorized
  if (initialSession.token) {
    setClientToken(initialSession.token);
  }

  const [usuario, setUsuario] = useState<Usuario | null>(initialSession.usuario);
  const [token, setToken] = useState<string | null>(initialSession.token);
  const [isLoading, setIsLoading] = useState(false);

  const restoreSession = useCallback((): boolean => {
    const session = readStoredSession();
    setToken(session.token);
    setUsuario(session.usuario);
    setClientToken(session.token);
    return session.token !== null;
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (correo: string, password: string) => {
    try {
      const response = await apiLogin(correo, password);

      setUsuario(response.usuario);
      setToken(response.access_token);
      setClientToken(response.access_token);

      localStorage.setItem(TOKEN_KEY, response.access_token);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(response.usuario));
    } catch (error) {
      setUsuario(null);
      setToken(null);
      setClientToken(null);
      throw error;
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    setClientToken(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
  };

  return (
    <AuthContext.Provider
      value={{ usuario, token, isLoading, login, logout, restoreSession }}
    >
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
