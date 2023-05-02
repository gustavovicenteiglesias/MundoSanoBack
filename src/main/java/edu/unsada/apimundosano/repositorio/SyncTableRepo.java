package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;
import edu.unsada.apimundosano.models.SyncTableEntity;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface SyncTableRepo extends CrudRepository<SyncTableEntity,Integer> {

    @Query(value = "SELECT sync_date FROM sync_table ORDER BY sync_date DESC LIMIT 1", nativeQuery = true)
    Integer buscarUltimoLast() ;
}
