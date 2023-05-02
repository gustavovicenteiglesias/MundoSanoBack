package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.AntecedentesAppsEntity;
import edu.unsada.apimundosano.models.EtmisEntity;
import edu.unsada.apimundosano.models.EtmisPersonasEntity;

import java.util.ArrayList;
import java.util.List;

public class EtmisPersonasService {
    public List<List<Object>> EtmisPersonasValues(Iterable<EtmisPersonasEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (EtmisPersonasEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdPersona());
            row.add(item.getIdEtmi());
            row.add(item.getIdControl());
            row.add(item.getConfirmada());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());


            values.add(row);
        }
        return values;

    }
}
