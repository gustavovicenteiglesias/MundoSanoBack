package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;
import edu.unsada.apimundosano.models.UbicacionesEntity;

import java.util.ArrayList;
import java.util.List;

public class UbicacionesService {
    public List<List<Object>> UbicacionesValues(Iterable<UbicacionesEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (UbicacionesEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdUbicacion());
            row.add(item.getIdPersona());
            row.add(item.getIdParaje());
            row.add(item.getIdArea());
            row.add(item.getNumVivienda());
            row.add(item.getFecha());
            row.add(item.getGeoreferencia());
            row.add(item.getIdPais());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());
            values.add(row);
        }
        return values;

    }
}
