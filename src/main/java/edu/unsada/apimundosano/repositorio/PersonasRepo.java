package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.PersonasEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonasRepo extends CrudRepository <PersonasEntity,Integer> {

}
