package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ControlEmbPatologicoEntity;
import org.springframework.data.repository.CrudRepository;

public interface ControlEmbarazoPatologicoRepo extends CrudRepository<ControlEmbPatologicoEntity,Integer> {

    Optional<ControlEmbPatologicoEntity> findByUuid(String uuid);
}

