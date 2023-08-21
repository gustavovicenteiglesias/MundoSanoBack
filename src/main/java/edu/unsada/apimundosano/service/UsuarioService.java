package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.PersonasEntity;
import edu.unsada.apimundosano.models.UsuariosEntity;

import java.util.ArrayList;
import java.util.List;

public class UsuarioService {

    public List<List<Object>> valuesUsuarios(Iterable<UsuariosEntity> data) {
        List<List<Object>> values = new ArrayList<>();
        for (UsuariosEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdUsuario());
            row.add(item.getUsuario());
            row.add(item.getPassword());
            row.add(item.getEmail());
            row.add(item.getNombre());
            row.add(item.getNivelAcceso());
            row.add(item.getLastModified());
            row.add(item.getSqlDeleted());

            values.add(row);
        }
        return values;
    }
}
