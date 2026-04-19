package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ControlPuerperioEntity;
import org.springframework.data.repository.CrudRepository;

public interface ControlPuerperioRepo extends CrudRepository <ControlPuerperioEntity,Integer> {

    Optional<ControlPuerperioEntity> findByUuid(String uuid);
}

