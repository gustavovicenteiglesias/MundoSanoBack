package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.PaisesEntity;
import edu.unsada.apimundosano.models.UsuariosEntity;

import java.util.ArrayList;
import java.util.List;

public class PaisesService {
    public List<List<Object>> valuesPaises (Iterable<PaisesEntity> data) {
        List<List<Object>> values = new ArrayList<>();
        for (PaisesEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdPais());
            row.add(item.getCodigo());
            row.add(item.getNombre());
            row.add(item.getLastModified());
            row.add(item.getSqlDeleted());

            values.add(row);
        }
        return values;

    }
}
