package edu.unsada.apimundosano.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Id;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

@Service
public class UniversalUpsertService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Para entidades con PK simple numérica.
     * Ejemplo: PersonasEntity, ControlesEntity, UbicacionesEntity,
     * AntecedentesEntity, ControlEmbarazoEntity.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public <T> T upsertSimplePkByUuid(
            String uuid,
            Function<String, Optional<T>> findByUuid,
            Function<T, T> mergerFn,
            T newEntity,
            Class<T> entityClass,
            String idFieldName,
            Number incomingId) {
        Optional<T> existingOpt = findByUuid.apply(uuid);

        if (existingOpt.isPresent()) {
            T merged = mergerFn.apply(existingOpt.get());
            return entityManager.merge(merged);
        }

        validateSimplePk(entityClass, idFieldName);

        Number idToUse = (incomingId != null) ? incomingId : nextId(entityClass, idFieldName);
        assignNumericId(newEntity, entityClass, idFieldName, idToUse);

        entityManager.persist(newEntity);
        return newEntity;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public <T> T upsertSimplePkByUuid(
            String uuid,
            Function<String, Optional<T>> findByUuid,
            Function<T, T> mergerFn,
            T newEntity,
            Class<T> entityClass,
            String idFieldName) {
        return upsertSimplePkByUuid(uuid, findByUuid, mergerFn, newEntity, entityClass, idFieldName, null);
    }

    /**
     * Para entidades con PK compuesta.
     * Ejemplo: InmunizacionesControlEntity, EtmisPersonasEntity,
     * LaboratoriosRealizadosEntity,
     * AntecedentesAppsEntity, AntecedentesMacsEntity, EmbarazosEntity,
     * EmbarazosPatologiasEntity.
     *
     * No calcula MAX(id) porque la PK ya viene armada en la propia entidad.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public <T> T upsertCompositePkByUuid(
            String uuid,
            Function<String, Optional<T>> findByUuid,
            Function<T, T> mergerFn,
            T newEntity,
            Class<T> entityClass) {
        Optional<T> existingOpt = findByUuid.apply(uuid);

        if (existingOpt.isPresent()) {
            T merged = mergerFn.apply(existingOpt.get());
            return entityManager.merge(merged);
        }

        validateCompositePk(entityClass);
        entityManager.persist(newEntity);
        return newEntity;
    }

    private <T> Number nextId(Class<T> entityClass, String idFieldName) {
        Number maxId = (Number) entityManager.createQuery(
                "SELECT COALESCE(MAX(e." + idFieldName + "), 999999) FROM " + entityClass.getSimpleName() + " e")
                .getSingleResult();

        return maxId.longValue() + 1;
    }

    private <T> void assignNumericId(T entity, Class<T> entityClass, String idFieldName, Number value) {
        try {
            Field field = findField(entityClass, idFieldName);
            field.setAccessible(true);

            Class<?> type = field.getType();

            if (type == int.class || type == Integer.class) {
                field.set(entity, value.intValue());
            } else if (type == long.class || type == Long.class) {
                field.set(entity, value.longValue());
            } else if (type == short.class || type == Short.class) {
                field.set(entity, value.shortValue());
            } else {
                throw new RuntimeException(
                        "Tipo de id no soportado para " + entityClass.getSimpleName() + "." + idFieldName);
            }
        } catch (Exception e) {
            throw new RuntimeException("No se pudo asignar id a " + entityClass.getSimpleName(), e);
        }
    }

    private <T> void validateSimplePk(Class<T> entityClass, String idFieldName) {
        List<Field> idFields = findIdFields(entityClass);
        if (idFields.size() != 1) {
            throw new RuntimeException("La entidad " + entityClass.getSimpleName()
                    + " no tiene PK simple. Use upsertCompositePkByUuid().");
        }

        Field onlyId = idFields.get(0);
        if (!onlyId.getName().equals(idFieldName)) {
            throw new RuntimeException(
                    "El campo PK esperado para " + entityClass.getSimpleName() + " era '" + onlyId.getName()
                            + "' y se recibió '" + idFieldName + "'");
        }
    }

    private <T> void validateCompositePk(Class<T> entityClass) {
        List<Field> idFields = findIdFields(entityClass);
        if (idFields.size() <= 1) {
            throw new RuntimeException("La entidad " + entityClass.getSimpleName()
                    + " no tiene PK compuesta. Use upsertSimplePkByUuid().");
        }
    }

    private List<Field> findIdFields(Class<?> entityClass) {
        List<Field> result = new ArrayList<>();
        Class<?> current = entityClass;

        while (current != null) {
            for (Field f : current.getDeclaredFields()) {
                if (f.isAnnotationPresent(Id.class)) {
                    result.add(f);
                }
            }
            current = current.getSuperclass();
        }

        return result;
    }

    private Field findField(Class<?> type, String fieldName) throws NoSuchFieldException {
        Class<?> current = type;
        while (current != null) {
            try {
                return current.getDeclaredField(fieldName);
            } catch (NoSuchFieldException ignored) {
                current = current.getSuperclass();
            }
        }
        throw new NoSuchFieldException(fieldName);
    }
}

/*
 * ========================================
 * USO EN EL CONTROLLER
 * ========================================
 * 
 * 1) PK SIMPLE
 * -----------
 * PersonasEntity personaPersistida =
 * universalUpsertService.upsertSimplePkByUuid(
 * uuid,
 * personasRepo::findByUuid,
 * existente -> copyPersona(existente, nuevaPersona),
 * nuevaPersona,
 * PersonasEntity.class,
 * "idPersona",
 * idPersonaMovil
 * );
 * 
 * 2) PK COMPUESTA
 * ---------------
 * universalUpsertService.upsertCompositePkByUuid(
 * uuid,
 * inmunizacionesControlRepo::findByUuid,
 * existente -> copyInmunizacion(existente, nuevaInmunizacion),
 * nuevaInmunizacion,
 * InmunizacionesControlEntity.class
 * );
 * 
 * ========================================
 * TABLAS QUE VAN POR PK SIMPLE
 * ========================================
 * - PersonasEntity
 * - ControlesEntity
 * - UbicacionesEntity
 * - AntecedentesEntity
 * - ControlEmbarazoEntity
 * 
 * ========================================
 * TABLAS QUE VAN POR PK COMPUESTA
 * ========================================
 * - InmunizacionesControlEntity
 * - EtmisPersonasEntity
 * - LaboratoriosRealizadosEntity
 * - AntecedentesAppsEntity
 * - AntecedentesMacsEntity
 * - EmbarazosEntity
 * - EmbarazosPatologiasEntity
 */
