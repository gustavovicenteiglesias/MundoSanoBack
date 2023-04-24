package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.EmbarazosEntity;
import org.springframework.data.repository.CrudRepository;

public interface EmbarazosRepo extends CrudRepository <EmbarazosEntity,Integer> {
}
