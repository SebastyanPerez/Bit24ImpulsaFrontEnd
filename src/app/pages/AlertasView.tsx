import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle2, MessageSquare, Send, Mail, Shield, Check } from "lucide-react";
import { C, mapBackendRoleToRolId } from "../data/datosRegenda";
import { useAuth } from "../context/AuthContext";
import {
  getAlertasMe,
  getAlertas,
  leerAlerta,
  atenderAlerta,
  createAlerta,
  type Alerta
} from "../api/alertas";
import { getUsuarios, getApiErrorMessage, type Usuario } from "../api/usuarios";

export default function AlertasView() {
  const { usuario } = useAuth();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");
  const [titulo, setTitulo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipo, setTipo] = useState("Adopción");
  const [canal, setCanal] = useState<"WhatsApp" | "Email" | "Sistema">("Sistema");
  const [accionRecomendada, setAccionRecomendada] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const roleName = usuario?.rol?.nombre || "";
  const isAdminOrResponsable = roleName === "Administrador" || roleName === "Responsable Interno";

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      if (isAdminOrResponsable) {
        const data = await getAlertas();
        setAlertas(data);
      } else {
        const data = await getAlertasMe();
        setAlertas(data);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, "Error al cargar alertas."));
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!isAdminOrResponsable) return;
    try {
      const data = await getUsuarios();
      setUsuarios(data.filter((u) => u.estado));
    } catch (err) {
      console.error("Error al cargar usuarios para alertas:", err);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchUsers();
  }, [roleName]);

  async function handleLeer(id: string) {
    try {
      await leerAlerta(id);
      setAlertas((prev) =>
        prev.map((a) => (a.id === id ? { ...a, estado: "Leída" } : a))
      );
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  }

  async function handleAtender(id: string) {
    try {
      await atenderAlerta(id);
      setAlertas((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, estado: "Atendida" as const, fecha_atendida: new Date().toISOString() }
            : a
        )
      );
    } catch (err) {
      console.error("Error al atender alerta:", err);
    }
  }

  async function handleCreateAlert(e: React.FormEvent) {
    e.preventDefault();
    if (!targetUserId || !titulo || !mensaje) {
      setFormError("Por favor completa los campos obligatorios.");
      return;
    }
    try {
      setFormSubmitting(true);
      setFormError(null);
      const newAlert = await createAlerta({
        usuario_id: targetUserId,
        titulo,
        mensaje,
        tipo,
        canal,
        accion_recommended: accionRecomendada, // Note: backend is accion_recomendada
        accion_recomendada: accionRecomendada
      } as any);

      setAlertas((prev) => [newAlert, ...prev]);
      setShowForm(false);
      // Reset form
      setTargetUserId("");
      setTitulo("");
      setMensaje("");
      setTipo("Adopción");
      setCanal("Sistema");
      setAccionRecomendada("");
    } catch (err) {
      setFormError(getApiErrorMessage(err, "Error al enviar la alerta."));
    } finally {
      setFormSubmitting(false);
    }
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Atendida":
        return { bg: "#e8f7f6", color: "#3DB1AA" };
      case "Leída":
        return { bg: "#eef2ff", color: "#4f46e5" };
      default:
        return { bg: "#fffbeb", color: "#d97706" };
    }
  };

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case "WhatsApp":
        return <MessageSquare size={14} style={{ color: "#25D366" }} />;
      case "Email":
        return <Mail size={14} style={{ color: "#3b82f6" }} />;
      default:
        return <CheckCircle2 size={14} style={{ color: C.purple }} />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-xl font-extrabold"
            style={{
              color: C.purple,
              fontFamily: "var(--font-brand)",
            }}
          >
            {isAdminOrResponsable ? "Panel Global de Alertas" : "Mis Alertas"}
          </h1>
          <p
            className="text-sm mt-0.5"
            style={{
              color: C.gray,
              fontFamily: "var(--font-body)",
            }}
          >
            {isAdminOrResponsable
              ? "Monitoreo y generación de notificaciones para los usuarios en adopción."
              : "Revisa las alertas y recomendaciones enviadas a tu cuenta."}
          </p>
        </div>

        {isAdminOrResponsable && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="font-bold flex items-center gap-2 rounded-xl transition-all shadow-sm text-sm px-4 py-2"
            style={{
              background: "linear-gradient(135deg, #5D1451, #8a2b7a)",
              color: "#ffffff",
              fontFamily: "var(--font-brand)",
            }}
          >
            <Send size={15} /> {showForm ? "Cerrar Formulario" : "Nueva Alerta"}
          </button>
        )}
      </div>

      {/* Formulario de Nueva Alerta */}
      {showForm && isAdminOrResponsable && (
        <form
          onSubmit={handleCreateAlert}
          className="bg-white rounded-2xl p-5 border border-slate-100 flex flex-col gap-4 shadow-sm"
        >
          <h2
            className="font-extrabold text-sm"
            style={{ color: C.purple, fontFamily: "var(--font-brand)" }}
          >
            Emitir Alerta Manual
          </h2>

          {formError && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Usuario Destinatario *</label>
              <select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
              >
                <option value="">Selecciona un usuario...</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre} {u.apellido} ({u.rol?.nombre || "Sin Rol"})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Canal de Envío</label>
              <select
                value={canal}
                onChange={(e) => setCanal(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
              >
                <option value="Sistema">Notificación de Sistema</option>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Email">Email</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Título / Condición *</label>
              <input
                type="text"
                placeholder="Ej. Cierre de caja atrasado"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Categoría / Tipo</label>
              <input
                type="text"
                placeholder="Ej. Adopción, Soporte, Control"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Mensaje de Notificación *</label>
            <textarea
              placeholder="Escribe el cuerpo del mensaje..."
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none resize-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-700">Acción Recomendada (Opcional)</label>
            <input
              type="text"
              placeholder="Ej. Ir al módulo Caja y realizar el arqueo"
              value={accionRecomendada}
              onChange={(e) => setAccionRecomendada(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-4 py-2 rounded-xl text-sm font-bold text-white transition-opacity"
              style={{
                backgroundColor: C.purple,
                opacity: formSubmitting ? 0.7 : 1,
              }}
            >
              {formSubmitting ? "Enviando..." : "Enviar Alerta"}
            </button>
          </div>
        </form>
      )}

      {/* Lista de Alertas */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <p className="text-sm text-slate-500 animate-pulse font-semibold">Cargando alertas...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 text-red-500 rounded-2xl border border-red-200 text-sm">
          {error}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {alertas.map((a) => {
            const badge = getStatusBadge(a.estado);
            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition-all hover:shadow-md"
              >
                <div className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${C.purple}10`,
                          color: C.purple,
                        }}
                      >
                        {a.tipo || "Alerta"}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        {getChannelIcon(a.canal)}
                        {a.canal}
                      </span>
                      <span
                        className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: badge.bg,
                          color: badge.color,
                        }}
                      >
                        {a.estado}
                      </span>
                    </div>

                    <h3
                      className="font-extrabold text-sm mb-1 text-slate-800"
                      style={{ fontFamily: "var(--font-brand)" }}
                    >
                      {a.titulo}
                    </h3>
                    {isAdminOrResponsable && (
                      <p className="text-xs text-slate-500 mb-2">
                        Para: <span className="font-semibold text-slate-600">{a.usuario.nombre}</span> ({a.usuario.correo})
                      </p>
                    )}

                    <p className="text-xs text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">
                      {a.mensaje}
                    </p>

                    {a.accion_recomendada && (
                      <div className="p-2.5 bg-slate-50/50 rounded-xl border border-slate-100 text-xs inline-flex items-center gap-2">
                        <AlertTriangle size={12} className="text-amber-500" />
                        <span className="text-slate-600">
                          <strong className="text-slate-700 font-bold">Recomendación:</strong> {a.accion_recomendada}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 flex-shrink-0 w-full sm:w-auto">
                    <span className="text-[10px] text-slate-400">
                      {new Date(a.fecha_envio).toLocaleString("es-ES", {
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </span>

                    {/* Acciones */}
                    {!isAdminOrResponsable && a.estado === "Pendiente" && (
                      <button
                        onClick={() => handleLeer(a.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                      >
                        <Check size={12} /> Marcar como Leída
                      </button>
                    )}

                    {isAdminOrResponsable && a.estado !== "Atendida" && (
                      <button
                        onClick={() => handleAtender(a.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-50 text-teal-600 border border-teal-100 hover:bg-teal-100 transition-colors"
                      >
                        <CheckCircle2 size={12} /> Marcar Atendida
                      </button>
                    )}

                    {a.fecha_atendida && (
                      <span className="text-[9px] text-teal-600">
                        Atendida: {new Date(a.fecha_atendida).toLocaleString("es-ES", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {alertas.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100">
              <Shield className="size-8 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No se encontraron alertas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
