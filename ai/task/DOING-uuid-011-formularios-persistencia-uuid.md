# TAREA UUID-011: Auditoría y Corrección de Formularios (Nueva Embarazada, Antecedentes, Edit Antecedentes, Nuevo Control)

## Estado
DOING

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
- [x] Los repositorios no envían `id` genérico ni valores `undefined` en SQL.
- [x] Se mantiene `last_modified` en updates/inserts.
- [x] Se preserva `uuid` existente y solo se genera si falta en create.
- [ ] El flujo "editar presión sistólica y guardar" persiste localmente sin error.

## Plan de Implementación
1. Endurecer `Repository.ts` para saneo de entidad (quitar `id` genérico y `undefined`) y escape de strings.
2. Validar formularios de antecedentes/control que usan `update`, `updateInmunizaciones`, `updateLaboratoriosRealizados`, `updateEtmisPersonas`.
3. Ajustar formularios puntuales donde se detecten campos no compatibles con el esquema real.
4. Registrar checklist de resultados por formulario.

## Notas
- Prioridad inmediata: resolver la persistencia local antes de ajustar export/import.
- Cambios mínimos, trazables y focalizados por formulario.

## Matriz de Auditoría Componente por Componente (Persistencia)
| Componente | Tipo de operación | Tablas afectadas | Riesgo actual | Estado |
|---|---|---|---|---|
| `EditControlEmbarazada.tsx` | `update`, `updateInmunizaciones`, `updateLaboratoriosRealizados`, `updateEtmisPersonas`, `updateFecha` | `controles`, `control_embarazo`, `inmunizaciones_control`, `laboratorios_realizados`, `etmis_personas` | **Crítico** (ya reportó `no such column: id`) | En curso |
| `NuevoControl.tsx` | `create` múltiple | `controles`, `control_embarazo`, `inmunizaciones_control`, `laboratorios_realizados`, `etmis_personas` | Alto (persistencia masiva en submit) | En curso |
| `NuevaEmbazadaControl.tsx` | `create` múltiple + alta paciente/ubicación | `personas`, `ubicaciones`, `controles`, `antecedentes`, `antecedentes_apps`, `antecedentes_macs`, `control_embarazo`, `inmunizaciones_control`, `laboratorios_realizados`, `etmis_personas` | Alto | Pendiente |
| `NuevoEmbarazoControl.tsx` | `create` + `update` de antecedentes | `controles`, `antecedentes`, `antecedentes_apps`, `antecedentes_macs`, `control_embarazo`, `inmunizaciones_control`, `laboratorios_realizados`, `etmis_personas` | Alto | En curso |
| `FormEditAntecedentes.tsx` | `update/create` | `antecedentes`, `antecedentes_apps`, `antecedentes_macs` | Medio/Alto (updates por PK real) | Pendiente |
| `FormNuevoAntecedente.tsx` | tránsito de datos (persistencia en paso posterior) | Deriva a controles/antecedentes | Medio (depende del submit siguiente) | Pendiente |
| `NuevaEmbarazada.tsx` | tránsito de datos inicial | Deriva a alta de persona/control | Medio | Pendiente |

## Orden de Ejecución (obligatorio)
1. `EditControlEmbarazada` (incidente en producción reportado).
2. `NuevoControl`.
3. `NuevoEmbarazoControl` y `NuevaEmbazadaControl`.
4. `FormEditAntecedentes`.
5. Validación de flujo completo desde `NuevaEmbarazada` + `FormNuevoAntecedente`.
