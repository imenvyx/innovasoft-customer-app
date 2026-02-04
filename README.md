# Innovasoft Customer Management App

Aplicación SPA para el mantenimiento de clientes desarrollada como prueba técnica para Innovasoft S.A.

## 📋 Descripción

Esta aplicación permite gestionar clientes con las siguientes operaciones:
- **Crear**: Registro de nuevos clientes
- **Listar**: Visualización de clientes existentes con filtros
- **Detalle**: Ver información completa de un cliente
- **Actualizar**: Modificar datos de clientes existentes
- **Consultar**: Búsqueda por nombre e identificación
- **Eliminar**: Eliminación de clientes

## 🛠️ Tecnologías

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | v17 | Framework principal |
| TypeScript | v4+ | Tipado estático |
| Material UI | v5 | Componentes UI |
| React Router Dom | v6 | Navegación |
| TanStack Query | v5 | Estado del servidor |
| React Hook Form | v7 | Manejo de formularios |
| Zod | v3 | Validación de esquemas |
| i18next | v22 | Internacionalización |
| Axios | v1 | Cliente HTTP |
| Date-fns | v2 | Manipulación de fechas |

## 📁 Estructura del Proyecto

```
src/
├── api/                    # Configuración y servicios Axios
│   ├── axiosConfig.ts      # Configuración base de Axios
│   └── apiEndpoints.ts     # Endpoints de la API
├── components/            # Componentes reutilizables
│   └── layout/            # Componentes de layout
│       ├── AppBar.tsx     # Barra de navegación superior
│       ├── MainLayout.tsx # Layout principal
│       └── Sidebar.tsx    # Menú lateral
├── contexts/              # Contextos de React
│   └── AuthContext.tsx    # Estado de autenticación
├── constants/             # Constantes globales
│   └── index.ts           # Constantes compartidas
├── hooks/                 # Custom hooks
│   └── useSnackbar.ts     # Hook para notificaciones
├── i18n/                  # Configuración de idiomas
│   └── index.ts           # Traducciones
├── pages/                 # Páginas de la aplicación
│   ├── auth/              # Autenticación
│   │   ├── Login.tsx     # Login
│   │   └── Register.tsx  # Registro
│   ├── customers/        # Gestión de clientes
│   │   ├── CustomerQuery.tsx    # Listado y búsqueda
│   │   └── CustomerMaintenance.tsx # Crear/Editar
│   ├── error/            # Páginas de error
│   │   └── ErrorPage.tsx
│   └── home/
│       └── Home.tsx      # Página principal
├── routes/                # Configuración de rutas
│   └── AppRoutes.tsx     # Definición de rutas
├── theme/                 # Tema de Material UI
│   └── index.ts          # Configuración del theme
├── types/                 # Tipos TypeScript
│   └── index.ts          # Definiciones de tipos
├── utils/                 # Utilidades
│   └── formatDate.ts     # Funciones de formato
├── App.tsx               # Componente raíz
└── index.tsx             # Entry point
```

## 🚀 Instalación

### Prerrequisitos
- Node.js v14 o superior
- npm v6 o superior

### Pasos

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (si aplica):
```bash
cp .env.example .env
```

4. Iniciar el servidor de desarrollo:
```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

| Comando | Descripción |
|---------|------------|
| `npm start` | Inicia el servidor de desarrollo |
| `npm run build` | Construye la app para producción |
| `npm test` | Ejecuta los tests |
| `npm run lint` | Verifica el código con ESLint |
| `npm run format` | Formatea el código con Prettier |

## 🔐 Autenticación

La aplicación usa autenticación JWT con tokens Bearer.

### Flujo de autenticación:
1. El usuario inicia sesión con credentials
2. El servidor retorna un token JWT
3. El token se almacena en localStorage
4. Todas las peticiones subsiguientes incluyen el token

### Endpoints de autenticación:
- **POST** `/api/Authenticate/login` - Inicio de sesión
- **POST** `/api/Authenticate/register` - Registro de usuario

## 📡 API de Clientes

| Método | Endpoint | Descripción |
|--------|----------|------------|
| GET | `/api/Intereses/Listado` | Lista de intereses |
| GET | `/api/Cliente/Obtener/{id}` | Obtener cliente |
| POST | `/api/Cliente/Listado` | Listar clientes |
| POST | `/api/Cliente/Crear` | Crear cliente |
| POST | `/api/Cliente/Actualizar` | Actualizar cliente |
| DELETE | `/api/Cliente/Eliminar/{id}` | Eliminar cliente |

## 🎨 Personalización

### Tema
El tema de Material UI se configura en `src/theme/index.ts`:
- Colores primarios y secundarios
- Tipografía
- Breakpoints responsivos
- Componentes personalizados

### Internacionalización
Los archivos de traducción están en `public/locales/`:
- `en/` - Inglés
- `es/` - Español

## 🔧 Configuración

### API Base
La URL base de la API se configura en `src/api/axiosConfig.ts`:
```typescript
const API_BASE_URL = "https://pruebareactjs.test-class.com/Api/";
```
## 📱 Responsive Design

El diseño es completamente responsive:
- **Desktop (>980px)**: Sidebar permanente con opción de colapsar
- **Móvil (<980px)**: Drawer temporal que cubre toda la pantalla

## 📄 Licencia

Este proyecto es propiedad de Innovasoft S.A. - Todos los derechos reservados © 2022
