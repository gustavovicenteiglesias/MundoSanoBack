# TAREA UUID-001: Adaptar Entidades y Repositorios al esquema Híbrido (UUID + INT)

## Estado
TODO

## Objetivo
Añadir el campo UUID a todas las entidades de Spring Boot y actualizar los repositorios para soportar la identificación global sin perder los IDs numéricos actuales.

## Criterios de Aceptación (Checklist)
- [ ] Modificar las 50+ entidades en `edu.unsada.apimundosano.models` para incluir el campo `String uuid`.
- [ ] Configurar la generación automática de UUID para nuevos registros.
- [ ] Asegurar que las Foreign Keys sigan apuntando al ID numérico internamente para performance.
- [ ] Verificar que los Repositorios puedan buscar registros tanto por ID como por UUID.

## Archivos Involucrados
- `src/main/java/edu/unsada/apimundosano/models/*.java`
- `src/main/java/edu/unsada/apimundosano/repositorio/*.java`

## Notas o Restricciones
- NO borrar los campos de ID numéricos existentes.
- Mantener la compatibilidad con los Excel de los infectólogos (usando los IDs numéricos como referencia amigable).
