# Base de datos y scripts

## Scripts localizados

### UUID

Archivo:

- `src/main/resources/db/migration/add_uuid_column.sql`

Uso:

- agrega columna `uuid`
- completa valores iniciales
- marca `uuid` como `NOT NULL`
- crea indices unicos

Luego se recomienda ejecutar:

- `POST /api/admin/migrate-uuids`

para normalizar UUIDs de forma deterministica.

### Auditoria de sincronizacion

Archivo:

- `src/main/resources/sql/sync_audit_tables.sql`

Crea:

- `sync_batch_log_server`
- `sync_item_log_server`

## Schema SQLite

Archivo:

- `src/main/resources/schema.json`

Este archivo es la fuente usada para construir payloads compatibles con Capacitor SQLite y contiene definicion de tablas, columnas, indices y valores.

## Backups

Carpeta:

- `backups/`

Contiene dumps historicos. No asumir que son el ultimo estado productivo.

## Script pendiente de ubicar

No se encontro un SQL con nombre o contenido claro para "pasar a embarazada por tiempo" o cambio automatico de estados obstetricos por fecha.

Cuando se encuentre en Drive, sugerencia:

1. Guardarlo en `src/main/resources/sql/`.
2. Agregar fecha, objetivo y condiciones de ejecucion.
3. Documentar tablas afectadas.
4. Probarlo contra copia de base.
5. Agregar referencia en este archivo.

