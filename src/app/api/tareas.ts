import axiosClient from "./axiosClient";
import type { Tarea } from "./rutas";

export interface CreateTareaPayload {
    ruta_id: string;
    titulo: string;
    descripcion: string;
    estado: boolean;
}

export interface UpdateTareaPayload {
    ruta_id?: string;
    titulo?: string;
    descripcion?: string;
    estado?: boolean;
}

export interface Guia {
    id: string;
    tarea_id: string;
    titulo: string;
    contenido?: string | null;
    video_url?: string | null;
    duracion?: number | string | null;
    estado: boolean;
    // Rehydrated / frontend compatibility fields
    categoria?: string;
    orden?: number;
    pasos?: string[];
    steps?: string[];
    learned?: boolean;
}

/**
 * Obtiene el listado de tareas.
 * Calls GET /tareas.
 */
export const getTareas = async (): Promise<Tarea[]> => {
    const response = await axiosClient.get<Tarea[]>("/tareas");
    return response.data;
};

/**
 * Obtiene una tarea por su ID.
 * Calls GET /tareas/{id}.
 */
export const getTareaById = async (id: string): Promise<Tarea> => {
    const response = await axiosClient.get<Tarea>(`/tareas/${id}`);
    return response.data;
};

/**
 * Obtiene las guías asociadas a una tarea.
 * Calls GET /tareas/{tareaId}/guias.
 */
export const getGuiasByTarea = async (tareaId: string): Promise<Guia[]> => {
    const response = await axiosClient.get<Guia[]>(`/tareas/${tareaId}/guias`);
    return response.data;
};

/**
 * Crea una nueva tarea.
 * Calls POST /tareas.
 */
export const createTarea = async (payload: CreateTareaPayload): Promise<Tarea> => {
    const response = await axiosClient.post<Tarea>("/tareas", payload);
    return response.data;
};

/**
 * Actualiza una tarea existente.
 * Calls PUT /tareas/{id}.
 */
export const updateTarea = async (
    id: string,
    payload: UpdateTareaPayload
): Promise<Tarea> => {
    const response = await axiosClient.put<Tarea>(`/tareas/${id}`, payload);
    return response.data;
};

/**
 * Elimina (o desactiva por soft delete) una tarea.
 * Calls DELETE /tareas/{id}.
 */
export const deleteTarea = async (id: string): Promise<void> => {
    await axiosClient.delete(`/tareas/${id}`);
};
