# Backend API

Base controller principal:

- `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`

## Sincronizacion

### POST `/api/sqlite`

Recibe payload exportado desde SQLite y consolida en MySQL.

Responsabilidades:

- leer `syncMeta`
- registrar inicio de batch
- importar tablas por UUID
- resolver relaciones
- reportar guardados, rechazados y conflictos
- registrar auditoria server-side
- devolver hora Unix oficial del servidor

### GET `/api/data/json3`

Devuelve bootstrap full compatible con Capacitor SQLite:

- schema
- valores iniciales/dinamicos
- `mode = full`

### GET `/api/data/json3/partial?since=...`

Devuelve delta incremental filtrado por `last_modified`.

Incluye el tiempo actual del servidor para evitar depender del reloj del dispositivo.

### POST `/api/sync_date`

Actualiza fecha de sincronizacion en tabla central `sync_table`.

## Auditoria

### GET `/api/sync/logs/batches`

Lista lotes de sincronizacion registrados en servidor.

### GET `/api/sync/logs/batches/{syncBatchId}`

Devuelve batch e items asociados a un lote.

## Migracion

Controller:

- `src/main/java/edu/unsada/apimundosano/Controller/MigrationController.java`

### POST `/api/admin/migrate-uuids`

Ejecuta migracion deterministica de UUIDs en entidades que extienden `BaseEntity`.

Usar solo en bases preparadas y con backup.

