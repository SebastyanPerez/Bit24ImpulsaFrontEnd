import { useState } from "react";
import { CheckCircle2, Headphones, Plus } from "lucide-react";
import { C, supportCases } from "../data/datosRegenda";
import {
  BtnGhost,
  BtnPrimary,
  FilledIconCard,
  StatusBadge,
} from "../components/ui-shared/DesignSystem";

// ─── MÓDULO 7: Soporte con trazabilidad ───────────────────────────────────────
export default function SoporteView() {
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
