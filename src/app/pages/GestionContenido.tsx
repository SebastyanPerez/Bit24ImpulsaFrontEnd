import React, { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Power,
    PowerOff,
    ShieldAlert,
    Layers,
    FileText,
    BookOpen,
    ChevronRight,
    AlertCircle
} from "lucide-react";
import { getRutas, createRuta, updateRuta, deleteRuta, Ruta, Tarea, getTareasByRuta } from "../api/rutas";
import { createTarea, updateTarea, deleteTarea, getGuiasByTarea } from "../api/tareas";
import { createGuia, updateGuia, deleteGuia, Guia } from "../api/guias";
import { getApiErrorMessage } from "../api/usuarios";
import { getRoles } from "../api/roles";
import { C } from "../data/datosRegenda";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";

export default function GestionContenido() {
    // --- Niveles ---
    const [rutas, setRutas] = useState<Ruta[]>([]);
    const [rutasLoading, setRutasLoading] = useState(true);
    const [rutasError, setRutasError] = useState<string | null>(null);
    const [selectedRuta, setSelectedRuta] = useState<Ruta | null>(null);
    const [roles, setRoles] = useState<any[]>([]);

    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [tareasLoading, setTareasLoading] = useState(false);
    const [tareasError, setTareasError] = useState<string | null>(null);
    const [selectedTarea, setSelectedTarea] = useState<Tarea | null>(null);

    const [guias, setGuias] = useState<Guia[]>([]);
    const [guiasLoading, setGuiasLoading] = useState(false);
    const [guiasError, setGuiasError] = useState<string | null>(null);

    // --- Modales State ---
    const [isRutaModalOpen, setIsRutaModalOpen] = useState(false);
    const [editingRuta, setEditingRuta] = useState<Ruta | null>(null);
    const [rutaNombre, setRutaNombre] = useState("");
    const [rutaDesc, setRutaDesc] = useState("");
    const [rutaRolId, setRutaRolId] = useState("");
    const [rutaEstado, setRutaEstado] = useState(true);

    const [isTareaModalOpen, setIsTareaModalOpen] = useState(false);
    const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);
    const [tareaTitulo, setTareaTitulo] = useState("");
    const [tareaDesc, setTareaDesc] = useState("");
    const [tareaEstado, setTareaEstado] = useState(true);

    const [isGuiaModalOpen, setIsGuiaModalOpen] = useState(false);
    const [editingGuia, setEditingGuia] = useState<Guia | null>(null);
    const [guiaTitulo, setGuiaTitulo] = useState("");
    const [guiaCategoria, setGuiaCategoria] = useState("Ventas");
    const [guiaDuracion, setGuiaDuracion] = useState(5);
    const [guiaOrden, setGuiaOrden] = useState(1);
    const [guiaPasosRaw, setGuiaPasosRaw] = useState("");
    const [guiaEstado, setGuiaEstado] = useState(true);

    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // --- Effects ---
    useEffect(() => {
        fetchRutas();
        fetchRoles();
    }, []);

    useEffect(() => {
        if (selectedRuta) {
            fetchTareas(selectedRuta.id);
        } else {
            setTareas([]);
            setSelectedTarea(null);
        }
    }, [selectedRuta]);

    useEffect(() => {
        if (selectedTarea) {
            fetchGuias(selectedTarea.id);
        } else {
            setGuias([]);
        }
    }, [selectedTarea]);

    // --- Fetchers ---
    const fetchRutas = async () => {
        try {
            setRutasLoading(true);
            setRutasError(null);
            const res = await getRutas();
            setRutas(res);
        } catch (err) {
            setRutasError(getApiErrorMessage(err, "Error al cargar las rutas."));
        } finally {
            setRutasLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const res = await getRoles();
            setRoles(res);
        } catch (err) {
            console.error("Error al cargar roles:", err);
        }
    };

    const fetchTareas = async (rutaId: string) => {
        try {
            setTareasLoading(true);
            setTareasError(null);
            const res = await getTareasByRuta(rutaId);
            setTareas(res);
        } catch (err) {
            setTareasError(getApiErrorMessage(err, "Error al cargar las tareas."));
        } finally {
            setTareasLoading(false);
        }
    };

    const fetchGuias = async (tareaId: string) => {
        try {
            setGuiasLoading(true);
            setGuiasError(null);
            const res = await getGuiasByTarea(tareaId);
            // Parsear el campo `contenido` (JSON string) para rehydratar categoria, orden y pasos
            const parsed = res.map(g => {
                let categoria = g.categoria || "General";
                let orden = g.orden || 1;
                let pasos = g.pasos || [];
                if (g.contenido && typeof g.contenido === "string") {
                    try {
                        const obj = JSON.parse(g.contenido);
                        if (obj && typeof obj === "object") {
                            categoria = obj.categoria || categoria;
                            orden = typeof obj.orden === "number" ? obj.orden : orden;
                            pasos = Array.isArray(obj.pasos) ? obj.pasos : pasos;
                        }
                    } catch {
                        // Si no parsea, lo usamos como primer paso
                        pasos = [g.contenido as string];
                    }
                } else if (g.contenido && typeof g.contenido === "object") {
                    // Ya viene parseado como objeto
                    const obj = g.contenido as { categoria?: string; orden?: number; pasos?: string[] };
                    categoria = obj.categoria || categoria;
                    orden = typeof obj.orden === "number" ? obj.orden : orden;
                    pasos = Array.isArray(obj.pasos) ? obj.pasos : pasos;
                }
                return { ...g, categoria, orden, pasos };
            });
            setGuias(parsed);
        } catch (err) {
            setGuiasError(getApiErrorMessage(err, "Error al cargar las guías."));
        } finally {
            setGuiasLoading(false);
        }
    };

    // --- Ruta Handlers ---
    const handleOpenCreateRuta = () => {
        setEditingRuta(null);
        setRutaNombre("");
        setRutaDesc("");
        setRutaRolId("");
        setRutaEstado(true);
        setSubmitError(null);
        setIsRutaModalOpen(true);
    };

    const handleOpenEditRuta = (r: Ruta, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingRuta(r);
        setRutaNombre(r.nombre);
        setRutaDesc(r.descripcion || "");
        setRutaRolId(r.rol_id || "");
        setRutaEstado(r.estado);
        setSubmitError(null);
        setIsRutaModalOpen(true);
    };

    const handleRutaStatusToggle = async (r: Ruta, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (r.estado) {
                if (window.confirm(`¿Desactivar la ruta: "${r.nombre}"?`)) {
                    await deleteRuta(r.id);
                } else {
                    return;
                }
            } else {
                await updateRuta(r.id, {
                    nombre: r.nombre,
                    descripcion: r.descripcion,
                    rol_id: r.rol_id,
                    estado: true,
                });
            }
            await fetchRutas();
            if (selectedRuta?.id === r.id) {
                setSelectedRuta((prev: Ruta | null) => prev ? { ...prev, estado: !prev.estado } : null);
            }
        } catch (err) {
            alert(getApiErrorMessage(err, "Error al cambiar estado de la ruta."));
        }
    };

    const handleRutaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rutaNombre.trim()) {
            setSubmitError("El nombre es requerido.");
            return;
        }
        try {
            setSubmitting(true);
            setSubmitError(null);
            const payload = {
                nombre: rutaNombre.trim(),
                descripcion: rutaDesc.trim() || undefined,
                rol_id: rutaRolId || null,
                estado: rutaEstado,
            };

            if (editingRuta) {
                const updated = await updateRuta(editingRuta.id, payload);
                if (selectedRuta?.id === editingRuta.id) {
                    setSelectedRuta(updated);
                }
            } else {
                await createRuta(payload);
            }
            setIsRutaModalOpen(false);
            await fetchRutas();
        } catch (err) {
            setSubmitError(getApiErrorMessage(err, "Error al guardar la ruta."));
        } finally {
            setSubmitting(false);
        }
    };

    // --- Tarea Handlers ---
    const handleOpenCreateTarea = () => {
        if (!selectedRuta) return;
        setEditingTarea(null);
        setTareaTitulo("");
        setTareaDesc("");
        setTareaEstado(true);
        setSubmitError(null);
        setIsTareaModalOpen(true);
    };

    const handleOpenEditTarea = (t: Tarea, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTarea(t);
        setTareaTitulo(t.titulo);
        setTareaDesc(t.descripcion || "");
        setTareaEstado(t.estado);
        setSubmitError(null);
        setIsTareaModalOpen(true);
    };

    const handleTareaStatusToggle = async (t: Tarea, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedRuta) return;
        try {
            if (t.estado) {
                if (window.confirm(`¿Desactivar la tarea: "${t.titulo}"?`)) {
                    await deleteTarea(t.id);
                } else {
                    return;
                }
            } else {
                await updateTarea(t.id, {
                    ruta_id: selectedRuta.id,
                    titulo: t.titulo,
                    descripcion: t.descripcion,
                    estado: true,
                });
            }
            await fetchTareas(selectedRuta.id);
            if (selectedTarea?.id === t.id) {
                setSelectedTarea((prev: Tarea | null) => prev ? { ...prev, estado: !prev.estado } : null);
            }
        } catch (err) {
            alert(getApiErrorMessage(err, "Error al cambiar estado de la tarea."));
        }
    };

    const handleTareaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRuta) return;
        if (!tareaTitulo.trim()) {
            setSubmitError("El título es requerido.");
            return;
        }
        try {
            setSubmitting(true);
            setSubmitError(null);
            const payload = {
                ruta_id: selectedRuta.id,
                titulo: tareaTitulo.trim(),
                descripcion: tareaDesc.trim(),
                estado: tareaEstado,
            };

            if (editingTarea) {
                const updated = await updateTarea(editingTarea.id, payload);
                if (selectedTarea?.id === editingTarea.id) {
                    setSelectedTarea(updated);
                }
            } else {
                await createTarea(payload);
            }
            setIsTareaModalOpen(false);
            await fetchTareas(selectedRuta.id);
        } catch (err) {
            setSubmitError(getApiErrorMessage(err, "Error al guardar la tarea."));
        } finally {
            setSubmitting(false);
        }
    };

    // --- Guia Handlers ---
    const handleOpenCreateGuia = () => {
        if (!selectedTarea) return;
        setEditingGuia(null);
        setGuiaTitulo("");
        setGuiaCategoria("Ventas");
        setGuiaDuracion(5);
        setGuiaOrden(guias.length + 1);
        setGuiaPasosRaw("");
        setGuiaEstado(true);
        setSubmitError(null);
        setIsGuiaModalOpen(true);
    };

    const handleOpenEditGuia = (g: Guia, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingGuia(g);
        setGuiaTitulo(g.titulo);
        setGuiaCategoria(g.categoria || "Ventas");
        setGuiaDuracion(typeof g.duracion === "number" ? g.duracion : (parseInt(String(g.duracion)) || 5));
        setGuiaOrden(g.orden || 1);
        setGuiaPasosRaw((g.pasos || []).join("\n"));
        setGuiaEstado(g.estado);
        setSubmitError(null);
        setIsGuiaModalOpen(true);
    };

    const handleGuiaStatusToggle = async (g: Guia, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedTarea) return;
        try {
            if (g.estado) {
                if (window.confirm(`¿Desactivar la guía: "${g.titulo}"?`)) {
                    await deleteGuia(g.id);
                } else {
                    return;
                }
            } else {
                const dur = typeof g.duracion === "number" ? g.duracion : (parseInt(String(g.duracion)) || 5);
                const contenidoJSON = JSON.stringify({
                    categoria: g.categoria || "General",
                    orden: g.orden || 1,
                    pasos: g.pasos || []
                });
                await updateGuia(g.id, {
                    tarea_id: selectedTarea.id,
                    titulo: g.titulo,
                    contenido: contenidoJSON,
                    duracion: dur,
                    estado: true,
                });
            }
            await fetchGuias(selectedTarea.id);
        } catch (err) {
            alert(getApiErrorMessage(err, "Error al cambiar estado de la guía."));
        }
    };

    const handleGuiaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTarea) return;
        if (!guiaTitulo.trim()) {
            setSubmitError("El título es requerido.");
            return;
        }
        const pasos = guiaPasosRaw
            .split("\n")
            .map(p => p.trim())
            .filter(p => p.length > 0);

        if (pasos.length === 0) {
            setSubmitError("Debes escribir al menos un paso.");
            return;
        }

        try {
            setSubmitting(true);
            setSubmitError(null);

            const dur = Number(guiaDuracion) || 5;
            const contenidoJSON = JSON.stringify({
                categoria: guiaCategoria.trim(),
                orden: Number(guiaOrden),
                pasos: pasos,
            });

            const payload = {
                tarea_id: selectedTarea.id,
                titulo: guiaTitulo.trim(),
                contenido: contenidoJSON,
                duracion: dur,
                estado: guiaEstado,
            };

            if (editingGuia) {
                await updateGuia(editingGuia.id, payload);
            } else {
                await createGuia(payload);
            }
            setIsGuiaModalOpen(false);
            await fetchGuias(selectedTarea.id);
        } catch (err) {
            setSubmitError(getApiErrorMessage(err, "Error al guardar la guía."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full min-h-[500px]">
            <div>
                <h1
                    className="text-2xl font-extrabold tracking-tight"
                    style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                    Gestión de Contenido
                </h1>
                <p
                    className="text-sm mt-0.5"
                    style={{ color: C.gray, fontFamily: "var(--font-body)" }}
                >
                    Administración jerárquica de Rutas de adopción, sus Tareas y Guías de microaprendizaje.
                </p>
            </div>

            {/* Grid de 3 Columnas Jerárquicas */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">

                {/* NIVEL 1: RUTAS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-[650px]">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <Layers className="size-4" style={{ color: "#5D1451" }} />
                            <h2 className="font-extrabold text-sm" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Nivel 1: Rutas ({rutas.length})
                            </h2>
                        </div>
                        <Button
                            size="sm"
                            onClick={handleOpenCreateRuta}
                            className="size-8 rounded-xl p-0 hover:opacity-90"
                            style={{ backgroundColor: "#5D1451" }}
                        >
                            <Plus className="size-4" />
                        </Button>
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 pr-1 flex flex-col gap-2">
                        {rutasLoading ? (
                            <p className="text-xs animate-pulse text-center mt-8" style={{ color: C.gray, fontFamily: "var(--font-body)" }}>
                                Cargando rutas...
                            </p>
                        ) : rutasError ? (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3 flex-shrink-0" />
                                <span>{rutasError}</span>
                            </div>
                        ) : rutas.length === 0 ? (
                            <p className="text-xs text-center text-slate-400 mt-8" style={{ fontFamily: "var(--font-body)" }}>
                                No hay rutas creadas.
                            </p>
                        ) : (
                            rutas.map(r => {
                                const isSelected = selectedRuta?.id === r.id;
                                return (
                                    <div
                                        key={r.id}
                                        onClick={() => {
                                            setSelectedRuta(r);
                                            setSelectedTarea(null);
                                        }}
                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-2 ${isSelected
                                            ? "border-[#5D1451] bg-[#5D1451]/5 shadow-sm"
                                            : "border-slate-100 hover:border-slate-200 bg-white"
                                            }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 flex-wrap">
                                                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-md ${r.estado
                                                    ? "bg-purple-50 text-[#5D1451]"
                                                    : "bg-slate-100 text-slate-400"
                                                    }`} style={{ fontFamily: "var(--font-brand)" }}>
                                                    {roles.find(x => x.id === r.rol_id)?.nombre || "Sin rol"}
                                                </span>
                                                {!r.estado && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-500">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xs mt-1.5 break-all" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                                {r.nombre}
                                            </h3>
                                            {r.descripcion && (
                                                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                                                    {r.descripcion}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={(e) => handleOpenEditRuta(r, e)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Editar Ruta"
                                            >
                                                <Pencil className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleRutaStatusToggle(r, e)}
                                                className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors ${r.estado ? "text-amber-500" : "text-emerald-500"
                                                    }`}
                                                title={r.estado ? "Desactivar Ruta" : "Activar Ruta"}
                                            >
                                                {r.estado ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* NIVEL 2: TAREAS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-[650px]">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <FileText className="size-4" style={{ color: "#5D1451" }} />
                            <h2 className="font-extrabold text-sm" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Nivel 2: Tareas ({tareas.length})
                            </h2>
                        </div>
                        {selectedRuta && (
                            <Button
                                size="sm"
                                onClick={handleOpenCreateTarea}
                                className="size-8 rounded-xl p-0 hover:opacity-90"
                                style={{ backgroundColor: "#5D1451" }}
                            >
                                <Plus className="size-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 pr-1 flex flex-col gap-2">
                        {!selectedRuta ? (
                            <div className="text-center mt-12 px-4">
                                <AlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                                    Seleccione una ruta en el Nivel 1 para ver y administrar sus tareas.
                                </p>
                            </div>
                        ) : tareasLoading ? (
                            <p className="text-xs animate-pulse text-center mt-8" style={{ color: C.gray, fontFamily: "var(--font-body)" }}>
                                Cargando tareas de la ruta...
                            </p>
                        ) : tareasError ? (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3" />
                                <span>{tareasError}</span>
                            </div>
                        ) : tareas.length === 0 ? (
                            <p className="text-xs text-center text-slate-400 mt-8" style={{ fontFamily: "var(--font-body)" }}>
                                No hay tareas creadas para esta ruta.
                            </p>
                        ) : (
                            tareas.map(t => {
                                const isSelected = selectedTarea?.id === t.id;
                                return (
                                    <div
                                        key={t.id}
                                        onClick={() => setSelectedTarea(t)}
                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-start gap-2 ${isSelected
                                            ? "border-[#5D1451] bg-[#5D1451]/5 shadow-sm"
                                            : "border-slate-100 hover:border-slate-200 bg-white"
                                            }`}
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5">
                                                {!t.estado && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-500">
                                                        Inactivo
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xs mt-0.5 break-all" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                                {t.titulo || (t as any).title}
                                            </h3>
                                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
                                                {t.descripcion || (t as any).desc}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1 flex-shrink-0">
                                            <button
                                                onClick={(e) => handleOpenEditTarea(t, e)}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                                title="Editar Tarea"
                                            >
                                                <Pencil className="size-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => handleTareaStatusToggle(t, e)}
                                                className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors ${t.estado ? "text-amber-500" : "text-emerald-500"
                                                    }`}
                                                title={t.estado ? "Desactivar Tarea" : "Activar Tarea"}
                                            >
                                                {t.estado ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* NIVEL 3: GUÍAS */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-[650px]">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <BookOpen className="size-4" style={{ color: "#5D1451" }} />
                            <h2 className="font-extrabold text-sm" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Nivel 3: Guías ({guias.length})
                            </h2>
                        </div>
                        {selectedTarea && (
                            <Button
                                size="sm"
                                onClick={handleOpenCreateGuia}
                                className="size-8 rounded-xl p-0 hover:opacity-90"
                                style={{ backgroundColor: "#5D1451" }}
                            >
                                <Plus className="size-4" />
                            </Button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto mt-4 pr-1 flex flex-col gap-2">
                        {!selectedTarea ? (
                            <div className="text-center mt-12 px-4">
                                <AlertCircle className="size-8 text-slate-300 mx-auto mb-2" />
                                <p className="text-xs text-slate-400 font-medium" style={{ fontFamily: "var(--font-body)" }}>
                                    Seleccione una tarea en el Nivel 2 para ver y administrar sus guías rápidas.
                                </p>
                            </div>
                        ) : guiasLoading ? (
                            <p className="text-xs animate-pulse text-center mt-8" style={{ color: C.gray, fontFamily: "var(--font-body)" }}>
                                Cargando guías didácticas...
                            </p>
                        ) : guiasError ? (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3" />
                                <span>{guiasError}</span>
                            </div>
                        ) : guias.length === 0 ? (
                            <p className="text-xs text-center text-slate-400 mt-8" style={{ fontFamily: "var(--font-body)" }}>
                                No hay guías de microaprendizaje fijadas en esta tarea.
                            </p>
                        ) : (
                            guias.map(g => (
                                <div
                                    key={g.id}
                                    className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white flex justify-between items-start gap-2"
                                >
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-600" style={{ fontFamily: "var(--font-brand)" }}>
                                                {g.categoria}
                                            </span>
                                            <span className="text-[10px] text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                                                {g.duracion} · Orden {g.orden}
                                            </span>
                                            {!g.estado && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-red-50 text-red-500">
                                                    Inactivo
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-xs mt-1.5 break-all" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                            {g.titulo}
                                        </h3>
                                        <div className="mt-2 pl-3 border-l-2 border-slate-100 flex flex-col gap-1">
                                            {(g.pasos || []).map((step, idx) => (
                                                <div key={idx} className="flex gap-1 items-start text-[10px]" style={{ color: C.gray, fontFamily: "var(--font-body)" }}>
                                                    <span className="font-bold text-[#5D1451]">{idx + 1}.</span>
                                                    <span className="line-clamp-2">{step}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <button
                                            onClick={(e) => handleOpenEditGuia(g, e)}
                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
                                            title="Editar Guía"
                                        >
                                            <Pencil className="size-3.5" />
                                        </button>
                                        <button
                                            onClick={(e) => handleGuiaStatusToggle(g, e)}
                                            className={`p-1.5 hover:bg-slate-100 rounded-lg transition-colors ${g.estado ? "text-amber-500" : "text-emerald-500"
                                                }`}
                                            title={g.estado ? "Desactivar Guía" : "Activar Guía"}
                                        >
                                            {g.estado ? <PowerOff className="size-3.5" /> : <Power className="size-3.5" />}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>

            {/* --- MODAL 1: RUTAS (Crear/Editar) --- */}
            <Dialog open={isRutaModalOpen} onOpenChange={setIsRutaModalOpen}>
                <DialogContent className="rounded-2xl max-w-md w-full border border-slate-100 shadow-xl bg-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-extrabold" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>
                            {editingRuta ? "Editar Ruta" : "Nueva Ruta"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleRutaSubmit} className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Nombre de la Ruta
                            </label>
                            <Input
                                placeholder="Ruta Vendedor, Ruta Cajero, etc."
                                value={rutaNombre}
                                onChange={e => setRutaNombre(e.target.value)}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Descripción (opcional)
                            </label>
                            <Textarea
                                placeholder="Detalla de qué trata esta ruta de aprendizaje corporativo..."
                                value={rutaDesc}
                                onChange={e => setRutaDesc(e.target.value)}
                                className="rounded-xl min-h-[80px]"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Rol Asociado
                            </label>
                            <select
                                value={rutaRolId}
                                onChange={e => setRutaRolId(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#5D1451]/50"
                                style={{ fontFamily: "var(--font-body)" }}
                            >
                                <option value="">Ninguno / Libre</option>
                                {roles.map((r: any) => (
                                    <option key={r.id} value={r.id}>
                                        {r.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {editingRuta && (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-1">
                                <span className="text-xs font-bold text-slate-600" style={{ fontFamily: "var(--font-brand)" }}>
                                    Estado Activo
                                </span>
                                <input
                                    type="checkbox"
                                    checked={rutaEstado}
                                    onChange={e => setRutaEstado(e.target.checked)}
                                    className="rounded text-[#5D1451] focus:ring-[#5D1451] size-4"
                                />
                            </div>
                        )}

                        {submitError && (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3.5 flex-shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <DialogFooter className="mt-4 gap-2 flex-wrap">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsRutaModalOpen(false)}
                                className="rounded-xl text-xs font-bold"
                                style={{ fontFamily: "var(--font-brand)" }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl text-xs font-bold text-white"
                                style={{ backgroundColor: "#5D1451", fontFamily: "var(--font-brand)" }}
                            >
                                {submitting ? "Guardando..." : "Guardar Ruta"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL 2: TAREAS (Crear/Editar) --- */}
            <Dialog open={isTareaModalOpen} onOpenChange={setIsTareaModalOpen}>
                <DialogContent className="rounded-2xl max-w-md w-full border border-slate-100 shadow-xl bg-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-extrabold" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>
                            {editingTarea ? "Editar Tarea" : "Nueva Tarea"}
                        </DialogTitle>
                        <p className="text-[11px] text-[#5D1451]" style={{ fontFamily: "var(--font-body)" }}>
                            Asociada a: <span className="font-bold">{selectedRuta?.nombre}</span>
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleTareaSubmit} className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Título de la Tarea
                            </label>
                            <Input
                                placeholder="Registrar venta directa, Arqueo de caja, etc."
                                value={tareaTitulo}
                                onChange={e => setTareaTitulo(e.target.value)}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Descripción de la Tarea
                            </label>
                            <Textarea
                                placeholder="Indica qué objetivos tiene este paso en la ruta de adopción..."
                                value={tareaDesc}
                                onChange={e => setTareaDesc(e.target.value)}
                                className="rounded-xl min-h-[100px]"
                                required
                            />
                        </div>

                        {editingTarea && (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-1">
                                <span className="text-xs font-bold text-slate-600" style={{ fontFamily: "var(--font-brand)" }}>
                                    Estado Activo
                                </span>
                                <input
                                    type="checkbox"
                                    checked={tareaEstado}
                                    onChange={e => setTareaEstado(e.target.checked)}
                                    className="rounded text-[#5D1451] focus:ring-[#5D1451] size-4"
                                />
                            </div>
                        )}

                        {submitError && (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3.5 flex-shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <DialogFooter className="mt-4 gap-2 flex-wrap">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsTareaModalOpen(false)}
                                className="rounded-xl text-xs font-bold"
                                style={{ fontFamily: "var(--font-brand)" }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl text-xs font-bold text-white"
                                style={{ backgroundColor: "#5D1451", fontFamily: "var(--font-brand)" }}
                            >
                                {submitting ? "Guardando..." : "Guardar Tarea"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* --- MODAL 3: GUÍAS (Crear/Editar) --- */}
            <Dialog open={isGuiaModalOpen} onOpenChange={setIsGuiaModalOpen}>
                <DialogContent className="rounded-2xl max-w-md w-full border border-slate-100 shadow-xl bg-white p-6">
                    <DialogHeader>
                        <DialogTitle className="text-base font-extrabold" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>
                            {editingGuia ? "Editar Guía Rápida" : "Nueva Guía Rápida"}
                        </DialogTitle>
                        <p className="text-[11px] text-[#5D1451]" style={{ fontFamily: "var(--font-body)" }}>
                            Para la tarea: <span className="font-bold">{selectedTarea?.titulo}</span>
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleGuiaSubmit} className="flex flex-col gap-3.5 mt-1 overflow-y-auto max-h-[550px] pr-1">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Título descriptivo
                            </label>
                            <Input
                                placeholder="Cómo facturar productos sin código de barras"
                                value={guiaTitulo}
                                onChange={e => setGuiaTitulo(e.target.value)}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3.5">
                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                    Categoría didáctica
                                </label>
                                <select
                                    value={guiaCategoria}
                                    onChange={e => setGuiaCategoria(e.target.value)}
                                    className="rounded-xl border border-slate-200 p-2.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#5D1451]/50"
                                    style={{ fontFamily: "var(--font-body)" }}
                                >
                                    <option value="Ventas">Ventas</option>
                                    <option value="Almacén">Almacén</option>
                                    <option value="Caja">Caja</option>
                                    <option value="Compras">Compras</option>
                                    <option value="General">General</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                    Duración (minutos)
                                </label>
                                <Input
                                    type="number"
                                    min="1"
                                    placeholder="Ej: 5"
                                    value={guiaDuracion}
                                    onChange={e => setGuiaDuracion(Number(e.target.value))}
                                    className="rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                Orden de Visualización
                            </label>
                            <Input
                                type="number"
                                min="1"
                                value={guiaOrden}
                                onChange={e => setGuiaOrden(Number(e.target.value))}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold" style={{ color: "#2a1028", fontFamily: "var(--font-brand)" }}>
                                    Pasos de la Guía (Uno por línea)
                                </label>
                                <span className="text-[10px] text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                                    Salto de línea = Nuevo paso
                                </span>
                            </div>
                            <Textarea
                                placeholder="1. Abre Ventas en el menú.&#10;2. Presiona venta rápida.&#10;3. Completa los montos y guarda."
                                value={guiaPasosRaw}
                                onChange={e => setGuiaPasosRaw(e.target.value)}
                                className="rounded-xl min-h-[120px] text-xs font-mono"
                                required
                            />
                        </div>

                        {editingGuia && (
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl mt-1">
                                <span className="text-xs font-bold text-slate-600" style={{ fontFamily: "var(--font-brand)" }}>
                                    Estado Activo
                                </span>
                                <input
                                    type="checkbox"
                                    checked={guiaEstado}
                                    onChange={e => setGuiaEstado(e.target.checked)}
                                    className="rounded text-[#5D1451] focus:ring-[#5D1451] size-4"
                                />
                            </div>
                        )}

                        {submitError && (
                            <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl flex gap-1 items-center">
                                <AlertCircle className="size-3.5 flex-shrink-0" />
                                <span>{submitError}</span>
                            </div>
                        )}

                        <DialogFooter className="mt-4 gap-2 flex-shrink-0">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsGuiaModalOpen(false)}
                                className="rounded-xl text-xs font-bold"
                                style={{ fontFamily: "var(--font-brand)" }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="rounded-xl text-xs font-bold text-white"
                                style={{ backgroundColor: "#5D1451", fontFamily: "var(--font-brand)" }}
                            >
                                {submitting ? "Guardando..." : "Guardar Guía"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
