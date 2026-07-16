import axiosClient from "./axiosClient";

export interface Actividad {
    id: string;
    usuario: {
        nombre: string;
        apellido: string;
        correo?: string;
    };
    accion: string;
    modulo: string;
    fecha: string;
}

/**
 * Obtiene el listado de actividad reciente a través del endpoint real del backend.
 * Llama a GET /actividad/reciente.
 */
export const getActividadReciente = async (): Promise<Actividad[]> => {
    const response = await axiosClient.get<any[]>("/actividad/reciente");
    return response.data.map((item) => ({
        id: String(item.id),
        usuario: {
            nombre: item.usuario.nombre,
            apellido: item.usuario.apellido,
            correo: item.usuario.correo
        },
        accion: item.accion,
        modulo: item.modulo,
        fecha: item.created_at || item.fecha || new Date().toISOString()
    }));
};


