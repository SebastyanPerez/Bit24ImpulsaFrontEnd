import { useState, useEffect } from "react";
import { CheckCircle2, ShieldAlert } from "lucide-react";
import { C, RolId, roleConfig, mapBackendRoleToRolId } from "../data/datosRegenda";
import { ProgressBar, StatusBadge } from "../components/ui-shared/DesignSystem";
import { getRutas, getTareasByRuta, Tarea } from "../api/rutas";
import { getApiErrorMessage } from "../api/usuarios";
import { useAuth } from "../context/AuthContext";

// ─── MÓDULO 3: Ruta de adopción por rol ───────────────────────────────────────
export default function RutaView({ rol }: { rol: RolId }) {
  const { usuario } = useAuth();
  const [tasks, setTasks] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cfg = roleConfig[rol];

  useEffect(() => {
    const fetchRouteAndTasks = async () => {
      try {
        setLoading(true);
        setError(null);
        const routes = await getRutas();

        // Find route matching user's RolId
        const matchedRoute = routes.find(
          (r) =>
            mapBackendRoleToRolId(r.nombre) === rol ||
            (r.nombre && r.nombre.toLowerCase().includes(cfg.label.toLowerCase()))
        );

        if (!matchedRoute) {
          setTasks([]);
          setLoading(false);
          return;
        }

        const data = await getTareasByRuta(matchedRoute.id);
        const mapped = data.map((t) => {
          const storedStatus = localStorage.getItem(`task_status_${usuario?.id || "anon"}_${t.id}`);
          return {
            ...t,
            title: t.titulo || t.title || "Sin título",
            desc: t.descripcion || t.desc || "Sin descripción",
            status: (storedStatus as "completado" | "en_proceso" | "pendiente") || "pendiente"
          };
        });

        setTasks(mapped);
      } catch (err) {
        setError(
          getApiErrorMessage(
            err,
            "Error al cargar la ruta de adopción. Por favor, intente de nuevo."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRouteAndTasks();
  }, [rol, cfg.label, usuario?.id]);

  const completed = tasks.filter((t) => t.status === "completado").length;
  const progress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  function advance(id: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        let newStatus: "pendiente" | "en_proceso" | "completado" = "pendiente";
        if (t.status === "pendiente") newStatus = "en_proceso";
        else if (t.status === "en_proceso") newStatus = "completado";
        else return t;

        localStorage.setItem(`task_status_${usuario?.id || "anon"}_${id}`, newStatus);
        return { ...t, status: newStatus };
      })
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

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p
            className="text-sm font-semibold animate-pulse"
            style={{ color: C.gray, fontFamily: "var(--font-body)" }}
          >
            Cargando ruta de adopción...
          </p>
        </div>
      ) : error ? (
        <div
          className="p-4 rounded-xl text-sm flex items-center gap-2"
          style={{
            backgroundColor: C.redLight,
            color: C.red,
            border: `1px solid ${C.red}20`,
          }}
        >
          <ShieldAlert className="size-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ) : tasks.length === 0 ? (
        <div
          className="p-8 text-center bg-white rounded-2xl border border-slate-100"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p className="text-sm font-medium" style={{ color: C.gray }}>
            No hay tareas registradas para el rol {cfg.label} en la base de datos.
          </p>
        </div>
      ) : (
        <>
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
                {usuario ? `${usuario.nombre} ${usuario.apellido}` : cfg.user} · {cfg.label}
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
                          <StatusBadge status={t.status || "pendiente"} />
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
        </>
      )}
    </div>
  );
}
