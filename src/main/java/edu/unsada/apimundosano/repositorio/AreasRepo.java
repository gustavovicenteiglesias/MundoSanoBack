package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.AreasEntity;
import org.springframework.data.repository.CrudRepository;

public interface AreasRepo extends CrudRepository<AreasEntity,Integer> {

    Optional<AreasEntity> findByUuid(String uuid);
}

