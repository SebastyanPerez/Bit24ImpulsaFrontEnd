import axiosClient from "./axiosClient";

export interface PreguntaCreatePayload {
    pregunta: string;
    tarea_id?: string | null;
    guia_id?: string | null;
}

export interface PreguntaOut {
    id: string;
    pregunta: string;
    respuesta: string;
    categoria: string;
    created_at: string;
}

/**
 * Envia una pregunta al asistente de IA en el backend (Gemini).
 * Calls POST /asistente-ia.
 */
export const preguntar = async (pregunta: string, tareaId?: string | null, guiaId?: string | null): Promise<PreguntaOut> => {
    const payload: PreguntaCreatePayload = {
        pregunta,
        tarea_id: tareaId || null,
        guia_id: guiaId || null,
    };
    const response = await axiosClient.post<PreguntaOut>("/asistente-ia", payload);
    return response.data;
};

/**
 * Obtiene el historial de consultas del asistente de IA para el usuario autenticado.
 * Calls GET /asistente-ia/historial.
 */
export const getHistorial = async (): Promise<PreguntaOut[]> => {
    const response = await axiosClient.get<PreguntaOut[]>("/asistente-ia/historial");
    return response.data;
};
