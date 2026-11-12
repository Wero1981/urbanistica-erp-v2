# Migración visual V1 → V2

## Etapas y alcance

1. Inspección: V2 tenía la pantalla inicial de Vite, Tailwind v4 y los tokens visuales de V1. No había flujos de negocio que reemplazar. Se conservaron `index.css`, `vite.config.js` y versiones declaradas de las dependencias existentes.
2. Reutilización: Button, Input, StatusBadge, PageHeader, DataTable, AppLayout, LoginPage y Topbar proceden de V1. Se adaptaron navegación, sesión y empresa. Sidebar mantiene la composición de V1, simplificando el catálogo a módulos relevantes; el dashboard no usa métricas ficticias. Se agregó `lucide-react`.
3. Adaptación: rutas protegidas por sesión, empresa validada y rol global. Catálogo de roles de solo lectura. Selección/cambio de empresa, estados vacíos, reintento y errores. Se mantiene la estructura api/config/contexts/services/routes/layouts/pages/components.
4. Verificación: `npm run build`, `npm run lint`, `node --test tests/roles.test.js`.

No se modificó V1 ni el backend. No se portaron formularios de inmuebles, propietarios, mapas o CRUD de usuarios: sus modelos, servicios y contratos V1 no existen todavía en V2. Sus rutas muestran un estado pendiente, sin datos simulados ni acciones que fallen al guardar.

## Roles

El rol procede exclusivamente de `/auth/me/`, como `role.code` o código textual: `administrador`, `capturista`, `consulta`. No se deduce de username, is_superuser ni membresías. Usuarios y Roles se restringen a administrador tanto en enlaces como en acceso directo. Capturista tiene capacidad de captura, consulta solo lectura. Los formularios futuros deben consultar `canWrite`; la API debe aplicar su propia autorización. Empresas no modifica el rol.

## Contrato de API V2

En la etapa inicial solo existía `/admin/`. La etapa posterior implementó estos endpoints sobre los modelos V2 existentes. Véase [implementación, permisos y verificación del backend](../../backend/docs/API-V2.md). Los servicios frontend conservan este contrato:

| Método y ruta relativa a VITE_API_URL | Respuesta esperada |
| --- | --- |
| POST `/auth/login/` con `{username,password}` | `{access: "JWT"}` |
| GET `/auth/me/` | `{id,username,first_name,last_name,role:{code}}` |
| GET `/companies/?page=1` | Array de empresas o `{results:[...],next:null/URL}` con paginación por número de página |
| GET `/companies/:id/` | Empresa `{id,name,trade_name,rfc,is_active}` |

La lista contiene empresas directamente, no membresías V1. Se recorren páginas (límite 100), se excluyen empresas inactivas y se valida el detalle antes de seleccionar/restaurar. Todas las empresas son espacios de trabajo del mismo rol global.

`VITE_API_URL` conserva el valor de `.env.example`; por defecto `http://localhost:8000/api`. El cliente envía `Authorization: Bearer ...`. Para futuras llamadas empresariales usar `{companyId: activeCompany.id}` en la configuración Axios: añade `X-Company-ID` explícitamente. Login, perfil y catálogo son globales y no reciben ese header. No se utiliza `/companies/context/` de V1.

La sesión y el ID de empresa usan sessionStorage con prefijo `urbanistica-v2`, sin interferir con V1. Al recargar se revalida usuario y empresa; errores 401 limpian sesión y desmontan el contexto empresarial. El cierre de sesión es local: no hay endpoint de revocación en V2. No se guardan refresh tokens ni se simula renovación; al expirar se requiere volver a ingresar. El cambio de empresa desmonta las pantallas del espacio anterior.

## Validación pendiente de integración

Las pruebas del backend cubren el contrato y los permisos. Queda pendiente recorrer la interfaz en navegador con credenciales reales para comprobar login correcto/incorrecto, restauración, token expirado, tres roles, acceso directo a `/usuarios` y `/roles`, lista vacía/paginada, empresa inactiva, error/reintento y cambio de empresa. Comprobar menú móvil y teclado. La compilación y las pruebas de políticas no sustituyen estos recorridos contra una API real.

La instalación reportó advertencias de engine: ESLint 10 requiere Node 22.13+ en la rama 22 y el entorno usa 22.12. También reportó cuatro vulnerabilidades moderadas del árbol instalado; no se aplicaron actualizaciones incompatibles automáticas.
