package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.ControlEmbarazoEntity;

import java.util.ArrayList;
import java.util.List;

public class ControlEmbarazoService {
    public List<List<Object>> valuesControlEmbarazo(Iterable<ControlEmbarazoEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (ControlEmbarazoEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdControlEmbarazo());
            row.add((item.getIdControl()));
            row.add(item.getEdadGestacional());
            row.add(item.getEco());
            row.add(item.getDetalleEco());
            row.add(item.getHpv());
            row.add(item.getPap());
            row.add(item.getSistolica());
            row.add(item.getDiastolica());
            row.add(item.getClinico());
            row.add(item.getObservaciones());
            row.add(item.getMotivo());
            row.add(item.getDerivada());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());
            values.add(row);
        }
        return values;

    }
}
