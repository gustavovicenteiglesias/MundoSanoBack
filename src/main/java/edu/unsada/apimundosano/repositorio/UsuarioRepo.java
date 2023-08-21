package edu.unsada.apimundosano.repositorio;

import edu.unsada.apimundosano.models.UsuariosEntity;
import org.springframework.data.repository.CrudRepository;

public interface UsuarioRepo extends CrudRepository<UsuariosEntity,Integer> {
}
