package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.BaseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.metamodel.EntityType;
import jakarta.persistence.metamodel.Metamodel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class MigrationService {

    @PersistenceContext
    private EntityManager entityManager;

    private final PlatformTransactionManager transactionManager;

    public MigrationService(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    private static final String NAMESPACE = "MundoSano:";

    public Map<String, Integer> migrateToDeterministicUuids() {
        Map<String, Integer> stats = new LinkedHashMap<>();
        Metamodel metamodel = entityManager.getMetamodel();
        Set<EntityType<?>> entities = metamodel.getEntities();
        int pageSize = 200; // Bloque más chico para que el Modo Cirujano sea más rápido

        for (EntityType<?> entityType : entities) {
            Class<?> javaType = entityType.getJavaType();
            if (BaseEntity.class.isAssignableFrom(javaType)) {
                String entityName = javaType.getSimpleName();
                System.out.println("\n--------------------------------------------------");
                System.out.println("[MIGRACIÓN] Iniciando tabla: " + entityName);
                System.out.println("--------------------------------------------------");

                String idAttributeName = "";
                
                // Intentamos encontrar el atributo ID dinámicamente
                try {
                    idAttributeName = entityType.getSingularAttributes().stream()
                            .filter(a -> a.isId())
                            .findFirst()
                            .map(a -> a.getName())
                            .orElse("");
                } catch (Exception e) {
                    System.err.println("[ERROR] No se pudo detectar ID para " + entityName);
                }

                int totalUpdatedAcrossPages = 0;
                int offset = 0;
                boolean hasMore = true;

                while (hasMore) {
                    final int currentOffset = offset;
                    final String finalIdAttr = idAttributeName;
                    
                    TransactionTemplate transactionTemplate = new TransactionTemplate(transactionManager);
                    try {
                        Integer updatedInPage = transactionTemplate.execute(status -> {
                            int count = 0;
                            String queryStr = "SELECT e FROM " + entityName + " e";
                            if (!finalIdAttr.isEmpty()) {
                                queryStr += " ORDER BY e." + finalIdAttr + " ASC";
                            }

                            List<?> records = entityManager.createQuery(queryStr)
                                    .setFirstResult(currentOffset)
                                    .setMaxResults(pageSize)
                                    .getResultList();

                            if (records.isEmpty()) return -1;

                            for (Object record : records) {
                                BaseEntity entity = (BaseEntity) record;
                                Object id = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
                                if (id != null) {
                                    String nameForHash = NAMESPACE + entityName + ":" + id.toString();
                                    String deterministicUuid = UUID.nameUUIDFromBytes(nameForHash.getBytes(StandardCharsets.UTF_8)).toString();
                                    if (!deterministicUuid.equals(entity.getUuid())) {
                                        entity.setUuid(deterministicUuid);
                                        entityManager.merge(entity);
                                        count++;
                                    }
                                }
                            }
                            entityManager.flush();
                            entityManager.clear();
                            return count;
                        });

                        if (updatedInPage == null || updatedInPage == -1) {
                            hasMore = false;
                        } else {
                            totalUpdatedAcrossPages += updatedInPage;
                            offset += pageSize;
                            System.out.println("[PROGRESO] " + entityName + ": " + offset + " registros procesados...");
                        }
                    } catch (Exception e) {
                        System.err.println("⚠️ [WARN] Bloque de " + entityName + " falló en offset " + currentOffset + ". Reintentando 1 a 1...");
                        // MODO CIRUJANO: Reprocesamos el mismo bloque registro por registro
                        int recoveredInBlock = processRecordsOneByOne(entityName, finalIdAttr, currentOffset, pageSize);
                        totalUpdatedAcrossPages += recoveredInBlock;
                        offset += pageSize;
                    }
                }
                System.out.println("[OK] Tabla " + entityName + " finalizada. Total migrados: " + totalUpdatedAcrossPages);
                stats.put(entityName, totalUpdatedAcrossPages);
            }
        }
        return stats;
    }

    private int processRecordsOneByOne(String entityName, String idAttr, int offset, int pageSize) {
        int recoveredCount = 0;
        String queryStr = "SELECT e FROM " + entityName + " e";
        if (!idAttr.isEmpty()) {
            queryStr += " ORDER BY e." + idAttr + " ASC";
        }

        List<?> records;
        try {
            records = entityManager.createQuery(queryStr)
                    .setFirstResult(offset)
                    .setMaxResults(pageSize)
                    .getResultList();
        } catch (Exception e) {
            System.err.println("No se pudo recuperar bloque para modo cirujano: " + e.getMessage());
            return 0;
        }

        for (Object record : records) {
            BaseEntity entity = (BaseEntity) record;
            Object idForLogging = entityManager.getEntityManagerFactory().getPersistenceUnitUtil().getIdentifier(entity);
            
            TransactionTemplate individualTx = new TransactionTemplate(transactionManager);
            try {
                // Cálculo del UUID esperado
                String nameForHash = NAMESPACE + entityName + ":" + idForLogging.toString();
                String deterministicUuid = UUID.nameUUIDFromBytes(nameForHash.getBytes(StandardCharsets.UTF_8)).toString();

                try {
                    individualTx.executeWithoutResult(status -> {
                        BaseEntity managedEntity = entityManager.merge(entity);
                        if (!deterministicUuid.equals(managedEntity.getUuid())) {
                            managedEntity.setUuid(deterministicUuid);
                        }
                        entityManager.flush();
                    });
                } catch (Exception txError) {
                    // Si el error es por duplicado (SQL State 23000, Error 1062)
                    if (txError.getMessage().contains("1062") || txError.getMessage().contains("ConstraintViolationException")) {
                        System.out.println("   [REPARANDO] Colisión de UUID detectada para ID " + idForLogging + ". Liberando UUID...");
                        
                        // Paso extra: Ponemos en NULL al registro que actualmente "ocupa" ese UUID
                        TransactionTemplate repairTx = new TransactionTemplate(transactionManager);
                        repairTx.executeWithoutResult(status -> {
                            entityManager.createQuery("UPDATE " + entityName + " e SET e.uuid = NULL WHERE e.uuid = :u")
                                    .setParameter("u", deterministicUuid)
                                    .executeUpdate();
                            entityManager.flush();
                        });

                        // Reintento final para este registro
                        individualTx.executeWithoutResult(status -> {
                            BaseEntity managedEntity = entityManager.merge(entity);
                            managedEntity.setUuid(deterministicUuid);
                            entityManager.flush();
                        });
                    } else {
                        throw txError; // Si es otro error, lo lanzamos al catch externo
                    }
                }
                recoveredCount++;
            } catch (Exception e) {
                System.err.println("❌ Registro individual fallido en " + entityName + " (ID: " + idForLogging + "): " + e.getMessage());
            }
        }
        entityManager.clear();
        return recoveredCount;
    }
}
