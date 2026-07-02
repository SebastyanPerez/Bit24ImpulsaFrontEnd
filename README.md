
# Bit24 Impulsa Frontend

Frontend del proyecto universitario **Bit24 Impulsa**, desarrollado con enfoque Scrum para acompañar la adopcion digital de usuarios en un entorno ERP (caso piloto: REGENDA).

> Estado actual: **Sprint 1 en progreso (aprox. 20%)**.  
> Este repositorio representa trabajo en curso, no una version final de producto.

---

## Descripcion del proyecto

Bit24 Impulsa busca centralizar la experiencia de adopcion del sistema mediante:

- autenticacion de usuarios y roles;
- vistas de avance y adopcion;
- soporte visual para rutas, alertas y acompanamiento.

En esta etapa inicial ya existe una base funcional del frontend y conexion con backend para login.

## Objetivo del frontend

- Proveer una base escalable en React para las vistas clave del sistema.
- Conectar autenticacion y consumo HTTP del backend.
- Definir estructura de componentes, layout y convenciones desde Sprint 1.
- Permitir iteracion rapida por incrementos durante los siguientes sprints.

## Arquitectura (estado actual)

Arquitectura orientada a capas en `src/app`:

- `api/`: cliente Axios y servicios (`auth`).
- `context/`: estado global de autenticacion (`AuthContext`).
- `components/`: componentes reutilizables y layout (`ProtectedRoute`, `layout/AppShell`, `ui`, `ui-shared`).
- `pages/`: pantallas de negocio.
- `data/`: datos y configuraciones de demo para vistas en construccion.

Flujo principal hoy:

1. `LoginScreen` autentica contra backend (`POST /auth/login`).
2. `AuthContext` guarda token/usuario y lo persiste.
3. `ProtectedRoute` protege la app privada.
4. `AppShell` renderiza navegacion y vistas.

## Estructura de carpetas

```txt
src/
  app/
    api/
      auth.ts
      axiosClient.ts
    components/
      figma/
      layout/
        AppShell.tsx
      ui/
      ui-shared/
      ProtectedRoute.tsx
    context/
      AuthContext.tsx
    data/
      datosRegenda.ts
    pages/
      LoginScreen.tsx
      DashboardView.tsx
      RutaView.tsx
      MicroaprendizajeView.tsx
      AsistenteIAView.tsx
      AlertasView.tsx
      SoporteView.tsx
      PanelResponsableView.tsx
      TecnologiasView.tsx
      GestionUsuarios.tsx
    App.tsx
  styles/
  main.tsx
```

## Tecnologias

- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios

## Instalacion

```bash
npm install
```

## Variables de entorno

Actualmente el cliente API usa `http://localhost:8000` de forma fija en `src/app/api/axiosClient.ts`.

Para una configuracion mas flexible, se recomienda manejar una variable como:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Nota: al dia de hoy esta variable aun no esta cableada en el codigo.

## Como ejecutar el proyecto

```bash
npm run dev
```

Luego abrir:

- `http://localhost:5173`

Para build de produccion:

```bash
npm run build
```

## Estado actual del Sprint (20%)

Sprint: `Sprint 1` (2 semanas)  
Avance estimado: `20%` (dia 3-4)

Situacion real:

- ya existe base tecnica del frontend;
- ya hay login conectado con backend;
- ya hay estructura modular inicial de pantallas/layout;
- varias vistas siguen en fase de construccion y validacion.

## Funcionalidades implementadas

- Estructura base React + Vite + TypeScript.
- Sistema de rutas y proteccion de acceso (`ProtectedRoute`).
- Contexto de autenticacion con persistencia local (`AuthContext`).
- Integracion de login con backend (`/auth/login`) usando Axios.
- Layout principal con sidebar/header (`AppShell`).
- Conjunto inicial de pantallas para navegacion interna.
- Sistema de componentes UI reutilizables (`ui`, `ui-shared`).

## Funcionalidades en desarrollo

- Endpoints reales para la mayoria de modulos (actualmente hay vistas con datos simulados).
- Integracion completa de modulos de negocio mas alla de autenticacion.
- Hardening de manejo de errores, estados vacios y loading states por modulo.
- Pruebas (unitarias/e2e) y pipeline de calidad.
- Ajustes de performance, code splitting y optimizacion de bundle.

## Roadmap (proximo trabajo)

- **Sprint 1 (restante)**: estabilizar autenticacion y navegacion base, consolidar estructura de pantallas.
- **Sprint 2**: conectar modulos principales a backend (dashboard/rutas/alertas/soporte).
- **Sprint 3**: calidad tecnica (testing, manejo de errores, refinamiento UX/UI, hardening).
- **Sprint 4**: cierre de MVP universitario, documentacion final y demo integrada.

## Diseno basado en Figma

El frontend parte de un diseno base trabajado en Figma y adaptado progresivamente a componentes React reutilizables.

- Se mantiene consistencia visual mediante tokens, estilos compartidos y componentes de UI.
- La implementacion actual prioriza la estructura y la validacion funcional del Sprint 1.

## Convenciones de componentes

- Un componente/pantalla por archivo.
- Nombres de componentes en `PascalCase`.
- Exportacion principal con `export default` en pantallas/layout.
- Componentes reutilizables en `components/ui` y `components/ui-shared`.
- Logica de acceso a API centralizada en `app/api`.
- Estado global de autenticacion en `app/context/AuthContext.tsx`.

## Licencia

Proyecto de uso academico para curso universitario.  
Licencia formal pendiente de definicion por el equipo.
  