package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.AntecedentesAppsEntity;
import org.springframework.data.repository.CrudRepository;

public interface AntecedentesAppsRepo extends CrudRepository <AntecedentesAppsEntity,Integer> {

    Optional<AntecedentesAppsEntity> findByUuid(String uuid);
}

