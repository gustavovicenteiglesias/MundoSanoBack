# TAREA UUID-004: Script de Migración Determinista de IDs a UUID

## Estado
DONE

## Cierre
- 2026-05-29: cerrado administrativamente durante reconstruccion de estado. La migracion ID->UUID queda documentada con SQL y endpoint de migracion deterministica.

## Objetivo
Crear una utilidad para convertir los ~10,000 registros actuales de enteros a UUIDs sin romper las relaciones de la base de datos.

## Criterios de Aceptación (Checklist)
- [ ] Desarrollar un servicio en Java que recorra todas las tablas.
- [ ] Implementar la fórmula `hash(tabla + id_entero)` para generar UUIDs deterministas.
- [ ] Poblar el nuevo campo `uuid` en todas las tablas existentes.
- [ ] Verificar que las Foreign Keys sigan coincidiendo tras la migración.

## Archivos Involucrados
- `src/main/java/edu/unsada/apimundosano/service/MigrationService.java` (Nueva)

## Notas o Restricciones
- Esta tarea debe ejecutarse una sola vez en el Sandbox antes de probar la sincronización UUID.
