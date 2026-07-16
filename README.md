# Bit24 Impulsa - Frontend

[![React](https://img.shields.io/badge/React-18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)](https://reactrouter.com/)
[![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=for-the-badge)](https://axios-http.com/)

---

## 📌 Descripción del Proyecto

**Bit24 Impulsa** es un proyecto universitario orientado a la adopción digital en entorno ERP (caso piloto: **REGENDA**). Este repositorio contiene el **frontend web**, construido en React y trabajado bajo el marco ágil **Scrum**.

La interfaz permite a colaboradores de distintas áreas (Ventas, Caja, Almacén, Compras, Administración) y a roles de gestión (Administrador, Responsable Interno) autenticarse, visualizar su progreso de adopción digital y acceder a los módulos habilitados según su rol.

---

## 🎯 Objetivo del Frontend

Construir una interfaz moderna, modular y escalable que permita:

- Autenticar usuarios contra el backend real según su rol.
- Visualizar módulos del sistema de adopción (ruta de aprendizaje, microaprendizaje, IA, alertas, soporte).
- Habilitar gestión administrativa (usuarios) para el rol Administrador.
- Evolucionar por incrementos de Sprint sin bloquear el avance general.

---

## 🛠️ Arquitectura del Proyecto

El frontend sigue una organización por capas dentro de `src/app`, en línea con la separación de responsabilidades del backend:

- **`api/`**: cliente HTTP centralizado (Axios) y servicios de autenticación.
- **`context/`**: estado global de sesión (`AuthContext`) — token, usuario y rol activo.
- **`components/`**:
  - `layout/` → estructura principal de la app (`AppShell`: sidebar + navbar + contenido).
  - `ui/` y `ui-shared/` → componentes reutilizables (shadcn/ui + wrappers propios).
  - `ProtectedRoute` → control de acceso a rutas privadas.
  - `figma/` → assets/componentes generados desde el diseño original de Figma.
- **`pages/`**: pantallas de negocio, una por módulo del sistema.
- **`data/`**: datos de demo/configuración usados mientras se integran endpoints reales.

### Flujo de autenticación

```
LoginScreen
    ↓ POST /auth/login
AuthContext (guarda token + usuario)
    ↓
ProtectedRoute (permite/deniega acceso)
    ↓
AppShell (sidebar dinámico según rol + vistas internas)
```

---

## 📂 Estructura de Carpetas

```text
src/
├── app/
│   ├── api/
│   │   ├── auth.ts              # login(correo, password)
│   │   └── axiosClient.ts       # instancia Axios + baseURL + interceptor de token
│   ├── components/
│   │   ├── figma/                # assets/componentes exportados de Figma
│   │   ├── layout/
│   │   │   └── AppShell.tsx      # sidebar + navbar + outlet de rutas
│   │   ├── ui/                   # componentes base (shadcn/ui)
│   │   ├── ui-shared/            # composiciones reutilizables propias
│   │   └── ProtectedRoute.tsx    # guard de rutas privadas
│   ├── context/
│   │   └── AuthContext.tsx       # sesión: token, usuario, login(), logout()
│   ├── data/
│   │   └── datosRegenda.ts       # datos mock para vistas aún no conectadas
│   ├── pages/
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardView.tsx
│   │   ├── RutaView.tsx
│   │   ├── MicroaprendizajeView.tsx
│   │   ├── AsistenteIAView.tsx
│   │   ├── AlertasView.tsx
│   │   ├── SoporteView.tsx
│   │   ├── PanelResponsableView.tsx
│   │   ├── TecnologiasView.tsx
│   │   └── GestionUsuarios.tsx   # CRUD de usuarios (solo rol Administrador)
│   └── App.tsx                   # árbol de rutas + providers
├── styles/
└── main.tsx
```

---

## 💻 Tecnologías Utilizadas

* **[React 18](https://react.dev/)**: librería principal de interfaz.
* **[Vite 6](https://vitejs.dev/)**: bundler y dev server.
* **[TypeScript](https://www.typescriptlang.org/)**: tipado estático en todo el proyecto.
* **[Tailwind CSS](https://tailwindcss.com/)**: sistema de estilos utilitario.
* **[React Router v7](https://reactrouter.com/)**: enrutamiento y protección de rutas.
* **[Axios](https://axios-http.com/)**: cliente HTTP hacia el backend FastAPI.
* **[shadcn/ui](https://ui.shadcn.com/)**: librería de componentes base (tablas, diálogos, formularios).

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/Bit24ImpulsaFrontEnd.git
cd Bit24ImpulsaFrontEnd
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Variables de entorno

> ⚠️ **Estado actual**: la URL del backend todavía está fija (hardcodeada) en `src/app/api/axiosClient.ts` como `http://localhost:8000`. La variable de entorno de abajo es la convención recomendada para el próximo incremento, aún no integrada en el código.

Crea un archivo `.env` en la raíz:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### 4. Ejecutar en desarrollo
```bash
npm run dev
```
Disponible en: [http://localhost:5173](http://localhost:5173)

### 5. Build de producción
```bash
npm run build
```

---

## 📊 Estado Actual del Sprint 1

* **Duración**: 2 semanas (Incrementos de desarrollo finalizados).
* **Progreso general**: 100% Completado.

```text
[████████████████████] 100% Completado
```

### ✅ Funcionalidades Implementadas

1. **Base técnica del proyecto**: React + Vite + TypeScript + Tailwind configurados y funcionando.
2. **Enrutamiento**: React Router con árbol de rutas centralizado en `App.tsx`.
3. **Autenticación real**: `LoginScreen` conectado a `POST /auth/login` del backend vía Axios.
4. **Persistencia de sesión**: El token y los datos de usuario se persisten en `localStorage` (`bit24_token` y `bit24_usuario`), restaurándose automáticamente en `AuthContext` al recargar la página.
5. **Base URL Dinámica**: Configuración de `VITE_API_BASE_URL` en el cliente HTTP (`axiosClient.ts`) mediante variables de entorno `.env`.
6. **Control de Acceso y Sidebar por Rol (RBAC)**: Panels administrativos restringidos al rol `Administrador` y `Responsable Interno` en menú lateral (`AppShell.tsx`) y mediante `RoleGuard`.
7. **Gestión de Contenido (`GestionContenido.tsx`)**: CRUD completo de 3 niveles jerárquicos (Rutas, Tareas, Guías) integrado con base de datos.
8. **Gestión de Usuarios (`GestionUsuarios.tsx`)**: CRUD de usuarios completado, añadiendo soporte para restablecimiento opcional y seguro de contraseñas.
9. **Integración Asistente IA (`AsistenteIAView.tsx`)**: Conectado a la API Gemini mediante el backend para resolver consultas interactivas, con soporte de historial de chat y sugerencias predefinidas.
10. **Línea de Actividad Reciente**: Registro en tiempo real de inicios de sesión y consultas de IA en el backend, mostrando una línea de tiempo dinámica en el `PanelResponsableView` con resolución de nombres y correos.
11. **Dashboard y Panel Responsable Web**: Conectados a la base de datos real. Muestra KPIs válidos para soporte (totales/pendientes/en atención) calculados al vuelo, porcentaje de adopción por área en gráfico de barras, y las tareas personales recientes con su estado de progreso.
12. **Recomendación Inteligente de Impulsa AI**: Generación automatizada de sugerencias basadas en el nombre y primera tarea pendiente en la ruta del usuario logueado.

### ⏳ Funcionalidades Pendientes

1. **Pruebas automatizadas avanzadas** (unitarias/e2e).
2. **Mapeo de integraciones adicionales de Bitrix24**.

---

## 🗺️ Roadmap Planificado para el Sprint 1

```mermaid
gantt
    title Roadmap de Desarrollo - Sprint 1 (Frontend)
    dateFormat  D
    axisFormat Día %d

    section Inicialización
    Estructura Base React + Vite + TS   :active, day1, 3d

    section Autenticación
    Login conectado a backend real       :active, day3, 1d
    Persistencia de sesión (localStorage):  day4, 1d
    Rutas protegidas + sidebar por rol   :  day4, 1d

    section Módulos de Negocio
    Layout principal (AppShell)          :active, day3, 2d
    Gestión de Usuarios (CRUD real)      :  day5, 2d
    Integración Ruta/Microaprendizaje    :  day7, 3d
    Integración Alertas/Soporte          :  day10, 2d

    section Cierre
    Pulido visual y responsive           :  day12, 2d
    Pruebas y QA                         :  day13, 1d
    Cierre de Sprint y Demo              :  day14, 1d
```

---

## 🎨 Diseño basado en Figma

El frontend se implementa a partir del diseño base en Figma, con adaptación progresiva a componentes React reutilizables.

- Se mantiene coherencia visual entre pantallas.
- Se prioriza primero estructura y navegación (Sprint 1), luego integración completa de negocio.
- El diseño actual corresponde a una etapa temprana de construcción (no versión final).

---

## 📜 Convenciones del Proyecto

* **Componentes**: un componente/pantalla por archivo, nombrado en **PascalCase**.
* **Exportación**: `export default` para pantallas y layout principal.
* **Reutilización**: componentes genéricos en `components/ui` (base) y `components/ui-shared` (composiciones propias) — nunca lógica de negocio ahí.
* **Acceso HTTP**: centralizado exclusivamente en `app/api`, ningún `fetch`/`axios` suelto dentro de páginas o componentes.
* **Estado de sesión**: centralizado en `app/context/AuthContext.tsx`, ningún otro componente debe leer el token directamente de storage.
* **Formateo**: Tailwind utility-first, sin CSS-in-JS ni archivos `.css` por componente salvo casos justificados.

---

## 📄 Licencia

Proyecto desarrollado con fines académicos para universidad. Uso interno del equipo y contexto educativo.

---
📄 *Desarrollado bajo el marco ágil de Scrum · 2026.*