# Mundo Sano - Indice de documentacion

Esta carpeta reconstruye el estado del proyecto a partir de `AGENTS.md`, `ai/*.md`, `ai/task/*.md` y verificaciones puntuales del codigo.

## Resumen corto

- La sincronizacion fue migrada de identidad por IDs numericos a identidad global por `uuid`.
- El flujo offline-first exporta desde SQLite y consolida en MySQL por UUID.
- Hay auditoria de sincronizacion local y server-side con `sync_batch_id`.
- La pantalla `/personas` ya fue modernizada con cards, nubes de sync y filtros por embarazadas/puerperas.
- Queda como pendiente de ubicacion externa el posible script de cambio automatico de estado por tiempo, si existe en Drive.

## Indice

| Documento | Para que sirve |
|---|---|
| [estado-del-proyecto.md](./estado-del-proyecto.md) | Foto general del proyecto, que esta cerrado y que queda por confirmar. |
| [arquitectura.md](./arquitectura.md) | Mapa tecnico de backend, frontend y base de datos. |
| [sincronizacion-uuid-offline.md](./sincronizacion-uuid-offline.md) | Explica el flujo offline-first, UUID, auditoria, bootstrap full e incremental. |
| [migracion-id-a-uuid.md](./migracion-id-a-uuid.md) | Guia para pasar una base legacy con IDs numericos a UUID. |
| [frontend-ui-ux.md](./frontend-ui-ux.md) | Documenta `/personas`, nubes de sync, filtros y detalle puerpera. |
| [backend-api.md](./backend-api.md) | Lista endpoints relevantes de sync, auditoria y migracion. |
| [base-de-datos-y-scripts.md](./base-de-datos-y-scripts.md) | Scripts SQL ubicados, schema SQLite, backups y script pendiente de Drive. |
| [tareas-cerradas-y-pendientes.md](./tareas-cerradas-y-pendientes.md) | Estado administrativo de tareas cerradas, duplicadas y pendientes reales. |
| [operacion-y-pruebas.md](./operacion-y-pruebas.md) | Comandos y pruebas manuales sugeridas para backend, frontend y sync. |

## Rutas rapidas

- Para retomar el proyecto: leer [estado-del-proyecto.md](./estado-del-proyecto.md) y [tareas-cerradas-y-pendientes.md](./tareas-cerradas-y-pendientes.md).
- Para tocar sincronizacion: leer [sincronizacion-uuid-offline.md](./sincronizacion-uuid-offline.md), [backend-api.md](./backend-api.md) y [operacion-y-pruebas.md](./operacion-y-pruebas.md).
- Para migrar una base vieja: leer [migracion-id-a-uuid.md](./migracion-id-a-uuid.md) y [base-de-datos-y-scripts.md](./base-de-datos-y-scripts.md).
- Para UI de pacientes: leer [frontend-ui-ux.md](./frontend-ui-ux.md).
