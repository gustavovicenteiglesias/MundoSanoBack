package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.ControlesEntity;
import org.springframework.data.repository.CrudRepository;

public interface ControlesRepo extends CrudRepository <ControlesEntity,Integer> {

    Optional<ControlesEntity> findByUuid(String uuid);
}

