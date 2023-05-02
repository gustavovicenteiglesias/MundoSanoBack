package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.PersonasEntity;

import java.util.ArrayList;
import java.util.List;

public class PersonaSrevice {
    public List<List<Object>> valuesPersonas(Iterable<PersonasEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (PersonasEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdPersona());
            row.add(item.getApellido());
            row.add(item.getNombre());
            row.add(item.getDocumento());
            row.add(item.getFechaNacimiento());
            row.add(item.getIdOrigen());
            row.add(item.getNacionalidad());
            row.add(item.getSexo());
            row.add(item.getMadre());
            row.add(item.getAlta());
            row.add(item.getNacidoVivo());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());
            values.add(row);
        }
        return values;

    }


}
