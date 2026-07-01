/**
 * Bit24 Impulsa — Demo 20% inicial
 * Cliente piloto: REGENDA (repuestos y accesorios para motocicletas)
 * Curso: Innovación y Transformación Digital
 *
 * Sistema de diseño:
 *  Paleta primaria : #5D1451 (purple) · #3DB1AA (teal)
 *  Paleta secundaria: #e34038 (red) · #ffd37f (yellow)
 *  Complementarios : #666666 · #ffffff
 *  Tipografía brand: Montserrat (Gotham substitute)
 *  Tipografía body : Nunito (Calibri substitute)
 *  Gestalt         : proximidad, similitud, jerarquía, figura-fondo, continuidad
 */

import { useState } from "react";
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Bot,
  MessageSquare,
  Headphones,
  Shield,
  Layers,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Menu,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Zap,
  ArrowUpRight,
  ArrowRight,
  Send,
  ToggleLeft,
  ToggleRight,
  Phone,
  Database,
  Lock,
  Globe,
  Cloud,
  Info,
  Plus,
  Bell,
  FileText,
  RefreshCw,
  CheckSquare,
  MoreHorizontal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import bit24Logo from "@/imports/bit24_logo.png";

// ─── Brand tokens (JS mirror of CSS vars) ────────────────────────────────────
const C = {
  purple: "#5D1451",
  teal: "#3DB1AA",
  red: "#e34038",
  yellow: "#ffd37f",
  gray: "#666666",
  white: "#ffffff",
  purpleLight: "#f5f0f5",
  tealLight: "#e8f7f6",
  redLight: "#fdecea",
  yellowLight: "#fff8e7",
  grayLight: "#f4f2f5",
  purpleMid: "#8a2b7a",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type RolId =
  | "ventas"
  | "caja"
  | "almacen"
  | "compras"
  | "administracion"
  | "responsable";
type NavId =
  | "dashboard"
  | "ruta"
  | "microaprendizaje"
  | "ia"
  | "alertas"
  | "soporte"
  | "responsable"
  | "tecnologias";

interface TaskItem {
  id: number;
  title: string;
  desc: string;
  status: "completado" | "en_proceso" | "pendiente";
}

// ─── Datos simulados REGENDA ──────────────────────────────────────────────────
const roleConfig: Record<
  RolId,
  {
    label: string;
    color: string;
    user: string;
    tasks: TaskItem[];
    progress: number;
  }
> = {
  ventas: {
    label: "Ventas",
    color: C.purple,
    user: "Ana Torres",
    progress: 75,
    tasks: [
      {
        id: 1,
        title: "Registrar venta rápida",
        desc: "Emitir boleta o factura desde el punto de venta.",
        status: "completado",
      },
      {
        id: 2,
        title: "Consultar stock disponible",
        desc: "Verificar disponibilidad antes de confirmar venta.",
        status: "completado",
      },
      {
        id: 3,
        title: "Emitir comprobante electrónico",
        desc: "Generar PDF y enviar al cliente.",
        status: "en_proceso",
      },
      {
        id: 4,
        title: "Revisar cierre de caja",
        desc: "Conciliar ventas del día con caja.",
        status: "pendiente",
      },
    ],
  },
  caja: {
    label: "Caja",
    color: C.teal,
    user: "Miguel Salazar",
    progress: 60,
    tasks: [
      {
        id: 1,
        title: "Apertura de caja",
        desc: "Registrar monto inicial del día.",
        status: "completado",
      },
      {
        id: 2,
        title: "Registrar cobros",
        desc: "Ingresar pagos en efectivo, tarjeta y transferencia.",
        status: "en_proceso",
      },
      {
        id: 3,
        title: "Cierre de caja diario",
        desc: "Totalizar y registrar el cierre.",
        status: "pendiente",
      },
      {
        id: 4,
        title: "Revisión de diferencias",
        desc: "Identificar y justificar diferencias de caja.",
        status: "pendiente",
      },
    ],
  },
  almacen: {
    label: "Almacén",
    color: C.yellow,
    user: "Carlos Ruiz",
    progress: 40,
    tasks: [
      {
        id: 1,
        title: "Registrar entrada de mercadería",
        desc: "Ingresar productos recibidos al sistema.",
        status: "completado",
      },
      {
        id: 2,
        title: "Actualizar stock",
        desc: "Ajustar existencias según conteo físico.",
        status: "pendiente",
      },
      {
        id: 3,
        title: "Revisar órdenes de compra",
        desc: "Confirmar recepción conforme a órdenes emitidas.",
        status: "pendiente",
      },
      {
        id: 4,
        title: "Generar reporte de inventario",
        desc: "Exportar listado actualizado de productos.",
        status: "pendiente",
      },
    ],
  },
  compras: {
    label: "Compras",
    color: C.purpleMid,
    user: "Resp. de Compras",
    progress: 55,
    tasks: [
      {
        id: 1,
        title: "Crear orden de compra",
        desc: "Generar OC para proveedor aprobado.",
        status: "completado",
      },
      {
        id: 2,
        title: "Aprobar proveedores",
        desc: "Validar y registrar nuevos proveedores.",
        status: "en_proceso",
      },
      {
        id: 3,
        title: "Registrar recepción",
        desc: "Confirmar ingreso contra OC.",
        status: "pendiente",
      },
      {
        id: 4,
        title: "Conciliar facturas",
        desc: "Cruzar facturas con órdenes de compra.",
        status: "pendiente",
      },
    ],
  },
  administracion: {
    label: "Administración",
    color: C.teal,
    user: "Laura Pérez",
    progress: 80,
    tasks: [
      {
        id: 1,
        title: "Gestionar usuarios del sistema",
        desc: "Crear, editar y asignar roles.",
        status: "completado",
      },
      {
        id: 2,
        title: "Revisar reportes financieros",
        desc: "Analizar ingresos, gastos y márgenes.",
        status: "completado",
      },
      {
        id: 3,
        title: "Aprobar solicitudes de compra",
        desc: "Autorizar órdenes pendientes.",
        status: "en_proceso",
      },
      {
        id: 4,
        title: "Configurar permisos por área",
        desc: "Ajustar accesos según responsabilidades.",
        status: "pendiente",
      },
    ],
  },
  responsable: {
    label: "Responsable Interno",
    color: C.red,
    user: "Responsable Adopción",
    progress: 68,
    tasks: [
      {
        id: 1,
        title: "Revisar panel de adopción",
        desc: "Monitorear avance por área.",
        status: "completado",
      },
      {
        id: 2,
        title: "Enviar alertas a usuarios",
        desc: "Notificar a usuarios sin actividad.",
        status: "en_proceso",
      },
      {
        id: 3,
        title: "Revisar casos de soporte",
        desc: "Gestionar tickets pendientes.",
        status: "en_proceso",
      },
      {
        id: 4,
        title: "Generar informe semanal",
        desc: "Reporte de adopción para gerencia.",
        status: "pendiente",
      },
    ],
  },
};

const areaStats = [
  {
    area: "Ventas",
    user: "Ana Torres",
    progress: 75,
    lastActivity: "hace 2 horas",
    risk: "bajo",
    action: "Continuar con módulo de comprobantes",
    color: C.purple,
  },
  {
    area: "Caja",
    user: "Miguel Salazar",
    progress: 60,
    lastActivity: "hace 1 día",
    risk: "medio",
    action: "Completar módulo de cierre de caja",
    color: C.teal,
  },
  {
    area: "Almacén",
    user: "Carlos Ruiz",
    progress: 40,
    lastActivity: "hace 3 días",
    risk: "alto",
    action: "Retomar inmediatamente — sin actividad",
    color: C.red,
  },
  {
    area: "Compras",
    user: "Sin asignar",
    progress: 55,
    lastActivity: "hace 5 horas",
    risk: "medio",
    action: "Asignar responsable y completar aprobaciones",
    color: C.purpleMid,
  },
  {
    area: "Administración",
    user: "Laura Pérez",
    progress: 80,
    lastActivity: "hace 30 min",
    risk: "bajo",
    action: "Avance óptimo — continuar con reportes",
    color: C.teal,
  },
];

const adoptionTrend = [
  { sem: "S1", avance: 15 },
  { sem: "S2", avance: 32 },
  { sem: "S3", avance: 45 },
  { sem: "S4", avance: 58 },
  { sem: "S5", avance: 63 },
  { sem: "S6", avance: 72 },
];

const supportCases = [
  {
    id: "SOC-001",
    title: "No aparece producto en búsqueda",
    area: "Almacén",
    priority: "alta",
    status: "en_atencion",
    responsible: "Equipo Bit24",
    date: "29 Jun 2025",
  },
  {
    id: "SOC-002",
    title: "Duda sobre cómo emitir nota de crédito",
    area: "Ventas",
    priority: "media",
    status: "resuelto",
    responsible: "Ana Torres",
    date: "27 Jun 2025",
  },
  {
    id: "SOC-003",
    title: "Error al registrar recepción",
    area: "Almacén",
    priority: "alta",
    status: "pendiente",
    responsible: "Sin asignar",
    date: "30 Jun 2025",
  },
];

const whatsappAlerts = [
  {
    id: 1,
    area: "Almacén",
    user: "Carlos Ruiz",
    condition: "3 días sin actualización de stock",
    enabled: true,
    color: C.red,
    message:
      "📦 REGENDA · Almacén\n\nHola Carlos, llevás 3 días sin registrar movimientos en Almacén.\n\nRecordá actualizar el stock para evitar inconsistencias. ¿Necesitás ayuda?",
    action:
      "Ver guía de actualización de stock en Bit24 Impulsa",
  },
  {
    id: 2,
    area: "Caja",
    user: "Miguel Salazar",
    condition: "Cierre de caja pendiente",
    enabled: true,
    color: C.teal,
    message:
      "💵 REGENDA · Caja\n\nMiguel, el cierre de caja del día 30/06 aún no fue registrado.\n\nPor favor realizá el cierre antes de las 18:00 para evitar diferencias.",
    action: "Ir al módulo de Cierre de Caja",
  },
  {
    id: 3,
    area: "Ventas",
    user: "Nuevo usuario",
    condition: "Usuario nuevo sin completar guía inicial",
    enabled: false,
    color: C.purple,
    message:
      "🎯 REGENDA · Ventas\n\nHay un usuario nuevo en Ventas que aún no completó la guía de inicio.\n\nAcompañá su proceso para garantizar una adopción exitosa.",
    action: "Ver ruta de adopción del usuario",
  },
];

const microlessons = [
  {
    id: 1,
    title: "Cómo registrar una venta rápida",
    category: "Ventas",
    duration: "5 min",
    learned: false,
    steps: [
      "Ingresá al módulo Ventas → Nueva Venta.",
      "Buscá el cliente o seleccioná 'Cliente General'.",
      "Agregá los productos con su cantidad.",
      "Seleccioná el tipo de comprobante (boleta o factura).",
      "Confirmá y emití el comprobante.",
    ],
  },
  {
    id: 2,
    title: "Cómo revisar el stock disponible",
    category: "Almacén",
    duration: "3 min",
    learned: false,
    steps: [
      "Ve al módulo Almacén → Consulta de Stock.",
      "Buscá el producto por código o nombre.",
      "Verificá la cantidad disponible y ubicación.",
      "Si hay diferencias, registrá un ajuste con motivo.",
    ],
  },
  {
    id: 3,
    title: "Cómo registrar una devolución",
    category: "Ventas",
    duration: "7 min",
    learned: true,
    steps: [
      "Accedé a Ventas → Comprobantes emitidos.",
      "Buscá la venta original por número o fecha.",
      "Seleccioná 'Emitir Nota de Crédito'.",
      "Indicá los productos devueltos y el motivo.",
      "Confirmá — el stock se actualiza automáticamente.",
    ],
  },
  {
    id: 4,
    title: "Apertura y cierre de caja",
    category: "Caja",
    duration: "4 min",
    learned: false,
    steps: [
      "Ingresá a Caja → Apertura y registrá el monto inicial.",
      "Durante el día registrá todos los cobros.",
      "Al finalizar ve a Caja → Cierre diario.",
      "Compará el total del sistema con el efectivo real.",
      "Justificá diferencias si las hay y confirmá el cierre.",
    ],
  },
];

const aiResponses: Record<string, string> = {
  "¿Cómo registro una devolución?":
    "Para registrar una devolución en Bit24:\n\n1. Ve a **Ventas → Comprobantes emitidos**.\n2. Buscá la venta por número o fecha.\n3. Seleccioná **Emitir Nota de Crédito**.\n4. Indicá los productos devueltos y el motivo.\n5. Confirmá — el stock se actualiza solo.\n\n¿Querés ver la guía completa en Microaprendizaje?",
  "¿Cómo reviso el stock?":
    "Para revisar el stock disponible:\n\n1. Ingresá al módulo **Almacén → Consulta de Stock**.\n2. Buscá el producto por código o nombre.\n3. Verificá cantidad disponible, ubicación y lote.\n4. Si hay diferencias, registrá un **Ajuste de Stock**.\n\n¿Necesitás saber cómo hacer un ajuste?",
  "¿Qué hago si no aparece un producto?":
    "Si un producto no aparece en la búsqueda:\n\n1. Verificá que el nombre o código esté bien escrito.\n2. Revisá que el producto esté activo en **Almacén → Productos**.\n3. Confirmá que tenga stock mayor a cero.\n4. Si sigue sin aparecer, abrí un **ticket de soporte** con el código del producto.",
  "¿Cómo emito una factura?":
    "Para emitir una factura electrónica:\n\n1. Ve a **Ventas → Nueva Venta**.\n2. Seleccioná el cliente y agregá los productos.\n3. En tipo de comprobante elegí **Factura**.\n4. Ingresá el RUC del cliente.\n5. Confirmá — el sistema enviará la factura automáticamente.",
};

// ─── Design System Components ─────────────────────────────────────────────────

/** Tarjeta con esquina doblada — estilo icono1 (fondo claro, ícono línea púrpura) */
function OutlineIconCard({
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
function FilledIconCard({
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
function ProgressBar({
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
function StatusBadge({ status }: { status: string }) {
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
function KPICard({
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
function BtnPrimary({
  children,
  onClick,
  disabled,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  small?: boolean;
}) {
  return (
    <button
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
function BtnSecondary({
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
function BtnGhost({
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

// ─── MÓDULO 1: Login por rol ───────────────────────────────────────────────────
function LoginScreen({
  onLogin,
}: {
  onLogin: (rol: RolId) => void;
}) {
  const [selected, setSelected] = useState<RolId | null>(null);

  const roles: {
    id: RolId;
    label: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      id: "ventas",
      label: "Ventas",
      icon: <TrendingUp size={20} />,
      color: C.purple,
    },
    {
      id: "caja",
      label: "Caja",
      icon: <CheckSquare size={20} />,
      color: C.teal,
    },
    {
      id: "almacen",
      label: "Almacén",
      icon: <Database size={20} />,
      color: C.red,
    },
    {
      id: "compras",
      label: "Compras",
      icon: <FileText size={20} />,
      color: C.purpleMid,
    },
    {
      id: "administracion",
      label: "Administración",
      icon: <Globe size={20} />,
      color: C.teal,
    },
    {
      id: "responsable",
      label: "Responsable Interno",
      icon: <Shield size={20} />,
      color: C.red,
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `linear-gradient(145deg, ${C.purpleLight} 0%, #ffffff 50%, ${C.tealLight} 100%)`,
      }}
    >
      {/* Demo badge — Gestalt figura-fondo: el badge destaca sobre el fondo claro */}
      <div
        className="mb-6 flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full"
        style={{
          backgroundColor: C.yellowLight,
          border: `1px solid ${C.yellow}`,
          color: "#7a4f00",
          fontFamily: "var(--font-brand)",
        }}
      >
        <Info size={12} /> Demo preliminar 20% · Piloto REGENDA
        · Innovación y Transformación Digital
      </div>

      {/* Card login — figura-fondo: blanco sobre fondo degradado */}
      <div
        className="bg-white rounded-3xl w-full max-w-md p-8"
        style={{
          boxShadow: `0 20px 60px ${C.purple}20`,
          border: `1px solid ${C.purple}12`,
        }}
      >
        {/* Logo — Gestalt continuidad: marca presente en todo el flujo */}
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
              Módulo de adopción digital ·{" "}
              <strong>REGENDA</strong>
            </p>
          </div>
        </div>

        {/* Selector de rol — Gestalt proximidad: botones agrupados con espaciado uniforme */}
        <p
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          Seleccioná tu rol
        </p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {roles.map((r) => {
            const isSelected = selected === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className="flex items-center gap-2.5 px-3 py-3.5 rounded-2xl text-sm font-semibold text-left transition-all hover:scale-105"
                style={{
                  border: `2px solid ${isSelected ? r.color : "#e8e0e8"}`,
                  backgroundColor: isSelected
                    ? `${r.color}10`
                    : "#fafafa",
                  color: isSelected ? r.color : C.gray,
                  fontFamily: "var(--font-brand)",
                  minHeight: "48px",
                }}
              >
                <span
                  style={{
                    color: isSelected ? r.color : "#bbb",
                  }}
                >
                  {r.icon}
                </span>
                {r.label}
              </button>
            );
          })}
        </div>

        <BtnPrimary
          onClick={() => selected && onLogin(selected)}
          disabled={!selected}
        >
          <Play size={15} /> Ingresar al dashboard
        </BtnPrimary>

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

      <p
        className="text-xs text-center mt-6 max-w-sm"
        style={{
          color: C.gray,
          fontFamily: "var(--font-body)",
        }}
      >
        Demo funcional del 20% inicial. Los datos son ficticios
        y no requieren backend ni login real.
      </p>
    </div>
  );
}

// ─── MÓDULO 2: Dashboard post-login ───────────────────────────────────────────
function DashboardView({ rol }: { rol: RolId }) {
  const cfg = roleConfig[rol];
  const completedTasks = cfg.tasks.filter(
    (t) => t.status === "completado",
  ).length;
  const pendingTasks = cfg.tasks.filter(
    (t) => t.status !== "completado",
  ).length;
  const activeAlerts = whatsappAlerts.filter(
    (a) => a.enabled,
  ).length;

  /* Gestalt similitud: todas las KPI cards tienen igual forma, tamaño y estructura */
  const iconAlternate = (i: number) =>
    i % 2 === 0 ? "filled" : "outline";

  return (
    <div className="flex flex-col gap-6">
      {/* Encabezado — Gestalt jerarquía visual */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-xl font-extrabold"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Bienvenido, {cfg.user} 👋
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: C.gray,
              fontFamily: "var(--font-body)",
            }}
          >
            Área:{" "}
            <span
              className="font-bold"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>{" "}
            · REGENDA · 1 julio 2025
          </p>
        </div>
        <div
          className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: C.yellowLight,
            border: `1px solid ${C.yellow}`,
            color: "#7a4f00",
            fontFamily: "var(--font-brand)",
          }}
        >
          <Info size={11} /> Demo 20% — Datos simulados REGENDA
        </div>
      </div>

      {/* KPIs — Gestalt proximidad: grupo de métricas unidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<TrendingUp size={18} />}
          label="Adopción del área"
          value={`${cfg.progress}%`}
          sub="Meta: 90% este mes"
          color={cfg.color}
          trend="+5%"
          iconStyle={iconAlternate(0)}
        />
        <KPICard
          icon={<CheckCircle2 size={18} />}
          label="Tareas completadas"
          value={`${completedTasks}`}
          sub={`${pendingTasks} pendientes`}
          color={C.teal}
          iconStyle={iconAlternate(1)}
        />
        <KPICard
          icon={<AlertTriangle size={18} />}
          label="Alertas activas"
          value={`${activeAlerts}`}
          sub="Requieren atención"
          color={C.red}
          iconStyle={iconAlternate(2)}
        />
        <KPICard
          icon={<Headphones size={18} />}
          label="Casos de soporte"
          value="3"
          sub="1 pendiente, 1 en atención"
          color={C.purpleMid}
          iconStyle={iconAlternate(3)}
        />
      </div>

      {/* Chart + avance por área — Gestalt continuidad */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div
          className="lg:col-span-2 bg-white rounded-2xl p-5"
          style={{
            border: `1px solid ${C.purple}10`,
            boxShadow: `0 2px 12px ${C.purple}08`,
          }}
        >
          <h2
            className="font-extrabold text-base mb-0.5"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Progreso de adopción — REGENDA
          </h2>
          <p
            className="text-xs mb-4"
            style={{
              color: C.gray,
              fontFamily: "var(--font-body)",
            }}
          >
            Avance acumulado del equipo (últimas 6 semanas)
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart
              data={adoptionTrend}
              margin={{
                top: 4,
                right: 4,
                bottom: 0,
                left: -20,
              }}
            >
              <defs>
                <linearGradient
                  id="areaGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={C.purple}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor={C.purple}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0ebf0"
              />
              <XAxis
                dataKey="sem"
                tick={{ fontSize: 11, fill: C.gray }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: C.gray }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  background: "#fff",
                  border: `1px solid ${C.purple}20`,
                  borderRadius: 10,
                  fontSize: 12,
                }}
              />
              <Area
                type="monotone"
                dataKey="avance"
                stroke={C.purple}
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                name="Adopción %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className="bg-white rounded-2xl p-5"
          style={{
            border: `1px solid ${C.teal}15`,
            boxShadow: `0 2px 12px ${C.teal}08`,
          }}
        >
          <h2
            className="font-extrabold text-base mb-4"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Avance por área
          </h2>
          <div className="flex flex-col gap-4">
            {areaStats.map((a) => (
              <div key={a.area}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span
                    className="font-semibold"
                    style={{
                      color: "#2a1028",
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    {a.area}
                  </span>
                  <span
                    className="font-extrabold"
                    style={{
                      color: a.color,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    {a.progress}%
                  </span>
                </div>
                <ProgressBar
                  value={a.progress}
                  color={a.color}
                  size="sm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tareas recientes */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ border: `1px solid ${C.purple}10` }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-extrabold text-base"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Mis tareas recientes
          </h2>
          <span
            className="text-xs font-bold cursor-pointer hover:underline"
            style={{
              color: C.teal,
              fontFamily: "var(--font-brand)",
            }}
          >
            Ver ruta completa →
          </span>
        </div>
        {/* Gestalt proximidad: tareas agrupadas en grid con separación uniforme */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cfg.tasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{
                border: `1px solid ${C.purple}0d`,
                backgroundColor: "#fdfbfd",
              }}
            >
              <span>
                {t.status === "completado" ? (
                  <CheckCircle2 size={18} color={C.teal} />
                ) : t.status === "en_proceso" ? (
                  <RefreshCw size={18} color={C.purple} />
                ) : (
                  <Clock size={18} color={C.gray} />
                )}
              </span>
              <p
                className="text-sm font-semibold flex-1 truncate"
                style={{
                  color: "#2a1028",
                  fontFamily: "var(--font-brand)",
                }}
              >
                {t.title}
              </p>
              <StatusBadge status={t.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Recomendación IA — Gestalt figura-fondo: bloque oscuro destaca */}
      <div
        className="rounded-2xl p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${C.purple} 0%, ${C.purpleMid} 100%)`,
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          >
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p
              className="font-extrabold text-sm mb-1"
              style={{ fontFamily: "var(--font-brand)" }}
            >
              Recomendación de Impulsa AI
            </p>
            <p
              className="text-sm leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-body)",
              }}
            >
              Hola {cfg.user}. Según tu avance en{" "}
              <strong className="text-white">
                {cfg.label}
              </strong>
              , te recomendamos completar{" "}
              <strong className="text-white">
                "
                {cfg.tasks.find(
                  (t) => t.status !== "completado",
                )?.title ?? "tu siguiente tarea"}
                "
              </strong>{" "}
              hoy. Esto subirá tu adopción del área al menos 8
              puntos.
            </p>
          </div>
          <BtnSecondary small onClick={() => {}}>
            <Play size={12} /> Ir ahora
          </BtnSecondary>
        </div>
      </div>
    </div>
  );
}

// ─── MÓDULO 3: Ruta de adopción por rol ───────────────────────────────────────
function RutaView({ rol }: { rol: RolId }) {
  const [tasks, setTasks] = useState(roleConfig[rol].tasks);
  const cfg = roleConfig[rol];
  const completed = tasks.filter(
    (t) => t.status === "completado",
  ).length;
  const progress = Math.round((completed / tasks.length) * 100);

  function advance(id: number) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (t.status === "pendiente")
          return { ...t, status: "en_proceso" as const };
        if (t.status === "en_proceso")
          return { ...t, status: "completado" as const };
        return t;
      }),
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
          Ruta de Adopción
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Tareas asignadas para el rol{" "}
          <span
            className="font-bold"
            style={{ color: cfg.color }}
          >
            {cfg.label}
          </span>{" "}
          en REGENDA
        </p>
      </div>

      {/* Progreso general */}
      <div
        className="bg-white rounded-2xl p-5"
        style={{ border: `1px solid ${cfg.color}18` }}
      >
        <div className="flex items-center justify-between mb-2">
          <span
            className="font-bold text-sm"
            style={{
              color: "#2a1028",
              fontFamily: "var(--font-brand)",
            }}
          >
            {cfg.user} · {cfg.label}
          </span>
          <span
            className="text-2xl font-extrabold"
            style={{
              color: cfg.color,
              fontFamily: "var(--font-brand)",
            }}
          >
            {progress}%
          </span>
        </div>
        <ProgressBar
          value={progress}
          color={cfg.color}
          size="lg"
        />
        <p
          className="text-xs mt-2"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          {completed} de {tasks.length} tareas completadas
        </p>
      </div>

      {/* Timeline — Gestalt continuidad: línea vertical conecta pasos */}
      <div className="flex flex-col gap-0">
        {tasks.map((t, i) => {
          const isDone = t.status === "completado";
          const isActive = t.status === "en_proceso";
          return (
            <div key={t.id} className="flex gap-4">
              {/* Línea vertical + círculo */}
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-sm flex-shrink-0 z-10"
                  style={{
                    backgroundColor: isDone
                      ? C.teal
                      : isActive
                        ? C.purple
                        : "#e8e0e8",
                    color: isDone || isActive ? "#fff" : C.gray,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  {isDone ? <CheckCircle2 size={15} /> : i + 1}
                </div>
                {i < tasks.length - 1 && (
                  <div
                    className="w-0.5 flex-1 my-1"
                    style={{
                      backgroundColor: isDone
                        ? C.teal
                        : "#e8e0e8",
                    }}
                  />
                )}
              </div>

              {/* Tarjeta de tarea */}
              <div
                className={`pb-5 flex-1 ${!isDone && !isActive ? "opacity-60" : ""}`}
              >
                <div
                  className="bg-white rounded-2xl p-4"
                  style={{
                    border: `1.5px solid ${isActive ? C.purple : "#e8e0e8"}`,
                    boxShadow: isActive
                      ? `0 4px 16px ${C.purple}14`
                      : "none",
                  }}
                >
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <p
                        className="font-bold text-sm"
                        style={{
                          color: "#2a1028",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        {t.title}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{
                          color: C.gray,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {t.desc}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <StatusBadge status={t.status} />
                      {!isDone && (
                        <button
                          onClick={() => advance(t.id)}
                          className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all hover:opacity-90"
                          style={{
                            backgroundColor: `${cfg.color}18`,
                            color: cfg.color,
                            fontFamily: "var(--font-brand)",
                            minHeight: "30px",
                          }}
                        >
                          {isActive ? "Completar" : "Iniciar"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MÓDULO 4: Microaprendizaje ────────────────────────────────────────────────
function MicroaprendizajeView() {
  const [lessons, setLessons] = useState(microlessons);
  const [active, setActive] = useState<number | null>(null);
  const learnedCount = lessons.filter((l) => l.learned).length;

  function markLearned(id: number) {
    setLessons((prev) =>
      prev.map((l) =>
        l.id === id ? { ...l, learned: true } : l,
      ),
    );
    setActive(null);
  }

  /* Gestalt similitud: todas las tarjetas de lección tienen igual estructura */
  const catColor: Record<string, string> = {
    Ventas: C.purple,
    Almacén: C.red,
    Caja: C.teal,
    Compras: C.purpleMid,
  };

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
          Microaprendizaje
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Guías rápidas para dominar Bit24 paso a paso en
          REGENDA
        </p>
      </div>

      {/* Progreso global */}
      <div
        className="bg-white rounded-2xl p-4 flex items-center gap-4"
        style={{ border: `1px solid ${C.purple}12` }}
      >
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span
              className="font-bold"
              style={{
                color: "#2a1028",
                fontFamily: "var(--font-brand)",
              }}
            >
              Guías aprendidas
            </span>
            <span
              className="font-extrabold"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              {learnedCount}/{lessons.length}
            </span>
          </div>
          <ProgressBar
            value={(learnedCount / lessons.length) * 100}
            color={C.purple}
          />
        </div>
        <div
          className="text-2xl font-extrabold flex-shrink-0"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          {Math.round((learnedCount / lessons.length) * 100)}%
        </div>
      </div>

      {/* Grid de lecciones — Gestalt proximidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lessons.map((lesson) => {
          const lColor = catColor[lesson.category] ?? C.purple;
          return (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl overflow-hidden transition-all hover:shadow-lg"
              style={{
                border: `1.5px solid ${lesson.learned ? C.teal : lColor}20`,
                boxShadow: lesson.learned
                  ? `0 2px 8px ${C.teal}15`
                  : "none",
              }}
            >
              {/* Header card con color de categoría */}
              <div
                className="px-4 pt-4 pb-3"
                style={{
                  borderBottom: `1px solid ${lColor}12`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="text-xs font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${lColor}15`,
                      color: lColor,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    {lesson.category}
                  </span>
                  <span
                    className="text-xs"
                    style={{
                      color: C.gray,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    {lesson.duration}
                  </span>
                  {lesson.learned && (
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: C.tealLight,
                        color: C.teal,
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      ✓ Aprendido
                    </span>
                  )}
                </div>
                <h3
                  className="font-extrabold text-sm"
                  style={{
                    color: "#2a1028",
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  {lesson.title}
                </h3>
              </div>

              {/* Pasos desplegables */}
              {active === lesson.id && (
                <div
                  className="px-4 py-3"
                  style={{ backgroundColor: "#fdfbfd" }}
                >
                  <p
                    className="text-xs font-extrabold uppercase tracking-widest mb-2"
                    style={{
                      color: lColor,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    Pasos del proceso
                  </p>
                  <ol className="flex flex-col gap-2">
                    {lesson.steps.map((step, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-xs"
                        style={{
                          color: "#2a1028",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0"
                          style={{
                            backgroundColor: `${lColor}20`,
                            color: lColor,
                            fontFamily: "var(--font-brand)",
                          }}
                        >
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-2 p-4 pt-3">
                <BtnGhost
                  onClick={() =>
                    setActive(
                      active === lesson.id ? null : lesson.id,
                    )
                  }
                >
                  {active === lesson.id
                    ? "Ocultar guía"
                    : "Ver guía"}
                </BtnGhost>
                {!lesson.learned && (
                  <BtnPrimary
                    small
                    onClick={() => markLearned(lesson.id)}
                  >
                    ✓ Marcar como aprendido
                  </BtnPrimary>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MÓDULO 5: Asistente IA generativa (simulada) ─────────────────────────────
function AsistenteIAView() {
  const [messages, setMessages] = useState([
    {
      role: "assistant" as const,
      text: "Hola, soy **Impulsa AI** 🤖 Estoy aquí para ayudarte con cualquier duda sobre Bit24 en REGENDA. Escribí tu pregunta o elegí una sugerida.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function sendMessage(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, text },
    ]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const response =
        aiResponses[text] ??
        "Entendido. Para esa consulta te recomiendo revisar la guía en **Microaprendizaje** o abrir un ticket en **Soporte** si el problema persiste. ¿Puedo ayudarte con algo más?";
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, text: response },
      ]);
      setLoading(false);
    }, 900);
  }

  function renderText(t: string) {
    return t
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
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
          Asistente IA
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Respuestas en lenguaje natural sobre Bit24 — IA
          simulada con respuestas predefinidas
        </p>
      </div>

      <div
        className="bg-white rounded-2xl flex flex-col overflow-hidden"
        style={{
          height: 530,
          border: `1.5px solid ${C.purple}18`,
          boxShadow: `0 4px 24px ${C.purple}0a`,
        }}
      >
        {/* Header IA */}
        <div
          className="flex items-center gap-3 p-4"
          style={{
            borderBottom: `1px solid ${C.purple}10`,
            background: `linear-gradient(135deg, ${C.purple}06, ${C.teal}04)`,
          }}
        >
          <FilledIconCard
            icon={<Sparkles size={16} />}
            size={38}
            color={C.purple}
          />
          <div>
            <p
              className="font-extrabold text-sm"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              Impulsa AI
            </p>
            <p
              className="text-xs font-semibold"
              style={{
                color: C.teal,
                fontFamily: "var(--font-body)",
              }}
            >
              ● En línea · Simulada para demo
            </p>
          </div>
          <span
            className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: C.yellowLight,
              color: "#7a4f00",
              border: `1px solid ${C.yellow}`,
              fontFamily: "var(--font-brand)",
            }}
          >
            Demo simulada
          </span>
        </div>

        {/* Preguntas sugeridas — Gestalt similitud: chips con mismo estilo */}
        <div
          className="p-3 flex gap-2 flex-wrap"
          style={{
            borderBottom: `1px solid ${C.purple}08`,
            backgroundColor: "#fdfbfd",
          }}
        >
          {Object.keys(aiResponses).map((s) => (
            <button
              key={s}
              onClick={() => sendMessage(s)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-90"
              style={{
                backgroundColor: `${C.purple}12`,
                color: C.purple,
                border: `1px solid ${C.purple}20`,
                fontFamily: "var(--font-brand)",
                minHeight: "30px",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} gap-2`}
            >
              {m.role === "assistant" && (
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{
                    background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                  }}
                >
                  <Sparkles size={12} color="#fff" />
                </div>
              )}
              <div
                className="max-w-xs sm:max-w-sm px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                style={{
                  background:
                    m.role === "user"
                      ? `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`
                      : "#f8f4f9",
                  color: m.role === "user" ? "#fff" : "#2a1028",
                  borderBottomRightRadius:
                    m.role === "user" ? 4 : undefined,
                  borderBottomLeftRadius:
                    m.role === "assistant" ? 4 : undefined,
                  fontFamily: "var(--font-body)",
                }}
                dangerouslySetInnerHTML={{
                  __html: renderText(m.text),
                }}
              />
            </div>
          ))}
          {loading && (
            <div className="flex gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                }}
              >
                <Sparkles size={12} color="#fff" />
              </div>
              <div
                className="px-4 py-3 rounded-2xl rounded-bl-sm"
                style={{ backgroundColor: "#f8f4f9" }}
              >
                <div className="flex gap-1 items-center h-4">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full animate-bounce"
                      style={{
                        backgroundColor: C.purple,
                        animationDelay: `${i * 150}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          className="p-4 flex gap-2"
          style={{ borderTop: `1px solid ${C.purple}10` }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage(input)
            }
            placeholder="Escribí tu consulta sobre Bit24..."
            className="flex-1 text-sm rounded-xl px-4 py-2.5 outline-none"
            style={{
              backgroundColor: "#f8f4f9",
              border: `1.5px solid ${C.purple}18`,
              color: "#2a1028",
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
              minWidth: "40px",
            }}
          >
            <Send size={15} color="#fff" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MÓDULO 6: Alertas WhatsApp simuladas ─────────────────────────────────────
function AlertasView() {
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
                        <ArrowRight size={11} /> {a.action}
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

// ─── MÓDULO 7: Soporte con trazabilidad ───────────────────────────────────────
function SoporteView() {
  const [cases, setCases] = useState(supportCases);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: "Ventas",
    description: "",
    priority: "media",
  });
  const [submitted, setSubmitted] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setCases((prev) => [
      {
        id: `SOC-00${prev.length + 1}`,
        title:
          form.description.slice(0, 55) ||
          "Nuevo caso de soporte",
        area: form.category,
        priority: form.priority,
        status: "pendiente" as const,
        responsible: "Sin asignar",
        date: "1 Jul 2025",
      },
      ...prev,
    ]);
    setSubmitted(true);
    setShowForm(false);
    setForm({
      category: "Ventas",
      description: "",
      priority: "media",
    });
    setTimeout(() => setSubmitted(false), 3500);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1
            className="text-xl font-extrabold"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Soporte
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: C.gray,
              fontFamily: "var(--font-body)",
            }}
          >
            Registrá y hacé seguimiento a casos con trazabilidad
            completa
          </p>
        </div>
        <BtnPrimary onClick={() => setShowForm(!showForm)}>
          <Plus size={15} /> Nuevo caso
        </BtnPrimary>
      </div>

      {submitted && (
        <div
          className="flex items-center gap-2 rounded-2xl p-3 text-sm font-semibold"
          style={{
            backgroundColor: C.tealLight,
            border: `1px solid ${C.teal}30`,
            color: "#1a5f5a",
            fontFamily: "var(--font-brand)",
          }}
        >
          <CheckCircle2 size={16} style={{ color: C.teal }} />{" "}
          Caso registrado correctamente. El equipo de soporte lo
          atenderá pronto.
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div
          className="bg-white rounded-2xl p-5"
          style={{
            border: `1.5px solid ${C.purple}20`,
            boxShadow: `0 4px 20px ${C.purple}0a`,
          }}
        >
          <h2
            className="font-extrabold text-base mb-4"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            Registrar nuevo caso de soporte
          </h2>
          <form
            onSubmit={submit}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  label: "Área / Categoría",
                  key: "category",
                  type: "select",
                  opts: [
                    "Ventas",
                    "Caja",
                    "Almacén",
                    "Compras",
                    "Administración",
                  ],
                },
                {
                  label: "Prioridad",
                  key: "priority",
                  type: "select",
                  opts: ["alta", "media", "baja"],
                },
              ].map((f) => (
                <div key={f.key}>
                  <label
                    className="text-xs font-extrabold uppercase tracking-widest block mb-1"
                    style={{
                      color: C.purple,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    {f.label}
                  </label>
                  <select
                    value={
                      (form as Record<string, string>)[f.key]
                    }
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        [f.key]: e.target.value,
                      }))
                    }
                    className="w-full text-sm rounded-xl px-3 py-2.5 outline-none"
                    style={{
                      border: `1.5px solid ${C.purple}20`,
                      backgroundColor: "#fdfbfd",
                      color: "#2a1028",
                      fontFamily: "var(--font-body)",
                      minHeight: "40px",
                    }}
                  >
                    {f.opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <div>
              <label
                className="text-xs font-extrabold uppercase tracking-widest block mb-1"
                style={{
                  color: C.purple,
                  fontFamily: "var(--font-brand)",
                }}
              >
                Descripción del problema
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                placeholder="Describí el problema con el mayor detalle posible..."
                className="w-full text-sm rounded-xl px-3 py-2.5 outline-none resize-none"
                style={{
                  border: `1.5px solid ${C.purple}20`,
                  backgroundColor: "#fdfbfd",
                  color: "#2a1028",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>
            <div>
              <label
                className="text-xs font-extrabold uppercase tracking-widest block mb-1"
                style={{
                  color: C.purple,
                  fontFamily: "var(--font-brand)",
                }}
              >
                Evidencia (opcional)
              </label>
              <div
                className="border-2 border-dashed rounded-xl p-4 text-center text-xs cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  borderColor: `${C.purple}25`,
                  color: C.gray,
                  fontFamily: "var(--font-body)",
                }}
              >
                Adjuntá captura de pantalla o archivo · Solo
                visual en demo
              </div>
            </div>
            <div className="flex gap-2">
              <BtnPrimary onClick={() => {}}>
                Registrar caso
              </BtnPrimary>
              <BtnGhost onClick={() => setShowForm(false)}>
                Cancelar
              </BtnGhost>
            </div>
          </form>
        </div>
      )}

      {/* Lista de casos */}
      <div className="flex flex-col gap-3">
        <h2
          className="font-extrabold text-sm uppercase tracking-widest"
          style={{
            color: C.gray,
            fontFamily: "var(--font-brand)",
          }}
        >
          Casos registrados ({cases.length})
        </h2>
        {cases.map((c) => {
          const sColor =
            c.status === "resuelto"
              ? C.teal
              : c.status === "en_atencion"
                ? "#b37000"
                : C.gray;
          return (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow"
              style={{ border: `1px solid ${C.purple}0d` }}
            >
              <div className="flex items-start gap-3">
                <FilledIconCard
                  icon={<Headphones size={16} />}
                  size={38}
                  color={sColor}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <span
                        className="text-xs font-mono mr-2"
                        style={{ color: C.gray }}
                      >
                        {c.id}
                      </span>
                      <span
                        className="font-extrabold text-sm"
                        style={{
                          color: "#2a1028",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        {c.title}
                      </span>
                    </div>
                    <StatusBadge status={c.status} />
                  </div>
                  <div
                    className="flex items-center gap-3 text-xs mt-1.5 flex-wrap"
                    style={{
                      color: C.gray,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    <span>
                      Área:{" "}
                      <strong style={{ color: "#2a1028" }}>
                        {c.area}
                      </strong>
                    </span>
                    ·
                    <span>
                      Prioridad:{" "}
                      <StatusBadge status={c.priority} />
                    </span>
                    ·
                    <span>
                      Resp.:{" "}
                      <strong style={{ color: "#2a1028" }}>
                        {c.responsible}
                      </strong>
                    </span>
                    ·<span>{c.date}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MÓDULO 8: Panel del Responsable Interno ──────────────────────────────────
function PanelResponsableView() {
  const barData = areaStats.map((a) => ({
    area: a.area,
    avance: a.progress,
  }));

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
          Panel del Responsable Interno
        </h1>
        <p
          className="text-sm mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Visión global de adopción por área · REGENDA ·
          Champion de adopción
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<TrendingUp size={18} />}
          label="Adopción global"
          value="62%"
          sub="Promedio entre áreas"
          color={C.purple}
          trend="+5%"
          iconStyle="filled"
        />
        <KPICard
          icon={<AlertTriangle size={18} />}
          label="Áreas en riesgo alto"
          value="1"
          sub="Almacén — 3 días inactivo"
          color={C.red}
          iconStyle="outline"
        />
        <KPICard
          icon={<CheckCircle2 size={18} />}
          label="Usuarios activos hoy"
          value="3/5"
          sub="Ventas, Admin, Compras"
          color={C.teal}
          iconStyle="filled"
        />
        <KPICard
          icon={<Headphones size={18} />}
          label="Tickets abiertos"
          value="2"
          sub="1 pendiente, 1 en atención"
          color={C.purpleMid}
          iconStyle="outline"
        />
      </div>

      {/* Gráfico barras */}
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
          Avance de adopción por área
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart
            data={barData}
            margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0ebf0"
            />
            <XAxis
              dataKey="area"
              tick={{ fontSize: 10, fill: C.gray }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: C.gray }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: `1px solid ${C.purple}20`,
                borderRadius: 10,
                fontSize: 12,
              }}
            />
            <Bar
              dataKey="avance"
              fill={C.purple}
              radius={[6, 6, 0, 0]}
              name="Avance %"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cards por área */}
      <div className="flex flex-col gap-3">
        {areaStats.map((a) => (
          <div
            key={a.area}
            className="bg-white rounded-2xl p-4 transition-shadow hover:shadow-md"
            style={{
              border: `1.5px solid ${a.color}20`,
              boxShadow:
                a.risk === "alto"
                  ? `0 2px 8px ${C.red}15`
                  : "none",
            }}
          >
            <div className="flex items-start gap-4">
              <FilledIconCard
                icon={<Shield size={18} />}
                size={42}
                color={a.color}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <span
                      className="font-extrabold"
                      style={{
                        color: "#2a1028",
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      {a.area}
                    </span>
                    <span
                      className="text-xs ml-2"
                      style={{
                        color: C.gray,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      — {a.user}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs"
                      style={{
                        color: C.gray,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      Riesgo:
                    </span>
                    <StatusBadge status={a.risk} />
                    <span
                      className="font-extrabold text-lg"
                      style={{
                        color: a.color,
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      {a.progress}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={a.progress}
                  color={a.color}
                  size="sm"
                />
                <div className="flex items-start justify-between mt-2 flex-wrap gap-2">
                  <p
                    className="text-xs"
                    style={{
                      color: C.gray,
                      fontFamily: "var(--font-body)",
                    }}
                  >
                    Última actividad: {a.lastActivity}
                  </p>
                  <p
                    className="text-xs font-semibold flex items-start gap-1"
                    style={{
                      color: a.color,
                      fontFamily: "var(--font-brand)",
                    }}
                  >
                    <Zap
                      size={11}
                      className="flex-shrink-0 mt-0.5"
                    />{" "}
                    {a.action}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MÓDULO 9: Tecnologías aplicadas ─────────────────────────────────────────
function TecnologiasView() {
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

      {/* Grid alternando estilos filled/outline — Gestalt similitud y variedad */}
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

      {/* Arquitectura */}
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

// ─── Navegación ───────────────────────────────────────────────────────────────
interface NavItem {
  id: NavId;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={17} />,
  },
  {
    id: "ruta",
    label: "Ruta de adopción",
    icon: <Map size={17} />,
  },
  {
    id: "microaprendizaje",
    label: "Microaprendizaje",
    icon: <BookOpen size={17} />,
  },
  { id: "ia", label: "Asistente IA", icon: <Bot size={17} /> },
  {
    id: "alertas",
    label: "Alertas WhatsApp",
    icon: <MessageSquare size={17} />,
  },
  {
    id: "soporte",
    label: "Soporte",
    icon: <Headphones size={17} />,
  },
  {
    id: "responsable",
    label: "Panel Responsable",
    icon: <Shield size={17} />,
  },
  {
    id: "tecnologias",
    label: "Tecnologías",
    icon: <Layers size={17} />,
  },
];

const navLabels: Record<NavId, string> = {
  dashboard: "Dashboard",
  ruta: "Ruta de adopción",
  microaprendizaje: "Microaprendizaje",
  ia: "Asistente IA",
  alertas: "Alertas WhatsApp",
  soporte: "Soporte",
  responsable: "Panel del Responsable",
  tecnologias: "Tecnologías aplicadas",
};

// ─── App Shell ────────────────────────────────────────────────────────────────
export default function App() {
  const [rol, setRol] = useState<RolId | null>(null);
  const [active, setActive] = useState<NavId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!rol)
    return (
      <LoginScreen
        onLogin={(r) => {
          setRol(r);
          setActive("dashboard");
        }}
      />
    );

  const cfg = roleConfig[rol];

  function renderView() {
    switch (active) {
      case "dashboard":
        return <DashboardView rol={rol!} />;
      case "ruta":
        return <RutaView rol={rol!} />;
      case "microaprendizaje":
        return <MicroaprendizajeView />;
      case "ia":
        return <AsistenteIAView />;
      case "alertas":
        return <AlertasView />;
      case "soporte":
        return <SoporteView />;
      case "responsable":
        return <PanelResponsableView />;
      case "tecnologias":
        return <TecnologiasView />;
      default:
        return <DashboardView rol={rol!} />;
    }
  }

  /** Sidebar — Gestalt continuidad: navegación consistente en todas las pantallas */
  const SidebarContent = ({ mobile = false }) => (
    <div
      className="flex flex-col h-full"
      style={{
        width: mobile ? 272 : collapsed ? 64 : 240,
        backgroundColor: "#fff",
        borderRight: `1px solid ${C.purple}0d`,
        transition: "width 0.2s ease",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-2.5 px-3 h-14 flex-shrink-0"
        style={{
          borderBottom: `1px solid ${C.purple}0d`,
          justifyContent:
            collapsed && !mobile ? "center" : undefined,
        }}
      >
        {!collapsed || mobile ? (
          <ImageWithFallback
            src={bit24Logo}
            alt="Logo Bit24 Impulsa"
            className="object-contain"
            style={{ height: 36, width: "auto" }}
          />
        ) : (
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
            }}
          >
            <Zap size={14} color="#fff" />
          </div>
        )}
        {(!collapsed || mobile) && (
          <span
            className="text-sm font-extrabold"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
              marginLeft: 2,
            }}
          >
            Impulsa
          </span>
        )}
      </div>

      {/* Nav items — Gestalt proximidad: ítems relacionados sin separador */}
      <nav className="flex-1 overflow-y-auto py-3 flex flex-col gap-0.5 px-2">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActive(item.id);
                setMobileOpen(false);
              }}
              title={
                collapsed && !mobile ? item.label : undefined
              }
              className="flex items-center rounded-xl font-semibold transition-all hover:opacity-90"
              style={{
                gap: 10,
                padding:
                  collapsed && !mobile ? "9px 0" : "9px 12px",
                justifyContent:
                  collapsed && !mobile
                    ? "center"
                    : "flex-start",
                width: "100%",
                backgroundColor: isActive
                  ? `${C.purple}12`
                  : "transparent",
                color: isActive ? C.purple : C.gray,
                fontFamily: "var(--font-brand)",
                fontSize: 13,
                fontWeight: isActive ? 700 : 500,
                minHeight: "36px",
                /* Gestalt figura-fondo: ítem activo destaca con fondo tenue */
                borderLeft: isActive
                  ? `3px solid ${C.purple}`
                  : "3px solid transparent",
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {(!collapsed || mobile) && (
                <span className="truncate text-left">
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div
        className="p-3"
        style={{ borderTop: `1px solid ${C.purple}0d` }}
      >
        {(!collapsed || mobile) && (
          <>
            <div
              className="flex items-center gap-2.5 px-2 py-2 rounded-xl mb-2"
              style={{ backgroundColor: C.purpleLight }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-extrabold flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
                  fontFamily: "var(--font-brand)",
                }}
              >
                {cfg.user.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p
                  className="text-xs font-extrabold truncate"
                  style={{
                    color: C.purple,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  {cfg.user}
                </p>
                <p
                  className="text-xs truncate"
                  style={{
                    color: C.gray,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  {cfg.label}
                </p>
              </div>
            </div>
            <button
              onClick={() => setRol(null)}
              className="w-full text-xs font-semibold py-1.5 rounded-xl hover:opacity-80 transition-opacity"
              style={{
                color: C.gray,
                fontFamily: "var(--font-brand)",
              }}
            >
              Cambiar rol / Cerrar sesión
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "#f4f2f5",
        fontFamily: "var(--font-body)",
      }}
    >
      {/* Desktop sidebar */}
      <div className="hidden md:flex h-full flex-shrink-0 relative">
        <SidebarContent />
        {/* Botón colapso */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-16 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md z-10 hover:shadow-lg transition-shadow"
          style={{
            border: `1px solid ${C.purple}15`,
            color: C.purple,
          }}
        >
          {collapsed ? (
            <ChevronRight size={12} />
          ) : (
            <ChevronLeft size={12} />
          )}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full shadow-2xl">
            <SidebarContent mobile />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header — Gestalt continuidad: mismo header en todas las vistas */}
        <header
          className="h-14 bg-white flex items-center gap-3 px-4 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${C.purple}0d`,
            boxShadow: `0 1px 8px ${C.purple}06`,
          }}
        >
          {/* Mobile burger */}
          <button
            className="md:hidden p-1.5 rounded-xl hover:opacity-80"
            style={{ color: C.purple }}
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>

          {/* Breadcrumb — Gestalt jerarquía */}
          <div className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
            <span
              className="font-extrabold hidden sm:block"
              style={{
                color: C.purple,
                fontFamily: "var(--font-brand)",
              }}
            >
              Impulsa
            </span>
            <ChevronRight
              size={14}
              style={{ color: `${C.purple}40` }}
              className="hidden sm:block"
            />
            <span
              className="font-extrabold truncate"
              style={{
                color: "#2a1028",
                fontFamily: "var(--font-brand)",
              }}
            >
              {navLabels[active]}
            </span>
          </div>

          {/* Search */}
          <div
            className="hidden sm:flex items-center gap-2 rounded-xl px-3 py-1.5 w-44"
            style={{
              backgroundColor: C.purpleLight,
              border: `1px solid ${C.purple}18`,
            }}
          >
            <Search
              size={13}
              style={{ color: C.purple, flexShrink: 0 }}
            />
            <input
              placeholder="Buscar..."
              className="bg-transparent text-sm outline-none w-full"
              style={{
                color: "#2a1028",
                fontFamily: "var(--font-body)",
              }}
            />
          </div>

          {/* Demo badge */}
          <div
            className="hidden sm:flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
            style={{
              backgroundColor: C.yellowLight,
              color: "#7a4f00",
              border: `1px solid ${C.yellow}`,
              fontFamily: "var(--font-brand)",
            }}
          >
            <Info size={11} /> Demo 20%
          </div>

          {/* Alerts bell */}
          <button
            className="relative p-1.5 rounded-xl hover:opacity-80 transition-opacity"
            style={{ color: C.purple }}
            onClick={() => setActive("alertas")}
          >
            <Bell size={18} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: C.red }}
            />
          </button>

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-extrabold cursor-pointer hover:opacity-90 flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${C.purple}, ${C.purpleMid})`,
              fontFamily: "var(--font-brand)",
            }}
          >
            {cfg.user.slice(0, 2).toUpperCase()}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}