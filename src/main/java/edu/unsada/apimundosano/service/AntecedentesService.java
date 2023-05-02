package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AntecedentesEntity;
import edu.unsada.apimundosano.models.UbicacionesEntity;

import java.util.ArrayList;
import java.util.List;

public class AntecedentesService {
    public List<List<Object>> AntecedentesValues(Iterable<AntecedentesEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (AntecedentesEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdAntecedente());
            row.add(item.getIdPersona());
            row.add(item.getIdControl());
            row.add(item.getEdadPrimerEmbarazo());
            row.add(item.getFechaUltimoEmbarazo());
            row.add(item.getGestas());
            row.add(item.getPartos());
            row.add(item.getCesareas());
            row.add(item.getAbortos());
            row.add(item.getPlanificado());
            row.add(item.getFum());
            row.add(item.getFpp());
            row.add(item.getLastModified());
            row.add(item.getSqlDeleted());

            values.add(row);
        }
        return values;

    }
}
