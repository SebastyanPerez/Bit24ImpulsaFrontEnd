import React from "react";
import { C } from "../../data/datosRegenda";
import { ArrowUpRight } from "lucide-react";

// ─── Design System Components ─────────────────────────────────────────────────

/** Tarjeta con esquina doblada — estilo icono1 (fondo claro, ícono línea púrpura) */
export function OutlineIconCard({
  icon,
  size = 48,
}: {
  icon: React.ReactNode;
  size?: number;
}) {
  const clip = `polygon(0 0, calc(100% - ${size * 0.28}px) 0, 100% ${size * 0.28}px, 100% 100%, 0 100%)`;
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: C.purpleLight,
        clipPath: clip,
        border: `1.5px solid ${C.purple}22`,
      }}
    >
      {/* Dog-ear fold */}
      <div
        className="absolute top-0 right-0 flex items-center justify-center"
        style={{
          width: size * 0.28,
          height: size * 0.28,
          background: `linear-gradient(135deg, transparent 50%, ${C.purple}18 50%)`,
        }}
      />
      <span style={{ color: C.purple }}>{icon}</span>
    </div>
  );
}

/** Tarjeta sólida teal — estilo icono2 (fondo teal, ícono blanco relleno) */
export function FilledIconCard({
  icon,
  size = 48,
  color = C.teal,
}: {
  icon: React.ReactNode;
  size?: number;
  color?: string;
}) {
  return (
    <div
      className="flex items-center justify-center flex-shrink-0 rounded-2xl"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      <span style={{ color: C.white }}>{icon}</span>
    </div>
  );
}

/** Barra de progreso con gradiente corporativo */
export function ProgressBar({
  value,
  color = C.purple,
  size = "md",
}: {
  value: number;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const h =
    size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <div
      className={`w-full ${h} rounded-full overflow-hidden`}
      style={{ backgroundColor: `${color}20` }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
        }}
      />
    </div>
  );
}

/** Badge de estado — Gestalt similitud: mismo estilo en toda la app */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    completado: {
      label: "Completado",
      color: C.teal,
      bg: C.tealLight,
    },
    en_proceso: {
      label: "En proceso",
      color: C.purple,
      bg: C.purpleLight,
    },
    pendiente: {
      label: "Pendiente",
      color: C.gray,
      bg: C.grayLight,
    },
    en_atencion: {
      label: "En atención",
      color: "#b37000",
      bg: C.yellowLight,
    },
    resuelto: {
      label: "Resuelto",
      color: C.teal,
      bg: C.tealLight,
    },
    bajo: { label: "Bajo", color: C.teal, bg: C.tealLight },
    medio: {
      label: "Medio",
      color: "#b37000",
      bg: C.yellowLight,
    },
    alto: { label: "Alto ⚠", color: C.red, bg: C.redLight },
    alta: { label: "Alta", color: C.red, bg: C.redLight },
    media: {
      label: "Media",
      color: "#b37000",
      bg: C.yellowLight,
    },
    baja: { label: "Baja", color: C.teal, bg: C.tealLight },
  };
  const s = map[status] ?? map.pendiente;
  return (
    <span
      className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap"
      style={{
        color: s.color,
        backgroundColor: s.bg,
        fontFamily: "var(--font-brand)",
      }}
    >
      {s.label}
    </span>
  );
}

/** KPI Card — Gestalt jerarquía visual: número grande → etiqueta → subtítulo */
export function KPICard({
  icon,
  label,
  value,
  sub,
  color,
  trend,
  iconStyle = "filled",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
  trend?: string;
  iconStyle?: "filled" | "outline";
}) {
  return (
    <div
      className="bg-white rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow duration-200"
      style={{
        border: `1px solid ${color}18`,
        boxShadow: `0 2px 8px ${color}0d`,
      }}
    >
      <div className="flex items-start justify-between">
        {iconStyle === "filled" ? (
          <FilledIconCard icon={icon} size={44} color={color} />
        ) : (
          <OutlineIconCard icon={icon} size={44} />
        )}
        {trend && (
          <span
            className="flex items-center gap-0.5 text-xs font-bold"
            style={{
              color: C.teal,
              fontFamily: "var(--font-brand)",
            }}
          >
            <ArrowUpRight size={12} />
            {trend}
          </span>
        )}
      </div>
      <div>
        {/* Jerarquía: valor (más grande) → etiqueta → subtítulo */}
        <p
          className="text-2xl font-extrabold tracking-tight"
          style={{ color, fontFamily: "var(--font-brand)" }}
        >
          {value}
        </p>
        <p
          className="text-sm font-semibold mt-0.5"
          style={{
            color: "#2a1028",
            fontFamily: "var(--font-brand)",
          }}
        >
          {label}
        </p>
        <p
          className="text-xs mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          {sub}
        </p>
      </div>
    </div>
  );
}

/** Botón primario corporativo */
export function BtnPrimary({
  children,
  onClick,
  disabled,
  small,
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center gap-2 font-bold rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
        color: C.white,
        fontFamily: "var(--font-brand)",
        padding: small ? "6px 14px" : "10px 20px",
        fontSize: small ? "12px" : "14px",
        minHeight: "30px" /* mínimo 28.5px per spec */,
      }}
    >
      {children}
    </button>
  );
}

/** Botón secundario teal */
export function BtnSecondary({
  children,
  onClick,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 font-bold rounded-xl transition-all hover:opacity-90 active:scale-95"
      style={{
        background: `linear-gradient(135deg, ${C.teal}, #2d9a93)`,
        color: C.white,
        fontFamily: "var(--font-brand)",
        padding: small ? "6px 14px" : "10px 20px",
        fontSize: small ? "12px" : "14px",
        minHeight: "30px",
      }}
    >
      {children}
    </button>
  );
}

/** Botón ghost */
export function BtnGhost({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 font-semibold rounded-xl transition-all hover:opacity-90"
      style={{
        backgroundColor: active ? C.purpleLight : "transparent",
        border: `1px solid ${active ? C.purple : "#ddd"}`,
        color: active ? C.purple : C.gray,
        fontFamily: "var(--font-brand)",
        padding: "6px 14px",
        fontSize: "12px",
        minHeight: "30px",
      }}
    >
      {children}
    </button>
  );
}
