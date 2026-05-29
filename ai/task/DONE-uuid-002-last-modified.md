# TAREA UUID-002: Migrar triggers de last_modified a la Lógica de Aplicación

## Estado
DONE

## Cierre
- 2026-05-29: cerrado administrativamente durante reconstruccion de estado. `last_modified` queda documentado como parte del contrato incremental y de conflicto.

## Objetivo
Eliminar la dependencia de triggers SQL para el seguimiento de cambios y centralizar la actualización de `last_modified` en Java y Typescript.

## Criterios de Aceptación (Checklist)
- [ ] Implementar `@PreUpdate`/`@PrePersist` en el Backend para gestionar `last_modified`.
- [ ] Modificar el `Repository` genérico en el Frontend para actualizar `last_modified` en cada operación de escritura.
- [ ] Eliminar los 50+ triggers definidos en `CargarBase.ts` y en la definición de la base de datos.
- [ ] Verificar que el timestamp se guarde correctamente en formato Unix (segundos).

## Archivos Involucrados
- `src/main/java/edu/unsada/apimundosano/models/*.java`
- `mundosano/src/repository/Repository.ts`
- `mundosano/src/data/CargarBase.ts`
- `mundosano/src/data/exportarIII..last.js`

## Notas o Restricciones
- El campo `last_modified` es crítico para la sincronización diferencial. No debe fallar.
