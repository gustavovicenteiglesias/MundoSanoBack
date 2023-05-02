package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AntecedentesAppsEntity;
import edu.unsada.apimundosano.models.AntecedentesEntity;

import java.util.ArrayList;
import java.util.List;

public class AntecedentesApps {
    public List<List<Object>> AntecedentesAppsValues(Iterable<AntecedentesAppsEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (AntecedentesAppsEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdAntecedente());
            row.add(item.getIdApp());
            row.add(item.getLastModified());
            row.add(item.getSqlDelete());

            values.add(row);
        }
        return values;

    }
}
