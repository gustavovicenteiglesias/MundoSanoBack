package edu.unsada.apimundosano.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.unsada.apimundosano.models.SyncBatchLogServerEntity;
import edu.unsada.apimundosano.models.SyncItemLogServerEntity;
import edu.unsada.apimundosano.repositorio.SyncBatchLogServerRepo;
import edu.unsada.apimundosano.repositorio.SyncItemLogServerRepo;
import edu.unsada.apimundosano.utilidades.JsonSyncMeta;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SyncAuditService {

    private static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    private static final String STATUS_OK = "OK";
    private static final String STATUS_PARTIAL = "PARTIAL";
    private static final String STATUS_ERROR = "ERROR";

    @Autowired
    private SyncBatchLogServerRepo syncBatchLogServerRepo;
    @Autowired
    private SyncItemLogServerRepo syncItemLogServerRepo;

    private final ObjectMapper mapper = new ObjectMapper();

    @Transactional
    public String registerBatchStart(String incomingSyncBatchId, JsonSyncMeta meta) {
        String syncBatchId = normalize(incomingSyncBatchId);
        if (syncBatchId == null) {
            syncBatchId = "sync-" + UUID.randomUUID();
        }

        SyncBatchLogServerEntity batch = syncBatchLogServerRepo
                .findBySyncBatchId(syncBatchId)
                .orElseGet(SyncBatchLogServerEntity::new);

        batch.setSyncBatchId(syncBatchId);
        batch.setUsuario(meta != null ? normalize(meta.getUsuario()) : null);
        batch.setDispositivo(meta != null ? normalize(meta.getDispositivo()) : null);
        batch.setVersionApp(meta != null ? normalize(meta.getVersionApp()) : null);
        batch.setFechaInicioCliente(meta != null ? normalize(meta.getFechaInicio()) : null);
        batch.setFechaInicio(LocalDateTime.now());
        batch.setFechaFin(null);
        batch.setEstado(STATUS_IN_PROGRESS);
        batch.setMensaje(null);
        batch.setTotalItems(0);
        batch.setOkCount(0);
        batch.setRejectedCount(0);
        batch.setConflictCount(0);
        batch.setSqlDeleted(0);
        syncBatchLogServerRepo.save(batch);
        return syncBatchId;
    }

    @Transactional
    public void registerBatchResult(
            String syncBatchId,
            boolean success,
            int conflictosLastModified,
            List<Map<String, Object>> logs,
            String errorMessage) {
        if (syncBatchId == null || syncBatchId.isBlank()) {
            return;
        }

        SyncBatchLogServerEntity batch = syncBatchLogServerRepo
                .findBySyncBatchId(syncBatchId)
                .orElseGet(SyncBatchLogServerEntity::new);

        batch.setSyncBatchId(syncBatchId);
        batch.setFechaInicio(batch.getFechaInicio() != null ? batch.getFechaInicio() : LocalDateTime.now());
        batch.setFechaFin(LocalDateTime.now());
        batch.setConflictCount(Math.max(conflictosLastModified, 0));

        int rejected = logs != null ? logs.size() : 0;
        int totalItems = rejected + Math.max(conflictosLastModified, 0);
        int okCount = Math.max(0, totalItems - rejected - Math.max(conflictosLastModified, 0));

        batch.setRejectedCount(rejected);
        batch.setTotalItems(totalItems);
        batch.setOkCount(okCount);
        batch.setMensaje(normalize(errorMessage));

        if (!success || errorMessage != null) {
            batch.setEstado(STATUS_ERROR);
        } else if (rejected > 0 || conflictosLastModified > 0) {
            batch.setEstado(STATUS_PARTIAL);
        } else {
            batch.setEstado(STATUS_OK);
        }

        syncBatchLogServerRepo.save(batch);

        syncItemLogServerRepo.deleteBySyncBatchId(syncBatchId);
        if (logs == null || logs.isEmpty()) {
            return;
        }

        List<SyncItemLogServerEntity> items = new ArrayList<>();
        for (Map<String, Object> log : logs) {
            if (log == null) {
                continue;
            }
            SyncItemLogServerEntity item = new SyncItemLogServerEntity();
            item.setSyncBatchId(syncBatchId);
            item.setTabla(normalize(asString(log.get("tabla"))) != null ? normalize(asString(log.get("tabla"))) : "unknown");
            item.setSourceUuid(extractUuid(log.get("payload")));
            item.setIdPersona(asInt(log.get("idPersona")));
            item.setIdControl(asInt(log.get("idControl")));
            item.setIdReferencia(asInt(log.get("idReferencia")));
            item.setEstado("RECHAZADO");
            item.setMotivo(normalize(asString(log.get("motivo"))));
            item.setPayloadJson(toJson(log.get("payload")));
            item.setCreatedAt(LocalDateTime.now());
            item.setSqlDeleted(0);
            items.add(item);
        }
        syncItemLogServerRepo.saveAll(items);
    }

    @Transactional(readOnly = true)
    public List<SyncBatchLogServerEntity> getLatestBatches() {
        return syncBatchLogServerRepo.findTop200ByOrderByFechaInicioDesc();
    }

    @Transactional(readOnly = true)
    public Optional<SyncBatchLogServerEntity> findBatch(String syncBatchId) {
        return syncBatchLogServerRepo.findBySyncBatchId(syncBatchId);
    }

    @Transactional(readOnly = true)
    public List<SyncItemLogServerEntity> findItemsByBatch(String syncBatchId) {
        return syncItemLogServerRepo.findBySyncBatchIdOrderByCreatedAtAsc(syncBatchId);
    }

    private String toJson(Object value) {
        if (value == null) {
            return null;
        }
        try {
            return mapper.writeValueAsString(value);
        } catch (Exception e) {
            return String.valueOf(value);
        }
    }

    private String extractUuid(Object payload) {
        if (!(payload instanceof List<?> list) || list.isEmpty()) {
            return null;
        }
        for (Object cell : list) {
            String value = normalize(asString(cell));
            if (value != null && value.length() >= 32 && value.length() <= 80 && value.contains("-")) {
                return value;
            }
        }
        return null;
    }

    private Integer asInt(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer i) {
            return i;
        }
        if (value instanceof Long l) {
            return l.intValue();
        }
        if (value instanceof Number n) {
            return n.intValue();
        }
        String text = asString(value);
        if (text == null) {
            return null;
        }
        try {
            return Integer.parseInt(text.trim());
        } catch (Exception e) {
            return null;
        }
    }

    private String asString(Object value) {
        return value != null ? String.valueOf(value) : null;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        if (trimmed.isEmpty() || "null".equalsIgnoreCase(trimmed) || "undefined".equalsIgnoreCase(trimmed)) {
            return null;
        }
        return trimmed;
    }
}

