# TAREA UUID-006: Refactorización Single Source of Truth para Esquema SQLite
## Estado
TODO

## Objetivo
Eliminar el archivo `exportarIII..last.js` del front-end en el que se encuentra el esquema de base de datos *hardcodeado*, para consolidarlo permitiendo que el endpoint `/data/json3` en el Servidor (Java) despache dinámicamente tanto el Esquema (schema, índices) como los Valores estáticos y dinámicos para Capacitor SQLite, asegurando una única fuente de la verdad para la sincronización y robustez a la hora de integrar o modificar la arquitectura como la recientemente aplicada a UUID.

## Criterios de Aceptación (Checklist)
- [ ] Refactorizar `ExportControler.java` y Servicios de exportación para serializar el esquema de las tablas junto con los arrays de registros en el Formato de `JsonSQLite`.
- [ ] Transferir los datos duros de tablas base (estados, provincias, motivos, países, apps) hacia el endpoint en base a los repositorios de MySql.
- [ ] Eliminar `mundoSano/src/data/exportarIII..last.js` o inutilizar su contenido.
- [ ] Ajustar `CargarBase.ts` para que pase el cuerpo del endpoint directo a `sqlite.importFromJson`.

## Archivos Involucrados
- Backend: `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- Backend: Servicios exportadores (`...Service.java`)
- Frontend: `mundosano/src/data/CargarBase.ts`
- Frontend: `mundosano/src/data/exportarIII..last.js` (a eliminar)

## Notas o Restricciones
- El JSON exportado por el back-end debe ajustarse milimétricamente al contrato tipado que exige Capacitor (campos: database, version, encrypted, mode, tables con elements name, schema e values).
