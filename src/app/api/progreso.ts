import axiosClient from "./axiosClient";

export interface ProgresoInfo {
    porcentaje_adopcion: number;
    tareas_completadas: number;
    tareas_pendientes: number;
}

// Interfaces para compatibilidad
export interface TareaSimple {
    id: string;
    titulo: string;
}

export interface Progreso {
    id: string;
    usuario_id: string;
    tarea_id: string;
    estado: "Pendiente" | "En Proceso" | "Completado";
    fecha_completado: string | null;
    tarea: TareaSimple;
}

export interface ProgresoResumen {
    rol_id: string;
    rol_nombre: string;
    usuarios_activos: number;
    tareas_activas: number;
    tareas_completadas: number;
    porcentaje_adopcion: number;
}

/**
 * Obtiene el progreso del usuario actual.
 * Calls GET /progreso/me.
 */
export const getMiProgreso = async (): Promise<any> => {
    const response = await axiosClient.get<any>("/progreso/me");
    return response.data;
};

/**
 * Obtiene el resumen de progreso de todas las áreas (para Administrador/Responsable Interno).
 * Calls GET /progreso/resumen.
 */
export const getProgresoResumen = async (): Promise<any> => {
    const response = await axiosClient.get<any>("/progreso/resumen");
    return response.data;
};

/**
 * Marca una tarea como completada en la ruta de adopción del usuario.
 * Calls PUT /progreso/{tareaId} con el estado "Completado".
 */
export const marcarTareaCompletada = async (tareaId: string): Promise<void> => {
    await axiosClient.put(`/progreso/${tareaId}`, { estado: "Completado" });
};

// Aliases para compatibilidad con código existente si lo hubiese
export const getProgresoMe = getMiProgreso;
export const updateProgreso = async (
    tareaId: string,
    estado: "Pendiente" | "En Proceso" | "Completado"
): Promise<any> => {
    if (estado === "Completado") {
        await marcarTareaCompletada(tareaId);
    } else {
        const response = await axiosClient.put(`/progreso/${tareaId}`, { estado });
        return response.data;
    }
};
