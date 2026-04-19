package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.UbicacionesEntity;
import org.springframework.data.repository.CrudRepository;

public interface UbicacionesRepo extends CrudRepository <UbicacionesEntity,Integer> {

    Optional<UbicacionesEntity> findByUuid(String uuid);
}

