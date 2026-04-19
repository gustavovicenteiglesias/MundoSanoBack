package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.PersonasEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PersonasRepo extends CrudRepository <PersonasEntity,Integer> {

    Optional<PersonasEntity> findByUuid(String uuid);

    Iterable<PersonasEntity> findBySqlDeletedOrSqlDeletedIsNull(Integer sqlDeleted);

}


