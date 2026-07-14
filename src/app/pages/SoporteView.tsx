import { useEffect, useState } from "react";
import { CheckCircle2, Headphones, Plus } from "lucide-react";
import { C } from "../data/datosRegenda";
import {
  BtnGhost,
  BtnPrimary,
  FilledIconCard,
  StatusBadge,
} from "../components/ui-shared/DesignSystem";
import {
  getCategoriasSoporte,
  createSoporte,
  getSoporteMe,
  Soporte,
  CategoriaSoporte,
} from "../api/soporte";

// ─── MÓDULO 7: Soporte con trazabilidad ───────────────────────────────────────
export default function SoporteView() {
  const [cases, setCases] = useState<Soporte[]>([]);
  const [categories, setCategories] = useState<CategoriaSoporte[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    categoryId: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [cats, myTickets] = await Promise.all([
          getCategoriasSoporte(),
          getSoporteMe(),
        ]);
        setCategories(cats);
        setCases(myTickets);
        if (cats.length > 0) {
          setForm((p) => ({ ...p, categoryId: cats[0].id }));
        }
      } catch (err) {
        console.error("Error al cargar datos de soporte:", err);
        setError("Error al conectar con la base de datos de soporte.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.categoryId || !form.title) return;
    try {
      const newTicket = await createSoporte({
        categoria_id: form.categoryId,
        titulo: form.title,
        descripcion: form.description,
      });
      setCases((prev) => [newTicket, ...prev]);
      setSubmitted(true);
      setShowForm(false);
      setForm({
        title: "",
        categoryId: categories[0]?.id || "",
        description: "",
      });
      setTimeout(() => setSubmitted(false), 3500);
    } catch (err) {
      console.error("Error al crear caso de soporte:", err);
      alert("Hubo un error al registrar el caso. Por favor reintente.");
    }
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
            Registrá y hacé seguimiento a casos con trazabilidad completa
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
          Caso registrado correctamente. El equipo de soporte lo atenderá pronto.
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
              <div>
                <label
                  className="text-xs font-extrabold uppercase tracking-widest block mb-1"
                  style={{
                    color: C.purple,
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  Título *
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ej: Error al emitir boletas de venta"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      title: e.target.value,
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
                  Área / Categoría *
                </label>
                <select
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      categoryId: e.target.value,
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
                  {categories.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nombre}
                    </option>
                  ))}
                </select>
              </div>
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
                  border: `1.5px solid ${C.purple}20$,`,
                  borderColor: `${C.purple}20`,
                  backgroundColor: "#fdfbfd",
                  color: "#2a1028",
                  fontFamily: "var(--font-body)",
                }}
              />
            </div>

            <div className="flex gap-2">
              <BtnPrimary type="submit">
                Registrar caso
              </BtnPrimary>
              <BtnGhost onClick={() => setShowForm(false)}>
                Cancelar
              </BtnGhost>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="text-center py-4 text-sm text-red-500 font-semibold bg-red-50 border border-red-100 rounded-xl" style={{ fontFamily: "var(--font-brand)" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-sm text-gray-500" style={{ fontFamily: "var(--font-body)" }}>
          Cargando casos de soporte...
        </div>
      )}

      {!loading && (
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
          {cases.length === 0 ? (
            <p className="text-sm text-center py-8 text-gray-400 font-medium" style={{ fontFamily: "var(--font-body)" }}>
              No tenés casos de soporte registrados.
            </p>
          ) : (
            cases.map((c) => {
              const sColor =
                c.estado === "resuelto" || c.estado === "Resuelto"
                  ? C.teal
                  : c.estado === "en_atencion" || c.estado === "En Proceso"
                    ? "#b37000"
                    : c.estado === "Abierto"
                      ? C.red
                      : C.gray;
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-4 hover:shadow-md transition-shadow animate-fade-in"
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
                            className="text-[10px] font-mono mr-2 uppercase tracking-wide bg-slate-100 py-0.5 px-2 rounded-md"
                            style={{ color: C.gray }}
                          >
                            {c.id.slice(0, 8)}
                          </span>
                          <span
                            className="font-extrabold text-sm"
                            style={{
                              color: "#2a1028",
                              fontFamily: "var(--font-brand)",
                            }}
                          >
                            {c.titulo}
                          </span>
                          {c.descripcion && (
                            <p
                              className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed"
                              style={{ fontFamily: "var(--font-body)" }}
                            >
                              {c.descripcion}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={c.estado} />
                      </div>
                      <div
                        className="flex items-center gap-3 text-[11px] mt-2 flex-wrap"
                        style={{
                          color: C.gray,
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        <span>
                          Área:{" "}
                          <strong style={{ color: "#2a1028" }}>
                            {c.categoria?.nombre || "General"}
                          </strong>
                        </span>
                        ·
                        <span>
                          Resp.:{" "}
                          <strong style={{ color: "#2a1028" }}>
                            {c.responsable
                              ? `${c.responsable.nombre} ${c.responsable.apellido}`
                              : "Sin asignar"}
                          </strong>
                        </span>
                        ·
                        <span>
                          {new Date(c.created_at).toLocaleDateString("es-ES", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
