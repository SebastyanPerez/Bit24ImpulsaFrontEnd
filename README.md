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

* **Duración**: 2 semanas (Sprint en curso - Día 3-4).
* **Progreso general**: ~20% de avance estimado.

```text
[████░░░░░░░░░░░░░░░░] 20% Completado
```

### ✅ Funcionalidades Implementadas

1. **Base técnica del proyecto**: React + Vite + TypeScript + Tailwind configurados y funcionando.
2. **Enrutamiento**: React Router con árbol de rutas centralizado en `App.tsx`.
3. **Autenticación real**: `LoginScreen` conectado a `POST /auth/login` del backend vía Axios.
4. **Sesión**: `AuthContext` gestiona token y usuario autenticado.
5. **Protección de rutas**: `ProtectedRoute` bloquea acceso a vistas internas sin sesión activa.
6. **Layout principal**: `AppShell` modular con sidebar y navbar, desacoplado de las pantallas de negocio.
7. **Separación por pantallas**: un archivo por vista de negocio (Dashboard, Ruta, Microaprendizaje, IA, Alertas, Soporte, Panel Responsable, Tecnologías, Gestión de Usuarios).
8. **Componentes reutilizables**: base de `ui/` (shadcn) y `ui-shared/` para composiciones propias.

### ⏳ Funcionalidades Pendientes

1. **Persistencia de sesión**: el token vive solo en memoria (`AuthContext`); al recargar la página (F5) se pierde la sesión. Falta guardar/restaurar desde `localStorage`.
2. **Variable de entorno para la API**: migrar el `baseURL` hardcodeado en `axiosClient.ts` a `VITE_API_BASE_URL`.
3. **Sidebar dinámico por rol**: mostrar/ocultar módulos (ej. "Gestión de Usuarios", "Panel Responsable") según el rol real del usuario autenticado, no de forma estática.
4. **Integración progresiva de endpoints reales**: la mayoría de vistas (`RutaView`, `MicroaprendizajeView`, `AlertasView`, `SoporteView`, etc.) aún consumen datos de `data/datosRegenda.ts` en lugar de la API.
5. **Gestión de Usuarios conectada**: `GestionUsuarios.tsx` debe consumir el CRUD real (`GET/POST/PUT/DELETE /usuarios`) y el listado de roles (`GET /roles`) del backend.
6. **Manejo consistente de errores y estados de carga** en todas las vistas.
7. **Pruebas automatizadas** (unitarias/e2e).

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