package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.IdsegundeviceEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface IdSegunDevice extends CrudRepository<IdsegundeviceEntity,Integer> {
    @Query(value="SELECT * FROM idsegundevice ORDER BY id_device DESC LIMIT 1", nativeQuery=true)
    Iterable<IdsegundeviceEntity> getLastRoe();

    Optional<IdsegundeviceEntity> findByNroDevice(String nroDevice);
}
