# Operacion y pruebas

## Backend

Compilar:

```powershell
.\mvnw.cmd -q -DskipTests compile
```

Ejecutar segun configuracion local del proyecto o IDE.

Endpoints clave para probar:

```http
GET  /api/data/json3
GET  /api/data/json3/partial?since=0
POST /api/sqlite
GET  /api/sync/logs/batches
POST /api/admin/migrate-uuids
```

## Frontend

Carpeta:

```powershell
cd mundosano
```

Instalar dependencias si hace falta:

```powershell
npm install
```

Levantar:

```powershell
npm start
```

Build:

```powershell
npm run build
```

## Pruebas manuales minimas de sincronizacion

1. Instalar o limpiar base local.
2. Ejecutar bootstrap full.
3. Crear persona/control offline.
4. Confirmar que quedan pendientes.
5. Exportar.
6. Verificar respuesta `success`.
7. Reenviar el mismo lote o mismo cambio para confirmar idempotencia.
8. Revisar logs locales y server.
9. Verificar que `/personas` actualiza nube/estado.

## Pruebas de migracion UUID

1. Restaurar backup en base sandbox.
2. Ejecutar `add_uuid_column.sql`.
3. Levantar backend contra sandbox.
4. Ejecutar `POST /api/admin/migrate-uuids`.
5. Buscar nulos y duplicados por tabla.
6. Probar bootstrap y export parcial.

## Riesgos conocidos

- Relojes de dispositivos desincronizados: mitigado con hora oficial del servidor.
- Filas sin UUID: se filtran o rechazan.
- Relaciones historicas por ID local: mitigadas con mapas UUID en import.
- Publicacion de credenciales: revisar `application.properties`.

