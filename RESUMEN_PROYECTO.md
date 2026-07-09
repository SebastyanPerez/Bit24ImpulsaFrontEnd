# Resumen del Proyecto Bit24 Impulsa - Frontend

## 1. Qué es este proyecto

Este repositorio contiene el frontend web de **Bit24 Impulsa**, una aplicación de adopción digital orientada a apoyar a colaboradores de ERP (caso piloto: REGENDA). Está construida con **React + Vite + TypeScript** y diseñada para usarse como interfaz de gestión y seguimiento de aprendizaje digital.

## 2. Objetivo principal

Crear una interfaz moderna, escalable y modular que permita:

- Autenticar usuarios con backend real.
- Mostrar módulos según rol (administrador, responsable u otros colaboradores).
- Brindar acceso a pantallas de aprendizaje, alertas, soporte y gestión.
- Mantener una base de código ordenada para avanzar con nuevas funcionalidades rápidamente.

## 3. Estructura clave del proyecto

### Carpeta principal

- `src/app/`
  - `api/`
    - `axiosClient.ts`: instancia Axios con configuración base y token.
    - `auth.ts`: función de login.
  - `context/`
    - `AuthContext.tsx`: estado global de autenticación, token y usuario.
  - `components/`
    - `layout/AppShell.tsx`: layout principal con sidebar y contenido.
    - `ProtectedRoute.tsx`: protección de rutas privadas.
    - `ui/`: componentes base reutilizables (shadcn/ui).
    - `ui-shared/`: componentes compartidos del proyecto.
  - `data/`
    - `datosRegenda.ts`: datos de ejemplo/mock para las vistas.
  - `pages/`
    - `LoginScreen.tsx`
    - `DashboardView.tsx`
    - `RutaView.tsx`
    - `MicroaprendizajeView.tsx`
    - `AsistenteIAView.tsx`
    - `AlertasView.tsx`
    - `SoporteView.tsx`
    - `PanelResponsableView.tsx`
    - `TecnologiasView.tsx`
    - `GestionUsuarios.tsx`
  - `App.tsx`: navegación y rutas.

### Archivos de configuración

- `package.json`: dependencias del frontend.
- `vite.config.ts`: configuración de Vite.
- `tailwind.config`/CSS: configuración de estilos Tailwind.

## 4. Flujo principal

1. El usuario accede a `/login`.
2. `LoginScreen` llama a `api/auth.ts` para autenticar.
3. `AuthContext` guarda el token y el usuario.
4. `ProtectedRoute` valida que haya sesión activa.
5. `AppShell` muestra la navegación y el contenido según las rutas protegidas.

## 5. Tecnologías principales

- React 18
- Vite 6
- TypeScript
- Tailwind CSS
- React Router v7
- Axios
- shadcn/ui (componentes UI base)

## 6. Estado actual del proyecto

### Lo que ya funciona

- Base del proyecto con React, Vite y Tailwind.
- Login funcional con backend mediante Axios.
- Enrutamiento básico con rutas protegidas.
- Layout principal desacoplado en `AppShell`.
- Páginas principales definidas.

### Lo que necesita avanzar

- Persistencia de sesión (`localStorage` o `sessionStorage`).
- Uso de variable de entorno `VITE_API_BASE_URL` para la API.
- Sidebar dinámico según rol del usuario.
- Conexión real de vistas que hoy usan datos mock.
- CRUD real en `GestionUsuarios.tsx`.
- Mejor manejo de estados de carga y errores.
- Pruebas automatizadas.

## 7. Sugerencias de funcionalidades a implementar primero

1. Persistir sesión al recargar la página.
2. Convertir `axiosClient.ts` para usar `VITE_API_BASE_URL`.
3. Mostrar/ocultar secciones del menú según rol real.
4. Integrar datos reales en `RutaView`, `MicroaprendizajeView`, `AlertasView` y `SoporteView`.
5. Completar CRUD de usuarios con backend.

## 8. Ideas de próximas funcionalidades

- Dashboard con métricas de adopción personalizadas.
- Reportes filtrables por rol, área o etapa.
- Notificaciones en tiempo real para alertas.
- Módulo de aprendizaje gamificado.
- Administración de roles y permisos desde el frontend.

## 9. Notas relevantes

- El proyecto está pensado para crecer por iteraciones rápidas.
- Mantén la carpeta `src/app/` organizada por responsabilidad.
- Usa `data/datosRegenda.ts` como referencia temporal mientras se integran endpoints.

---

> Con este resumen tienes una hoja de ruta clara para avanzar en nuevas funcionalidades sin perder el foco del proyecto.
