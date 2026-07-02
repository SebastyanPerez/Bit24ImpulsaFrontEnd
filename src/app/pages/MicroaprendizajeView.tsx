import { useState } from "react";
import { C, microlessons } from "../data/datosRegenda";
import { BtnGhost, BtnPrimary, ProgressBar } from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 4: Microaprendizaje ────────────────────────────────────────────────
export default function MicroaprendizajeView() {
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
