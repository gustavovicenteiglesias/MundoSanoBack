package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ControlRnEntity;
import org.springframework.data.repository.CrudRepository;

public interface ControlRnRepo extends CrudRepository <ControlRnEntity,Integer> {

    Optional<ControlRnEntity> findByUuid(String uuid);
}

