# TAREA UUID-008: Robustez del Exportador y Logging de Errores
## Estado
DOING

## Objetivo
Garantizar que el endpoint `/data/json3` sea robusto ante datos antiguos sin UUID, descartando filas inválidas (sin romper el esquema) y generando un log para auditoría. Además, sincronizar todos los servicios con el esquema oficial de `schema.json`.

## Criterios de Aceptación (Checklist)
- [ ] **Backend**: Alinear indices de columnas en todos los servicios de exportación con `schema.json`.
- [ ] **Backend**: Implementar filtro en `ExportControler.java` que descarte filas con UUID nulo/vacío.
- [ ] **Backend**: Implementar sistema de logging (archivo o consola) para las filas descartadas.
- [ ] **Frontend**: Eliminar disparadores duplicados de carga de base en `Home.tsx`.
- [ ] **Frontend**: Validar que el JSON limpio llegue a `sqlite.importFromJson`.

## Archivos Involucrados
- `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- `src/main/java/edu/unsada/apimundosano/service/*.java`
- `mundosano/src/pages/Home.tsx`

## Notas
- No se puede permitir que el personal de campo reciba un JSON inválido. Es preferible omitir una fila que romper toda la sincronización.
