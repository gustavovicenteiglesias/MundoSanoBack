package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.InmunizacionesControlEntity;

import java.util.ArrayList;
import java.util.List;

public class InmunizacionesControlService {
    public List<List<Object>> InmunizacionesControl(Iterable<InmunizacionesControlEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (InmunizacionesControlEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdPersona());
            row.add(item.getIdControl());
            row.add(item.getIdInmunizacion());
            row.add(item.getEstado());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());
            values.add(row);
        }
        return values;

    }
}
