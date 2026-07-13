import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { C } from "../data/datosRegenda";
import { BtnGhost, BtnPrimary, ProgressBar } from "../components/ui-shared/DesignSystem";
import { getGuias, Guia } from "../api/guias";
import { getApiErrorMessage } from "../api/usuarios";
import { useAuth } from "../context/AuthContext";

interface UIGuia extends Guia {
  title: string;
  category: string;
  duration: string;
  steps: string[];
}

// ─── MÓDULO 4: Microaprendizaje ────────────────────────────────────────────────
export default function MicroaprendizajeView() {
  const { usuario } = useAuth();
  const [lessons, setLessons] = useState<UIGuia[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const learnedCount = lessons.filter((l) => l.learned).length;

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getGuias();
        const mapped = data.map((g): UIGuia => {
          const storedLearned = localStorage.getItem(`lesson_learned_${usuario?.id || "anon"}_${g.id}`);
          let parsed: { categoria: string; pasos: string[] } = { categoria: "General", pasos: [] as string[] };
          try {
            if (g.contenido) {
              if (typeof g.contenido === "object") {
                // Ya viene parseado como ContenidoGuia
                parsed = {
                  categoria: g.contenido.categoria || "General",
                  pasos: Array.isArray(g.contenido.pasos) ? g.contenido.pasos : [],
                };
              } else {
                // Es un JSON string, lo parseamos
                const obj = JSON.parse(g.contenido as string);
                parsed = {
                  categoria: obj.categoria || "General",
                  pasos: Array.isArray(obj.pasos) ? obj.pasos : [],
                };
              }
            }
          } catch (e) {
            parsed = { categoria: "", pasos: g.contenido ? [g.contenido as string] : [] };
          }
          return {
            ...g,
            title: g.titulo || "Sin título",
            category: parsed.categoria || g.categoria || "General",
            duration: g.duracion ? `${g.duracion} min` : "5 min",
            learned: storedLearned === "true" || !!g.learned,
            steps: parsed.pasos || g.pasos || g.steps || [],
          };
        });
        setLessons(mapped);
      } catch (err) {
        setError(
          getApiErrorMessage(
            err,
            "Error al cargar las guías de microaprendizaje. Por favor, intente de nuevo."
          )
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [usuario?.id]);

  function markLearned(id: string) {
    setLessons((prev) =>
      prev.map((l) => {
        if (l.id !== id) return l;
        localStorage.setItem(`lesson_learned_${usuario?.id || "anon"}_${id}`, "true");
        return { ...l, learned: true };
      })
    );
    setActive(null);
  }

  /* Gestalt similitud: todas las tarjetas de lección tienen igual estructura */
  const catColor: Record<string, string> = {
    Ventas: C.purple,
    Almacén: C.red,
    Almacen: C.red,
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
          Guías rápidas para dominar Bit24 paso a paso en REGENDA
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p
            className="text-sm font-semibold animate-pulse"
            style={{ color: C.gray, fontFamily: "var(--font-body)" }}
          >
            Cargando guías...
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
      ) : lessons.length === 0 ? (
        <div
          className="p-8 text-center bg-white rounded-2xl border border-slate-100"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p className="text-sm font-medium" style={{ color: C.gray }}>
            No hay guías registradas en la base de datos.
          </p>
        </div>
      ) : (
        <>
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

          {/* Grid de lecciones ── Gestalt proximidad */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lessons.map((lesson) => {
              const lColor = catColor[lesson.category] || C.purple;
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
                    <div className="flex items-center gap-2 mb-2 bg-transparent">
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
                          className="text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
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
                        {(lesson.steps || []).map((step: string, i: number) => (
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
                          active === lesson.id ? null : lesson.id
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
        </>
      )}
    </div>
  );
}
