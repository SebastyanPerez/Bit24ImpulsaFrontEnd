import { useState } from "react";
import { Info, Play } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import bit24Logo from "../../imports/bit24_logo.png";
import { C } from "../data/datosRegenda";
import { BtnPrimary } from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 1: Login Form ───────────────────────────────────────────────────────
export default function LoginScreen() {
  const { login } = useAuth();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(correo, password);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Correo o contraseña incorrectos"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(145deg, ${C.purpleLight} 0%, #ffffff 50%, ${C.tealLight} 100%)`,
      }}
    >
      {/* Demo badge — Gestalt figura-fondo */}
      <div
        className="mb-6 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full"
        style={{
          backgroundColor: C.yellowLight,
          border: `1px solid ${C.yellow}`,
          color: "#7a4f00",
          fontFamily: "var(--font-brand)",
        }}
      >
        <Info size={12} /> Piloto REGENDA · Módulo de Adopción Digital
      </div>

      {/* Card login — figura-fondo */}
      <div
        className="bg-white rounded-3xl w-full max-w-md p-8"
        style={{
          boxShadow: `0 20px 60px ${C.purple}20`,
          border: `1px solid ${C.purple}12`,
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <ImageWithFallback
            src={bit24Logo}
            alt="Logo Bit24"
            className="object-contain"
            style={{ width: 140, height: 80 }}
          />
          <div className="text-center">
            <h1
              className="text-xl font-extrabold"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              Impulsa
            </h1>
            <p
              className="text-sm mt-0.5"
              style={{
                color: C.gray,
                fontFamily: "var(--font-body)",
              }}
            >
              Módulo de adopción digital · <strong>REGENDA</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              required
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border outline-none text-sm focus:border-purple-600 transition-colors"
              style={{
                borderColor: "#e8e0e8",
                fontFamily: "var(--font-body)",
                backgroundColor: "#fafafa",
              }}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
                fontWeight: "bold",
                fontSize: "13px",
              }}
            >
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border outline-none text-sm focus:border-purple-600 transition-colors"
              style={{
                borderColor: "#e8e0e8",
                fontFamily: "var(--font-body)",
                backgroundColor: "#fafafa",
              }}
              placeholder="••••••••"
            />
          </div>

          <div className="mt-2">
            <BtnPrimary type="submit" disabled={loading}>
              <Play size={15} /> {loading ? "Iniciando sesión..." : "Ingresar"}
            </BtnPrimary>
          </div>

          {error && (
            <p
              className="text-xs text-center mt-2 font-bold"
              style={{
                color: C.red,
                fontFamily: "var(--font-brand)",
              }}
            >
              {error}
            </p>
          )}
        </form>

        <p
          className="text-center text-xs mt-5"
          style={{
            color: "#bbb",
            fontFamily: "var(--font-body)",
          }}
        >
          Sistema de adopción ERP · Bit24 · REGENDA 2025
        </p>
      </div>
    </div>
  );
}
