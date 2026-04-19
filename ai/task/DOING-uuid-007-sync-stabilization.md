# TAREA UUID-007: Estabilización de Sincronización y Depuración de JSON
## Estado
DOING

## Objetivo
Resolver el error persistente `ImportFromJson: Stringify Json Object not Valid` mediante la limpieza del payload JSON (eliminación de claves no estándar como `success`) y la eliminación de la duplicidad de llamadas entre `App.tsx` y `Home.tsx`.

## Criterios de Aceptación (Checklist)
- [x] **Backend**: Modificar `ExportControler.java` para retornar únicamente las 5 claves permitidas por `JsonSQLite`.
- [x] **Frontend**: Refactorizar `Home.tsx` para eliminar el auto-disparo de `checkDbAndMigrate` en el montaje, delegando la carga inicial a `App.tsx`.
- [x] **Frontend**: Refactorizar `CargarBase.ts` para aplicar un filtro de seguridad (pick) sobre las claves permitidas antes de llamar a `sqlite.importFromJson`.
- [ ] **Verificación**: Confirmar que `/json3` se llame una sola vez y la base se cargue correctamente.

## Archivos Involucrados
- Backend: `src/main/java/edu/unsada/apimundosano/Controller/ExportControler.java`
- Frontend: `mundosano/src/pages/Home.tsx`
- Frontend: `mundosano/src/data/CargarBase.ts`

## Notas o Restricciones
- El objeto pasado a `importFromJson` DEBE ser un objeto (o string) que posea exclusivamente: `database`, `version`, `encrypted`, `mode`, `tables`.
- No debe haber solapamiento entre el ciclo de vida de `App` y `Home` respecto a la inicialización de la base de datos.
