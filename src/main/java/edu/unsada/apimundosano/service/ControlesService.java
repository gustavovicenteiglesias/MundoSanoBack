package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.ControlesEntity;
import edu.unsada.apimundosano.models.PersonasEntity;

import java.util.ArrayList;
import java.util.List;

public class ControlesService {
    public List<List<Object>> valuesControles(Iterable<ControlesEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (ControlesEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdControl());
            row.add(item.getFecha());
            row.add(item.getIdPersona());
            row.add(item.getControlNumero());
            row.add(item.getIdEstado());
            row.add(item.getIdSeguimientoChagas());
            row.add(item.getIdTratamientoChagas());
            row.add(item.getIdSeguimientoHiv());
            row.add(item.getIdTratamientoHiv());
            row.add(item.getIdSeguimientoSifilis());
            row.add(item.getIdTratamientoSifilis());
            row.add(item.getIdSeguimientoVhb());
            row.add(item.getIdTratamientoVhb());
            row.add(item.getFechaFinEmbarazo());
            row.add(item.getIdTiposFinEmbarazos());
            row.add(item.getGeoreferencia());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());


            values.add(row);
        }
        return values;

    }
}
