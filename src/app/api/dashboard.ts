import axiosClient from "./axiosClient";

export interface AreaDetalle {
    area: string;
    user: string;
    progress: number;
    lastActivity: string;
    risk: "bajo" | "medio" | "alto";
    action: string;
    color: string;
}

export interface DashboardResponsableData {
    adopcion_global: number;
    areas_riesgo_alto: number;
    usuarios_activos: string;
    usuarios_activos_sub: string;
    tickets_abiertos: number;
    avance_areas_detalle: AreaDetalle[];
}

export interface DashboardData {
    alertas_activas: number;
    casos_soporte: {
        total: number;
        pendiente: number;
        en_proceso: number;
        resuelto: number;
        cerrado: number;
    };
    mis_tareas_recientes: {
        id: string;
        title: string;
        status: "pendiente" | "en_proceso" | "completado";
    }[];
    avance_por_area: {
        area: string;
        progress: number;
    }[];
    recomendacion: string;
    metrics: {
        progreso_general_porcentaje: number;
        tareas_completadas: number;
        tareas_pendientes: number;
    };
}

/**
 * Obtiene las métricas reales para el panel de control del responsable interno.
 * Llama a GET /dashboard/responsable.
 */
export const getDashboardResponsable = async (): Promise<DashboardResponsableData> => {
    const response = await axiosClient.get<DashboardResponsableData>("/dashboard/responsable");
    return response.data;
};

/**
 * Obtiene las métricas reales para el panel de control del colaborador o administrador.
 * Llama a GET /dashboard.
 */
export const getDashboardData = async (): Promise<DashboardData> => {
    const response = await axiosClient.get<DashboardData>("/dashboard");
    return response.data;
};
