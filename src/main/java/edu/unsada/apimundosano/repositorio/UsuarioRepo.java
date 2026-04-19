package edu.unsada.apimundosano.repositorio;

import java.util.Optional;

import edu.unsada.apimundosano.models.UsuariosEntity;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioRepo extends CrudRepository<UsuariosEntity,Integer> {

    Optional<UsuariosEntity> findByUuid(String uuid);
}

