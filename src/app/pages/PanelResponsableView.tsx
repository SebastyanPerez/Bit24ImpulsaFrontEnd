import { AlertTriangle, CheckCircle2, Headphones, Shield, TrendingUp, Zap } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C, areaStats } from "../data/datosRegenda";
import {
  FilledIconCard,
  KPICard,
  ProgressBar,
  StatusBadge,
} from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 8: Panel del Responsable Interno ──────────────────────────────────
export default function PanelResponsableView() {
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
