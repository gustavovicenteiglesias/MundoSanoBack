package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AntecedentesAppsEntity;
import edu.unsada.apimundosano.models.AntecedentesMacsEntity;

import java.util.ArrayList;
import java.util.List;

public class AntededentesMacs {
    public List<List<Object>> AntecedentesMacsValues(Iterable<AntecedentesMacsEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (AntecedentesMacsEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdAntecedente());
            row.add(item.getIdMac());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());


            values.add(row);
        }
        return values;

    }
}
