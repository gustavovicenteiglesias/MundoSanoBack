package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.EmbarazosEntity;
import org.springframework.data.repository.CrudRepository;

public interface EmbarazosRepo extends CrudRepository <EmbarazosEntity,Integer> {

    Optional<EmbarazosEntity> findByUuid(String uuid);
}

