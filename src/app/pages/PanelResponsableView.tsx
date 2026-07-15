import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, Headphones, Shield, TrendingUp, Zap, Send, ClipboardList, Map, BookOpen, MessageSquare, Users, Clock } from "lucide-react";
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
import { getTodosTickets, asignarTicket, actualizarEstado, Soporte } from "../api/soporte";
import { getActividadReciente, Actividad } from "../api/actividad";
import { useAuth } from "../context/AuthContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

// ─── MÓDULO 8: Panel del Responsable Interno ──────────────────────────────────
export default function PanelResponsableView() {
  const { usuario: currentUser } = useAuth();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [allAlerts, setAllAlerts] = useState<Alerta[]>([]);
  const [tickets, setTickets] = useState<Soporte[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [ticketsError, setTicketsError] = useState<string | null>(null);

  const [activities, setActivities] = useState<Actividad[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formType, setFormType] = useState("Inactividad");
  const [formChannel, setFormChannel] = useState<"WhatsApp" | "Email" | "Sistema">("WhatsApp");
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<string | null>(null);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  const fetchTickets = async () => {
    try {
      setTicketsLoading(true);
      setTicketsError(null);
      const data = await getTodosTickets();
      setTickets(data);
    } catch (err) {
      console.error("Error al cargar tickets:", err);
      setTicketsError("Error al cargar la lista de tickets.");
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      setActivitiesLoading(true);
      setActivitiesError(null);
      const data = await getActividadReciente();
      setActivities(data);
    } catch (err) {
      console.error("Error al cargar actividades:", err);
      setActivitiesError("Error al cargar la actividad reciente.");
    } finally {
      setActivitiesLoading(false);
    }
  };

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
    fetchTickets();
    fetchActivities();
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

  const handleAttendAlert = async (id: string) => {
    try {
      await marcarAtendida(id);
      setAllAlerts((prev) =>
        prev.map((a) => (a.id === id ? { ...a, estado: "Atendida" } : a))
      );
    } catch (err) {
      console.error("Error al atender alerta:", err);
    }
  };

  const handleAsignarme = async (id: string) => {
    try {
      await asignarTicket(id);
      await fetchTickets();
    } catch (err) {
      console.error("Error al asignarse el ticket:", err);
    }
  };

  const handleEstadoChange = async (id: string, nuevoEstado: string) => {
    try {
      await actualizarEstado(id, nuevoEstado);
      await fetchTickets();
    } catch (err) {
      console.error("Error al cambiar estado del ticket:", err);
    }
  };

  const barData = areaStats.map((a) => ({
    area: a.area,
    avance: a.progress,
  }));

  const openTicketsCount = tickets.filter((t) => t.estado !== "Resuelto" && t.estado !== "Cerrado").length;
  const pendingCount = tickets.filter((t) => t.estado === "Abierto").length;
  const inAttentionCount = tickets.filter((t) => t.estado === "En Proceso").length;

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Abierto":
        return (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-red-100 text-red-700"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            Abierto
          </span>
        );
      case "En Proceso":
        return (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-amber-100 text-amber-800"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            En Proceso
          </span>
        );
      case "Resuelto":
        return (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-emerald-100 text-emerald-800"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            Resuelto
          </span>
        );
      case "Cerrado":
        return (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-slate-100 text-slate-600"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            Cerrado
          </span>
        );
      default:
        return (
          <span
            className="text-xs font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap bg-slate-100 text-slate-600"
            style={{ fontFamily: "var(--font-brand)" }}
          >
            {estado}
          </span>
        );
    }
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
          value={ticketsLoading ? "..." : String(openTicketsCount)}
          sub={
            ticketsLoading
              ? "Cargando tickets..."
              : `${pendingCount} pendiente, ${inAttentionCount} en atención`
          }
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
                          {al.estado === "Leída" && (
                            <span className="text-[10px] text-gray-400 font-semibold" style={{ fontFamily: "var(--font-body)" }}>Leída</span>
                          )}
                          {al.estado === "Atendida" ? (
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

      {/* ─── ACTIVIDAD RECIENTE ──────────────────────────────────────────────── */}
      {(currentUser?.rol?.nombre === "Administrador" ||
        currentUser?.rol?.nombre === "Responsable Interno") && (
          <div
            className="bg-white rounded-2xl p-5"
            style={{ border: `1px solid ${C.purple}10` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3
                  className="font-extrabold text-base flex items-center gap-2"
                  style={{
                    color: C.purple,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  <Zap size={18} /> Actividad Reciente
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: C.gray,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Historial de las últimas acciones realizadas por los usuarios en la plataforma.
                </p>
              </div>
            </div>

            {activitiesLoading && (
              <div className="text-center py-6 text-xs text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
                Cargando historial de actividad...
              </div>
            )}

            {activitiesError && (
              <div className="text-center py-6 text-xs text-red-500" style={{ fontFamily: "var(--font-body)" }}>
                {activitiesError}
              </div>
            )}

            {!activitiesLoading && !activitiesError && (
              <div className="relative pl-6 border-l border-slate-100 flex flex-col gap-6 ml-3 my-2">
                {activities.map((act) => {
                  let icon = <Zap size={10} />;
                  let iconColor = C.purple;
                  let iconBg = `${C.purple}15`;

                  const mod = act.modulo.toLowerCase().trim();
                  if (mod.includes("ruta")) {
                    icon = <Map size={10} />;
                    iconColor = C.purple;
                    iconBg = `${C.purple}15`;
                  } else if (mod.includes("tarea")) {
                    icon = <ClipboardList size={10} />;
                    iconColor = C.teal;
                    iconBg = `${C.teal}15`;
                  } else if (mod.includes("guia")) {
                    icon = <BookOpen size={10} />;
                    iconColor = C.purpleMid;
                    iconBg = `${C.purpleMid}15`;
                  } else if (mod.includes("alerta")) {
                    icon = <MessageSquare size={10} />;
                    iconColor = C.red;
                    iconBg = `${C.red}15`;
                  } else if (mod.includes("soporte")) {
                    icon = <Headphones size={10} />;
                    iconColor = C.teal;
                    iconBg = `${C.teal}15`;
                  } else if (mod.includes("usuario") || mod.includes("auth")) {
                    icon = <Users size={10} />;
                    iconColor = C.purple;
                    iconBg = `${C.purple}15`;
                  }

                  return (
                    <div key={act.id} className="relative flex flex-col gap-1 animate-fade-in">
                      {/* Timeline dot */}
                      <span
                        className="absolute -left-[31px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center border border-white shadow-sm"
                        style={{
                          backgroundColor: iconColor,
                          color: "#fff"
                        }}
                      >
                        {icon}
                      </span>

                      <div className="flex justify-between items-start gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-xs text-slate-800 leading-normal"
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            <span className="font-extrabold text-[#2a1028]" style={{ fontFamily: "var(--font-brand)" }}>
                              {act.usuario.nombre}
                            </span>{" "}
                            <span className="text-slate-400">
                              ({act.usuario.correo})
                            </span>{" "}
                            — {act.accion}
                          </p>
                          <span
                            className="inline-block text-[9px] font-bold px-1.5 py-0.5 rounded mt-1"
                            style={{
                              backgroundColor: iconBg,
                              color: iconColor,
                              fontFamily: "var(--font-brand)"
                            }}
                          >
                            MÓDULO: {act.modulo.toUpperCase()}
                          </span>
                        </div>
                        <span
                          className="text-[10px] text-slate-400 font-medium flex items-center gap-1 whitespace-nowrap"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          <Clock size={10} />
                          {new Date(act.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {activities.length === 0 && (
                  <p className="text-xs text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                    No hay actividad reciente registrada.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

      {/* ─── GESTIÓN DE SOPORTE ──────────────────────────────────────────────── */}
      {(currentUser?.rol?.nombre === "Administrador" ||
        currentUser?.rol?.nombre === "Responsable Interno") && (
          <div
            className="bg-white rounded-2xl p-5"
            style={{ border: `1px solid ${C.purple}10` }}
          >
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <div>
                <h3
                  className="font-extrabold text-base flex items-center gap-2"
                  style={{
                    color: C.purple,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  <Headphones size={18} /> Gestión de Soporte
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{
                    color: C.gray,
                    fontFamily: "var(--font-body)",
                  }}
                >
                  Lista completa de incidentes y requerimientos de soporte.
                </p>
              </div>
            </div>

            {ticketsLoading && (
              <div
                className="text-center py-8 text-xs text-gray-500"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Cargando tickets de soporte...
              </div>
            )}

            {ticketsError && (
              <div
                className="text-center py-8 text-xs text-red-500"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {ticketsError}
              </div>
            )}

            {!ticketsLoading && !ticketsError && (
              <div className="overflow-x-auto rounded-xl border border-slate-100 bg-white">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow>
                      <TableHead
                        className="font-bold py-3"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Título
                      </TableHead>
                      <TableHead
                        className="font-bold py-3"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Reportado por
                      </TableHead>
                      <TableHead
                        className="font-bold py-3"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Categoría
                      </TableHead>
                      <TableHead
                        className="font-bold py-3"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Estado
                      </TableHead>
                      <TableHead
                        className="font-bold py-3"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Responsable
                      </TableHead>
                      <TableHead
                        className="font-bold py-3 text-right"
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                        }}
                      >
                        Acción
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tickets.map((t) => (
                      <TableRow
                        key={t.id}
                        className="hover:bg-slate-50/40 transition-colors animate-fade-in"
                      >
                        <TableCell
                          className="py-4 font-semibold text-slate-800"
                          style={{ fontFamily: "var(--font-brand)" }}
                        >
                          <div>
                            <div>{t.titulo}</div>
                            {t.descripcion && (
                              <div className="text-xs text-slate-500 font-normal mt-0.5">
                                {t.descripcion}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell
                          className="py-4 text-slate-600"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {t.usuario?.nombre} {t.usuario?.apellido}
                        </TableCell>
                        <TableCell
                          className="py-4 text-slate-600 font-medium"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {t.categoria?.nombre || "General"}
                        </TableCell>
                        <TableCell className="py-4">
                          {getStatusBadge(t.estado)}
                        </TableCell>
                        <TableCell
                          className="py-4 text-slate-600 font-medium"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          {t.responsable
                            ? `${t.responsable.nombre} ${t.responsable.apellido}`
                            : "Sin asignar"}
                        </TableCell>
                        <TableCell className="py-4 text-right">
                          {t.estado === "Abierto" &&
                            t.responsable_id === null ? (
                            <button
                              onClick={() => handleAsignarme(t.id)}
                              className="text-xs font-bold px-3 py-1.5 rounded-xl text-white transition-opacity hover:opacity-90 active:scale-95"
                              style={{
                                backgroundColor: C.purple,
                                fontFamily: "var(--font-brand)",
                                minHeight: "30px",
                              }}
                            >
                              Asignarme
                            </button>
                          ) : t.responsable_id !== null ? (
                            <Select
                              onValueChange={(val) =>
                                handleEstadoChange(t.id, val)
                              }
                              value={t.estado}
                            >
                              <SelectTrigger className="w-[140px] ml-auto rounded-xl">
                                <SelectValue placeholder="Estado" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="En Proceso">
                                  En Proceso
                                </SelectItem>
                                <SelectItem value="Resuelto">Resuelto</SelectItem>
                                <SelectItem value="Cerrado">Cerrado</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : null}
                        </TableCell>
                      </TableRow>
                    ))}
                    {tickets.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-slate-400"
                          style={{ fontFamily: "var(--font-body)" }}
                        >
                          No se encontraron tickets en el sistema.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
