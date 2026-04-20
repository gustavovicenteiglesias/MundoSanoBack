package edu.unsada.apimundosano.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import java.util.Optional;
import java.util.function.Function;

@Service
public class UniversalUpsertService {
    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Upsert genérico por UUID. Si existe, actualiza con mergerFn. Si no, asigna id=max+1 y persiste.
     * @param uuid UUID del registro
     * @param findByUuid función que busca por UUID
     * @param mergerFn función que actualiza el registro existente
     * @param newEntity entidad nueva a persistir si no existe
     * @param entityClass clase de la entidad (para buscar max id)
     * @param <T> tipo de entidad
     * @param <ID> tipo de id
     * @return entidad persistida
     */
    public <T, ID extends Number> T upsertByUuid(
            String uuid,
            Function<String, Optional<T>> findByUuid,
            Function<T, T> mergerFn,
            T newEntity,
            Class<T> entityClass,
            String idFieldName
    ) {
        Optional<T> existingOpt = findByUuid.apply(uuid);
        if (existingOpt.isPresent()) {
            T merged = mergerFn.apply(existingOpt.get());
            return entityManager.merge(merged);
        } else {
            // Asignar id = max+1
            Number maxId = (Number) entityManager.createQuery(
                    "SELECT COALESCE(MAX(e." + idFieldName + "), 999999) FROM " + entityClass.getSimpleName() + " e"
            ).getSingleResult();
            try {
                entityClass.getMethod("set" + capitalize(idFieldName), maxId.getClass()).invoke(newEntity, maxId.longValue() + 1);
            } catch (Exception e) {
                throw new RuntimeException("No se pudo asignar id a " + entityClass.getSimpleName(), e);
            }
            return entityManager.merge(newEntity);
        }
    }

    private String capitalize(String s) {
        if (s == null || s.isEmpty()) return s;
        return s.substring(0, 1).toUpperCase() + s.substring(1);
    }
}
