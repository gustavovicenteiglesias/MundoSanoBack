# TAREA UUID-003: Actualizar Modelos y Esquema SQLite para UUID

## Estado
TODO

## Objetivo
Adaptar el frontend para manejar UUIDs como llaves de sincronización y preparar la base de datos SQLite para almacenar identificadores de texto.

## Criterios de Aceptación (Checklist)
- [ ] Actualizar todas las interfaces en `mundosano/src/models/` para incluir `uuid: string`.
- [ ] Modificar el esquema en `exportarIII..last.js` para asegurar que los campos UUID existan (o convertir PKs a TEXT si se decide cambiar la PK local).
- [ ] Incorporar una utilidad de generación de UUID (ej: `crypto.randomUUID()`) para nuevos registros.
- [ ] Eliminar la dependencia de rangos de IDs (min/max) en la creación de registros.

## Archivos Involucrados
- `mundosano/src/models/*.ts`
- `mundosano/src/data/exportarIII..last.js`
- `mundosano/src/repository/*.ts`

## Notas o Restricciones
- Los modelos deben inicializarse con UUIDs vacíos o generados, nunca null si se van a usar de llave.
