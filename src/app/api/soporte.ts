import axiosClient from "./axiosClient";

export interface CategoriaSoporte {
    id: string;
    nombre: string;
    created_at: string;
}

export interface UsuarioSoporte {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
}

export interface Soporte {
    id: string;
    usuario_id: string;
    categoria_id: string;
    responsable_id: string | null;
    titulo: string;
    descripcion: string | null;
    estado: "Abierto" | "En Proceso" | "Resuelto" | "Cerrado" | string;
    created_at: string;
    usuario: UsuarioSoporte;
    categoria: CategoriaSoporte;
    responsable: UsuarioSoporte | null;
}

export interface SoporteCreatePayload {
    categoria_id: string;
    titulo: string;
    descripcion?: string;
}

export const getCategoriasSoporte = async (): Promise<CategoriaSoporte[]> => {
    const response = await axiosClient.get<CategoriaSoporte[]>("/categorias-soporte");
    return response.data;
};

export const createSoporte = async (payload: SoporteCreatePayload): Promise<Soporte> => {
    const response = await axiosClient.post<Soporte>("/soporte", payload);
    return response.data;
};

export const getSoporteMe = async (): Promise<Soporte[]> => {
    const response = await axiosClient.get<Soporte[]>("/soporte/me");
    return response.data;
};

export const getSoportes = async (): Promise<Soporte[]> => {
    const response = await axiosClient.get<Soporte[]>("/soporte");
    return response.data;
};

export const getTodosTickets = async (): Promise<Soporte[]> => {
    const response = await axiosClient.get<Soporte[]>("/soporte");
    return response.data;
};

export const asignarTicket = async (id: string): Promise<Soporte> => {
    const response = await axiosClient.put<Soporte>(`/soporte/${id}/asignar`);
    return response.data;
};

export const actualizarEstado = async (
    id: string,
    estado: "Abierto" | "En Proceso" | "Resuelto" | "Cerrado" | string
): Promise<Soporte> => {
    const response = await axiosClient.put<Soporte>(`/soporte/${id}/estado`, {
        estado,
    });
    return response.data;
};

export const updateSoporteResponsable = async (
    id: string,
    responsable_id: string | null
): Promise<Soporte> => {
    const response = await axiosClient.put<Soporte>(`/soporte/${id}/responsable`, {
        responsable_id,
    });
    return response.data;
};

export const updateSoporteEstado = async (
    id: string,
    estado: "Abierto" | "En Proceso" | "Resuelto" | "Cerrado" | string
): Promise<Soporte> => {
    const response = await axiosClient.put<Soporte>(`/soporte/${id}/estado`, {
        estado,
    });
    return response.data;
};
