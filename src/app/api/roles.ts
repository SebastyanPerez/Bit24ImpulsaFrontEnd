import axiosClient from "./axiosClient";
import type { Rol } from "./auth";

/**
 * Obtiene el listado de roles disponibles en el sistema.
 * Calls GET /roles.
 */
export const getRoles = async (): Promise<Rol[]> => {
  const response = await axiosClient.get<Rol[]>("/roles");
  return response.data;
};
