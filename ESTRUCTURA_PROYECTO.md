# Urbanística ERP V2 — Estructura y convenciones del proyecto

**Documento de referencia de arquitectura**  
**Actualizado:** 12 de noviembre de 2026  
**Repositorio local:** `~/Projectos/urbanistica-erp-v2/`  
**Alcance:** ERP V2 independiente; **no modificar Urbanística V1**.

> **Cómo usar este documento:** al retomar el proyecto, indicar: «Continúa Urbanística ERP V2 siguiendo `ESTRUCTURA_PROYECTO.md`». Este documento fija la organización deseada; **no es un inventario verificado del sistema de archivos**. Las rutas marcadas «propuesta» deben crearse cuando se implementen, no anticipadamente.

## 1. Tecnologías

- **Backend:** Python, Django REST Framework, MariaDB.
- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios.
- **Autenticación:** JWT.
- **Entorno:** desarrollo local Ubuntu, sin depender de Docker.
- **Idioma:** español para documentación, textos funcionales y comentarios.

## 2. Árbol de referencia

```text
urbanistica-erp-v2/
├── ESTRUCTURA_PROYECTO.md       # Este documento
├── backend/
│   ├── apps/
│   │   ├── accounts/           # Usuarios, roles globales, autenticación y permisos
│   │   └── companies/          # Empresas y sus datos; ver estructura existente
│   └── ...                     # Configuración Django y otros módulos existentes
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── apiClient.js     # Cliente Axios, JWT, manejo de errores
    │   ├── components/
    │   │   ├── companies/
    │   │   │   ├── CompanyCard.jsx
    │   │   │   ├── CompanyGrid.jsx
    │   │   │   ├── CompanySearch.jsx
    │   │   │   ├── CompanySelectorHeader.jsx  # Propuesta
    │   │   │   ├── CompanyEmptyState.jsx      # Propuesta
    │   │   │   └── forms/
    │   │   │       └── CompanyInitialForm.jsx # Propuesta
    │   │   └── ui/
    │   │       ├── Button.jsx
    │   │       └── Input.jsx
    │   ├── config/
    │   │   ├── navigation.js
    │   │   └── roles.js
    │   ├── contexts/
    │   │   ├── auth/                    # Organización por dominio (propuesta)
    │   │   │   └── authContext.js
    │   │   └── companies/               # Organización por dominio (propuesta)
    │   │       ├── companyContext.js
    │   │       └── CompanyContext.jsx
    │   ├── hooks/
    │   │   └── companies/
    │   │       ├── useCompanies.js
    │   │       └── useCreateCompany.js       # Propuesta
    │   ├── layouts/
    │   │   └── AppLayout.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   └── LoginPage.jsx
    │   │   ├── companies/
    │   │   │   ├── SelectCompanyPage.jsx
    │   │   │   └── CreateCompanyPage.jsx
    │   │   ├── dashboard/
    │   │   │   └── DashboardPage.jsx
    │   │   ├── GlobalRolesPage.jsx
    │   │   └── ModulePlaceholder.jsx
    │   ├── routes/
    │   │   └── AppRouter.jsx
    │   └── services/
    │       ├── auth/                  # Propuesta: servicios de autenticación
    │       └── companies/
    │           └── companyService.js # Mover desde services/ al adoptar estructura
    └── ...
```

**Nota:** el árbol refleja las rutas compartidas o discutidas en la conversación; confirmar en el repositorio antes de modificar archivos. No crear archivos de la sección «propuesta» hasta abordar esa funcionalidad.

## 3. Responsabilidades de frontend

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Páginas | `src/pages/<modulo>/` | Componer componentes y coordinar navegación; evitar formularios extensos o lógica HTTP. |
| Componentes de módulo | `src/components/<modulo>/` | Elementos visuales reutilizables dentro del módulo. |
| Formularios | `src/components/<modulo>/forms/` | Campos, controles y presentación del formulario. |
| Hooks | `src/hooks/<modulo>/` | Estado, efectos, filtros y acciones de negocio del frontend. |
| Servicios | `src/services/<modulo>/` | Solicitudes a API y normalización básica de respuestas. |
| Cliente HTTP | `src/api/` | Axios, token JWT, encabezados, refresh y errores comunes. |
| Contextos | `src/contexts/<modulo>/` | Estado compartido por dominio: `auth/`, `companies/`. Solo crear contextos cuando haya estado global real. |
| Rutas | `src/routes/` | Protección de sesión, empresa activa y acceso por rol. |
| Configuración | `src/config/` | Menú, módulos y reglas de presentación por rol. |
| Componentes comunes | `src/components/ui/` | Botones, entradas y otros controles genéricos. |

### Módulo de selección de empresas

- `CompanyCard.jsx`: tarjeta individual, datos resumidos y acción «Ingresar».
- `CompanyGrid.jsx`: cuadrícula de tarjetas.
- `CompanySearch.jsx`: filtro y acción «Crear empresa».
- `CompanySelectorHeader.jsx` (**propuesta**): encabezado y cierre de sesión.
- `CompanyEmptyState.jsx` (**propuesta**): ausencia de empresas o resultados.
- `useCompanies.js`: obtener catálogo, filtrar, gestionar carga, errores y reintentos.
- `SelectCompanyPage.jsx`: coordinar selector, navegación y empresa activa.
- `CompanyInitialForm.jsx` (**propuesta**): campos mínimos de alta.
- `useCreateCompany.js` (**propuesta**): estado, validación y envío de alta.
- `CreateCompanyPage.jsx`: pantalla de alta y navegación posterior.
- `companyService.js`: `getCompanies`, `getCompany` y `createCompany` (comprobar implementación real).

## 4. Convenciones obligatorias

1. **No reconstruir árboles de carpetas en cada respuesta.** Consultar este documento y proponer únicamente cambios puntuales.
2. **No crear carpetas ni archivos preventivamente.** Incorporarlos al implementar una necesidad concreta.
3. **Contextos por dominio:** `src/contexts/auth/`, `src/contexts/companies/`. Mover los contextos actuales solo al actualizar todos sus imports; no crear contextos innecesarios.
4. **Servicios por dominio:** `src/services/companies/companyService.js`, y servicios de autenticación en `src/services/auth/` cuando existan. Mantener `src/api/apiClient.js` compartido. Mover los servicios actuales únicamente actualizando todos sus imports.
5. **Hooks por dominio:** `src/hooks/companies/`, y posteriormente `src/hooks/properties/`, `src/hooks/finance/`, etc. No mover hooks de dominio a la raíz de `hooks/`.
6. **Componentes por dominio:** `src/components/companies/`, `src/components/properties/`, etc.; controles genéricos en `src/components/ui/`.
7. **JSDoc en JavaScript y JSX:** documentar módulos, componentes, funciones, parámetros y retornos relevantes, en español.
8. **Docstrings en Python:** documentar módulos, clases, métodos y funciones, en español.
9. **Un componente, una responsabilidad:** extraer lógica de consulta/estado a hooks y comunicación HTTP a servicios.
10. **Exports/imports consistentes:** si el archivo usa `export default`, importarlo sin llaves.
11. **No duplicar lógica:** reutilizar `apiClient`, contextos, servicios y controles existentes.
12. **Cambios incrementales y manuales:** entregar rutas exactas y código de los archivos que cambian; no usar Codex salvo petición expresa.
13. **Seguridad en backend:** ocultar botones en React no sustituye autorización en Django.
14. **No modificar V1:** todos los cambios se limitan al repositorio V2.
15. **Antes de afirmar que existe una ruta o función**, comprobar el archivo real o pedir su contenido.

## 5. Flujo de acceso y empresas

```text
Login (JWT)
  └── Seleccionar empresa
       ├── Empresa existente → empresa activa → Dashboard
       └── Crear empresa (administrador/capturista)
            └── Registro mínimo → seleccionar nueva empresa → Dashboard
```

- Todos los usuarios autenticados pueden consultar empresas activas; el rol es **global**.
- Roles previstos: `administrador`, `capturista`, `consulta`.
- `consulta` no puede crear empresas.
- El cambio de empresa debe limpiar o actualizar el contexto activo sin reutilizar información de otra empresa.
- La empresa activa se conserva en el contexto `CompanyProvider` y puede restaurarse desde `sessionStorage`; verificar el comportamiento al iniciar/cerrar sesión.
- El backend debe comprobar permisos en `POST /companies/` y aislar adecuadamente los datos por empresa en los módulos empresariales.

## 6. Alta mínima de empresa

Campos iniciales:

| Campo | Clave API | Regla |
|---|---|---|
| Tipo de contribuyente | `company_type` | `moral` o `fisica`. |
| Razón social / nombre completo | `name` | Obligatorio. |
| Nombre comercial | `trade_name` | Opcional. |

El RFC, régimen fiscal y demás información se completan posteriormente desde **Datos**. El modelo `Company` existente contempla otros campos, pero no deben forzarse en el alta inicial sin acordarlo.

## 7. Módulos funcionales

| Módulo | Propósito | Observación |
|---|---|---|
| Dashboard | Resumen de la empresa activa. | Disponible tras selección. |
| Datos | Datos generales, fiscales, domicilios, socios, representantes, contactos y documentos. | Prioridad después del alta. |
| Propiedades | Inmuebles, unidades, ubicación y documentación. | Requiere configuración mínima de empresa. |
| Negocios | Operaciones comerciales/inmobiliarias. | Desarrollo posterior. |
| Finanzas | Ingresos, egresos y resultados. | Desarrollo posterior. |
| Reportes | Indicadores y análisis de operación. | Desarrollo posterior. |

**Regla funcional prevista:** al crear una empresa, habilitar Dashboard y Datos; mostrar otros módulos pero restringirlos hasta completar información mínima. Esta regla requiere validación tanto en frontend como en backend y no debe darse por implementada.

## 8. Organización futura por dominio (patrón, no archivos creados)

Cuando se implemente un nuevo módulo, seguir el patrón:

```text
src/pages/<modulo>/...
src/components/<modulo>/...
src/components/<modulo>/forms/...
src/hooks/<modulo>/...
src/services/<modulo>/<modulo>Service.js
```

El backend seguirá la estructura real de apps Django; no inventar rutas, modelos o endpoints sin revisar el código existente.

## 9. Verificaciones antes de avanzar

Desde `frontend/`:

```bash
npm run lint
npm run build
```

Revisar también que los imports apunten a `src/hooks/companies/useCompanies.js`:

```js
// En src/pages/companies/SelectCompanyPage.jsx
import useCompanies from "../../hooks/companies/useCompanies";

// En src/hooks/companies/useCompanies.js
import { getCompanies } from "../../services/companyService";
import { apiError } from "../../api/apiClient";
```

No marcar una funcionalidad como terminada solo porque exista el componente: verificar navegación, permisos y API.

## 10. Próxima tarea acordada

1. Verificar `npm run lint` y `npm run build` tras la extracción de `CompanyCard`, `CompanyGrid`, `CompanySearch` y `useCompanies`.
2. Comprobar que el selector muestre empresas, buscador y botón «Crear empresa» según el rol.
3. Implementar o revisar `CompanyInitialForm.jsx` y `useCreateCompany.js` sin engrosar `CreateCompanyPage.jsx`.
4. Probar `POST /companies/`, selección automática de la empresa creada y navegación al Dashboard.
5. Continuar con el módulo **Datos**.

---

### Instrucción de continuidad

> «Usa `ESTRUCTURA_PROYECTO.md` como referencia de arquitectura de Urbanística ERP V2. No vuelvas a reconstruir la estructura; indica únicamente los archivos que deben crearse o modificarse para la siguiente tarea. Mantén JSDoc/docstrings en español y desarrollo manual paso a paso».

## Actualización de arquitectura: contextos por dominio

Se acuerda mantener los contextos organizados por dominio, al igual que componentes y hooks. La ubicación deseada es `src/contexts/auth/authContext.js` y `src/contexts/companies/{companyContext.js,CompanyContext.jsx}`. Las rutas actuales en la raíz de `contexts/` se consideran **ubicación anterior**, no una prueba de que los archivos ya se hayan movido.

**Migración segura:** mover los archivos existentes (sin duplicarlos), localizar todos sus consumidores (`rg 'contexts/(authContext|companyContext|CompanyContext)' src`) y corregir rutas relativas en cada import. Después ejecutar `npm run lint` y `npm run build`. No cambiar el contrato de los contextos ni introducir un segundo proveedor.

**Ejemplo en `src/routes/AppRouter.jsx`:**

```jsx
import { useAuth } from '../contexts/auth/authContext';
import { useCompany } from '../contexts/companies/companyContext';
import CompanyProvider from '../contexts/companies/CompanyContext';
```

**Ejemplo dentro de `src/contexts/companies/CompanyContext.jsx`:**

```jsx
import { CompanyContext } from './companyContext';
import { getCompany } from '../../services/companyService';
```

**Nota:** `services/` puede organizarse también por dominio cuando se acuerde la migración, pero no cambiar sus imports en esta etapa.

## 11. Convención de servicios por dominio (decisión acordada)

- Los servicios se agrupan en `src/services/<dominio>/`, al igual que contextos, hooks y componentes.
- Ejemplo actual de migración: `src/services/companyService.js` → `src/services/companies/companyService.js`.
- Ajustar todos los imports antes de borrar la ubicación anterior. En particular, `src/hooks/companies/useCompanies.js` importa desde `../../services/companies/companyService`.
- Mantener un solo cliente HTTP en `src/api/apiClient.js`; los servicios de dominio lo reutilizan.
- No crear carpetas vacías de módulos futuros.
