package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.SyncBatchLogServerEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface SyncBatchLogServerRepo extends CrudRepository<SyncBatchLogServerEntity, Long> {
    Optional<SyncBatchLogServerEntity> findBySyncBatchId(String syncBatchId);
    List<SyncBatchLogServerEntity> findTop200ByOrderByFechaInicioDesc();
}

