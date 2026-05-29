# Frontend UI/UX

## Personas

Pantalla principal: `mundosano/src/pages/Personas.tsx`

Estado confirmado:

- La vista usa cards/items para pacientes.
- Hay segmentacion por estado:
  - todas
  - embarazadas
  - puerperas
- Hay alternancia de pendientes/todos.
- Se mantiene busqueda por texto.
- Se muestra una nube por persona para estado de sincronizacion.

## Estados de nube

La pantalla usa iconos de Ionic:

- `cloudDoneOutline`: sincronizado.
- `cloudUploadOutline`: pendiente.
- `cloudOfflineOutline`: conflicto/rechazo.
- `cloudOutline`: desconocido.

La leyenda visible muestra:

- OK
- Pendiente
- Conflicto
- Desconocido

Los estilos estan en:

- `mundosano/src/pages/Personas.css`

## Detalle de paciente puerpera

Pantalla: `mundosano/src/pages/DetallePaciente.tsx`

Estado confirmado:

- Si el ultimo control indica paciente puerpera, se evita una lista repetitiva de todos los controles puerperales como vista principal.
- Hay mensaje operativo para iniciar nuevo embarazo cuando corresponde.
- La logica deja preparada una futura agrupacion por periodo obstetrico.

## Modal de progreso de sincronizacion

Componente:

- `mundosano/src/components/SyncProgressModal.tsx`

Uso principal:

- `mundosano/src/pages/Main.tsx`

Se usa para mostrar estados de exportacion/importacion:

- preparando
- descargando
- importando
- finalizando
- completado
- error

## Pendiente posible

No se encontro en este repo el script o automatismo de cambio de estado por tiempo. Si se refiere al pase automatico entre embarazada/puerpera u otro estado obstetrico, documentarlo cuando aparezca.

