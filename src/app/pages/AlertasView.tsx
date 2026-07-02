import { useState } from "react";
import { AlertTriangle, ToggleLeft, ToggleRight, Phone, CheckCircle2 } from "lucide-react";
import { C, whatsappAlerts } from "../data/datosRegenda";
import { BtnGhost } from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 6: Alertas WhatsApp simuladas ─────────────────────────────────────
export default function AlertasView() {
  const [alerts, setAlerts] = useState(whatsappAlerts);
  const [preview, setPreview] = useState<number | null>(null);

  function toggle(id: number) {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, enabled: !a.enabled } : a,
      ),
    );
  }

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
          Alertas WhatsApp
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Notificaciones automáticas simuladas — no se envían
          mensajes reales
        </p>
      </div>

      {/* Info banner — figura-fondo */}
      <div
        className="flex items-start gap-3 rounded-2xl p-4"
        style={{
          backgroundColor: C.tealLight,
          border: `1px solid ${C.teal}30`,
        }}
      >
        <Phone
          size={18}
          style={{ color: C.teal, flexShrink: 0 }}
        />
        <div>
          <p
            className="text-sm font-extrabold"
            style={{
              color: "#1a5f5a",
              fontFamily: "var(--font-brand)",
            }}
          >
            Integración WhatsApp Business API — Simulada
          </p>
          <p
            className="text-xs mt-0.5"
            style={{
              color: "#2d8a83",
              fontFamily: "var(--font-body)",
            }}
          >
            En producción se integraría con la API oficial de
            WhatsApp Business para enviar alertas automáticas al
            detectar las condiciones configuradas.
          </p>
        </div>
      </div>

      {/* Alert cards */}
      <div className="flex flex-col gap-4">
        {alerts.map((a) => (
          <div
            key={a.id}
            className="bg-white rounded-2xl overflow-hidden transition-all"
            style={{
              border: `1.5px solid ${a.enabled ? a.color : "#e8e0e8"}`,
              opacity: a.enabled ? 1 : 0.6,
              boxShadow: a.enabled
                ? `0 2px 12px ${a.color}12`
                : "none",
            }}
          >
            <div className="p-4">
              {/* Header alerta */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className="text-xs font-extrabold px-2.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: `${a.color}15`,
                        color: a.color,
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      {a.area}
                    </span>
                    <AlertTriangle
                      size={12}
                      style={{ color: a.color }}
                    />
                    <span
                      className="text-xs"
                      style={{
                        color: C.gray,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {a.condition}
                    </span>
                  </div>
                  <p
                    className="font-extrabold text-sm"
                    style={{
                      color: "#2a1028",
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    Para: {a.user}
                  </p>
                </div>
                {/* Toggle — Gestalt similitud: mismo control en todas las alertas */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: C.gray,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    {a.enabled ? "Activa" : "Inactiva"}
                  </span>
                  <button onClick={() => toggle(a.id)}>
                    {a.enabled ? (
                      <ToggleRight
                        size={28}
                        style={{ color: a.color }}
                      />
                    ) : (
                      <ToggleLeft
                        size={28}
                        style={{ color: "#ccc" }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <BtnGhost
                  active={preview === a.id}
                  onClick={() =>
                    setPreview(preview === a.id ? null : a.id)
                  }
                >
                  {preview === a.id
                    ? "Ocultar vista previa"
                    : "Ver mensaje WhatsApp"}
                </BtnGhost>
                {a.enabled && (
                  <span
                    className="text-xs font-bold flex items-center gap-1"
                    style={{
                      color: C.teal,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    <CheckCircle2 size={12} /> Alerta activa
                  </span>
                )}
              </div>

              {/* Vista previa WhatsApp */}
              {preview === a.id && (
                <div
                  className="mt-4 rounded-2xl p-4"
                  style={{ backgroundColor: "#e5ddd5" }}
                >
                  <p
                    className="text-xs text-center mb-3"
                    style={{
                      color: "#888",
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Vista previa — no enviado
                  </p>
                  <div className="bg-white rounded-2xl rounded-tr-sm p-3 shadow-sm max-w-xs ml-auto">
                    <p
                      className="text-sm whitespace-pre-line leading-relaxed"
                      style={{
                        color: "#2a1028",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {a.message}
                    </p>
                    <div
                      className="mt-2 pt-2"
                      style={{
                        borderTop: `1px solid ${C.purple}10`,
                      }}
                    >
                      <button
                        className="text-xs font-bold flex items-center gap-1 hover:underline"
                        style={{
                          color: C.purple,
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        <CheckCircle2 size={11} /> {a.action}
                      </button>
                    </div>
                    <p
                      className="text-xs text-right mt-1.5"
                      style={{
                        color: "#aaa",
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Bit24 Impulsa · Enviado automáticamente
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
