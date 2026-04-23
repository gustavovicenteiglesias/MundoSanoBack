Pantalla correcta: `mundosano/src/pages/DetallePaciente.tsx`.

Problema actual:
- `DetallePaciente.tsx` carga todos los controles de la paciente ordenados por fecha desc
- luego renderiza una card por cada control
- cuando `id_estado === 2` (PUÉRPERA), muestra una card simple por cada control puerperal histórico
- esto genera una vista repetitiva y poco útil

Objetivo funcional:
- si la paciente está EMBARAZADA, mantener la vista completa actual del último control
- si la paciente está PUÉRPERA, mostrar solo el último control puerperal
- agregar un botón o icono `+` para desplegar los controles históricos
- preparar la lógica para que el historial pueda interpretarse como período entre gestación y puerperio usando `id_persona` e `id_control`

Restricciones:
- cambios mínimos y seguros
- no reescribir el archivo completo sin necesidad
- mantener la carga de datos actual en una primera etapa
- tocar primero solo el render
- no romper navegación ni edición de controles

Trabajá en este orden:
1. revisar `DetallePaciente.tsx`
2. detectar el último control de la persona
3. si el último control es puerpera, renderizar solo ese control en la vista principal
4. agregar estado expandido/colapsado para mostrar historial con `+`
5. dejar preparado el código para una futura agrupación por período obstétrico

Antes de codificar, respondé con:
1. Diagnóstico
2. Faltante
3. Impacto
4. Plan

Esperá confirmación antes de escribir código.