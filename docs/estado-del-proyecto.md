# Estado del proyecto

## Proyecto

Mundo Sano es una aplicacion de salud/bienestar con:

- Backend Java 17 + Spring Boot 3.0.6.
- Frontend Ionic 6 + React 18 + Capacitor.
- Persistencia local SQLite en dispositivo.
- Persistencia central MySQL 8.

## Estado funcional reconstruido

La linea principal de trabajo fue la estabilizacion de sincronizacion offline-first y el cambio de identidad desde IDs numericos locales hacia UUID globales.

Segun las tareas y el codigo actual, la sincronizacion esta cerrada:

- Exportacion parcial desde SQLite local mediante `db.exportToJson("partial")`.
- Enriquecimiento del payload con dependencias necesarias.
- Envio a `POST /api/sqlite`.
- Import backend con upsert por `uuid`.
- Resolucion de relaciones criticas por UUID.
- Manejo de `last_modified` para conflictos.
- Uso de `sql_deleted` para bajas logicas.
- Auditoria local y server-side por `sync_batch_id`.
- Bootstrap full e incremental desde `/api/data/json3` y `/api/data/json3/partial`.

## UI/UX cerrada

Tambien aparecen cerradas mejoras de interfaz:

- `/personas` paso de tabla a cards/items.
- Cada persona muestra icono de nube por estado de sincronizacion.
- Hay filtro por estado obstetrico: todas, embarazadas, puerperas.
- Hay vista de pendientes.
- `DetallePaciente` tiene tratamiento especifico para paciente puerpera.
- El flujo de sync usa modal de progreso (`SyncProgressModal`) en lugar de depender solo de alerts.

## Pendiente no confirmado

No se encontro en este repositorio un script claro para "pasar a embarazada por tiempo" o cambiar estados obstetricos automaticamente por fecha. Puede estar en otra carpeta de Drive.

Si aparece, conviene incorporarlo a:

- `src/main/resources/sql/`
- `docs/base-de-datos-y-scripts.md`
- una tarea cerrada en `ai/task/`

