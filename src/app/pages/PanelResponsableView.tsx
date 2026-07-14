import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Headphones, Shield, TrendingUp, Zap, Send, ClipboardList } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { C, areaStats } from "../data/datosRegenda";
import {
  FilledIconCard,
  KPICard,
  ProgressBar,
  StatusBadge,
} from "../components/ui-shared/DesignSystem";
import { getUsuarios, Usuario } from "../api/usuarios";
import { getTodasAlertas, crearAlerta, marcarAtendida, Alerta } from "../api/alertas";

// ─── MÓDULO 8: Panel del Responsable Interno ──────────────────────────────────
export default function PanelResponsableView() {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alerta[]>([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState("Inactividad");
  const [formChannel, setFormChannel] = useState<"WhatsApp" | "Email" | "Sistema">("WhatsApp");
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  useEffect(() => {
    getUsuarios()
      .then((data) => setUsers(data.filter((u) => u.estado)))
      .catch((err) => console.error("Error al cargar usuarios:", err));

    const fetchAllAlerts = async () => {
      try {
        setAlertsLoading(true);
        setAlertsError(null);
        const data = await getTodasAlertas();
        setAllAlerts(data);
      } catch (err) {
        setAlertsError("Error al cargar las alertas del sistema.");
      } finally {
        setAlertsLoading(false);
      }
    };
    fetchAllAlerts();
  }, []);

  const handleCreateAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formTitle || !formMessage) {
      setFormStatus("Por favor completa los campos requeridos.");
      return;
    }
    try {
      setFormLoading(true);
      setFormStatus(null);
      const newAlert = await crearAlerta({
        usuario_id: selectedUser,
        titulo: formTitle,
        mensaje: formMessage,
        tipo: formType,
        canal: formChannel,
      });
      setAllAlerts((prev) => [newAlert, ...prev]);
      setFormTitle("");
      setFormMessage("");
      setFormStatus("Alerta creada exitosamente (Envío Simulado).");
    } catch (err) {
      console.error("Error al crear alerta:", err);
      setFormStatus("Error al registrar la alerta en el servidor.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAttendAlert = async (id: string | number) => {
    try {
      await marcarAtendida(id);
      setAllAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, atendida: true } : a))
      );
    } catch (err) {
      console.error("Error al atender alerta:", err);
    }
  };

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
          Visión global de adopción por área · REGENDA · Champion de adopción
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

      {/* ─── GESTIÓN DE ALERTAS (Crear y Atender) ─────────────────────────────────── */}
      <div>
        <h2
          className="font-extrabold text-base mt-2"
          style={{
            color: C.purple,
            fontFamily: "var(--font-brand)",
          }}
        >
          Gestión y Envío de Alertas
        </h2>
        <p
          className="text-xs mt-0.5"
          style={{
            color: C.gray,
            fontFamily: "var(--font-body)",
          }}
        >
          Notificaciones simuladas — no se envían mensajes reales
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario de Creación */}
        <div
          className="bg-white rounded-2xl p-5"
          style={{ border: `1px solid ${C.purple}10` }}
        >
          <h3
            className="font-extrabold text-sm mb-4 flex items-center gap-2"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            <Send size={16} /> Crear Alerta Manual
          </h3>
          <form onSubmit={handleCreateAlert} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Usuario Destinatario *</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 outline-none focus:border-purple-300 bg-white"
                style={{ fontFamily: "var(--font-body)" }}
              >
                <option value="">Selecciona un usuario...</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido} ({u.correo})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Título de Alerta *</label>
              <input
                type="text"
                placeholder="Ej. Inactividad en módulo de comprobantes"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 outline-none focus:border-purple-300"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-700">Mensaje de Notificación *</label>
              <textarea
                placeholder="Escribe el mensaje de la alerta..."
                value={formMessage}
                onChange={(e) => setFormMessage(e.target.value)}
                className="w-full text-xs rounded-xl border border-gray-200 p-2.5 outline-none focus:border-purple-300 h-20 resize-none"
                style={{ fontFamily: "var(--font-body)" }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Tipo de Alerta</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 outline-none focus:border-purple-300 bg-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="Inactividad">Inactividad</option>
                  <option value="Riesgo alto">Riesgo alto</option>
                  <option value="Informativa">Informativa</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-700">Canal de Envío</label>
                <select
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-gray-200 p-2.5 outline-none focus:border-purple-300 bg-white"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Sistema">Sistema</option>
                </select>
              </div>
            </div>

            {formStatus && (
              <p className="text-xs font-bold text-teal-600" style={{ fontFamily: "var(--font-brand)" }}>
                {formStatus}
              </p>
            )}

            <button
              type="submit"
              disabled={formLoading}
              className="text-xs font-bold py-2.5 px-4 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: C.purple,
                fontFamily: "var(--font-brand)",
                minHeight: "36px",
              }}
            >
              {formLoading ? "Enviando..." : "Crear y Enviar Alerta"}
            </button>
          </form>
        </div>

        {/* Monitoreo y Atención */}
        <div
          className="bg-white rounded-2xl p-5 flex flex-col"
          style={{ border: `1px solid ${C.purple}10` }}
        >
          <h3
            className="font-extrabold text-sm mb-4 flex items-center gap-2"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            <ClipboardList size={16} /> Alertas Activas del Sistema
          </h3>

          {alertsLoading && (
            <div className="text-center py-8 text-xs text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
              Cargando alertas del sistema...
            </div>
          )}

          {alertsError && !alertsLoading && (
            <div className="text-center py-8 text-xs text-red-500" style={{ fontFamily: "var(--font-body)" }}>
              {alertsError}
            </div>
          )}

          {!alertsLoading && !alertsError && (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[350px] pr-1">
              {allAlerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-gray-400" style={{ fontFamily: "var(--font-body)" }}>
                  No hay alertas registradas en el sistema.
                </div>
              ) : (
                allAlerts.map((al) => {
                  const badgeColor = al.canal === "WhatsApp" ? C.teal : al.canal === "Email" ? C.purple : C.purpleMid;
                  return (
                    <div
                      key={al.id}
                      className="border border-gray-100 rounded-xl p-3 flex flex-col gap-2 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${badgeColor}15`,
                              color: badgeColor,
                              fontFamily: "var(--font-brand)",
                            }}
                          >
                            {al.canal}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                            {al.tipo}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {al.leida && (
                            <span className="text-[10px] text-gray-400 font-semibold" style={{ fontFamily: "var(--font-body)" }}>Leída</span>
                          )}
                          {al.atendida ? (
                            <span
                              className="text-[10px] font-semibold text-teal-600 flex items-center gap-0.5"
                              style={{ fontFamily: "var(--font-brand)" }}
                            >
                              <CheckCircle2 size={10} /> Atendida
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAttendAlert(al.id)}
                              className="text-[10px] font-bold px-2 py-1 rounded bg-teal-50 text-teal-600 border border-teal-100 transition-opacity hover:opacity-90"
                              style={{ fontFamily: "var(--font-brand)" }}
                            >
                              Atender
                            </button>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800" style={{ fontFamily: "var(--font-brand)" }}>
                          {al.titulo}
                        </h4>
                        <p className="text-xs text-gray-600 mt-1" style={{ fontFamily: "var(--font-body)" }}>
                          {al.mensaje}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
