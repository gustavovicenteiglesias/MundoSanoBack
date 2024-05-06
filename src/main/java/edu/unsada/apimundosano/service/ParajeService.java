package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AreasEntity;
import edu.unsada.apimundosano.models.ParajesEntity;

import java.util.ArrayList;
import java.util.List;

public class ParajeService {
    public List<List<Object>> valuesParajes (Iterable <ParajesEntity> data){
        List<List<Object>> values =new ArrayList<>();
        for (ParajesEntity item:data){
            List<Object> row=new ArrayList<>();
            row.add(item.getIdParaje());
            row.add(item.getIdArea());
            row.add(item.getNombre());
            row.add(item.getLastModified());
            row.add(item.getSqlDeleted());
            values.add(row);
        }
        return values;
    }
}
