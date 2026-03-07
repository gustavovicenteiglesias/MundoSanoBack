package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.EtmisPersonasEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface EtmisPersonasRepo extends CrudRepository <EtmisPersonasEntity,Integer> {
    Optional<EtmisPersonasEntity> findByIdPersonaAndIdEtmiAndIdControl(
            Integer idPersona,
            Integer idEtmi,
            Integer idControl
    );
}
