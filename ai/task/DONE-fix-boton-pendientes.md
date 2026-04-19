# TAREA FIX-001: Corregir reactividad del botón de Pendientes en /personas

## Estado
DONE

## Objetivo
Asegurar que al presionar el botón "Pendientes", la lista de personas se actualice para mostrar solo los casos pendientes sin necesidad de recargar la página manualmente.

## Criterios de Aceptación (Checklist)
- [x] Incorporar `isPendientes` como dependencia en el `useEffect` de carga de datos.
- [x] (Opcional) Refactorizar la gestión de datos para que el cambio de vista sea instantáneo si los datos ya fueron cargados.
- [x] Verificar que al alternar entre "Pendientes" y "Ver Todos", la tabla se actualice correctamente.

## Archivos Involucrados
- `mundosano/src/pages/Personas.tsx`

## Notas o Restricciones
- No romper el filtrado existente por texto o estado (segmentEstado).
- Asegurar que `result1` sea manejado de forma segura dentro del ciclo de vida de React.

