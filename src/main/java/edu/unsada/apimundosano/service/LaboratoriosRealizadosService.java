package edu.unsada.apimundosano.service;

import edu.unsada.apimundosano.models.InmunizacionesControlEntity;
import edu.unsada.apimundosano.models.LaboratoriosRealizadosEntity;

import java.util.ArrayList;
import java.util.List;

public class LaboratoriosRealizadosService {
    public List<List<Object>> LaboratoriosRealizados(Iterable<LaboratoriosRealizadosEntity> data){
        List<List<Object>> values = new ArrayList<>();
        for (LaboratoriosRealizadosEntity item : data) {
            List<Object> row = new ArrayList<>();
            row.add(item.getIdPersona());
            row.add(item.getIdControl());
            row.add(item.getIdLaboratorio());
            row.add(item.getTrimestre());
            row.add(item.getFechaRealizado());
            row.add(item.getFechaResultados());
            row.add(item.getResultado());
            row.add(item.getIdEtmi());
            row.add(item.getSqlDeleted());
            row.add(item.getLastModified());
            values.add(row);
        }
        return values;

    }
}
