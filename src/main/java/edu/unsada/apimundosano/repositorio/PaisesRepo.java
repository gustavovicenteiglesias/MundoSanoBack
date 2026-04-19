package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.PaisesEntity;
import org.springframework.data.repository.CrudRepository;

public interface PaisesRepo extends CrudRepository<PaisesEntity,Integer> {

    Optional<PaisesEntity> findByUuid(String uuid);
}

