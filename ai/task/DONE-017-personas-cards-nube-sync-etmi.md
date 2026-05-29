Estado

DONE

Cierre

- 2026-05-29: confirmado en `mundosano/src/pages/Personas.tsx`. La pantalla usa cards/items, nubes de sincronizacion, leyenda visual y segmentacion todas/embarazadas/puerperas.

Objetivo

Rediseñar la pantalla /personas para reemplazar la tabla actual por una vista moderna tipo items/cards orientada a dispositivos móviles, manteniendo el resaltado visual de ETMI/patológicos y agregando un icono de nube que indique el estado de sincronización de cada persona.

Motivación

La vista actual usa una tabla (DataTable) que funciona, pero no está optimizada para lectura rápida en dispositivos móviles.

Además, hace falta una señal visual inmediata para distinguir:

riesgo clínico o prioridad (por ejemplo ETMI)
estado de sincronización con base central

La combinación de cards modernas + nube de sync mejorará mucho la claridad operativa.

Alcance

La tarea es solo Frontend.

Incluye
reemplazar la tabla de /personas por items/cards
mantener la lógica actual de resaltado en rojo para ETMI / patológico
agregar icono de nube a la derecha de cada item
usar color de nube para indicar sync local vs central
mantener navegación al detalle al tocar un item
conservar filtros existentes y mejorarlos si conviene
No incluye
implementación completa del sistema de auditoría front/back
backend nuevo para nube
historial de sincronización completo
Comportamiento esperado
Vista general

Cada persona debe renderizarse como un item/card con:

nombre y apellido destacados
id_persona y documento visibles
datos secundarios útiles (área, paraje, país o estado)
badges/chips de estado si aplica
icono de nube a la derecha
chevron o affordance visual de navegación
Resaltado ETMI/patológico

Si la persona tiene ETMI o patología relevante, el card debe resaltarse visualmente.

Opciones aceptables:

fondo rojo suave
borde izquierdo rojo fuerte
badge ETMI
combinación de las anteriores

Debe seguir siendo tan visible como hoy o mejor.

Nube de sincronización

Color sugerido:

verde: el dato ya existe en base central / último sync OK
ámbar: dato pendiente de exportar o con cambios locales no sincronizados
rojo: último intento rechazado o en conflicto
gris: estado desconocido o nunca sincronizado
Fuente del estado de nube

Inicialmente, el estado debe derivarse del estado local de sincronización y no de una consulta por fila al backend.

La estrategia recomendada es construir un syncStatus por id_persona usando logs locales o un estado local resumido.

Restricciones
no romper navegación actual al detalle de paciente
mantener filtros de búsqueda existentes
mantener segmentación todas / embarazadas / puerperas
optimizar para mobile-first
evitar consultas caras por cada fila
no reescribir más de lo necesario
Archivos probables a tocar
mundosano/src/pages/Personas.tsx
mundosano/src/components/ (nuevo componente si se separa un card de persona)
mundosano/src/models/ o helpers si se agrega cálculo de syncStatus
eventual repositorio local de sync si ya existe o si se conecta con logs locales
Criterios de aceptación


Estrategia sugerida
Fase 1
Identificar la lógica actual de filtros y resaltado dentro de Personas.tsx.
Mantener esa lógica y reemplazar únicamente el render de DataTable.
Crear card/item reutilizable para persona.
Fase 2
Agregar helper de syncStatus por persona.
Mostrar nube con color según estado.
Ajustar espaciado, badges y jerarquía visual.
