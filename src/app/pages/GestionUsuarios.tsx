import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Plus, Pencil, Power, PowerOff, ShieldAlert } from "lucide-react";

import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  getApiErrorMessage,
  type Usuario,
} from "../api/usuarios";
import { getRoles } from "../api/roles";
import type { Rol } from "../api/auth";

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
import { Switch } from "../components/ui/switch";

interface FormValues {
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol_id: string;
  estado: boolean;
}

export function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      nombre: "",
      apellido: "",
      correo: "",
      password: "",
      rol_id: "",
      estado: true,
    },
  });

  const fetchUsuarios = async () => {
    try {
      setGlobalError(null);
      setLoading(true);
      const data = await getUsuarios();
      setUsuarios(data);
    } catch (err) {
      setGlobalError(
        getApiErrorMessage(
          err,
          "Error al cargar la lista de usuarios. Verifica que el backend esté activo."
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
    } catch (err) {
      setGlobalError(
        getApiErrorMessage(err, "Error al cargar los roles del sistema.")
      );
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
      estado: true,
    });
    setIsOpen(true);
  };

  const openEditModal = (user: Usuario) => {
    setEditingUserId(user.id);
    setFormError(null);
    form.reset({
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol_id: user.rol_id || "",
      estado: user.estado,
    });
    setIsOpen(true);
  };

  const handleDeactivate = async (userId: string) => {
    if (
      !window.confirm("¿Estás seguro de que deseas desactivar a este usuario?")
    ) {
      return;
    }

    try {
      setGlobalError(null);
      setActionUserId(userId);
      await deleteUsuario(userId);
      await fetchUsuarios();
    } catch (err) {
      setGlobalError(getApiErrorMessage(err, "Error al desactivar el usuario."));
    } finally {
      setActionUserId(null);
    }
  };

  const handleReactivate = async (user: Usuario) => {
    if (!window.confirm("¿Deseas reactivar este usuario?")) {
      return;
    }

    try {
      setGlobalError(null);
      setActionUserId(user.id);
      await updateUsuario(user.id, {
        nombre: user.nombre,
        apellido: user.apellido,
        correo: user.correo,
        rol_id: user.rol_id || null,
        estado: true,
      });
      await fetchUsuarios();
    } catch (err) {
      setGlobalError(getApiErrorMessage(err, "Error al reactivar el usuario."));
    } finally {
      setActionUserId(null);
    }
  };

  const onSubmit = async (values: FormValues) => {
    setFormError(null);
    setSubmitting(true);

    try {
      if (editingUserId) {
        await updateUsuario(editingUserId, {
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          rol_id: values.rol_id || null,
          estado: values.estado,
        });
      } else {
        if (!values.password || values.password.trim() === "") {
          setFormError("La contraseña es requerida para nuevos usuarios.");
          setSubmitting(false);
          return;
        }

        await createUsuario({
          nombre: values.nombre,
          apellido: values.apellido,
          correo: values.correo,
          password: values.password,
          rol_id: values.rol_id || null,
          estado: values.estado,
        });
      }

      setIsOpen(false);
      await fetchUsuarios();
    } catch (err) {
      setFormError(
        getApiErrorMessage(
          err,
          "Ocurrió un error al guardar el usuario. Verifica los campos."
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1
            className="text-2xl font-extrabold tracking-tight"
            style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
          >
            Gestión de Usuarios
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "#666666", fontFamily: "var(--font-body)" }}
          >
            Registra, edita y administra los accesos y roles de los usuarios del
            sistema piloto REGENDA.
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

      {globalError && (
        <div
          className="p-4 rounded-xl text-sm flex items-center gap-2"
          style={{
            backgroundColor: "#fdecea",
            color: "#e34038",
            border: "1px solid rgba(227, 64, 56, 0.2)",
          }}
        >
          <ShieldAlert className="size-4 flex-shrink-0" />
          <span>{globalError}</span>
        </div>
      )}

      <div
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
        style={{ boxShadow: "0 4px 15px rgba(93, 20, 81, 0.03)" }}
      >
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p
              className="text-sm font-semibold animate-pulse"
              style={{ color: "#666666", fontFamily: "var(--font-body)" }}
            >
              Cargando usuarios...
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead
                  className="font-bold py-3"
                  style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                  Nombre Completo
                </TableHead>
                <TableHead
                  className="font-bold py-3"
                  style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                  Correo electrónico
                </TableHead>
                <TableHead
                  className="font-bold py-3"
                  style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                  Rol del Sistema
                </TableHead>
                <TableHead
                  className="font-bold py-3"
                  style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                  Estado
                </TableHead>
                <TableHead
                  className="font-bold py-3 text-right"
                  style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
                >
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usuarios.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-slate-50/40 transition-colors"
                >
                  <TableCell
                    className="py-4 font-semibold text-slate-800"
                    style={{ fontFamily: "var(--font-brand)" }}
                  >
                    {user.nombre} {user.apellido}
                  </TableCell>
                  <TableCell
                    className="py-4 text-slate-600"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
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
                      {user.estado ? (
                        <Button
                          onClick={() => handleDeactivate(user.id)}
                          disabled={actionUserId === user.id}
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-red-100 hover:bg-red-50/30 hover:border-red-200"
                          title="Desactivar usuario"
                        >
                          <Power className="size-3.5 text-red-500" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleReactivate(user)}
                          disabled={actionUserId === user.id}
                          variant="outline"
                          size="sm"
                          className="rounded-lg border-teal-100 hover:bg-teal-50/30 hover:border-teal-200"
                          title="Reactivar usuario"
                        >
                          <PowerOff className="size-3.5 text-teal-600" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {usuarios.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-slate-400"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    No se encontraron usuarios registrados en la base de datos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-purple-50">
          <DialogHeader>
            <DialogTitle
              style={{ color: "#5D1451", fontFamily: "var(--font-brand)" }}
            >
              {editingUserId ? "Editar Usuario" : "Registrar Nuevo Usuario"}
            </DialogTitle>
            <DialogDescription style={{ fontFamily: "var(--font-body)" }}>
              {editingUserId
                ? "Modifica los datos del usuario. La contraseña no se puede cambiar desde esta pantalla."
                : "Ingresa los datos correspondientes para registrar un nuevo usuario en la plataforma."}
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <div
              className="p-3 rounded-lg text-xs"
              style={{
                backgroundColor: "#fdecea",
                color: "#e34038",
                border: "1px solid rgba(227, 64, 56, 0.2)",
              }}
            >
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
                      <FormLabel
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                          fontWeight: "bold",
                        }}
                      >
                        Nombre
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Juan"
                          {...field}
                          className="rounded-xl"
                        />
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
                      <FormLabel
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                          fontWeight: "bold",
                        }}
                      >
                        Apellido
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej. Pérez"
                          {...field}
                          className="rounded-xl"
                        />
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
                    <FormLabel
                      style={{
                        color: "#5D1451",
                        fontFamily: "var(--font-brand)",
                        fontWeight: "bold",
                      }}
                    >
                      Correo electrónico
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="juan.perez@example.com"
                        type="email"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!editingUserId && (
                <FormField
                  control={form.control}
                  name="password"
                  rules={{
                    required: "La contraseña es requerida para nuevos usuarios",
                    minLength: {
                      value: 6,
                      message: "La contraseña debe tener al menos 6 caracteres",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                          fontWeight: "bold",
                        }}
                      >
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Mínimo 6 caracteres"
                          type="password"
                          {...field}
                          className="rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="rol_id"
                rules={{ required: "Debes seleccionar un rol" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      style={{
                        color: "#5D1451",
                        fontFamily: "var(--font-brand)",
                        fontWeight: "bold",
                      }}
                    >
                      Rol del sistema
                    </FormLabel>
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

              <FormField
                control={form.control}
                name="estado"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-xl border border-slate-100 px-4 py-3">
                    <div className="space-y-0.5">
                      <FormLabel
                        style={{
                          color: "#5D1451",
                          fontFamily: "var(--font-brand)",
                          fontWeight: "bold",
                        }}
                      >
                        Estado
                      </FormLabel>
                      <p
                        className="text-xs"
                        style={{
                          color: "#666666",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {field.value ? "Usuario activo" : "Usuario inactivo"}
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
