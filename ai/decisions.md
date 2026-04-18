# DECISIONES DE ARQUITECTURA Y DISEÑO - MUNDO SANO

## UI y Estilos (Frontend)
1. **Framework:** Ionic v6 con React.
2. **Estilos:** Uso de **Styled Components** para componentes personalizados y el sistema de temas nativo de Ionic.
3. **Responsividad:** Enfoque móvil-primero (Mobile-first) compatible con Capacitor para despliegue nativo.

## Lógica y Convenciones (Back & Front)
1. **Estado Frontend:** Gestión centralizada mediante `GlobalState.tsx` (React Context/Custom State).
2. **Serialización Backend:** Uso intensivo de **Gson** para el mapeo flexible de objetos JSON.
3. **Persistencia:** JPA/Hibernate sobre MySQL 8.
4. **Comunicación:** Axios para peticiones HTTP desde el frontend al backend de Spring Boot.