import axiosClient from "./axiosClient";
import type { Rol } from "./auth";

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id?: string | null;
  rol?: Rol | null;
  estado: boolean;
}

export interface CreateUsuarioPayload {
  nombre: string;
  apellido: string;
  correo: string;
  password: string;
  rol_id: string | null;
  estado: boolean;
}

export interface UpdateUsuarioPayload {
  nombre: string;
  apellido: string;
  correo: string;
  rol_id: string | null;
  estado: boolean;
  password?: string;
}

/**
 * Normaliza mensajes de error de respuestas FastAPI.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const detail = (err as { response?: { data?: { detail?: unknown } } })
      .response?.data?.detail;

    if (typeof detail === "string") {
      return detail;
    }

    if (Array.isArray(detail)) {
      return detail
        .map((item) => {
          if (typeof item === "string") return item;
          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: string }).msg);
          }
          return String(item);
        })
        .join(", ");
    }
  }

  return fallback;
}

/**
 * Obtiene el listado de usuarios.
 * Calls GET /usuarios.
 */
export const getUsuarios = async (): Promise<Usuario[]> => {
  const response = await axiosClient.get<Usuario[]>("/usuarios");
  return response.data;
};

/**
 * Obtiene un usuario por su ID.
 * Calls GET /usuarios/{id}.
 */
export const getUsuarioById = async (id: string): Promise<Usuario> => {
  const response = await axiosClient.get<Usuario>(`/usuarios/${id}`);
  return response.data;
};

/**
 * Registra un nuevo usuario.
 * Calls POST /usuarios.
 */
export const createUsuario = async (
  payload: CreateUsuarioPayload
): Promise<Usuario> => {
  const response = await axiosClient.post<Usuario>("/usuarios", payload);
  return response.data;
};

/**
 * Actualiza los datos de un usuario existente.
 * Calls PUT /usuarios/{id}.
 */
export const updateUsuario = async (
  id: string,
  payload: UpdateUsuarioPayload
): Promise<Usuario> => {
  const response = await axiosClient.put<Usuario>(`/usuarios/${id}`, payload);
  return response.data;
};

/**
 * Desactiva un usuario (soft delete).
 * Calls DELETE /usuarios/{id}.
 */
export const deleteUsuario = async (id: string): Promise<void> => {
  await axiosClient.delete(`/usuarios/${id}`);
};
