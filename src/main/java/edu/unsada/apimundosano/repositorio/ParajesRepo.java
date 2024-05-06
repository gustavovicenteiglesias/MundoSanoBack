package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.ParajesEntity;
import org.springframework.data.repository.CrudRepository;

public interface ParajesRepo extends CrudRepository<ParajesEntity,Integer> {
}
