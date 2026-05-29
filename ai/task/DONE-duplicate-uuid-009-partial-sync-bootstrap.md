# TAREA UUID-009: Bootstrap Full + Sincronización Parcial Incremental
## Estado
DONE

## Cierre
- 2026-05-29: duplicada con `DONE-uuid-009-partial-sync-bootstrap.md`. Se conserva como evidencia historica y se cierra administrativamente.

## Objetivo
Implementar una estrategia dual de sincronización para la versión 3.0:
1) usar `/data/json3` como bootstrap inicial (esquema + valores) cuando la base local no existe,
2) usar una importación parcial incremental cuando la base local ya existe, trayendo solo datos faltantes/cambiados/eliminados para reducir volumen y tiempos de sincronización.

## Criterios de Aceptación (Checklist)
- [x] **Backend**: Definir y exponer endpoint incremental (por ejemplo `/data/json3/partial`) con filtro por fecha de última sincronización (`since`) o versión equivalente.
- [ ] **Backend**: Mantener `/data/json3` como endpoint de carga inicial full compatible con `JsonSQLite`.
- [ ] **Backend**: Incluir en incremental altas/modificaciones y bajas lógicas (`sql_deleted`) para mantener consistencia.
- [x] **Frontend**: Ajustar flujo de inicio para decidir entre bootstrap full o sincronización parcial según existencia de DB local.
- [ ] **Frontend**: Persistir y reutilizar `lastSyncDate` para solicitar solo deltas en sincronizaciones posteriores.
- [ ] **UUID**: Garantizar upsert por UUID en todas las tablas críticas, evitando colisiones por rangos de IDs por dispositivo.
- [ ] **Verificación**: Confirmar reducción de volumen transferido en escenarios con datos ya inicializados.

## Archivos Involucrados
- Backend: `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- Backend: `src/main/java/edu/unsada/apimundosano/service/*.java`
- Frontend: `mundosano/src/data/CargarBase.ts`
- Frontend: `mundosano/src/App.tsx`
- Frontend: (si aplica) repositorios/sincronización de tablas con UUID

## Notas o Restricciones
- El payload para Capacitor SQLite debe cumplir estrictamente contrato `JsonSQLite` (`database`, `version`, `encrypted`, `mode`, `tables`).
- La estrategia incremental no debe romper la compatibilidad con instalaciones existentes.
- Priorizar cambios mínimos y trazabilidad de errores en backend.
