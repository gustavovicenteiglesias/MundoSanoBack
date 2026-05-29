# TAREA UUID-011: Auditoría y Corrección de Formularios (Nueva Embarazada, Antecedentes, Edit Antecedentes, Nuevo Control)

## Estado
DONE

## Cierre
- 2026-05-29: duplicada con `DONE-uuid-011-formularios-persistencia-uuid.md`. Se conserva como evidencia historica y se cierra administrativamente.

## Objetivo
Evitar regresiones de persistencia local y errores SQL durante guardado en formularios críticos, garantizando compatibilidad con migración UUID-first y persistencia SQLite consistente antes de sincronización backend.

## Formularios Alcanzados
- `NuevaEmbarazada`
- `FormNuevoAntecedente`
- `FormEditAntecedentes`
- `NuevoControl`
- `NuevoEmbarazoControl` / `NuevaEmbazadaControl` (flujo derivado)

## Problema Detectado
- Errores de ejecución en SQLite al guardar (`no such column: id`) durante updates en formularios de control.
- Construcción SQL dinámica sin saneo uniforme de entidades.
- Riesgo de mezclas entre esquema viejo (id numérico genérico) y actual (PK reales por tabla + UUID).

## Criterios de Aceptación
- [ ] Ningún formulario de la lista falla con `no such column: id` al guardar.
- [ ] Los repositorios no envían `id` genérico ni valores `undefined` en SQL.
- [ ] Se mantiene `last_modified` en updates/inserts.
- [ ] Se preserva `uuid` existente y solo se genera si falta en create.
- [ ] El flujo "editar presión sistólica y guardar" persiste localmente sin error.

## Plan de Implementación
1. Endurecer `Repository.ts` para saneo de entidad (quitar `id` genérico y `undefined`) y escape de strings.
2. Validar formularios de antecedentes/control que usan `update`, `updateInmunizaciones`, `updateLaboratoriosRealizados`, `updateEtmisPersonas`.
3. Ajustar formularios puntuales donde se detecten campos no compatibles con el esquema real.
4. Registrar checklist de resultados por formulario.

## Notas
- Prioridad inmediata: resolver la persistencia local antes de ajustar export/import.
- Cambios mínimos, trazables y focalizados por formulario.
