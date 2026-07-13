import axiosClient from "./axiosClient";
import type { Guia } from "./tareas";

export type { Guia };

export interface CreateGuiaPayload {
    tarea_id: string;
    titulo: string;
    contenido?: string;
    video_url?: string;
    duracion?: number;
    estado: boolean;
}

export interface UpdateGuiaPayload {
    tarea_id?: string;
    titulo?: string;
    contenido?: string;
    video_url?: string;
    duracion?: number;
    estado?: boolean;
}

/**
 * Obtiene el listado de guías.
 * Calls GET /guias.
 */
export const getGuias = async (): Promise<Guia[]> => {
    const response = await axiosClient.get<Guia[]>("/guias");
    return response.data;
};

/**
 * Obtiene una guía por su ID.
 * Calls GET /guias/{id}.
 */
export const getGuiaById = async (id: string): Promise<Guia> => {
    const response = await axiosClient.get<Guia>(`/guias/${id}`);
    return response.data;
};

/**
 * Crea una nueva guía.
 * Calls POST /guias.
 */
export const createGuia = async (payload: CreateGuiaPayload): Promise<Guia> => {
    const response = await axiosClient.post<Guia>("/guias", payload);
    return response.data;
};

/**
 * Actualiza una guía existente.
 * Calls PUT /guias/{id}.
 */
export const updateGuia = async (
    id: string,
    payload: UpdateGuiaPayload
): Promise<Guia> => {
    const response = await axiosClient.put<Guia>(`/guias/${id}`, payload);
    return response.data;
};

/**
 * Elimina (o desactiva por soft delete) una guía.
 * Calls DELETE /guias/{id}.
 */
export const deleteGuia = async (id: string): Promise<void> => {
    await axiosClient.delete(`/guias/${id}`);
};
