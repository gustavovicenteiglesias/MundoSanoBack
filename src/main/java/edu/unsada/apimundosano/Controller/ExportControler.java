package edu.unsada.apimundosano.Controller;


import edu.unsada.apimundosano.models.*;
import edu.unsada.apimundosano.repositorio.*;

import edu.unsada.apimundosano.utilidades.JsonSqlite;
import edu.unsada.apimundosano.utilidades.JsonTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;


@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")

public class ExportControler {

    @Autowired
    private PersonasRepo personasRepo;
    @Autowired
    private ControlesRepo controlesRepo;
    @Autowired
    private ControlEmbarazoRepo controlEmbarazoRepo;
    @Autowired
    private InmunizacionesControlRepo inmunizacionesControlRepo;

    @Autowired
    private LaboratoriosRealizadosRepo laboratoriosRealizadosRepo;
    @Autowired
    private UbicacionesRepo ubicacionesRepo;

    @Autowired
    private AntecedentesRepo antecedentesRepo;
    @Autowired
    private AntecedentesAppsRepo antecedentesAppsRepo;

    @Autowired
    private AntecedentesMacsRepo antecedentesMacsRepo;

    @GetMapping("/persona")
    public HashMap<String, Object> getAllPersonas() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Iterable<PersonasEntity> personas = personasRepo.findAll();
            response.put("data", personas);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }

    @GetMapping("/controles")
    public HashMap<String, Object> getAllControles() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Iterable<ControlesEntity> controles = controlesRepo.findAll();
            response.put("data", controles);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }

    @GetMapping("/control_embarazo")
    public HashMap<String, Object> getAl() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Iterable<ControlesEntity> controles = controlesRepo.findAll();
            response.put("data", controles);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }

    @PostMapping("/sqlite")
    public HashMap<String, Object> postSqlite(@RequestBody JsonSqlite json) {

        //Gson gson = new Gson();
        //JsonSqlite jsonSqlite = gson.fromJson(json, JsonSqlite.class);
        List<JsonTable> jsonTable = json.getTables();


        HashMap<String, Object> response = new HashMap<>();

        try {

            //separar por tabla
            for (int i = 0; i < jsonTable.size(); i++) {
                String nombre = jsonTable.get(i).getName();
                System.out.println(nombre);
                List valores = jsonTable.get(i).getValues();


                switch (nombre) {
                    case "personas" -> {
                        for (int j = 0; j < valores.size(); j++) {
                            PersonasEntity personas = new PersonasEntity();
                            List valor = (List) valores.get(j);
                            //System.out.println(valor.get(0));
                            personas.setIdPersona((Integer) valor.get(0));
                            personas.setApellido((String) valor.get(1));
                            personas.setNombre((String) valor.get(2));
                            personas.setDocumento((String) valor.get(3));
                            personas.setFechaNacimiento((String) valor.get(4) == null ? null : Date.valueOf((String) valor.get(4)));
                            personas.setIdOrigen((Integer) valor.get(5));
                            personas.setNacionalidad((Integer) valor.get(6));
                            personas.setSexo((String) valor.get(7));
                            personas.setMadre((Integer) valor.get(8));
                            personas.setAlta((Integer) valor.get(9));
                            personas.setNacionalidad((Integer) valor.get(10));
                            personas.setSqlDeleted((Integer) valor.get(11));
                            personas.setLastModified((Integer) valor.get(12));
                            System.out.println(personas.toString());
                            personasRepo.save(personas);
                        }
                    }
                    case ("controles") -> {
                        for (int j = 0; j < valores.size(); j++) {
                            ControlesEntity controles = new ControlesEntity();
                            List valor = (List) valores.get(j);
                            //System.out.println(valor.get(0));
                            controles.setIdControl((Integer) valor.get(0));
                            controles.setFecha((String) valor.get(1) == null ? null : Date.valueOf((String) valor.get(1)));
                            controles.setIdPersona((Integer) valor.get(2));
                            controles.setControlNumero((Integer) valor.get(3));
                            controles.setIdEstado((Integer) valor.get(4));
                            controles.setIdSeguimientoChagas((Integer) valor.get(5));
                            controles.setIdTratamientoChagas((Integer) valor.get(6));
                            controles.setIdSeguimientoHiv((Integer) valor.get(7));
                            controles.setIdTratamientoHiv((Integer) valor.get(8));
                            controles.setIdSeguimientoSifilis((Integer) valor.get(9));
                            controles.setIdTratamientoSifilis((Integer) valor.get(10));
                            controles.setIdSeguimientoVhb((Integer) valor.get(11));
                            controles.setIdTratamientoVhb((Integer) valor.get(12));
                            controles.setFechaFinEmbarazo((String) valor.get(13) == null ? null : Date.valueOf((String) valor.get(13)));
                            controles.setIdTiposFinEmbarazos((Integer) valor.get(14));
                            controles.setGeoreferencia((String) valor.get(15));
                            controles.setSqlDeleted((Integer) valor.get(16));
                            controles.setLastModified((Integer) valor.get(14));

                            controlesRepo.save(controles);
                        }
                    }
                    case ("control_embarazo") -> {
                        for (int j = 0; j < valores.size(); j++) {
                            ControlEmbarazoEntity controlEmbarazo = new ControlEmbarazoEntity();
                            List valor = (List) valores.get(j);
                            //System.out.println(valor.get(0));
                            controlEmbarazo.setIdControlEmbarazo((Integer) valor.get(0));
                            controlEmbarazo.setIdControl((Integer) valor.get(1));
                            controlEmbarazo.setEdadGestacional((Integer) valor.get(2));
                            controlEmbarazo.setEco((String) valor.get(3));
                            controlEmbarazo.setDetalleEco((String) valor.get(4));
                            controlEmbarazo.setHpv((String) valor.get(5));
                            controlEmbarazo.setPap((String) valor.get(6));
                            controlEmbarazo.setSistolica((Integer) valor.get(7));
                            controlEmbarazo.setDiastolica((Integer) valor.get(8));
                            controlEmbarazo.setClinico((String) valor.get(9));
                            controlEmbarazo.setObservaciones((String) valor.get(10));
                            controlEmbarazo.setMotivo((Integer) valor.get(11));
                            controlEmbarazo.setDerivada((Integer) valor.get(12));
                            controlEmbarazo.setSqlDeleted((Integer) valor.get(13));
                            controlEmbarazo.setLastModified((Integer) valor.get(14));
                            controlEmbarazoRepo.save(controlEmbarazo);
                            System.out.println(controlEmbarazo.toString());
                        }
                    }
                    case ("inmunizaciones_control") -> {

                        for (int j = 0; j < valores.size(); j++) {
                            InmunizacionesControlEntity inmunizacionesControl = new InmunizacionesControlEntity();

                            List valor = (List) valores.get(j);
                            inmunizacionesControl.setIdPersona((Integer) valor.get(0));
                            inmunizacionesControl.setIdControl((Integer) valor.get(1));
                            inmunizacionesControl.setIdInmunizacion((Integer) valor.get(2));
                            inmunizacionesControl.setEstado((String) valor.get(3));
                            inmunizacionesControl.setSqlDeleted((Integer) valor.get(4));
                            inmunizacionesControl.setLastModified((Integer) valor.get(5));

                            inmunizacionesControlRepo.save(inmunizacionesControl);
                            System.out.println(inmunizacionesControl.toString());
                        }
                    }
                    case ("laboratorios_realizados") -> {
                        for (int j = 0; j < valores.size(); j++) {
                            LaboratoriosRealizadosEntity laboratoriosRealizados = new LaboratoriosRealizadosEntity();
                            List valor = (List) valores.get(j);

                            laboratoriosRealizados.setIdPersona((Integer) valor.get(0));
                            laboratoriosRealizados.setIdControl((Integer) valor.get(1));
                            laboratoriosRealizados.setIdLaboratorio((Integer) valor.get(2));
                            laboratoriosRealizados.setTrimestre((Integer) valor.get(3));
                            laboratoriosRealizados.setFechaRealizado((String) valor.get(4) == null ? null : Date.valueOf((String) valor.get(4)));
                            laboratoriosRealizados.setFechaResultados((String) valor.get(5) == null ? null : Date.valueOf((String) valor.get(5)));
                            laboratoriosRealizados.setResultado((String) valor.get(6));
                            laboratoriosRealizados.setIdEtmi((Integer) valor.get(7));
                            laboratoriosRealizados.setSqlDeleted((Integer) valor.get(8));
                            laboratoriosRealizados.setLastModified((Integer) valor.get(9));

                            laboratoriosRealizadosRepo.save(laboratoriosRealizados);
                            System.out.println(laboratoriosRealizados.toString());

                        }

                    }
                    case ("ubicaciones") -> {
                        for (int j = 0; j < valores.size(); j++) {
                            UbicacionesEntity ubicaciones = new UbicacionesEntity();
                            List valor = (List) valores.get(j);

                            ubicaciones.setIdUbicacion((Integer) valor.get(0));
                            ubicaciones.setIdPersona((Integer) valor.get(1));
                            ubicaciones.setIdParaje((Integer) valor.get(2));
                            ubicaciones.setIdArea((Integer) valor.get(3));
                            ubicaciones.setNumVivienda((String) valor.get(4));
                            ubicaciones.setFecha((String) valor.get(5) == null ? null : Date.valueOf((String) valor.get(5)));
                            ubicaciones.setGeoreferencia((String) valor.get(6));
                            ubicaciones.setIdPais((Integer) valor.get(7));
                            ubicaciones.setSqlDeleted((Integer) valor.get(8));
                            ubicaciones.setLastModified((Integer) valor.get(9));

                            System.out.println(ubicaciones.toString());
                            ubicacionesRepo.save(ubicaciones);
                        }
                    }
                    case ("antecedentes") -> {
                        for (int j = 0; j < valores.size(); j++) {
                            AntecedentesEntity antecedentes = new AntecedentesEntity();

                            List valor = (List) valores.get(j);

                            antecedentes.setIdAntecedente((Integer) valor.get(0));
                            antecedentes.setIdPersona((Integer) valor.get(1));
                            antecedentes.setIdControl((Integer) valor.get(2));
                            antecedentes.setEdadPrimerEmbarazo((Integer) valor.get(3));
                            antecedentes.setFechaUltimoEmbarazo((String) valor.get(4) == null ? null : Date.valueOf((String) valor.get(4)));
                            antecedentes.setGestas((Integer) valor.get(5));
                            antecedentes.setPartos((Integer) valor.get(6));
                            antecedentes.setCesareas((Integer) valor.get(7));
                            antecedentes.setAbortos((Integer) valor.get(8));
                            antecedentes.setPlanificado((Integer) valor.get(9));
                            antecedentes.setFum((String) valor.get(10) == null ? null : Date.valueOf((String) valor.get(10)));
                            antecedentes.setFpp((String) valor.get(11) == null ? null : Date.valueOf((String) valor.get(11)));
                            antecedentes.setLastModified((Integer) valor.get(12));
                            antecedentes.setSqlDeleted((Integer) valor.get(13));


                            System.out.println(antecedentes.toString());
                            antecedentesRepo.save(antecedentes);
                        }
                    }
                    case ("antecedentes_apps")->{
                        for (int j = 0; j < valores.size(); j++) {
                            AntecedentesAppsEntity antecedentesApps=new AntecedentesAppsEntity();
                            List valor = (List) valores.get(j);

                            antecedentesApps.setIdAntecedente((Integer) valor.get(0));
                            antecedentesApps.setIdApp((Integer) valor.get(1));
                            antecedentesApps.setLastModified((Integer) valor.get(2));
                            antecedentesApps.setSqlDelete((Integer) valor.get(3));

                            System.out.println(antecedentesApps.toString());
                            antecedentesAppsRepo.save(antecedentesApps);
                        }
                    }
                    case ("antecedentes_macs")->{
                        for (int j = 0; j < valores.size(); j++) {
                            AntecedentesMacsEntity antecedentesMacs=new AntecedentesMacsEntity();
                            List valor = (List) valores.get(j);

                            antecedentesMacs.setIdAntecedente((Integer) valor.get(0));
                            antecedentesMacs.setIdMac((Integer) valor.get(1));
                            antecedentesMacs.setLastModified((Integer) valor.get(3));
                            antecedentesMacs.setSqlDelete((Integer) valor.get(2));

                            System.out.println(antecedentesMacs.toString());
                            antecedentesMacsRepo.save(antecedentesMacs);
                        }
                    }
                    default -> System.out.println("otro");
                }
            }
            response.put("data", jsonTable);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("success",false);
            response.put("error", e.toString());
        }
        return response;
    }


}
