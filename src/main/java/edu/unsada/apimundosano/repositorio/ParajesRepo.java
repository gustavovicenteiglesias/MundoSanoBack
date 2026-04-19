package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ParajesEntity;
import org.springframework.data.repository.CrudRepository;

public interface ParajesRepo extends CrudRepository<ParajesEntity,Integer> {

    Optional<ParajesEntity> findByUuid(String uuid);
}

