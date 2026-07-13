// ─── Brand tokens (JS mirror of CSS vars) ────────────────────────────────────
export const C = {
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
export type RolId =
  | "ventas"
  | "caja"
  | "almacen"
  | "compras"
  | "administracion"
  | "responsable";

export type NavId =
  | "dashboard"
  | "ruta"
  | "microaprendizaje"
  | "ia"
  | "alertas"
  | "soporte"
  | "responsable"
  | "tecnologias"
  | "usuarios"
  | "contenido";

export interface TaskItem {
  id: number;
  title: string;
  desc: string;
  status: "completado" | "en_proceso" | "pendiente";
}

// ─── Datos simulados REGENDA ──────────────────────────────────────────────────
export const roleConfig: Record<
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

export const areaStats = [
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

export const adoptionTrend = [
  { sem: "S1", avance: 15 },
  { sem: "S2", avance: 32 },
  { sem: "S3", avance: 45 },
  { sem: "S4", avance: 58 },
  { sem: "S5", avance: 63 },
  { sem: "S6", avance: 72 },
];

export const supportCases = [
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

export const whatsappAlerts = [
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

export const microlessons = [
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

export const aiResponses: Record<string, string> = {
  "¿Cómo registro una devolución?":
    "Para registrar una devolución en Bit24:\n\n1. Ve a **Ventas → Comprobantes emitidos**.\n2. Buscá la venta por número o fecha.\n3. Seleccioná **Emitir Nota de Crédito**.\n4. Indicá los productos devueltos y el motivo.\n5. Confirmá — el stock se actualiza solo.\n\n¿Querés ver la guía completa en Microaprendizaje?",
  "¿Cómo reviso el stock?":
    "Para revisar el stock disponible:\n\n1. Ingresá al módulo **Almacén → Consulta de Stock**.\n2. Buscá el producto por código o nombre.\n3. Verificá cantidad disponible, ubicación y lote.\n4. Si hay diferencias, registrá un **Ajuste de Stock**.\n\n¿Necesitás saber cómo hacer un ajuste?",
  "¿Qué hago si no aparece un producto?":
    "Si un producto no aparece en la búsqueda:\n\n1. Verificá que el nombre o código esté bien escrito.\n2. Revisá que el producto esté activo en **Almacén → Productos**.\n3. Confirmá que tenga stock mayor a cero.\n4. Si sigue sin aparecer, abrí un **ticket de soporte** con el código del producto.",
  "¿Cómo emito una factura?":
    "Para emitir una factura electrónica:\n\n1. Ve a **Ventas → Nueva Venta**.\n2. Seleccioná el cliente y agregá los productos.\n3. En tipo de comprobante elegí **Factura**.\n4. Ingresá el RUC del cliente.\n5. Confirmá — el sistema enviará la factura automáticamente.",
};

// ─── Mapper to normalize backend roles to frontend RolId ─────────────────────
export function mapBackendRoleToRolId(roleName: string): RolId {
  const normalized = roleName.trim().toLowerCase();
  if (
    normalized === "administrador" ||
    normalized === "administración" ||
    normalized === "administracion" ||
    normalized === "admin"
  ) {
    return "administracion";
  }
  if (normalized === "ventas") {
    return "ventas";
  }
  if (normalized === "caja") {
    return "caja";
  }
  if (normalized === "almacén" || normalized === "almacen") {
    return "almacen";
  }
  if (normalized === "compras") {
    return "compras";
  }
  if (
    normalized === "responsable" ||
    normalized === "responsable interno" ||
    normalized === "responsable_interno"
  ) {
    return "responsable";
  }
  return "ventas"; // Default fallback
}

// ─── Nav config ───────────────────────────────────────────────────────────────
export const navLabels: Record<NavId, string> = {
  dashboard: "Dashboard",
  ruta: "Ruta de adopción",
  microaprendizaje: "Microaprendizaje",
  ia: "Asistente IA",
  alertas: "Alertas WhatsApp",
  soporte: "Soporte",
  responsable: "Panel del Responsable",
  tecnologias: "Tecnologías aplicadas",
  usuarios: "Gestión de Usuarios",
  contenido: "Gestión de Contenido",
};
