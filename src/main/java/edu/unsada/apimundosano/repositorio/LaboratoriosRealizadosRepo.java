package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface LaboratoriosRealizadosRepo extends JpaRepository<LaboratoriosRealizadosEntity,Integer> {
}
