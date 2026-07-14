import axiosClient from "./axiosClient";

export interface UserSimple {
    nombre: string;
    correo: string;
}

export interface Alerta {
    id: string;
    usuario_id: string;
    titulo: string;
    mensaje: string;
    tipo: string | null;
    canal: "WhatsApp" | "Email" | "Sistema";
    estado: "Pendiente" | "Leída" | "Atendida";
    accion_recomendada: string | null;
    fecha_envio: string;
    fecha_atendida: string | null;
    usuario: UserSimple;
}

export interface AlertaCreatePayload {
    usuario_id: string;
    titulo: string;
    mensaje: string;
    tipo?: string;
    canal: "WhatsApp" | "Email" | "Sistema";
    accion_recomendada?: string;
}

export const getAlertasMe = async (): Promise<Alerta[]> => {
    const response = await axiosClient.get<Alerta[]>("/alertas/me");
    return response.data;
};

export const leerAlerta = async (id: string): Promise<Alerta> => {
    const response = await axiosClient.put<Alerta>(`/alertas/${id}/leer`);
    return response.data;
};

export const createAlerta = async (payload: AlertaCreatePayload): Promise<Alerta> => {
    const response = await axiosClient.post<Alerta>("/alertas", payload);
    return response.data;
};

export const getAlertas = async (): Promise<Alerta[]> => {
    const response = await axiosClient.get<Alerta[]>("/alertas");
    return response.data;
};

export const atenderAlerta = async (id: string): Promise<Alerta> => {
    const response = await axiosClient.put<Alerta>(`/alertas/${id}/atender`);
    return response.data;
};
