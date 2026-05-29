# TODO - AuditorÃ­a de sincronizaciÃ³n Front + Back

## Estado

DONE

## Cierre

- 2026-05-29: confirmado por tareas y archivos actuales. Existen logs locales/server, `syncMeta`, tablas de auditoria y endpoints `GET /api/sync/logs/batches`.

## Objetivo

Implementar una trazabilidad completa de sincronizaciÃ³n para que el usuario de campo pueda verificar quÃ© datos intentÃ³ sincronizar, con quÃ© resultado, exportar esa evidencia en CSV, y que el backend conserve un log equivalente en MySQL para permitir comparaciÃ³n por lote.

## MotivaciÃ³n

Hoy existen logs en archivo, pero no hay una pantalla operativa para que quienes cargan datos vean claramente:

* quÃ© lote sincronizaron
* cuÃ¡ndo lo hicieron
* quÃ© saliÃ³ bien
* quÃ© fue rechazado
* quÃ© quedÃ³ en conflicto
* quÃ© UUID / persona / control estuvo involucrado

Esto genera discusiones operativas porque el usuario afirma haber cargado datos y no tiene evidencia simple para compartir. La soluciÃ³n debe dejar una evidencia local exportable y una evidencia equivalente persistida en el servidor.

## Concepto central

Cada sincronizaciÃ³n debe identificarse con un `sync_batch_id` Ãºnico generado en frontend.

Ese `sync_batch_id` debe:

* guardarse en SQLite local
* viajar en el payload a `/api/sqlite`
* guardarse en MySQL backend
* devolverse en la respuesta si fuera necesario
* usarse como clave principal de auditorÃ­a para filtros, bÃºsqueda y exportaciÃ³n CSV

## Alcance

La implementaciÃ³n toca **Frontend + Backend + schema.json + MySQL**.

### Frontend

* agregar tablas locales de auditorÃ­a en `schema.json`
* persistir lotes e Ã­tems en SQLite local
* integrar el logging al flujo real de sincronizaciÃ³n
* crear pantalla de historial
* crear pantalla de detalle
* exportar CSV local

### Backend

* extender el contrato de `JsonSqlite` para soportar `syncMeta`
* crear tablas MySQL para batch e Ã­tems
* crear entidades JPA, repos y servicio de auditorÃ­a
* integrar la escritura de auditorÃ­a dentro de `/api/sqlite`
* exponer endpoints para consultar lotes y detalles

## Restricciones de arquitectura

* No romper el flujo actual de sincronizaciÃ³n `/api/sqlite`.
* Mantener cambios mÃ­nimos, modulares y seguros.
* No mezclar logs locales de SQLite con carga dinÃ¡mica desde MySQL en `/json3`: las tablas locales deben existir por `schema.json`, aunque arranquen vacÃ­as.
* Mantener separaciÃ³n estricta Back (`src/`) y Front (`mundosano/`).
* Reutilizar helpers existentes (`safeInt`, `safeString`, `fillImportResponse`, repos, etc.) cuando tenga sentido.
* No reescribir archivos completos salvo que sea estrictamente necesario.

## Archivos probables a tocar

### Backend

* `src/main/java/edu/unsada/apimundosano/utilidades/JsonSqlite.java`
* `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
* `src/main/java/edu/unsada/apimundosano/service/SyncAuditService.java` (nuevo)
* `src/main/java/edu/unsada/apimundosano/models/SyncBatchLogServerEntity.java` (nuevo)
* `src/main/java/edu/unsada/apimundosano/models/SyncItemLogServerEntity.java` (nuevo)
* `src/main/java/edu/unsada/apimundosano/repositorio/SyncBatchLogServerRepo.java` (nuevo)
* `src/main/java/edu/unsada/apimundosano/repositorio/SyncItemLogServerRepo.java` (nuevo)

### Frontend

* `mundosano/src/repository/` (nuevo repo de logs locales)
* `mundosano/src/models/SyncBatchLogLocal.ts` (nuevo)
* `mundosano/src/models/SyncItemLogLocal.ts` (nuevo)
* `mundosano/src/pages/SyncHistory.tsx` (nuevo)
* `mundosano/src/pages/SyncHistoryDetail.tsx` (nuevo)
* `mundosano/src/App.tsx` (ruta nueva)
* archivo/servicio donde hoy se arma y envÃ­a el payload de sincronizaciÃ³n (identificar y tocar mÃ­nimamente)

### Esquema local

* `src/main/resources/schema.json`

### Base MySQL

* script SQL nuevo o documentaciÃ³n en tarea para crear:

  * `sync_batch_log_server`
  * `sync_item_log_server`

## Criterios de aceptaciÃ³n

### A. Esquema local

* [x] `schema.json` incluye `sync_batch_log_local`.
* [x] `schema.json` incluye `sync_item_log_local`.
* [x] La app crea ambas tablas al iniciar aunque estÃ©n vacÃ­as.

### B. Contrato backend

* [x] `JsonSqlite` soporta `syncMeta`.
* [x] El frontend envÃ­a `sync_batch_id`, `usuario`, `dispositivo`, `version_app`, `fecha_inicio`.
* [x] `/api/sqlite` recibe ese bloque sin romper compatibilidad.

### C. Persistencia backend

* [x] Existen entidades JPA para `sync_batch_log_server` y `sync_item_log_server`.
* [x] Existen repositorios para esas tablas.
* [x] Existe `SyncAuditService` para centralizar altas/cierre de logs.
* [x] `ExportControler.postSqlite(...)` registra el lote y el detalle en MySQL.

### D. Persistencia frontend

* [x] Existe repositorio local para batch logs.
* [x] Existe repositorio local para item logs.
* [x] Antes de sincronizar se genera y persiste `sync_batch_id`.
* [x] Al cerrar la sincronizaciÃ³n se actualiza el lote local con totales y estado.

### E. Pantalla operativa

* [x] Existe pantalla `SyncHistory.tsx`.
* [x] Existe pantalla de detalle `SyncHistoryDetail.tsx`.
* [x] La pantalla permite filtrar por fecha.
* [x] La pantalla permite filtrar por estado.
* [x] La pantalla permite buscar por `sync_batch_id`.
* [x] La pantalla permite ver detalle por lote.

### F. ExportaciÃ³n

* [x] Se puede exportar CSV de lotes.
* [x] Se puede exportar CSV detallado por lote.
* [x] El CSV contiene `sync_batch_id`, fecha, tabla, uuid, ids relevantes, estado y motivo.

### G. AuditorÃ­a backend

* [x] Existen endpoints mÃ­nimos:

  * [x] `GET /api/sync/logs/batches`
  * [x] `GET /api/sync/logs/batches/{syncBatchId}`
* [x] Los resultados permiten comparar un lote local con el lote server-side.

## Estrategia recomendada de implementaciÃ³n

### Fase 1 - Infraestructura mÃ­nima

1. Agregar tablas locales a `schema.json`.
2. Crear tablas MySQL del backend.
3. Extender `JsonSqlite` con `syncMeta`.
4. Crear entidades / repos server-side.
5. Crear `SyncAuditService`.

### Fase 2 - IntegraciÃ³n real

6. Integrar creaciÃ³n/cierre de batch en `/api/sqlite`.
7. Registrar items en backend al menos para las tablas principales.
8. Integrar logging local en frontend.

### Fase 3 - OperaciÃ³n

9. Crear `SyncHistory.tsx`.
10. Crear `SyncHistoryDetail.tsx`.
11. Agregar exportaciÃ³n CSV.
12. Agregar endpoints GET de consulta.

## Notas importantes para el agente

* Seguir `AGENTS.md` y `ai/workflow.md` antes de modificar cÃ³digo.
* Trabajar por bloques pequeÃ±os.
* No cambiar la lÃ³gica principal de sincronizaciÃ³n salvo lo necesario para inyectar auditorÃ­a.
* Mostrar Ãºnicamente bloques modificados, no archivos enteros.
* Si al finalizar queda informaciÃ³n de estado Ãºtil, actualizar `ai/context.md` o generar checkpoint.

## Prompt sugerido para Codex

```text
SeguÃ­ AGENTS.md y la boot sequence. TomÃ¡ la tarea `ai/tasks/TODO-auditoria-sincronizacion-front-back.md`.

Necesito implementar auditorÃ­a de sincronizaciÃ³n completa entre frontend Ionic/React y backend Spring Boot.

Objetivo funcional:
- generar un sync_batch_id por sincronizaciÃ³n
- guardar lote e Ã­tems en SQLite local
- mostrar historial y detalle en pantalla
- exportar CSV local
- guardar lote e Ã­tems equivalentes en MySQL backend
- consultar esos logs por endpoint para comparar front vs back

Restricciones:
- cambios mÃ­nimos y seguros
- no romper `/api/sqlite`
- no reescribir archivos completos sin necesidad
- las tablas locales deben crearse desde `schema.json`, no desde MySQL
- mantener separaciÃ³n backend/frontend

TrabajÃ¡ en este orden:
1. schema.json
2. JsonSqlite + syncMeta
3. entidades/repos backend
4. SyncAuditService
5. integraciÃ³n mÃ­nima en postSqlite
6. repos/local logs frontend
7. pantalla SyncHistory + detalle
8. export CSV

Antes de codificar, respondÃ© con:
1. DiagnÃ³stico
2. Faltante
3. Impacto
4. Plan

EsperÃ¡ confirmaciÃ³n antes de escribir cÃ³digo.
```

