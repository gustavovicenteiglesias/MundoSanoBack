package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

public interface LaboratoriosRealizadosRepo extends JpaRepository<LaboratoriosRealizadosEntity,Integer> {
    @Modifying
    @Query(value = "SELECT * FROM laboratorios_realizados WHERE last_modified>:last", nativeQuery = true)
    Iterable<LaboratoriosRealizadosEntity> findBYLast (@Param("last") Integer last );
}
