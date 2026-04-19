package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ControlEmbarazoEntity;
import org.springframework.data.repository.CrudRepository;

public interface ControlEmbarazoRepo extends CrudRepository<ControlEmbarazoEntity,Integer> {

    Optional<ControlEmbarazoEntity> findByUuid(String uuid);
}

