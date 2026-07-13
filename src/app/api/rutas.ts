import axiosClient from "./axiosClient";

export interface Ruta {
    id: string;
    nombre: string;
    descripcion?: string;
    rol_id?: string | null;
    estado: boolean;
}

export interface CreateRutaPayload {
    nombre: string;
    descripcion?: string;
    rol_id?: string | null;
    estado: boolean;
}

export interface UpdateRutaPayload {
    nombre: string;
    descripcion?: string;
    rol_id?: string | null;
    estado: boolean;
}

export interface Tarea {
    id: string;
    ruta_id: string;
    titulo: string;
    descripcion: string;
    estado: boolean;
    // Para compatibilidad con la vista
    title?: string;
    desc?: string;
    status?: "completado" | "en_proceso" | "pendiente";
}

/**
 * Obtiene el listado de rutas.
 * Calls GET /rutas.
 */
export const getRutas = async (): Promise<Ruta[]> => {
    const response = await axiosClient.get<Ruta[]>("/rutas");
    return response.data;
};

/**
 * Obtiene una ruta por su ID.
 * Calls GET /rutas/{id}.
 */
export const getRutaById = async (id: string): Promise<Ruta> => {
    const response = await axiosClient.get<Ruta>(`/rutas/${id}`);
    return response.data;
};

/**
 * Obtiene las tareas asociadas a una ruta.
 * Calls GET /rutas/{rutaId}/tareas.
 */
export const getTareasByRuta = async (rutaId: string): Promise<Tarea[]> => {
    const response = await axiosClient.get<Tarea[]>(`/rutas/${rutaId}/tareas`);
    return response.data;
};

/**
 * Crea una nueva ruta.
 * Calls POST /rutas.
 */
export const createRuta = async (payload: CreateRutaPayload): Promise<Ruta> => {
    const response = await axiosClient.post<Ruta>("/rutas", payload);
    return response.data;
};

/**
 * Actualiza una ruta existente.
 * Calls PUT /rutas/{id}.
 */
export const updateRuta = async (
    id: string,
    payload: UpdateRutaPayload
): Promise<Ruta> => {
    const response = await axiosClient.put<Ruta>(`/rutas/${id}`, payload);
    return response.data;
};

/**
 * Elimina (o desactiva por soft delete) una ruta.
 * Calls DELETE /rutas/{id}.
 */
export const deleteRuta = async (id: string): Promise<void> => {
    await axiosClient.delete(`/rutas/${id}`);
};
