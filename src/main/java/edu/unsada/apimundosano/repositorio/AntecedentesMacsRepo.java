package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.AntecedentesMacsEntity;
import org.springframework.data.repository.CrudRepository;

public interface AntecedentesMacsRepo extends CrudRepository<AntecedentesMacsEntity,Integer> {

    Optional<AntecedentesMacsEntity> findByUuid(String uuid);
}

