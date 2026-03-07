package edu.unsada.apimundosano.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.unsada.apimundosano.models.*;
import edu.unsada.apimundosano.repositorio.*;


import edu.unsada.apimundosano.service.*;
import edu.unsada.apimundosano.utilidades.JsonSqlite;
import edu.unsada.apimundosano.utilidades.JsonTable;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;
import java.util.*;


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

    @Autowired
    private SyncTableRepo syncTableRepo;

    @Autowired
    private EtmisPersonasRepo etmisPersonasRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private  IdSegunDevice idSegunDeviceRepo;

    @Autowired
    private PaisesRepo paisesRepo;

    @Autowired
    private AreasRepo areasRepo;

    @Autowired
    private ParajesRepo parajesRepo;

    @Value("${mundosano.app.bbdd}")
    private String bbdd;

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
    private Object getValue(List valor, int index) {
        if (valor == null || index < 0 || index >= valor.size()) {
            return null;
        }
        return valor.get(index);
    }

    private String safeString(List valor, int index) {
        Object v = getValue(valor, index);
        if (v == null) return null;
        String s = v.toString().trim();
        return s.isEmpty() ? null : s;
    }

    private Integer safeInt(List valor, int index) {
        Object v = getValue(valor, index);
        if (v == null) return null;

        if (v instanceof Integer) return (Integer) v;
        if (v instanceof Long) return ((Long) v).intValue();
        if (v instanceof Double) return ((Double) v).intValue();
        if (v instanceof Float) return ((Float) v).intValue();

        String s = v.toString().trim();
        if (s.isEmpty() || "null".equalsIgnoreCase(s) || "undefined".equalsIgnoreCase(s)) {
            return null;
        }

        try {
            return Integer.parseInt(s);
        } catch (Exception e) {
            return null;
        }
    }

    private void addLog(List<Map<String, Object>> logs,
                        String tabla,
                        Integer idPersona,
                        Integer idControl,
                        Integer idReferencia,
                        String motivo,
                        List payload) {

        Map<String, Object> log = new HashMap<>();
        log.put("tabla", tabla);
        log.put("idPersona", idPersona);
        log.put("idControl", idControl);
        log.put("idReferencia", idReferencia);
        log.put("motivo", motivo);
        log.put("payload", payload);

        logs.add(log);

        System.err.println("RECHAZADO -> tabla=" + tabla
                + ", idPersona=" + idPersona
                + ", idControl=" + idControl
                + ", idReferencia=" + idReferencia
                + ", motivo=" + motivo
                + ", payload=" + payload);
    }
    private boolean personaDisponible(Integer idPersona, Set<Integer> personasValidas) {
        if (idPersona == null) return false;
        return personasValidas.contains(idPersona) || personasRepo.existsById(idPersona);
    }

    private boolean controlDisponible(Integer idControl, Set<Integer> controlesValidos) {
        if (idControl == null) return false;
        return controlesValidos.contains(idControl) || controlesRepo.existsById(idControl);
    }

    private boolean antecedenteDisponible(Integer idAntecedente, Set<Integer> antecedentesValidos) {
        if (idAntecedente == null) return false;
        return antecedentesValidos.contains(idAntecedente) || antecedentesRepo.existsById(idAntecedente);
    }
    private String safeStringNotNull(List valor, int index) {
        Object v = getValue(valor, index);
        if (v == null) return "";
        return v.toString().trim();
    }

    @PostMapping("/sqlite")
    public HashMap<String, Object> postSqlite(@RequestBody JsonSqlite json) {

        HashMap<String, Object> response = new HashMap<>();
        List<Map<String, Object>> logs = new ArrayList<>();

        int personasGuardadas = 0;
        int controlesGuardados = 0;
        int controlEmbarazoGuardados = 0;
        int inmunizacionesGuardadas = 0;
        int laboratoriosGuardados = 0;
        int ubicacionesGuardadas = 0;
        int antecedentesGuardados = 0;
        int antecedentesAppsGuardados = 0;
        int antecedentesMacsGuardados = 0;
        int etmisGuardados = 0;

        try {
            Map<String, List<List>> tablas = new HashMap<>();

            for (JsonTable table : json.getTables()) {
                tablas.put(table.getName(), table.getValues());
            }

            List<List> personasValues = tablas.getOrDefault("personas", new ArrayList<>());
            List<List> controlesValues = tablas.getOrDefault("controles", new ArrayList<>());
            List<List> controlEmbarazoValues = tablas.getOrDefault("control_embarazo", new ArrayList<>());
            List<List> inmunizacionesValues = tablas.getOrDefault("inmunizaciones_control", new ArrayList<>());
            List<List> laboratoriosValues = tablas.getOrDefault("laboratorios_realizados", new ArrayList<>());
            List<List> ubicacionesValues = tablas.getOrDefault("ubicaciones", new ArrayList<>());
            List<List> antecedentesValues = tablas.getOrDefault("antecedentes", new ArrayList<>());
            List<List> antecedentesAppsValues = tablas.getOrDefault("antecedentes_apps", new ArrayList<>());
            List<List> antecedentesMacsValues = tablas.getOrDefault("antecedentes_macs", new ArrayList<>());
            List<List> etmisValues = tablas.getOrDefault("etmis_personas", new ArrayList<>());

            Set<Integer> personasValidas = new HashSet<>();
            Set<Integer> controlesValidos = new HashSet<>();
            Set<Integer> antecedentesValidos = new HashSet<>();

            /*
             * =========================
             * 1) PERSONAS
             * =========================
             */
            for (List valor : personasValues) {
                Integer idPersona = safeInt(valor, 0);

                try {
                    if (idPersona == null) {
                        addLog(logs, "personas", null, null, null, "id_persona nulo o inválido", valor);
                        continue;
                    }

                    PersonasEntity personas = new PersonasEntity();
                    personas.setIdPersona(idPersona);
                    personas.setApellido(safeString(valor, 1));
                    personas.setNombre(safeString(valor, 2));
                    personas.setDocumento(safeString(valor, 3));
                    personas.setFechaNacimiento(parseSqlDate(getValue(valor, 4)));
                    personas.setIdOrigen(safeInt(valor, 5));
                    personas.setNacionalidad(safeInt(valor, 6));
                    personas.setSexo(safeString(valor, 7));
                    personas.setMadre(safeInt(valor, 8));
                    personas.setAlta(safeInt(valor, 9));
                    personas.setNacidoVivo(safeInt(valor, 10));
                    personas.setSqlDeleted(safeInt(valor, 11));
                    personas.setLastModified(safeInt(valor, 12));

                    personasRepo.save(personas);
                    personasValidas.add(idPersona);
                    personasGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "personas", idPersona, null, idPersona, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 2) CONTROLES
             * =========================
             */
            for (List valor : controlesValues) {
                Integer idControl = safeInt(valor, 0);
                Integer idPersona = safeInt(valor, 2);

                try {
                    if (idControl == null) {
                        addLog(logs, "controles", idPersona, null, null, "id_control nulo o inválido", valor);
                        continue;
                    }

                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "controles", idPersona, idControl, idControl,
                                "control rechazado porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    ControlesEntity controles = new ControlesEntity();
                    controles.setIdControl(idControl);
                    controles.setFecha(parseSqlDate(getValue(valor, 1)));
                    controles.setIdPersona(idPersona);
                    controles.setControlNumero(safeInt(valor, 3));
                    controles.setIdEstado(safeInt(valor, 4));
                    controles.setIdSeguimientoChagas(safeInt(valor, 5));
                    controles.setIdTratamientoChagas(safeInt(valor, 6));
                    controles.setIdSeguimientoHiv(safeInt(valor, 7));
                    controles.setIdTratamientoHiv(safeInt(valor, 8));
                    controles.setIdSeguimientoSifilis(safeInt(valor, 9));
                    controles.setIdTratamientoSifilis(safeInt(valor, 10));
                    controles.setIdSeguimientoVhb(safeInt(valor, 11));
                    controles.setIdTratamientoVhb(safeInt(valor, 12));
                    controles.setFechaFinEmbarazo(parseSqlDate(getValue(valor, 13)));
                    controles.setIdTiposFinEmbarazos(safeInt(valor, 14));
                    controles.setGeoreferencia(safeString(valor, 15));
                    controles.setSqlDeleted(safeInt(valor, 16));
                    controles.setLastModified(safeInt(valor, 17));

                    controlesRepo.save(controles);
                    controlesValidos.add(idControl);
                    controlesGuardados++;

                } catch (Exception e) {
                    addLog(logs, "controles", idPersona, idControl, idControl, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 3) UBICACIONES (dependen de persona)
             * =========================
             */
            for (List valor : ubicacionesValues) {
                Integer idUbicacion = safeInt(valor, 0);
                Integer idPersona = safeInt(valor, 1);

                try {
                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "ubicaciones", idPersona, null, idUbicacion,
                                "ubicacion rechazada porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    UbicacionesEntity ubicaciones = new UbicacionesEntity();
                    ubicaciones.setIdUbicacion(idUbicacion);
                    ubicaciones.setIdPersona(idPersona);
                    ubicaciones.setIdParaje(safeInt(valor, 2));
                    ubicaciones.setIdArea(safeInt(valor, 3));
                    ubicaciones.setNumVivienda(safeString(valor, 4));
                    ubicaciones.setFecha(parseSqlDate(getValue(valor, 5)));
                    ubicaciones.setGeoreferencia(safeString(valor, 6));
                    ubicaciones.setIdPais(safeInt(valor, 7));
                    ubicaciones.setSqlDeleted(safeInt(valor, 8));
                    ubicaciones.setLastModified(safeInt(valor, 9));

                    ubicacionesRepo.save(ubicaciones);
                    ubicacionesGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "ubicaciones", idPersona, null, idUbicacion, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 4) ANTECEDENTES (dependen de persona + control)
             * =========================
             */
            for (List valor : antecedentesValues) {
                Integer idAntecedente = safeInt(valor, 0);
                Integer idPersona = safeInt(valor, 1);
                Integer idControl = safeInt(valor, 2);

                try {
                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "antecedentes", idPersona, idControl, idAntecedente,
                                "antecedente rechazado porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    if (idControl == null || !controlDisponible(idControl, controlesValidos)) {
                        addLog(logs, "antecedentes", idPersona, idControl, idAntecedente,
                                "antecedente rechazado porque el control no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    AntecedentesEntity antecedentes = new AntecedentesEntity();
                    antecedentes.setIdAntecedente(idAntecedente);
                    antecedentes.setIdPersona(idPersona);
                    antecedentes.setIdControl(idControl);
                    antecedentes.setEdadPrimerEmbarazo(safeInt(valor, 3));
                    antecedentes.setFechaUltimoEmbarazo(parseSqlDate(getValue(valor, 4)));
                    antecedentes.setGestas(safeInt(valor, 5));
                    antecedentes.setPartos(safeInt(valor, 6));
                    antecedentes.setCesareas(safeInt(valor, 7));
                    antecedentes.setAbortos(safeInt(valor, 8));
                    antecedentes.setPlanificado(safeInt(valor, 9));
                    antecedentes.setFum(parseSqlDate(getValue(valor, 10)));
                    antecedentes.setFpp(parseSqlDate(getValue(valor, 11)));
                    antecedentes.setLastModified(safeInt(valor, 12));
                    antecedentes.setSqlDeleted(safeInt(valor, 13));

                    antecedentesRepo.save(antecedentes);

                    if (idAntecedente != null) {
                        antecedentesValidos.add(idAntecedente);
                    }

                    antecedentesGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes", idPersona, idControl, idAntecedente, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 5) CONTROL EMBARAZO (depende de control)
             * =========================
             */
            for (List valor : controlEmbarazoValues) {
                Integer idControlEmbarazo = safeInt(valor, 0);
                Integer idControl = safeInt(valor, 1);

                try {
                    if (idControl == null || !controlDisponible(idControl, controlesValidos)) {
                        addLog(logs, "control_embarazo", null, idControl, idControlEmbarazo,
                                "control_embarazo rechazado porque el control no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    if (idControlEmbarazo == null) {
                        addLog(logs, "control_embarazo", null, idControl, null,
                                "control_embarazo rechazado porque id_control_embarazo es nulo o inválido", valor);
                        continue;
                    }

                    ControlEmbarazoEntity controlEmbarazo = controlEmbarazoRepo.findById(idControlEmbarazo)
                            .orElseGet(ControlEmbarazoEntity::new);

                    controlEmbarazo.setIdControlEmbarazo(idControlEmbarazo);
                    controlEmbarazo.setIdControl(idControl);
                    controlEmbarazo.setEdadGestacional(safeInt(valor, 2));
                    controlEmbarazo.setEco(safeStringNotNull(valor, 3));
                    controlEmbarazo.setDetalleEco(safeStringNotNull(valor, 4));
                    controlEmbarazo.setHpv(safeStringNotNull(valor, 5));
                    controlEmbarazo.setPap(safeStringNotNull(valor, 6));
                    controlEmbarazo.setSistolica(safeInt(valor, 7));
                    controlEmbarazo.setDiastolica(safeInt(valor, 8));
                    controlEmbarazo.setClinico(safeStringNotNull(valor, 9));
                    controlEmbarazo.setObservaciones(safeStringNotNull(valor, 10));
                    controlEmbarazo.setMotivo(safeInt(valor, 11));
                    controlEmbarazo.setDerivada(safeInt(valor, 12));
                    controlEmbarazo.setSqlDeleted(safeInt(valor, 13));
                    controlEmbarazo.setLastModified(safeInt(valor, 14));

                    controlEmbarazoRepo.save(controlEmbarazo);
                    controlEmbarazoGuardados++;

                } catch (Exception e) {
                    addLog(logs, "control_embarazo", null, idControl, idControlEmbarazo, e.getMessage(), valor);
                }
            }
            /*
             * =========================
             * 6) INMUNIZACIONES (dependen de persona + control)
             * =========================
             */
            for (List valor : inmunizacionesValues) {
                Integer idPersona = safeInt(valor, 0);
                Integer idControl = safeInt(valor, 1);
                Integer idInmunizacion = safeInt(valor, 2);

                try {
                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "inmunizaciones_control", idPersona, idControl, idInmunizacion,
                                "inmunizacion rechazada porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    if (idControl == null || !controlDisponible(idControl, controlesValidos)) {
                        addLog(logs, "inmunizaciones_control", idPersona, idControl, idInmunizacion,
                                "inmunizacion rechazada porque el control no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    InmunizacionesControlEntity inmunizacionesControl = new InmunizacionesControlEntity();
                    inmunizacionesControl.setIdPersona(idPersona);
                    inmunizacionesControl.setIdControl(idControl);
                    inmunizacionesControl.setIdInmunizacion(idInmunizacion);
                    inmunizacionesControl.setEstado(safeString(valor, 3));
                    inmunizacionesControl.setSqlDeleted(safeInt(valor, 4));
                    inmunizacionesControl.setLastModified(safeInt(valor, 5));

                    inmunizacionesControlRepo.save(inmunizacionesControl);
                    inmunizacionesGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "inmunizaciones_control", idPersona, idControl, idInmunizacion, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 7) LABORATORIOS (dependen de persona + control)
             * =========================
             */
            for (List valor : laboratoriosValues) {
                Integer idPersona = safeInt(valor, 0);
                Integer idControl = safeInt(valor, 1);
                Integer idLaboratorio = safeInt(valor, 2);

                try {
                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "laboratorios_realizados", idPersona, idControl, idLaboratorio,
                                "laboratorio rechazado porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    if (idControl == null || !controlDisponible(idControl, controlesValidos)) {
                        addLog(logs, "laboratorios_realizados", idPersona, idControl, idLaboratorio,
                                "laboratorio rechazado porque el control no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    LaboratoriosRealizadosEntity laboratoriosRealizados = new LaboratoriosRealizadosEntity();
                    laboratoriosRealizados.setIdPersona(idPersona);
                    laboratoriosRealizados.setIdControl(idControl);
                    laboratoriosRealizados.setIdLaboratorio(idLaboratorio);
                    laboratoriosRealizados.setTrimestre(safeInt(valor, 3));
                    laboratoriosRealizados.setFechaRealizado(parseSqlDate(getValue(valor, 4)));
                    laboratoriosRealizados.setFechaResultados(parseSqlDate(getValue(valor, 5)));
                    laboratoriosRealizados.setResultado(safeString(valor, 6));
                    laboratoriosRealizados.setIdEtmi(safeInt(valor, 7));
                    laboratoriosRealizados.setSqlDeleted(safeInt(valor, 8));
                    laboratoriosRealizados.setLastModified(safeInt(valor, 9));

                    laboratoriosRealizadosRepo.save(laboratoriosRealizados);
                    laboratoriosGuardados++;

                } catch (Exception e) {
                    addLog(logs, "laboratorios_realizados", idPersona, idControl, idLaboratorio, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 8) ETMIS (dependen de persona + control)
             * =========================
             */
            for (List valor : etmisValues) {
                Integer idPersona = safeInt(valor, 0);
                Integer idEtmi = safeInt(valor, 1);
                Integer idControl = safeInt(valor, 2);

                try {
                    if (idPersona == null || !personaDisponible(idPersona, personasValidas)) {
                        addLog(logs, "etmis_personas", idPersona, idControl, idEtmi,
                                "etmi rechazada porque la persona no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    if (idControl == null || !controlDisponible(idControl, controlesValidos)) {
                        addLog(logs, "etmis_personas", idPersona, idControl, idEtmi,
                                "etmi rechazada porque el control no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    EtmisPersonasEntity etmisPersonasEntity = new EtmisPersonasEntity();
                    etmisPersonasEntity.setIdPersona(idPersona);
                    etmisPersonasEntity.setIdEtmi(idEtmi);
                    etmisPersonasEntity.setIdControl(idControl);
                    etmisPersonasEntity.setConfirmada(safeInt(valor, 3));
                    etmisPersonasEntity.setSqlDeleted(safeInt(valor, 4));
                    etmisPersonasEntity.setLastModified(safeInt(valor, 5));

                    etmisPersonasRepo.save(etmisPersonasEntity);
                    etmisGuardados++;

                } catch (Exception e) {
                    addLog(logs, "etmis_personas", idPersona, idControl, idEtmi, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 9) ANTECEDENTES_APPS (dependen de antecedente)
             * =========================
             */
            for (List valor : antecedentesAppsValues) {
                Integer idAntecedente = safeInt(valor, 0);
                Integer idApp = safeInt(valor, 1);

                try {
                    if (idAntecedente == null || !antecedenteDisponible(idAntecedente, antecedentesValidos)) {
                        addLog(logs, "antecedentes_apps", null, null, idAntecedente,
                                "antecedente_app rechazado porque el antecedente no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    AntecedentesAppsEntity antecedentesApps = new AntecedentesAppsEntity();
                    antecedentesApps.setIdAntecedente(idAntecedente);
                    antecedentesApps.setIdApp(idApp);
                    antecedentesApps.setLastModified(safeInt(valor, 2));
                    antecedentesApps.setSqlDelete(safeInt(valor, 3));

                    antecedentesAppsRepo.save(antecedentesApps);
                    antecedentesAppsGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes_apps", null, null, idAntecedente, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 10) ANTECEDENTES_MACS (dependen de antecedente)
             * =========================
             */
            for (List valor : antecedentesMacsValues) {
                Integer idAntecedente = safeInt(valor, 0);
                Integer idMac = safeInt(valor, 1);

                try {
                    if (idAntecedente == null || !antecedenteDisponible(idAntecedente, antecedentesValidos)) {
                        addLog(logs, "antecedentes_macs", null, null, idAntecedente,
                                "antecedente_mac rechazado porque el antecedente no existe ni en el payload ni en la base", valor);
                        continue;
                    }

                    AntecedentesMacsEntity antecedentesMacs = new AntecedentesMacsEntity();
                    antecedentesMacs.setIdAntecedente(idAntecedente);
                    antecedentesMacs.setIdMac(idMac);
                    antecedentesMacs.setSqlDeleted(safeInt(valor, 2));
                    antecedentesMacs.setLastModified(safeInt(valor, 3));

                    antecedentesMacsRepo.save(antecedentesMacs);
                    antecedentesMacsGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes_macs", null, null, idAntecedente, e.getMessage(), valor);
                }
            }

            response.put("success", true);
            response.put("message", "Importación procesada con tolerancia a errores");
            response.put("personasGuardadas", personasGuardadas);
            response.put("controlesGuardados", controlesGuardados);
            response.put("controlEmbarazoGuardados", controlEmbarazoGuardados);
            response.put("inmunizacionesGuardadas", inmunizacionesGuardadas);
            response.put("laboratoriosGuardados", laboratoriosGuardados);
            response.put("ubicacionesGuardadas", ubicacionesGuardadas);
            response.put("antecedentesGuardados", antecedentesGuardados);
            response.put("antecedentesAppsGuardados", antecedentesAppsGuardados);
            response.put("antecedentesMacsGuardados", antecedentesMacsGuardados);
            response.put("etmisGuardados", etmisGuardados);
            response.put("rechazados", logs.size());
            response.put("logs", logs);

            return response;

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Error general procesando importación");
            response.put("error", e.getMessage());
            response.put("logs", logs);
            return response;
        }
    }
    private Date parseSqlDate(Object value) {
        try {
            if (value == null) return null;

            String s = value.toString().trim();

            if (s.isEmpty() || "null".equalsIgnoreCase(s) || "undefined".equalsIgnoreCase(s)) {
                return null;
            }

            if (s.length() >= 10) {
                s = s.substring(0, 10);
            }

            return Date.valueOf(s);
        } catch (Exception e) {
            System.err.println("Fecha inválida recibida: " + value);
            return null;
        }
    }
    private Map<String, Object> buildTable(String name, List<List<Object>> values) {
        Map<String, Object> table = new HashMap<>();
        table.put("name", name);
        table.put("values", values != null ? values : new ArrayList<>());
        return table;
    }

    private List<List<Object>> safeValues(String tableName, java.util.function.Supplier<List<List<Object>>> supplier) {
        try {
            List<List<Object>> values = supplier.get();
            return values != null ? values : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error exportando tabla " + tableName + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    @GetMapping("/data/json2")
    public Map<String, Object> getData() {
        Iterable<PersonasEntity> data = personasRepo.findAll();
        Iterable<ControlesEntity> dataControles=controlesRepo.findAll();
        Iterable<ControlEmbarazoEntity> dataControlEmbarazo=controlEmbarazoRepo.findAll();

        Iterable<InmunizacionesControlEntity> dataInmunizacionesControl=inmunizacionesControlRepo.findBYLast(syncTableRepo.buscarUltimoLast());

        Iterable<LaboratoriosRealizadosEntity> dataLaboratorioRealizado=laboratoriosRealizadosRepo.findBYLast(syncTableRepo.buscarUltimoLast());
        Iterable<UbicacionesEntity> dataUbicaciones=ubicacionesRepo.findAll();
        Iterable<AntecedentesEntity> dataAntecedentes=antecedentesRepo.findAll();
        Iterable<AntecedentesAppsEntity>  dataAntecedentesApss=antecedentesAppsRepo.findAll();
        Iterable<AntecedentesMacsEntity> dataAtecedentesMacs=antecedentesMacsRepo.findAll();
        Iterable<UsuariosEntity> dataUsuarios=usuarioRepo.findAll();

        List<Object> row = new ArrayList<>();
        Map<String, Object> json= new HashMap<>();

        Map<String, Object> table = new HashMap<>();
        Map<String, Object> tableControles = new HashMap<>();
        Map<String,Object>  tableControlEmbarazo=new HashMap<>();
        Map<String,Object> tableInmunizacionesControl=new HashMap<>();
        Map<String,Object> tableLaboratorioRealizados=new HashMap<>();
        Map<String,Object> tableUbicaciones=new HashMap<>();
        Map<String,Object> tableAntecedentes=new HashMap<>();
        Map<String,Object> tableAntecedentesApps=new HashMap<>();
        Map<String,Object> tableAntecedentesMacs=new HashMap<>();
        Map<String,Object> tableUsuarios=new HashMap<>();

        PersonaSrevice ps=new PersonaSrevice();
        ControlesService cs=new ControlesService();
        ControlEmbarazoService ce=new ControlEmbarazoService();
        InmunizacionesControlService ic= new InmunizacionesControlService();
        LaboratoriosRealizadosService lr=new LaboratoriosRealizadosService();
        UbicacionesService ub=new UbicacionesService();
        AntecedentesService an=new AntecedentesService();
        AntecedentesApps aapps=new AntecedentesApps();
        AntededentesMacs amacs=new AntededentesMacs();
        UsuarioService us=new UsuarioService();

        List<List<Object>> valuesPersonas= ps.valuesPersonas(data) ;
        List<List<Object>> valuesControles=cs.valuesControles(dataControles);
        List<List<Object>> valuesControlEmbarazo=ce.valuesControlEmbarazo(dataControlEmbarazo);
        List<List<Object>>  valuesInmunizacionesControl=ic.InmunizacionesControl(dataInmunizacionesControl);
        List<List<Object>> valuesLaboratotiosRealizados=lr.LaboratoriosRealizados(dataLaboratorioRealizado);
        List<List<Object>> valuesUbicaciones=ub.UbicacionesValues(dataUbicaciones);
        List<List<Object>> valuesAntecedentes=an.AntecedentesValues(dataAntecedentes);
        List<List<Object>> valuesAntedentesApps=aapps.AntecedentesAppsValues(dataAntecedentesApss);
        List<List<Object>> valuesAntecedentesMacs=amacs.AntecedentesMacsValues(dataAtecedentesMacs);
        List<List<Object>> valuesUsuarios=us.valuesUsuarios(dataUsuarios);
        /*
        *
        * Arma el primer nivel del json
        *
        */
        json.put("database", bbdd);
        json.put("version" ,2);
        //json.put("overwrite",true);
        json.put("encrypted", false);
        json.put("mode","partial");
        /*
         *Tabla personas
        */
        table.put("name", "personas");
        table.put("values", valuesPersonas);
        row.add(table);
        /*
         *Tabla usuarios
         */
        tableUsuarios.put("name", "usuarios");
        tableUsuarios.put("values", valuesUsuarios);
        row.add(tableUsuarios);

        /*
        *Tabla controles
        */
        tableControles.put("name", "controles");
       tableControles.put("values", valuesControles);
        row.add(tableControles);

        /*
        *Tabla contol embarazo
         */
        tableControlEmbarazo.put("name", "control_embarazo");
        tableControlEmbarazo.put("values",valuesControlEmbarazo);
        row.add(tableControlEmbarazo);

        /*
        *Tabla inmunizaciones_control
         */
        tableInmunizacionesControl.put("name","inmunizaciones_control");
        tableInmunizacionesControl.put("values",valuesInmunizacionesControl);
        row.add(tableInmunizacionesControl);

        /*
        *Tabla laboratorios_realizados
         */
        tableLaboratorioRealizados.put("name","laboratorios_realizados");
        tableLaboratorioRealizados.put("values",valuesLaboratotiosRealizados);
        row.add(tableLaboratorioRealizados);

        /*
        *Tabla ubicaciones
         */
        tableUbicaciones.put("name","ubicaciones");
        tableUbicaciones.put("values",valuesUbicaciones);
        row.add(tableUbicaciones);

        /*
        *Tabla antecedentes
         */
        tableAntecedentes.put("name","antecedentes");
        tableAntecedentes.put("values",valuesAntecedentes);
        row.add(tableAntecedentes);
        /*
        *Tabla antecedentes_apss
         */
        tableAntecedentesApps.put("name","antecedentes_apps");
        tableAntecedentesApps.put("values",valuesAntedentesApps);
        row.add(tableAntecedentesApps);

        /*
        *Table antecedentes_macs
         */
        tableAntecedentesMacs.put("name","antecedentes_macs");
        tableAntecedentesMacs.put("values",valuesAntecedentesMacs);
        row.add(tableAntecedentesMacs);

        json.put("tables",row);

        return json;
    }
    @GetMapping("/data/json3")
    public Map<String, Object> getDataall() {
        Map<String, Object> json = new HashMap<>();
        List<Object> row = new ArrayList<>();

        try {
            json.put("database", bbdd);
            json.put("version", 2);
            json.put("encrypted", false);
            json.put("mode", "partial");

            PersonaSrevice ps = new PersonaSrevice();
            ControlesService cs = new ControlesService();
            ControlEmbarazoService ce = new ControlEmbarazoService();
            InmunizacionesControlService ic = new InmunizacionesControlService();
            LaboratoriosRealizadosService lr = new LaboratoriosRealizadosService();
            UbicacionesService ub = new UbicacionesService();
            AntecedentesService an = new AntecedentesService();
            AntecedentesApps aapps = new AntecedentesApps();
            AntededentesMacs amacs = new AntededentesMacs();
            EtmisPersonasService ep = new EtmisPersonasService();
            UsuarioService us = new UsuarioService();
            PaisesService paisesServices = new PaisesService();
            AreasService areaServices = new AreasService();
            ParajeService parajeService = new ParajeService();

            row.add(buildTable("personas",
                    safeValues("personas", () -> ps.valuesPersonas(personasRepo.findAll()))));

            row.add(buildTable("usuarios",
                    safeValues("usuarios", () -> us.valuesUsuarios(usuarioRepo.findAll()))));

            row.add(buildTable("controles",
                    safeValues("controles", () -> cs.valuesControles(controlesRepo.findAll()))));

            row.add(buildTable("control_embarazo",
                    safeValues("control_embarazo", () -> ce.valuesControlEmbarazo(controlEmbarazoRepo.findAll()))));

            row.add(buildTable("inmunizaciones_control",
                    safeValues("inmunizaciones_control", () ->
                            ic.InmunizacionesControl(inmunizacionesControlRepo.findAll()))));

            row.add(buildTable("laboratorios_realizados",
                    safeValues("laboratorios_realizados", () ->
                            lr.LaboratoriosRealizados(laboratoriosRealizadosRepo.findAll()))));

            row.add(buildTable("ubicaciones",
                    safeValues("ubicaciones", () -> ub.UbicacionesValues(ubicacionesRepo.findAll()))));

            row.add(buildTable("antecedentes",
                    safeValues("antecedentes", () -> an.AntecedentesValues(antecedentesRepo.findAll()))));

            row.add(buildTable("antecedentes_apps",
                    safeValues("antecedentes_apps", () -> aapps.AntecedentesAppsValues(antecedentesAppsRepo.findAll()))));

            row.add(buildTable("antecedentes_macs",
                    safeValues("antecedentes_macs", () -> amacs.AntecedentesMacsValues(antecedentesMacsRepo.findAll()))));

            row.add(buildTable("etmis_personas",
                    safeValues("etmis_personas", () -> ep.EtmisPersonasValues(etmisPersonasRepo.findAll()))));

            row.add(buildTable("paises",
                    safeValues("paises", () -> paisesServices.valuesPaises(paisesRepo.findAll()))));

            row.add(buildTable("areas",
                    safeValues("areas", () -> areaServices.valuesAreas(areasRepo.findAll()))));

            row.add(buildTable("parajes",
                    safeValues("parajes", () -> parajeService.valuesParajes(parajesRepo.findAll()))));

            json.put("tables", row);
            json.put("success", true);
            return json;

        } catch (Exception e) {
            e.printStackTrace();
            json.put("database", bbdd);
            json.put("version", 2);
            json.put("encrypted", false);
            json.put("mode", "partial");
            json.put("tables", row);
            json.put("success", false);
            json.put("error", e.toString());
            return json;
        }
    }
    @GetMapping("/data/json")
    public ResponseEntity<String> getDataAsJson() throws JsonProcessingException {
        Iterable<PersonasEntity> data = personasRepo.findAll();
        ObjectMapper objectMapper = new ObjectMapper();
        String dataJson = objectMapper.writeValueAsString(data);
        return ResponseEntity.ok(dataJson);
    }
    @PostMapping("/sync_date")
    public HashMap<String, Object> last(@RequestBody SyncTableEntity sync){
        HashMap<String, Object> response=new HashMap<>();
        SyncTableEntity sync_table=new SyncTableEntity();
        System.out.println(sync.toString());

        try {
            sync_table.setSyncDate(sync.getSyncDate());
            syncTableRepo.save(sync_table);
            response.put("success",true);

        }
        catch (Exception e){
            response.put("error", e.toString());

        }
        return  response;
    }

    @GetMapping("/ultimarowdevice")
    public Map<String, Object> getLastRow() {
        HashMap<String, Object> response = new HashMap<>();
        try {
            Iterable<IdsegundeviceEntity> lastrow = idSegunDeviceRepo.getLastRoe();
            response.put("data", lastrow);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }
    @PostMapping("/crearultimoid")
    public HashMap<String, Object> crearUltimoidDevicw(@RequestBody IdsegundeviceEntity device){
        HashMap<String, Object> response = new HashMap<>();
        IdsegundeviceEntity _device=new IdsegundeviceEntity();

        try {
            _device.setIdDevice(device.getIdDevice());
            _device.setNroDevice(device.getNroDevice());
            _device.setMinId(device.getMinId());
            _device.setMaxId(device.getMaxId());
            _device.setSqlDelete(device.getSqlDelete());
            _device.setLastModified(device.getLastModified());
            Integer id=idSegunDeviceRepo.save(_device).getIdDevice();
            response.put("data",id);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }
    @GetMapping("/findbynrodevice/{parametro}")
    public HashMap<String, Object> numero_device(@PathVariable String parametro){
        HashMap<String, Object> response = new HashMap<>();

        try {
            Optional device=idSegunDeviceRepo.findByNroDevice(parametro);
            response.put("data",device);
            response.put("success", true);
            return response;
        } catch (Exception e) {
            response.put("error", e.toString());
        }
        return response;
    }
    }



