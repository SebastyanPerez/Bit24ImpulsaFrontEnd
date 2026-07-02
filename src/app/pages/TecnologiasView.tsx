import { Cloud, Database, Globe, Info, Lock, Phone, Sparkles } from "lucide-react";
import { C } from "../data/datosRegenda";
import {
  FilledIconCard,
  OutlineIconCard,
} from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 9: Tecnologías aplicadas ─────────────────────────────────────────
export default function TecnologiasView() {
  const techs = [
    {
      icon: <Cloud size={26} />,
      name: "Cloud Computing",
      desc: "Almacenamiento y despliegue escalable en la nube para acceso desde cualquier dispositivo.",
      color: C.purple,
      detail: "AWS / Azure / GCP",
      style: "filled",
    },
    {
      icon: <Sparkles size={26} />,
      name: "IA Generativa",
      desc: "Asistente conversacional en lenguaje natural para guiar al usuario en el uso del ERP.",
      color: C.purpleMid,
      detail: "OpenAI / Claude API",
      style: "outline",
    },
    {
      icon: <Phone size={26} />,
      name: "API WhatsApp Business",
      desc: "Alertas automáticas a usuarios con baja actividad directamente por WhatsApp.",
      color: C.teal,
      detail: "WhatsApp Business API",
      style: "filled",
    },
    {
      icon: <Database size={26} />,
      name: "Base de Datos",
      desc: "Registro estructurado de usuarios, rutas de aprendizaje, tareas y casos de soporte.",
      color: C.purple,
      detail: "PostgreSQL / Supabase",
      style: "outline",
    },
    {
      icon: <Globe size={26} />,
      name: "GUI Web Responsive",
      desc: "Interfaz moderna en React con diseño adaptable a laptop y smartphone.",
      color: C.teal,
      detail: "React + Tailwind CSS",
      style: "filled",
    },
    {
      icon: <Lock size={26} />,
      name: "Seguridad y Roles",
      desc: "Autenticación por rol, permisos diferenciados y trazabilidad de acciones por usuario.",
      color: C.red,
      detail: "JWT / RBAC",
      style: "outline",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-extrabold"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          Tecnologías Aplicadas
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Stack tecnológico propuesto para Bit24 Impulsa —
          piloto REGENDA
        </p>
      </div>

      <div
        className="flex items-start gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: C.purpleLight,
          border: `1px solid ${C.purple}20`,
        }}
      >
        <Info
          size={16}
          style={{ color: C.purple, flexShrink: 0 }}
        />
        <p
          className="text-sm"
          style={{
            color: C.purple,
            fontFamily: "var(--font-body)",
          }}
        >
          Esta demo representa el{" "}
          <strong>20% inicial del proyecto</strong>. Las
          integraciones con Cloud, WhatsApp API e IA generativa
          están simuladas en esta versión para fines
          expositivos.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {techs.map((t) => (
          <div
            key={t.name}
            className="bg-white rounded-2xl p-5 flex flex-col gap-4 hover:shadow-lg transition-shadow"
            style={{
              border: `1.5px solid ${t.color}18`,
              boxShadow: `0 2px 8px ${t.color}08`,
            }}
          >
            {t.style === "filled" ? (
              <FilledIconCard
                icon={t.icon}
                size={52}
                color={t.color}
              />
            ) : (
              <OutlineIconCard icon={t.icon} size={52} />
            )}
            <div>
              <h3
                className="font-extrabold text-base"
                style={{
                  color: "#2a1028",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {t.name}
              </h3>
              <p
                className="text-xs mt-1.5 leading-relaxed"
                style={{
                  color: C.gray,
                  fontFamily: "var(--font-body)",
                }}
              >
                {t.desc}
              </p>
            </div>
            <span
              className="mt-auto text-xs font-extrabold px-3 py-1.5 rounded-full self-start"
              style={{
                backgroundColor: `${t.color}15`,
                color: t.color,
                fontFamily: "var(--font-brand)",
              }}
            >
              {t.detail}
            </span>
          </div>
        ))}
      </div>

      <div
        className="bg-white rounded-2xl p-5"
        style={{ border: `1px solid ${C.purple}10` }}
      >
        <h2
          className="font-extrabold text-base mb-4"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          Arquitectura propuesta
        </h2>
        <div className="flex flex-wrap gap-2 items-center justify-center">
          {[
            "Usuario REGENDA",
            "→",
            "GUI Web (React)",
            "→",
            "API REST",
            "→",
            "Base de datos",
            "→",
            "IA / WhatsApp / Cloud",
          ].map((s, i) => (
            <span
              key={i}
              className={
                s === "→"
                  ? "font-bold text-lg"
                  : "text-sm font-semibold px-3 py-1.5 rounded-xl"
              }
              style={
                s === "→"
                  ? {
                      color: `${C.purple}40`,
                      fontFamily: "var(--font-brand)",
                    }
                  : {
                      backgroundColor: C.purpleLight,
                      color: C.purple,
                      border: `1px solid ${C.purple}15`,
                      fontFamily: "var(--font-brand)",
                    }
              }
            >
              {s}
            </span>
          ))}
        </div>
        <p
          className="text-xs text-center mt-4"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Arquitectura modular y escalable — preparada para ML,
          predicción de abandono, scoring de adopción y
          gamificación en fases futuras.
        </p>
      </div>
    </div>
  );
}
