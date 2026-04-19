package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.EmbarazosPatologiasEntity;
import org.springframework.data.repository.CrudRepository;

public interface EmbarazosPatologiasRepo extends CrudRepository<EmbarazosPatologiasEntity,Integer> {

    Optional<EmbarazosPatologiasEntity> findByUuid(String uuid);
}

