# Tareas cerradas y pendientes

## Cierre administrativo

El 2026-05-29 se cerro administrativamente la carpeta `ai/task` para que no queden tareas `DOING`.

Se considero como fuente de verdad la decision del usuario:

- la sincronizacion esta saldada
- el paso de IDs numericos a UUID esta saldado
- las mejoras UI/UX de personas, nubes y filtros estan saldadas

## Tareas relevantes cerradas

- `DONE-uuid-001-entities.md`
- `DONE-uuid-002-last-modified.md`
- `DONE-uuid-003-frontend-models.md`
- `DONE-uuid-004-data-migration.md`
- `DONE-uuid-005-sync-refactor.md`
- `DONE-uuid-006-single-source.md`
- `DONE-uuid-007-sync-stabilization.md`
- `DONE-uuid-008-robustness.md`
- `DONE-uuid-009-partial-sync-bootstrap.md`
- `DONE-uuid-010-offline-sqlite-export-mysql-e2e.md`
- `DONE-uuid-011-formularios-persistencia-uuid.md`
- `DONE-uuid-012-sqlite-import-universal.md`
- `DONE-14-auditoria-sincronizacion-front-back.md`
- `DONE-015-sync-ux-modal-progreso-export-import.md`
- `DONE-017-personas-cards-nube-sync-etmi.md`
- `DONE-18-detalleaciente-puerpera.md`
- `DONE-fix-boton-pendientes.md`

## Duplicados preservados

Algunas tareas existian como `DOING` y tambien como `DONE`. Se renombraron como:

- `DONE-duplicate-uuid-009-partial-sync-bootstrap.md`
- `DONE-duplicate-uuid-010-offline-sqlite-export-mysql-e2e.md`
- `DONE-duplicate-uuid-011-formularios-persistencia-uuid.md`

Se conservaron para no perder bitacora historica.

## Pendientes reales o a confirmar

- Ubicar el posible script externo de cambio de estado obstetrico por tiempo.
- Revisar si todos los datos duros de tablas base deben salir desde MySQL o si `schema.json` sigue siendo suficiente.
- Confirmar con prueba manual en dispositivo que los colores de nube reflejan correctamente los logs locales.
- Revisar secretos en `application.properties` antes de publicar o compartir el repositorio.

