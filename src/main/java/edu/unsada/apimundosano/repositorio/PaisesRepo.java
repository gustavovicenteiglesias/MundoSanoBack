package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.PaisesEntity;
import org.springframework.data.repository.CrudRepository;

public interface PaisesRepo extends CrudRepository<PaisesEntity,Integer> {
}
