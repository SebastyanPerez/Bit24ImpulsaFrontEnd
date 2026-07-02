import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../api/axiosClient";
import { Plus, Pencil, Power, PowerOff, ShieldAlert } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

interface Rol {
  id: string;
  nombre: string;
  descripcion?: string | null;
}

interface UsuarioBackend {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  rol_id?: string | null;
  rol?: Rol | null;
  estado: boolean;
}

interface FormValues {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol_id: string;
}

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<UsuarioBackend[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);
  
  // Dialog modal states
  const [isOpen, setIsOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // react-hook-form setup
  const form = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      rol_id: "",
    },
  });

  const fetchUsuarios = async () => {
    try {
      setGlobalError(null);
      setLoading(true);
      const response = await axiosClient.get<UsuarioBackend[]>("/usuarios");
      setUsuarios(response.data);
    } catch (err: any) {
      setGlobalError(
        err.response?.data?.detail || "Error al cargar la lista de usuarios. Verifica que el backend esté activo."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get<Rol[]>("/roles");
      setRoles(response.data);
    } catch (err: any) {
      console.error("Error al cargar roles:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const openCreateModal = () => {
    setEditingUserId(null);
    setFormError(null);
    form.reset({
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      rol_id: "",
    });
    setIsOpen(true);
  };

  const openEditModal = (user: UsuarioBackend) => {
    setEditingUserId(user.id);
    setFormError(null);
    form.reset({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      password: "", // Contraseña vacía para no modificarla por defecto
      rol_id: user.rol_id || "",
    });
    setIsOpen(true);
  };

  const handleDeactivate = async (userId: string) => {
    if (!window.confirm("¿Estás seguro de que deseas desactivar a este usuario?")) {
      return;
    }
    try {
      setGlobalError(null);
      await axiosClient.delete(`/usuarios/${userId}`);
      await fetchUsuarios();
    } catch (err: any) {
      setGlobalError(
        err.response?.data?.detail || "Error al desactivar el usuario."
      );
    }
  };

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    setSubmitting(true);
    try {
      if (editingUserId) {
        // En edición, omitimos password si está vacío
        const payload: any = {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          rol_id: values.rol_id || null,
        };
        if (values.password && values.password.trim() !== "") {
          payload.password = values.password;
        }

        await axiosClient.put(`/usuarios/${editingUserId}`, payload);
      } else {
        // Al crear, la contraseña es obligatoria
        if (!values.password || values.password.trim() === "") {
          setFormError("La contraseña es requerida para nuevos usuarios.");
          setSubmitting(false);
          return;
        }

        const payload = {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          password: values.password,
          rol_id: values.rol_id || null,
        };

        await axiosClient.post("/usuarios", payload);
      }
      
      setIsOpen(false);
      await fetchUsuarios();
    } catch (err: any) {
      setFormError(
        err.response?.data?.detail || "Ocurrió un error al guardar el usuario. Verifica los campos."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>
            Gestión de Usuarios
          </h1>
          <p className="text-sm mt-1" style={{ color: "#666666", fontFamily: "var(--font-body)" }}>
            Registra, edita y administra los accesos y roles de los usuarios del sistema piloto REGENDA.
          </p>
        </div>
        <Button
          onClick={openCreateModal}
          className="font-bold flex items-center gap-2 rounded-xl transition-all shadow-sm"
          style={{
            background: "linear-gradient(135deg, #5D1451, #8a2b7a)",
            color: "#ffffff",
            fontFamily: "var(--font-brand)",
          }}
        >
          <Plus className="size-4" /> Nuevo usuario
        </Button>
      </div>

      {/* Error alert banner */}
      {globalError && (
        <div className="p-4 rounded-xl text-sm flex items-center gap-2" style={{ backgroundColor: "#fdecea", color: "#e34038", border: "1px solid rgba(227, 64, 56, 0.2)" }}>
          <ShieldAlert className="size-4 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      {/* Users table */}
      <div
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        style={{ boxShadow: "0 4px 15px rgba(93, 20, 81, 0.03)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm font-semibold animate-pulse" style={{ color: "#666666", fontFamily: "var(--font-body)" }}>
              Cargando usuarios...
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold py-3" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>Nombre Completo</TableHead>
                <TableHead className="font-bold py-3" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>Correo electrónico</TableHead>
                <TableHead className="font-bold py-3" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>Rol del Sistema</TableHead>
                <TableHead className="font-bold py-3" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>Estado</TableHead>
                <TableHead className="font-bold py-3 text-right" style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((user) => (
                <TableRow key={user.id} className="hover:bg-slate-50/40 transition-colors">
                  <TableCell className="py-4 font-semibold text-slate-800" style={{ fontFamily: "var(--font-brand)" }}>
                    {user.nombre} {user.apellido}
                  </TableCell>
                  <TableCell className="py-4 text-slate-600" style={{ fontFamily: "var(--font-body)" }}>
                    {user.correo}
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: "#f5f0f5",
                        color: "#5D1451",
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      {user.rol?.nombre || "Sin Rol"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4">
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: user.estado ? "#e8f7f6" : "#fdecea",
                        color: user.estado ? "#3DB1AA" : "#e34038",
                        fontFamily: "var(--font-brand)",
                      }}
                    >
                      {user.estado ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        onClick={() => openEditModal(user)}
                        variant="outline"
                        size="sm"
                        className="rounded-lg hover:bg-slate-100/50"
                        title="Editar usuario"
                      >
                        <Pencil className="size-3.5 text-slate-500" />
                      </Button>
                      <Button
                        onClick={() => handleDeactivate(user.id)}
                        disabled={!user.estado}
                        variant="outline"
                        size="sm"
                        className="rounded-lg border-red-100 hover:bg-red-50/30 hover:border-red-200"
                        title={user.estado ? "Desactivar usuario" : "Usuario ya inactivo"}
                      >
                        {user.estado ? (
                          <Power className="size-3.5 text-red-500" />
                        ) : (
                          <PowerOff className="size-3.5 text-slate-400" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {usuarios.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400" style={{ fontFamily: "var(--font-body)" }}>
                    No se encontraron usuarios registrados en la base de datos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Dialog for Create/Edit Form */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-purple-50">
          <DialogHeader>
            <DialogTitle style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}>
              {editingUserId ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-body)" }}>
              {editingUserId
                ? "Modifica los datos del usuario. Deja la contraseña en blanco si no deseas cambiarla."
                : "Ingresa los datos correspondientes para registrar un nuevo usuario en la plataforma."}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div className="p-3 rounded-lg text-xs" style={{ backgroundColor: "#fdecea", color: "#e34038", border: "1px solid rgba(227, 64, 56, 0.2)" }}>
              {formError}
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  rules={{ required: "El nombre es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: "#5D1451", fontFamily: "var(--font-brand)", fontWeight: "bold" }}>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Juan" {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="apellido"
                  rules={{ required: "El apellido es requerido" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel style={{ color: "#5D1451", fontFamily: "var(--font-brand)", fontWeight: "bold" }}>Apellido</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. Pérez" {...field} className="rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="correo"
                rules={{
                  required: "El correo es requerido",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo electrónico inválido",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#5D1451", fontFamily: "var(--font-brand)", fontWeight: "bold" }}>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input placeholder="juan.perez@example.com" type="email" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: editingUserId ? false : "La contraseña es requerida para nuevos usuarios",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#5D1451", fontFamily: "var(--font-brand)", fontWeight: "bold" }}>
                      Contraseña {editingUserId && "(Opcional)"}
                    </FormLabel>
                    <FormControl>
                      <Input placeholder={editingUserId ? "Dejar en blanco si no se cambia" : "Mínimo 6 caracteres"} type="password" {...field} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rol_id"
                rules={{ required: "Debes seleccionar un rol" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel style={{ color: "#5D1451", fontFamily: "var(--font-brand)", fontWeight: "bold" }}>Rol del sistema</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((rol) => (
                          <SelectItem key={rol.id} value={rol.id}>
                            {rol.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="font-bold rounded-xl"
                  style={{
                    background: "linear-gradient(135deg, #5D1451, #8a2b7a)",
                    color: "#ffffff",
                    fontFamily: "var(--font-brand)",
                  }}
                >
                  {submitting ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
