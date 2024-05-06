package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AreasEntity;

import java.util.ArrayList;
import java.util.List;

public class AreasService {
    public List<List<Object>> valuesAreas (Iterable <AreasEntity> data){
        List<List<Object>> values =new ArrayList<>();
        for (AreasEntity item:data){
            List<Object> row=new ArrayList<>();
            row.add(item.getIdArea());
            row.add(item.getIdPais());
            row.add(item.getNombre());
            row.add(item.getLastModified());
            row.add(item.getSqlDeleted());
            values.add(row);
        }
        return values;
    }
}
