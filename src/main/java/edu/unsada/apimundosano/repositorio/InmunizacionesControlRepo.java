package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.InmunizacionesControlEntity;
import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface InmunizacionesControlRepo extends CrudRepository<InmunizacionesControlEntity,Integer> {
    @Modifying
    @Query(value = "SELECT * FROM inmunizaciones_control WHERE last_modified>:last", nativeQuery = true)
    Iterable<InmunizacionesControlEntity> findBYLast (@Param("last") Integer last );
}
