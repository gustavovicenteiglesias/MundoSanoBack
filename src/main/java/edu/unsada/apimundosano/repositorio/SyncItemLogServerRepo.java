package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.SyncItemLogServerEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface SyncItemLogServerRepo extends CrudRepository<SyncItemLogServerEntity, Long> {
    List<SyncItemLogServerEntity> findBySyncBatchIdOrderByCreatedAtAsc(String syncBatchId);
    long deleteBySyncBatchId(String syncBatchId);
}

