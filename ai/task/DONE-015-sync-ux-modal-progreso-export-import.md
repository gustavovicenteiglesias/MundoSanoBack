Estado

DONE

Cierre

- 2026-05-29: se cierra administrativamente durante reconstruccion de estado. El componente `SyncProgressModal` y su uso en `Main.tsx` existen en el proyecto; se documenta como parte de la experiencia de sincronizacion.

Objetivo

Mejorar la experiencia visual y operativa del flujo de exportación/importación en el frontend Ionic/React, reemplazando los alert(...) por un modal moderno de sincronización que muestre progreso, tabla actual procesada, resumen final y estados claros para bajar la ansiedad del usuario mientras espera.

Motivación

Hoy el flujo funciona, pero visualmente es pobre:

usa alert(...) para informar resultados
usa un IonLoading genérico sin detalle
no muestra qué tabla se está procesando
no muestra barra de progreso ni estado intermedio
no da sensación de avance real

Esto genera incertidumbre y ansiedad operativa en personas que esperan la sincronización y no saben si el proceso sigue, terminó o falló.

Alcance

La tarea es solo Frontend por ahora.

Incluye
reemplazar los alert(...) del flujo de exportación/importación por UI moderna
crear un modal reutilizable de sincronización
mostrar tabla actual procesada
mostrar barra de progreso general
mostrar contador tipo Tabla X de Y
mostrar resumen final con OK / rechazados / conflictos
permitir cerrar el modal o ir al historial cuando exista
No incluye
backend de auditoría
persistencia de logs
pantalla completa de historial (eso va en otra tarea)
Restricciones
no romper el flujo actual de exportación/importación
mantener cambios mínimos y modulares
no reescribir Main.tsx completo si no hace falta
centralizar el feedback visual en un componente reutilizable
mantener estilo compatible con Ionic mobile-first
Archivos probables a tocar
mundosano/src/pages/Main.tsx
mundosano/src/components/SyncProgressModal.tsx (nuevo)
mundosano/src/components/ (si se separan subcomponentes auxiliares)
estilos asociados si hicieran falta
Comportamiento esperado
Durante exportación/importación

El usuario debe ver un modal con:

título: Sincronizando datos
subtítulo: No cierres la aplicación
barra de progreso
tabla actual en proceso
contador de tablas, por ejemplo: Tabla 3 de 9
cantidad de registros procesados si se puede estimar
estado textual: Preparando, Enviando, Importando, Finalizando
Al terminar

El modal debe mostrar un resumen visual con:

total procesado
total OK
rechazados
conflictos
mensaje final amigable
botón Cerrar
botón Ver detalle o Ir a historial si aplica
En caso de error

El modal debe mostrar:

estado Error
mensaje entendible
acción para cerrar
opcionalmente reintentar más adelante
Criterios de aceptación


Estrategia sugerida
Fase 1
Identificar en Main.tsx los puntos donde hoy se usan alert(...).
Crear SyncProgressModal.tsx con props mínimas.
Conectar estados básicos (loading, status, message, currentTable, progress).
Fase 2
Reemplazar alerts por apertura/actualización del modal.
Mostrar resumen final con la respuesta del backend.
Ajustar textos y colores para estados OK, PARCIAL, ERROR.
