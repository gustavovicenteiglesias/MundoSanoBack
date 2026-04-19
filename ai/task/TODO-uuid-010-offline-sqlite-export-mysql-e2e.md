# TAREA UUID-010: Persistencia Offline en SQLite + Exportación Segura a MySQL (E2E)

## Estado
TODO

## Objetivo
Garantizar de punta a punta (E2E) que:
1. Los datos creados/modificados localmente se persistan primero en SQLite (offline-first).
2. Luego se exporten al backend mediante `/api/sqlite`.
3. El backend consolide en MySQL usando identidad global por UUID (upsert idempotente), preservando relaciones y bajas lógicas.

## Alcance
### Incluye
- Validación del flujo de exportación desde SQLite (`exportToJson("partial")`) hacia backend.
- Endurecimiento del import backend para resolver relaciones por UUID y evitar inconsistencias por IDs locales.
- Reglas de conflicto e idempotencia documentadas y aplicadas.
- Observabilidad mínima (contadores, rechazados por tabla y motivo).
- Pruebas funcionales E2E con evidencia reproducible.

### No incluye
- Rediseño de UI.
- Refactors masivos fuera del flujo de sincronización.
- Cambios de arquitectura fuera del contrato UUID-first.

## Contexto / Problema
Con el cambio a UUID, el sistema debe dejar de depender de IDs incrementales locales para consolidar datos entre dispositivos. El riesgo principal es que existan relaciones resueltas por ID móvil (fallback) que introduzcan colisiones o referencias inválidas al importar en MySQL.

## Requisitos Funcionales
- RF-01: El cliente debe exportar únicamente desde SQLite local (no desde estado en memoria).
- RF-02: Cada fila exportable debe incluir `uuid` válido y no vacío.
- RF-03: El backend debe hacer upsert por UUID en tablas maestras y transaccionales.
- RF-04: Las relaciones críticas (persona/control/antecedente y derivadas) deben consolidarse por UUID.
- RF-05: El flujo debe soportar reintento seguro (idempotencia): mismo payload no duplica.
- RF-06: Las bajas lógicas (`sql_deleted`) deben reflejarse en MySQL.
- RF-07: El resultado de import debe reportar métricas por tabla: insertados/actualizados/rechazados.

## Requisitos No Funcionales
- RNF-01: Cambios mínimos y trazables (sin reescrituras completas).
- RNF-02: Tolerancia a errores parciales (no bloquear todo el lote por una fila inválida).
- RNF-03: Logging estructurado para auditoría de rechazos.
- RNF-04: Compatibilidad con payload `JsonSQLite` vigente.

## Contrato Técnico de Datos (UUID-first)
- Campo obligatorio por registro: `uuid` (string no vacío).
- Campos de sincronización: `last_modified` (epoch seg) y `sql_deleted` (0/1 o null según tabla).
- Regla de identidad: UUID determina existencia previa (no ID local).
- Regla de conflicto:
  - Si existe UUID y `last_modified` entrante > existente, actualizar.
  - Si existe UUID y `last_modified` entrante <= existente, no pisar (o registrar conflicto según política acordada).

## Estrategia de Implementación
### Fase 1 — Hardening de Export (Front)
- Confirmar que el envío a backend use `db.exportToJson("partial")` como fuente única.
- Validar payload antes de POST:
  - rechazar filas sin UUID,
  - detectar referencias potencialmente huérfanas,
  - registrar resumen de datos a enviar.

### Fase 2 — Hardening de Import (Back)
- Normalizar pipeline por orden de dependencia:
  1) entidades raíz,
  2) entidades dependientes,
  3) tablas puente.
- Reemplazar resolución por ID móvil en relaciones críticas por resolución UUID-first.
- Mantener tolerancia a errores por fila + log estructurado.

### Fase 3 — Idempotencia y Consistencia
- Definir y aplicar política de conflicto con `last_modified`.
- Verificar reenvío del mismo lote sin duplicación.
- Verificar integridad referencial tras importaciones consecutivas.

### Fase 4 — Verificación E2E y Métricas
- Ejecutar escenarios E2E controlados (ver sección de pruebas).
- Medir: filas procesadas, actualizadas, rechazadas, tiempo por import.
- Documentar resultados y límites conocidos.

## Criterios de Aceptación (Checklist)
- [ ] El front exporta datos pendientes desde SQLite local y envía payload válido a `/api/sqlite`.
- [ ] El backend importa personas/controles/relaciones por UUID sin duplicar registros existentes.
- [ ] Reintentar el mismo payload no genera duplicados (idempotencia validada).
- [ ] Las bajas lógicas (`sql_deleted`) quedan reflejadas en MySQL.
- [ ] Las relaciones críticas no dependen de IDs locales para consolidación final.
- [ ] Se generan métricas por import (totales por tabla + rechazados por motivo).
- [ ] Se dispone evidencia de pruebas E2E (pasos + resultados esperados/obtenidos).

## Plan de Pruebas (E2E)
### Caso A: Alta nueva offline
1. Crear persona/control localmente sin conexión.
2. Verificar presencia en SQLite.
3. Ejecutar exportación.
4. Validar alta en MySQL por UUID.

### Caso B: Reenvío idempotente
1. Reenviar exactamente el mismo payload.
2. Validar ausencia de duplicados y conteos estables.

### Caso C: Edición posterior
1. Modificar registro existente (incrementar `last_modified`).
2. Exportar.
3. Validar update correcto en MySQL.

### Caso D: Baja lógica
1. Marcar `sql_deleted=1` localmente.
2. Exportar.
3. Verificar reflejo en MySQL y comportamiento de consultas activas.

### Caso E: Relaciones cruzadas
1. Crear/editar datos relacionados en tablas dependientes.
2. Exportar.
3. Validar integridad referencial final en MySQL.

## Riesgos
- Dependencias históricas por ID local aún activas en relaciones.
- Diferencias de orden de columnas schema/values entre tablas.
- Conflictos por relojes desincronizados (`last_modified`).

## Mitigaciones
- Resolver relaciones por UUID y mantener mapa de resolución explícito.
- Validación estricta de payload por tabla antes de persistir.
- Log de conflictos con evidencia suficiente para auditoría.

## Rollback / Contingencia
- Si se detecta inconsistencia severa:
  - pausar importación de tablas afectadas,
  - mantener importación de tablas no afectadas,
  - registrar incidentes con payload mínimo reproducible,
  - restaurar estrategia previa temporalmente en endpoint con feature flag (si aplica).

## Archivos Involucrados (estimados)
- Backend:
  - `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
  - `src/main/java/edu/unsada/apimundosano/service/*.java`
  - `src/main/java/edu/unsada/apimundosano/repositorio/*Repo.java`
- Frontend:
  - `mundosano/src/pages/Main.tsx`
  - `mundosano/src/repository/Repository.ts`
  - `mundosano/src/data/CargarBase.ts` (solo si impacta sync_date/flujo parcial)

## Definición de Hecho (DoD)
- Checklist de aceptación completo.
- Pruebas E2E documentadas con resultado.
- Sin regresión en bootstrap full y sync parcial existentes.
- Trazabilidad de errores disponible para soporte.
