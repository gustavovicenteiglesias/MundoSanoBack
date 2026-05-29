# Migracion de base con IDs numericos a UUID

## Objetivo

Pasar una base legacy que dependia de IDs numericos a una base compatible con sincronizacion UUID-first.

El objetivo no es eliminar los IDs numericos. El objetivo es agregar `uuid` como identidad global y conservar IDs numericos para claves internas, compatibilidad e historico.

## Estrategia disponible en el proyecto

Hay dos piezas:

1. SQL para agregar columna `uuid` e indices unicos.
2. Endpoint Java para migracion deterministica.

Archivos:

- `src/main/resources/db/migration/add_uuid_column.sql`
- `src/main/java/edu/unsada/apimundosano/Controller/MigrationController.java`
- `src/main/java/edu/unsada/apimundosano/service/MigrationService.java`

## Paso 0 - Backup obligatorio

Antes de tocar una base real:

1. Exportar dump completo de MySQL.
2. Verificar que el dump restaure en una base de prueba.
3. Ejecutar todo primero en sandbox.

Hay backups historicos en `backups/`, pero no asumir que son actuales.

## Paso 1 - Agregar columna UUID

Ejecutar el SQL:

```sql
source src/main/resources/db/migration/add_uuid_column.sql;
```

Ese script agrega `uuid VARCHAR(36)`, rellena con `UUID()` donde falta, marca la columna como `NOT NULL` y crea indices unicos por tabla.

Nota: ese primer llenado con `UUID()` no es deterministico. Sirve para completar columnas, pero la migracion Java posterior normaliza a UUID deterministico segun entidad e ID.

## Paso 2 - Levantar backend contra la base objetivo

Verificar `src/main/resources/application.properties`.

No documentar credenciales en commits ni en capturas. Si se publica el repo, mover secretos a variables de entorno.

## Paso 3 - Ejecutar migracion deterministica

Endpoint:

```http
POST /api/admin/migrate-uuids
```

El servicio recorre entidades que extienden `BaseEntity` y calcula:

```text
UUID.nameUUIDFromBytes("MundoSano:" + EntityName + ":" + id)
```

Eso permite que el mismo registro legacy obtenga siempre el mismo UUID si conserva entidad e ID.

## Paso 4 - Validaciones minimas

Validar en MySQL:

```sql
SELECT COUNT(*) FROM personas WHERE uuid IS NULL OR uuid = '';
SELECT uuid, COUNT(*) FROM personas GROUP BY uuid HAVING COUNT(*) > 1;
SELECT COUNT(*) FROM controles WHERE uuid IS NULL OR uuid = '';
SELECT uuid, COUNT(*) FROM controles GROUP BY uuid HAVING COUNT(*) > 1;
```

Repetir para tablas sincronizables principales:

- `personas`
- `controles`
- `control_embarazo`
- `control_puerperio`
- `ubicaciones`
- `antecedentes`
- `antecedentes_apps`
- `antecedentes_macs`
- `inmunizaciones_control`
- `laboratorios_realizados`
- `etmis_personas`

## Paso 5 - Probar sincronizacion

Casos minimos:

- Bootstrap full en dispositivo limpio.
- Exportacion de una persona nueva.
- Reenvio del mismo payload para confirmar idempotencia.
- Edicion posterior con `last_modified` mayor.
- Baja logica con `sql_deleted=1`.
- Relacion persona/control/antecedente.

## Advertencias

- No volver a ejecutar scripts sobre produccion sin backup.
- No mezclar bases con UUID generados por distintas reglas si ya hubo sync entre dispositivos.
- Si se encuentra una base parcialmente migrada, revisar duplicados antes de activar sync.
- Si aparece un script externo en Drive, incorporarlo a `src/main/resources/sql/` y documentarlo aqui.

