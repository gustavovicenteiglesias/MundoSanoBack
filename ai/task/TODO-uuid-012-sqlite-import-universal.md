# Tarea 12: Importación Universal en /sqlite

## Objetivo
Dejar el endpoint `/sqlite` listo para recibir cualquier tabla y fila, con lógica robusta y universal:
- Upsert por UUID (buscar por UUID, actualizar si existe, insertar si no existe)
- Asignar id = max+1 para nuevos registros (sin colisiones)
- Persistir siempre el UUID
- Resolver relaciones por UUID (no solo por id)
- Tolerancia a columnas faltantes
- Logs claros de errores y rechazos

## Criterios de Aceptación
- [ ] El endpoint `/sqlite` acepta cualquier tabla definida en el modelo y realiza upsert seguro por UUID.
- [ ] Si el registro no existe, asigna id = max+1 (sin colisiones con legacy).
- [ ] El campo UUID siempre se persiste y es único.
- [ ] Las relaciones FK se resuelven por UUID si es posible.
- [ ] El sistema tolera columnas faltantes y lo registra en logs.
- [ ] Los logs de importación son claros y detallados.

## Notas
- Centralizar la lógica de upsert en un utilitario o servicio.
- Mantener cambios mínimos y modulares según el workflow.
- Actualizar este archivo marcando los criterios a medida que se avanza.
