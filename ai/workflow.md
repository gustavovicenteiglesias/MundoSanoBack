# WORKFLOW PARA TRABAJAR CON IA - MUNDO SANO

## Filosofía de Trabajo
- Priorizar cambios mínimos, modulares y seguros.
- No reescribir archivos completos ni refactorizar sin justificación explícita.
- **Doble Contexto:** Identificar siempre si el cambio afecta al Backend (`src/`) o al Frontend (`/mundosano`).

## Protocolo de Propuesta (Obligatorio)
Antes de generar o modificar código, debes responder estrictamente con este formato:
1. **Diagnóstico:** Breve estado actual (indicando si es Back, Front o ambos).
2. **Faltante:** Qué falta implementar para cumplir la tarea.
3. **Impacto:** Lista exacta de archivos a tocar.
4. **Plan:** Cambios mínimos propuestos.
Espera la confirmación del usuario para codificar.

## Regla de Salida
Al proponer o inyectar código:
- Mostrar solo los bloques o funciones modificadas, no el archivo entero.
- Al terminar un hito, si es relevante, actualiza `ai/context.md` o genera un checkpoint en `ai/tasks/done/`.

## Gestión Autónoma de Tareas (Carpeta ai/tasks/)
1. **Selección:** Si no se te asigna una tarea específica, busca el primer archivo `TODO-[nombre].md` en `ai/tasks/`.
2. **Inicio:** Al comenzar, renombra el archivo a `DOING-[nombre].md`.
3. **Ejecución:** Marca con una `[x]` los Criterios de Aceptación dentro del archivo a medida que avanzas.
4. **Bloqueos:** Si dependes del usuario o un error externo, renombra a `BLOCKED-[nombre].md` y documenta el motivo.
5. **Cierre:** Al cumplir todos los criterios, renombra el archivo a `DONE-[nombre].md`.