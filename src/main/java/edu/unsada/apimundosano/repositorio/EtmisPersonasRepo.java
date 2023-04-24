package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.EtmisPersonasEntity;
import org.springframework.data.repository.CrudRepository;

public interface EtmisPersonasRepo extends CrudRepository <EtmisPersonasEntity,Integer> {
}
