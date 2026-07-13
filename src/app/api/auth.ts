import axiosClient from "./axiosClient";

export interface Rol {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

export interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id?: string | null;
  rol?: Rol | null;
  estado?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  usuario: Usuario;
}

/**
 * Authenticates the user with the backend API.
 * Calls POST /auth/login.
 * 
 * @param correo - The email of the user.
 * @param password - The password of the user.
 * @returns The response containing the JWT token and user info.
 */
export const login = async (correo: string, password: string): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>("/auth/login", {
    correo,
    password,
  });
  return response.data;
};
