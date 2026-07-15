import axiosClient from "./axiosClient";

export interface Actividad {
    id: string;
    usuario: {
        nombre: string;
        correo: string;
    };
    accion: string;
    modulo: string;
    fecha: string;
}

/**
 * Obtiene el listado de actividad reciente.
 * Calls GET /actividades (with local fallback if not implemented on backend).
 */
export const getActividadReciente = async (): Promise<Actividad[]> => {
    try {
        const response = await axiosClient.get<Actividad[]>("/actividades");
        return response.data;
    } catch (error) {
        console.warn("Backend endpoint /actividades not found or failed, using mock data.", error);
        return [
            {
                id: "1",
                usuario: { nombre: "Juan Pérez", correo: "juan@bit24.com" },
                accion: "Creó la ruta 'Introducción a Ventas'",
                modulo: "rutas",
                fecha: "2026-07-15T10:30:00Z"
            },
            {
                id: "2",
                usuario: { nombre: "María Gómez", correo: "maria@bit24.com" },
                accion: "Completó la tarea 'Revisión de stock'",
                modulo: "tareas",
                fecha: "2026-07-15T11:15:00Z"
            },
            {
                id: "3",
                usuario: { nombre: "Carlos administrador", correo: "admin@bit24.com" },
                accion: "Creó una nueva alerta crítica",
                modulo: "alertas",
                fecha: "2026-07-15T12:00:00Z"
            },
            {
                id: "4",
                usuario: { nombre: "Soporte Bit24", correo: "soportebit24@bit24.com" },
                accion: "Respondió al ticket de soporte #1024",
                modulo: "soporte",
                fecha: "2026-07-15T12:45:00Z"
            }
        ];
    }
};
