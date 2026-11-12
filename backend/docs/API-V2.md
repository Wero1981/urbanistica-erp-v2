# API V2: autenticación y empresas

## Cambios

Se usan `accounts.User`, `accounts.Role` y `companies.Company` existentes. No se modificaron modelos, migraciones, V1 ni datos de aplicación. Las dependencias DRF, SimpleJWT, corsheaders y mysqlclient ya estaban instaladas.

- `accounts/serializers.py`, `views.py`, `permissions.py`, `urls.py`: login JWT, perfil y administración de usuarios.
- `companies/serializers.py`, `views.py`, `permissions.py`, `urls.py`: CRUD con baja lógica.
- `config/settings.py`: JWT, paginación, CORS y lectura de las variables DJANGO existentes en `.env.example`. `DJANGO_SECRET_KEY` es obligatoria y firma los tokens; no se usa la clave fija del código anterior.
- Pruebas en `apps/accounts/tests.py` y `apps/companies/tests.py`.

## Contrato frontend, sin membresías

Base: `http://localhost:8000/api`, coincidente con `VITE_API_URL`.

| Endpoint | Entrada / salida |
| --- | --- |
| POST `/api/auth/login/` | `{username,password}` → exclusivamente `{access: "JWT"}` |
| GET `/api/auth/me/` | `{id,username,first_name,last_name,role:{code}}` |
| GET `/api/companies/?page=1` | `{count,next,previous,results:[empresas]}`, 50 registros por página |
| POST `/api/companies/` | Campos de empresa → empresa creada, 201 |
| GET `/api/companies/{id}/` | Empresa activa, 200; inexistente o inactiva, 404 |
| PUT/PATCH `/api/companies/{id}/` | Reemplazo/edición de campos, 200 |
| DELETE `/api/companies/{id}/` | Baja lógica, 204; posteriores accesos, 404 |

Cada empresa contiene `id,name,trade_name,rfc,is_active`, más los campos fiscales, notariales, de contacto y fechas del modelo. `id,created_at,updated_at` son de solo lectura. `name` es obligatorio para alta/PUT. Se mantienen validadores del modelo: RFC, URL, fechas, longitud y opciones. Listado ordenado por nombre e ID para paginación estable; excluye bajas.

El token se envía como `Authorization: Bearer ...`, dura 30 minutos. No se emiten refresh tokens ni se añaden endpoints refresh/logout: el frontend borra la sesión local y vuelve al login al recibir 401. Los permisos consultan el rol actual de la base, no claims de rol persistidos en el token. Desactivar un usuario invalida su acceso aunque el JWT no haya caducado.

Login no evalúa un Authorization antiguo. Credenciales incorrectas/inactivo: 401; campos incompletos: 400; usuario sin rol válido: 403. Perfil/API sin token, con token inválido/expirado o token refresh: 401. Falta de permisos: 403. Validación de datos: 400.

CORS acepta los orígenes de `CORS_ALLOWED_ORIGINS` (por defecto localhost/127.0.0.1:5173), Authorization y X-Company-ID. Los endpoints de este documento son globales: no requieren ni filtran por X-Company-ID. No existen membresías ni `/companies/context/`.

## Autorización

| Operación | administrador | capturista | consulta |
| --- | --- | --- | --- |
| Listar/ver empresas activas | Sí | Sí | Sí |
| Crear/editar empresas | Sí | Sí | No |
| Baja de empresa (DELETE o is_active=false) | Sí | No | No |
| Administrar usuarios | Sí | No | No |

La baja se reservó a administrador; capturista no puede eludirla mediante PATCH/POST de is_active. No se expone restauración de empresas dadas de baja. Ninguna operación de esta API elimina físicamente empresas o usuarios. No se cambia el comportamiento general del ORM fuera de la API.

Administración de usuarios adicional en `/api/users/` y `/api/users/{id}/`: CRUD exclusivo para administrador global. Campos: id, username, email, first_name, last_name, role (código), is_active y password (solo escritura). Contraseñas obligatorias al crear, validadas y almacenadas con hash; nunca se devuelven. No se exponen is_staff, is_superuser, groups ni user_permissions. DELETE desactiva al usuario. is_superuser por sí solo no concede acceso a esta API.

## Puesta en marcha

Usar `backend/.venv/bin/python` y la configuración MariaDB de `.env.example`. Aplicar las migraciones existentes en el despliegue si aún no se aplicaron. Los roles deben existir en `Role` con los códigos canónicos; asignar un rol global al usuario real de acceso. No se insertaron usuarios, empresas, fixtures ni datos de demostración en la base del proyecto. Las filas de pruebas solo se crean en una base de pruebas desechable.

No se habilitó una pantalla CRUD nueva en frontend: se conservó la interfaz existente. Login, perfil, listado, paginación, detalle y selección ahora tienen sus endpoints correspondientes. Las pantallas de captura de empresas y usuarios permanecen pendientes en frontend.

## Verificación y pendientes

- `python manage.py check`: sin errores.
- `python manage.py check --database default`: sin errores contra MariaDB 10.11.14.
- `python manage.py makemigrations --check --dry-run`: sin cambios de modelos.
- `npm run build`, `npm run lint` y prueba frontend de roles: pasan.
- El intento de `python manage.py test --noinput` con el usuario habitual falla con error 1044: no puede crear `test_urbanistica_erp_v2`. No se ampliaron sus privilegios ni se alteró la base real.
- La suite pasó: **17 pruebas, 0 fallos**, en MariaDB 10.11.14 temporal, por socket y sin red, con las migraciones existentes. Django eliminó su base de pruebas al terminar y se apagó la instancia temporal.

Para repetir las pruebas con la configuración habitual, el entorno debe proporcionar una base de pruebas independiente con permisos de creación/eliminación para el usuario de pruebas. No usar la base de aplicación como TEST.NAME.

El contrato se comprueba con JWT real y solicitudes DRF, incluyendo CORS, roles, cambios de rol, baja, validación y paginación. No se realizó un recorrido visual de navegador con credenciales reales ni se insertaron datos reales para hacerlo. La limitación de permisos de la base de pruebas habitual sigue pendiente del entorno.
