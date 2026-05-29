# Arquitectura

## Backend

Ubicacion: `src/main/java/edu/unsada/apimundosano`

Capas principales:

- `Controller/`: endpoints REST. El controlador central de sync es `ExportControler.java`.
- `models/`: entidades JPA.
- `repositorio/`: repositorios Spring Data.
- `service/`: exportadores, migraciones, upsert universal y auditoria.
- `utilidades/`: DTOs para contrato SQLite/JSON.

Stack:

- Java 17.
- Spring Boot 3.0.6.
- Spring Web.
- Spring Data JPA.
- Hibernate.
- MySQL connector.
- Gson/Jackson para serializacion.

## Frontend

Ubicacion: `mundosano/`

Capas principales:

- `src/pages/`: pantallas Ionic/React.
- `src/components/`: componentes reutilizables.
- `src/repository/`: repositorios SQLite locales.
- `src/data/`: carga/bootstrap de base SQLite.
- `src/utils/`: helpers de sincronizacion y constantes.
- `src/models/`: interfaces y modelos del front.

Stack:

- Ionic React.
- Capacitor.
- Capacitor Community SQLite.
- Axios.
- Moment.
- Styled Components.

## Base de datos

Hay dos bases en juego:

- SQLite local en el dispositivo.
- MySQL central en backend.

El contrato de intercambio entre ambas usa formato compatible con Capacitor SQLite:

- `database`
- `version`
- `encrypted`
- `mode`
- `tables`

Para exportacion desde el cliente, el payload puede incluir ademas `syncMeta`, consumido por el backend para auditoria.

