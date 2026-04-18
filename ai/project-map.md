# MAPA DEL PROYECTO - MUNDO SANO

## Directorios Principales
MundoSanoBack/ (Raíz del proyecto)
 ├─ src/main/java/edu/unsada/apimundosano/ (CORE Backend - Spring Boot)
 │   ├─ Controller/ (Endpoints de la API)
 │   ├─ models/ (Entidades JPA)
 │   ├─ repositorio/ (Interfaces de persistencia)
 │   └─ service/ (Lógica de negocio)
 ├─ mundosano/ (CORE Frontend - Ionic/React)
 │   ├─ src/pages/ (Vistas de la aplicación)
 │   ├─ src/components/ (Componentes reutilizables)
 │   └─ src/service/ (Servicios de API/Axios)
 └─ ai/ (Configuración de Agentes IA y seguimiento de tareas)

## Archivos y Componentes Clave
- `pom.xml`: Configuración de dependencias Maven (Spring Boot).
- `AGENTS.md`: Protocolo de entrada para IA (Boot Sequence).
- `mundosano/package.json`: Definición del entorno frontend.
- `mundosano/src/App.tsx`: Punto de entrada y enrutamiento del frontend.

## Restricciones de Navegación
- Mantener la separación estricta entre la lógica de backend y la UI de frontend.
- Toda nueva tarea debe registrarse en la carpeta `ai/tasks/` antes de iniciar.