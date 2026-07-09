import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import LoginScreen from "./pages/LoginScreen";
import AppShell from "./components/layout/AppShell";

function LoginRoute() {
  const { token, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (token) {
    return <Navigate to="/" replace />;
  }
  return <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute fallback={<Navigate to="/login" replace />}>
                <AppShell />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
