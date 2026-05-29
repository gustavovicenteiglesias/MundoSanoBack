# Sincronizacion UUID offline-first

## Decision principal

La identidad global de registros es `uuid`. Los IDs numericos siguen existiendo como claves locales o claves internas, pero no deben ser la fuente de verdad para sincronizar entre dispositivos y servidor.

## Campos de sincronizacion

Cada fila sincronizable debe incluir:

- `uuid`: identificador global obligatorio.
- `last_modified`: timestamp Unix en segundos.
- `sql_deleted`: baja logica cuando aplica.

## Flujo de exportacion local a servidor

1. El usuario trabaja offline o con conectividad intermitente.
2. Los cambios se guardan primero en SQLite local.
3. La pantalla principal detecta pendientes comparando `last_modified` contra `sync_table.sync_date`.
4. Al exportar, el front usa `db.exportToJson("partial")`.
5. `enrichPartialExportWithAncestors(...)` agrega dependencias necesarias.
6. El front genera `syncMeta` con:
   - `syncBatchId`
   - `usuario`
   - `dispositivo`
   - `versionApp`
   - `fechaInicio`
7. El payload se envia a `POST /api/sqlite`.
8. El backend consolida en MySQL por UUID.
9. El backend devuelve metricas, rechazos, conflictos y hora oficial del servidor.
10. El front registra auditoria local y actualiza `sync_date`.

Archivos clave:

- `mundosano/src/pages/Main.tsx`
- `mundosano/src/utils/exportWithDependencies.ts`
- `mundosano/src/repository/syncBatchLogLocalRepo.ts`
- `mundosano/src/repository/syncItemLogLocalRepo.ts`
- `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- `src/main/java/edu/unsada/apimundosano/service/UniversalUpsertService.java`
- `src/main/java/edu/unsada/apimundosano/service/SyncAuditService.java`

## Import backend

`POST /api/sqlite`:

- Lee tablas desde el payload.
- Usa `schema.json` para mapear columnas.
- Preescanea UUIDs de personas, controles y antecedentes.
- Importa en orden de dependencias.
- Rechaza filas sin UUID.
- Resuelve relaciones por UUID cuando es posible.
- Hace upsert por UUID.
- Registra conflictos cuando el `last_modified` entrante es mas viejo que el existente.
- No deberia bloquear todo el lote por una fila invalida.

## Bootstrap desde servidor a SQLite

Endpoints:

- `GET /api/data/json3`: bootstrap full.
- `GET /api/data/json3/partial?since=...`: sincronizacion incremental.

El backend devuelve JSON compatible con Capacitor SQLite. El front lo importa con `sqlite.importFromJson(...)` desde `CargarBase.ts`.

## Auditoria de sincronizacion

Cada sync tiene un `sync_batch_id`.

Local:

- `sync_batch_log_local`
- `sync_item_log_local`

Servidor:

- `sync_batch_log_server`
- `sync_item_log_server`

Endpoints:

- `GET /api/sync/logs/batches`
- `GET /api/sync/logs/batches/{syncBatchId}`

Script server-side:

- `src/main/resources/sql/sync_audit_tables.sql`

