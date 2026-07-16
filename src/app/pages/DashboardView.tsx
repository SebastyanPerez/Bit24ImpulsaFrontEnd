import { useState, useEffect } from "react";
import { getDashboardData, DashboardData } from "../api/dashboard";
import {
  C,
  RolId,
  roleConfig,
  adoptionTrend,
} from "../data/datosRegenda";
import {
  KPICard,
  ProgressBar,
  StatusBadge,
  BtnSecondary,
} from "../components/ui-shared/DesignSystem";
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Headphones,
  RefreshCw,
  Clock,
  Play,
  Sparkles,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../context/AuthContext";

// ─── MÓDULO 2: Dashboard post-login ───────────────────────────────────────────
export default function DashboardView({ rol }: { rol: RolId }) {
  const { usuario } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  const roleName = usuario?.rol?.nombre || "";
  const isAdminOrResponsible =
    roleName === "Administrador" ||
    roleName === "Responsable Interno" ||
    rol === "administracion" ||
    rol === "responsable";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setDashboardLoading(true);
        setDashboardError(null);
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        console.error("Error al cargar datos del dashboard:", err);
        setDashboardError("Error al cargar datos.");
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboard();
  }, [rol]);

  const cfg = roleConfig[rol];
  const completedTasks = dashboardData ? dashboardData.metrics.tareas_completadas : 0;
  const pendingTasks = dashboardData ? dashboardData.metrics.tareas_pendientes : 0;
  const activeAlerts = dashboardData ? dashboardData.alertas_activas : 0;
  const progressAdoption = dashboardData ? dashboardData.metrics.progreso_general_porcentaje : 0;

  const iconAlternate = (i: number) =>
    i % 2 === 0 ? "filled" : "outline";

  const userDisplayName = usuario ? `${usuario.nombre} ${usuario.apellido}` : cfg.user;

  const areaColors: Record<string, string> = {
    "Ventas": "#5D1451",
    "Caja": "#3DB1AA",
    "Almacén": "#ffd37f",
    "Compras": "#8a2b7a",
    "Administración": "#3DB1AA"
  };

  const currentTasks = dashboardData?.mis_tareas_recientes || [];

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
            Bienvenido, {userDisplayName} 👋
          </h1>
          {roleName === "Administrador" ? (
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
                style={{ color: C.purple }}
              >
                Todas las áreas
              </span>{" "}
              · REGENDA · 1 julio 2025
            </p>
          ) : (
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
                style={{ color: cfg?.color || C.purple }}
              >
                {roleName || cfg?.label || "Sin Área"}
              </span>{" "}
              · REGENDA · 1 julio 2025
            </p>
          )}
        </div>
      </div>

      {/* KPIs — Gestalt proximidad: grupo de métricas unidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<TrendingUp size={18} />}
          label="Adopción del área"
          value={dashboardLoading ? "..." : `${progressAdoption}%`}
          sub="Meta: 90% este mes"
          color={cfg.color}
          trend="+5%"
          iconStyle={iconAlternate(0)}
        />
        <KPICard
          icon={<CheckCircle2 size={18} />}
          label="Tareas completadas"
          value={dashboardLoading ? "..." : `${completedTasks}`}
          sub={dashboardLoading ? "Cargando..." : `${pendingTasks} pendientes`}
          color={C.teal}
          iconStyle={iconAlternate(1)}
        />
        <KPICard
          icon={<AlertTriangle size={18} />}
          label="Alertas activas"
          value={dashboardLoading ? "..." : `${activeAlerts}`}
          sub="Requieren atención"
          color={C.red}
          iconStyle={iconAlternate(2)}
        />
        <KPICard
          icon={<Headphones size={18} />}
          label="Casos de soporte"
          value={dashboardLoading ? "..." : String(dashboardData?.casos_soporte.total || 0)}
          sub={
            dashboardLoading
              ? "Cargando..."
              : `${dashboardData?.casos_soporte.pendiente || 0} pendiente, ${dashboardData?.casos_soporte.en_proceso || 0} en atención`
          }
          color={C.purpleMid}
          iconStyle={iconAlternate(3)}
        />
      </div>

      {/* Chart + avance por área — Gestalt continuidad */}
      {isAdminOrResponsible && (
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
              {dashboardLoading && (
                <div className="text-center py-6 text-xs text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
                  Cargando avance de áreas...
                </div>
              )}
              {!dashboardLoading && (dashboardData?.avance_por_area || []).map((a) => {
                const color = areaColors[a.area] || C.purple;
                return (
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
                          color: color,
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        {a.progress}%
                      </span>
                    </div>
                    <ProgressBar
                      value={a.progress}
                      color={color}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
          {dashboardLoading && (
            <div className="text-center py-8 text-xs text-gray-500 col-span-2" style={{ fontFamily: "var(--font-body)" }}>
              Cargando tareas recientes...
            </div>
          )}
          {!dashboardLoading && currentTasks.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-400 col-span-2 bg-[#fdfbfd] rounded-xl border border-dashed border-purple-100" style={{ fontFamily: "var(--font-body)" }}>
              No hay tareas en tu ruta asignada.
            </div>
          )}
          {!dashboardLoading && currentTasks.map((t) => (
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
              {dashboardLoading ? "Cargando sugerencia..." : (dashboardData?.recomendacion || "No hay sugerencias en este momento.")}
            </p>
          </div>
          <BtnSecondary small onClick={() => { }}>
            <Play size={12} /> Ir ahora
          </BtnSecondary>
        </div>
      </div>
    </div>
  );
}
