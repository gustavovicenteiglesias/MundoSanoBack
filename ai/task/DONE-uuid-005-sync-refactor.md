# TAREA UUID-005: Protocolo de Sincronización basado en UUID

## Estado
DONE

## Cierre
- 2026-05-29: cerrado administrativamente durante reconstruccion de estado. `POST /api/sqlite` procesa payloads por UUID y usa upsert universal.

## Objetivo
Refactorizar el sistema de intercambio de datos para que el servidor identifique los registros por su UUID global en lugar de su ID incremental local.

## Criterios de Aceptación (Checklist)
- [ ] Actualizar `ExportControler.java` para procesar UUIDs en el JSON de entrada/salida.
- [ ] Ajustar los servicios de guardado para que realicen un "upsert" basado en UUID.
- [ ] Verificar la integridad de las relaciones (controles asociados a personas) usando UUIDs durante la sincronización.

## Archivos Involucrados
- `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- `src/main/java/edu/unsada/apimundosano/service/*Srevice.java`

## Notas o Restricciones
- Es la tarea final del ciclo y requiere que el Front y el Back ya hablen el "idioma" UUID.
