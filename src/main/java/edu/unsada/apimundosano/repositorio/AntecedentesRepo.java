package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.AntecedentesEntity;
import org.springframework.data.repository.CrudRepository;

public interface AntecedentesRepo extends CrudRepository <AntecedentesEntity,Integer> {

    Optional<AntecedentesEntity> findByUuid(String uuid);

}

