package edu.unsada.apimundosano.Controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.unsada.apimundosano.models.*;
import edu.unsada.apimundosano.repositorio.*;


import edu.unsada.apimundosano.service.*;
import edu.unsada.apimundosano.utilidades.JsonSqlite;
import edu.unsada.apimundosano.utilidades.JsonTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
            Iterable<PersonasEntity> personas = personasRepo.findBySqlDeletedOrSqlDeletedIsNull(0);
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
        log.put("ts", LocalDateTime.now().toString());

        logs.add(log);

        System.err.println("RECHAZADO -> tabla=" + tabla
                + ", idPersona=" + idPersona
                + ", idControl=" + idControl
                + ", idReferencia=" + idReferencia
                + ", motivo=" + motivo
                + ", payload=" + payload);

        appendLogToFile(log);
    }

    private void appendLogToFile(Map<String, Object> log) {
        try {
            Path folder = Path.of("logs");
            Files.createDirectories(folder);
            Path file = folder.resolve("import_sync.log");
            String line = new ObjectMapper().writeValueAsString(log) + System.lineSeparator();
            Files.writeString(file, line, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            // Si falla el log en disco no interrumpimos el flujo
            System.err.println("No se pudo escribir import_sync.log: " + e.getMessage());
        }
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

    private Date parseDate(Object value) {
        if (value == null) return null;
        String s = String.valueOf(value).trim();
        if (s.isEmpty() || "null".equalsIgnoreCase(s)) return null;
        try {
            return Date.valueOf(LocalDate.parse(s));
        } catch (Exception e1) {
            try {
                // ISO date-time -> take date part
                LocalDate ld = LocalDateTime.parse(s, DateTimeFormatter.ISO_DATE_TIME).toLocalDate();
                return Date.valueOf(ld);
            } catch (Exception e2) {
                if (s.length() >= 10) {
                    try {
                        return Date.valueOf(LocalDate.parse(s.substring(0, 10)));
                    } catch (Exception ignored) {}
                }
                // prefer null over romper import
                return null;
            }
        }
    }

    @PostMapping("/sqlite")
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
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

        // Mapas de traducción de IDs (Mobile ID -> Server ID)
        Map<Integer, Integer> mapPersonas = new HashMap<>();
        Map<Integer, Integer> mapControles = new HashMap<>();
        Map<Integer, Integer> mapAntecedentes = new HashMap<>();

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

            /*
             * =========================
             * 1) PERSONAS
             * =========================
             */
            for (List valor : personasValues) {
                Integer idPersonaMovil = safeInt(valor, 0);
                String uuid = safeString(valor, 13);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "personas", idPersonaMovil, null, null, "UUID nulo o vacío", valor);
                        continue;
                    }

                    // Look-up by UUID (Deterministic Identity)
                    PersonasEntity personas = personasRepo.findByUuid(uuid).orElse(new PersonasEntity());
                    
                    // Si es nuevo, dejamos que la DB asigne el ID; si existe, conservamos el ID del servidor.
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
                    personas.setUuid(uuid);

                    personasRepo.save(personas);
                    
                    // Guardamos el mapeo para descendientes
                    if (idPersonaMovil != null) {
                        mapPersonas.put(idPersonaMovil, personas.getIdPersona());
                    }
                    personasGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "personas", idPersonaMovil, null, null, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 2) CONTROLES
             * =========================
             */
            for (List valor : controlesValues) {
                Integer idControlMovil = safeInt(valor, 0);
                Integer idPersonaMovil = safeInt(valor, 2);
                String uuid = safeString(valor, 18);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "controles", idPersonaMovil, idControlMovil, null, "UUID de control nulo", valor);
                        continue;
                    }

                    // Traducción de ID de Persona
                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    if (serverIdPersona == null) {
                        // Si no estaba en el payload, intentamos buscarlo en la DB si existe la persona
                        serverIdPersona = idPersonaMovil; // Fallback al ID original por ahora
                    }

                    ControlesEntity controles = controlesRepo.findByUuid(uuid).orElse(new ControlesEntity());
                    
                    controles.setFecha(parseSqlDate(getValue(valor, 1)));
                    controles.setIdPersona(serverIdPersona);
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
                    controles.setUuid(uuid);

                    controlesRepo.save(controles);
                    
                    if (idControlMovil != null) {
                        mapControles.put(idControlMovil, controles.getIdControl());
                    }
                    controlesGuardados++;

                } catch (Exception e) {
                    addLog(logs, "controles", idPersonaMovil, idControlMovil, null, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 3) UBICACIONES (dependen de persona)
             * =========================
             */
            for (List valor : ubicacionesValues) {
                Integer idUbicacionMovil = safeInt(valor, 0);
                Integer idPersonaMovil = safeInt(valor, 1);
                String uuid = safeString(valor, 10);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "ubicaciones", idPersonaMovil, null, idUbicacionMovil, "UUID de ubicación nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    if (serverIdPersona == null) {
                        serverIdPersona = idPersonaMovil;
                    }

                    UbicacionesEntity ubicaciones = ubicacionesRepo.findByUuid(uuid).orElse(new UbicacionesEntity());
                    
                    ubicaciones.setIdPersona(serverIdPersona);
                    ubicaciones.setIdParaje(safeInt(valor, 2));
                    ubicaciones.setIdArea(safeInt(valor, 3));
                    ubicaciones.setNumVivienda(safeString(valor, 4));
                    ubicaciones.setFecha(parseSqlDate(getValue(valor, 5)));
                    ubicaciones.setGeoreferencia(safeString(valor, 6));
                    ubicaciones.setIdPais(safeInt(valor, 7));
                    ubicaciones.setSqlDeleted(safeInt(valor, 8));
                    ubicaciones.setLastModified(safeInt(valor, 9));
                    ubicaciones.setUuid(uuid);

                    ubicacionesRepo.save(ubicaciones);
                    ubicacionesGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "ubicaciones", idPersonaMovil, null, idUbicacionMovil, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 4) ANTECEDENTES (dependen de persona + control)
             * =========================
             */
            for (List valor : antecedentesValues) {
                Integer idAntecedenteMovil = safeInt(valor, 0);
                Integer idPersonaMovil = safeInt(valor, 1);
                Integer idControlMovil = safeInt(valor, 2);
                String uuid = safeString(valor, 14);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "antecedentes", idPersonaMovil, idControlMovil, idAntecedenteMovil, "UUID de antecedente nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    Integer serverIdControl = mapControles.get(idControlMovil);

                    AntecedentesEntity antecedentes = antecedentesRepo.findByUuid(uuid).orElse(new AntecedentesEntity());
                    
                    antecedentes.setIdPersona(serverIdPersona != null ? serverIdPersona : idPersonaMovil);
                    antecedentes.setIdControl(serverIdControl != null ? serverIdControl : idControlMovil);
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
                    antecedentes.setUuid(uuid);

                    antecedentesRepo.save(antecedentes);

                    if (idAntecedenteMovil != null) {
                        mapAntecedentes.put(idAntecedenteMovil, antecedentes.getIdAntecedente());
                    }

                    antecedentesGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes", idPersonaMovil, idControlMovil, idAntecedenteMovil, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 5) CONTROL EMBARAZO (depende de control)
             * =========================
             */
            for (List valor : controlEmbarazoValues) {
                Integer idControlEmbarazoMovil = safeInt(valor, 0);
                Integer idControlMovil = safeInt(valor, 1);
                String uuid = safeString(valor, 15);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "control_embarazo", null, idControlMovil, idControlEmbarazoMovil, "UUID de control_embarazo nulo", valor);
                        continue;
                    }

                    Integer serverIdControl = mapControles.get(idControlMovil);

                    ControlEmbarazoEntity controlEmbarazo = controlEmbarazoRepo.findByUuid(uuid).orElse(new ControlEmbarazoEntity());

                    controlEmbarazo.setIdControl(serverIdControl != null ? serverIdControl : idControlMovil);
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
                    controlEmbarazo.setUuid(uuid);

                    controlEmbarazoRepo.save(controlEmbarazo);
                    controlEmbarazoGuardados++;

                } catch (Exception e) {
                    addLog(logs, "control_embarazo", null, idControlMovil, idControlEmbarazoMovil, e.getMessage(), valor);
                }
            }
            /*
             * =========================
             * 6) INMUNIZACIONES (dependen de persona + control)
             * =========================
             */
            for (List valor : inmunizacionesValues) {
                Integer idPersonaMovil = safeInt(valor, 0);
                Integer idControlMovil = safeInt(valor, 1);
                Integer idInmunizacion = safeInt(valor, 2);
                String uuid = safeString(valor, 6);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "inmunizaciones_control", idPersonaMovil, idControlMovil, idInmunizacion, "UUID de inmunización nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    Integer serverIdControl = mapControles.get(idControlMovil);

                    InmunizacionesControlEntity inmunizacionesControl = 
                            inmunizacionesControlRepo.findByUuid(uuid).orElse(new InmunizacionesControlEntity());

                    inmunizacionesControl.setIdPersona(serverIdPersona != null ? serverIdPersona : idPersonaMovil);
                    inmunizacionesControl.setIdControl(serverIdControl != null ? serverIdControl : idControlMovil);
                    inmunizacionesControl.setIdInmunizacion(idInmunizacion);
                    inmunizacionesControl.setEstado(safeStringNotNull(valor, 3));
                    inmunizacionesControl.setSqlDeleted(safeInt(valor, 4));
                    inmunizacionesControl.setLastModified(safeInt(valor, 5));
                    inmunizacionesControl.setUuid(uuid);

                    inmunizacionesControlRepo.save(inmunizacionesControl);
                    inmunizacionesGuardadas++;

                } catch (Exception e) {
                    addLog(logs, "inmunizaciones_control", idPersonaMovil, idControlMovil, idInmunizacion, e.getMessage(), valor);
                }
            }
            /*
             * =========================
             * 7) LABORATORIOS (dependen de persona + control)
             * =========================
             */
            for (List valor : laboratoriosValues) {
                Integer idPersonaMovil = safeInt(valor, 0);
                Integer idControlMovil = safeInt(valor, 1);
                Integer idLaboratorio = safeInt(valor, 2);
                String uuid = safeString(valor, 10);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "laboratorios_realizados", idPersonaMovil, idControlMovil, idLaboratorio, "UUID de laboratorio nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    Integer serverIdControl = mapControles.get(idControlMovil);

                    LaboratoriosRealizadosEntity laboratoriosRealizados = 
                            laboratoriosRealizadosRepo.findByUuid(uuid).orElse(new LaboratoriosRealizadosEntity());

                    laboratoriosRealizados.setIdPersona(serverIdPersona != null ? serverIdPersona : idPersonaMovil);
                    laboratoriosRealizados.setIdControl(serverIdControl != null ? serverIdControl : idControlMovil);
                    laboratoriosRealizados.setIdLaboratorio(idLaboratorio);
                    laboratoriosRealizados.setTrimestre(safeInt(valor, 3));
                    laboratoriosRealizados.setFechaRealizado(parseSqlDate(getValue(valor, 4)));
                    laboratoriosRealizados.setFechaResultados(parseSqlDate(getValue(valor, 5)));
                    laboratoriosRealizados.setResultado(safeStringNotNull(valor, 6));
                    laboratoriosRealizados.setIdEtmi(safeInt(valor, 7));
                    laboratoriosRealizados.setSqlDeleted(safeInt(valor, 8));
                    laboratoriosRealizados.setLastModified(safeInt(valor, 9));
                    laboratoriosRealizados.setUuid(uuid);

                    laboratoriosRealizadosRepo.save(laboratoriosRealizados);
                    laboratoriosGuardados++;

                } catch (Exception e) {
                    addLog(logs, "laboratorios_realizados", idPersonaMovil, idControlMovil, idLaboratorio, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 8) ETMIS (dependen de persona + control)
             * =========================
             */
            for (List valor : etmisValues) {
                Integer idPersonaMovil = safeInt(valor, 0);
                Integer idEtmi = safeInt(valor, 1);
                Integer idControlMovil = safeInt(valor, 2);
                String uuid = safeString(valor, 6);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "etmis_personas", idPersonaMovil, idControlMovil, idEtmi, "UUID de ETMI nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = mapPersonas.get(idPersonaMovil);
                    Integer serverIdControl = mapControles.get(idControlMovil);

                    EtmisPersonasEntity etmisPersonasEntity = 
                            etmisPersonasRepo.findByUuid(uuid).orElse(new EtmisPersonasEntity());

                    etmisPersonasEntity.setIdPersona(serverIdPersona != null ? serverIdPersona : idPersonaMovil);
                    etmisPersonasEntity.setIdEtmi(idEtmi);
                    etmisPersonasEntity.setIdControl(serverIdControl != null ? serverIdControl : idControlMovil);
                    etmisPersonasEntity.setConfirmada(safeInt(valor, 3));
                    etmisPersonasEntity.setSqlDeleted(safeInt(valor, 4));
                    etmisPersonasEntity.setLastModified(safeInt(valor, 5));
                    etmisPersonasEntity.setUuid(uuid);

                    etmisPersonasRepo.save(etmisPersonasEntity);
                    etmisGuardados++;

                } catch (Exception e) {
                    addLog(logs, "etmis_personas", idPersonaMovil, idControlMovil, idEtmi, e.getMessage(), valor);
                }
            }
            /*
             * =========================
             * 9) ANTECEDENTES_APPS (dependen de antecedente)
             * =========================
             */
            for (List valor : antecedentesAppsValues) {
                Integer idAntecedenteMovil = safeInt(valor, 0);
                Integer idApp = safeInt(valor, 1);
                String uuid = safeString(valor, 4);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "antecedentes_apps", null, null, idAntecedenteMovil, "UUID de antecedente_app nulo", valor);
                        continue;
                    }

                    Integer serverIdAntecedente = mapAntecedentes.get(idAntecedenteMovil);

                    AntecedentesAppsEntity antecedentesApps = 
                            antecedentesAppsRepo.findByUuid(uuid).orElse(new AntecedentesAppsEntity());

                    antecedentesApps.setIdAntecedente(serverIdAntecedente != null ? serverIdAntecedente : idAntecedenteMovil);
                    antecedentesApps.setIdApp(idApp);
                    antecedentesApps.setLastModified(safeInt(valor, 2));
                    antecedentesApps.setSqlDeleted(safeInt(valor, 3));
                    antecedentesApps.setUuid(uuid);

                    antecedentesAppsRepo.save(antecedentesApps);
                    antecedentesAppsGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes_apps", null, null, idAntecedenteMovil, e.getMessage(), valor);
                }
            }

            /*
             * =========================
             * 10) ANTECEDENTES_MACS (dependen de antecedente)
             * =========================
             */
            for (List valor : antecedentesMacsValues) {
                Integer idAntecedenteMovil = safeInt(valor, 0);
                Integer idMac = safeInt(valor, 1);
                String uuid = safeString(valor, 4);

                try {
                    if (uuid == null || uuid.isEmpty()) {
                        addLog(logs, "antecedentes_macs", null, null, idAntecedenteMovil, "UUID de antecedente_mac nulo", valor);
                        continue;
                    }

                    Integer serverIdAntecedente = mapAntecedentes.get(idAntecedenteMovil);

                    AntecedentesMacsEntity antecedentesMacs = 
                            antecedentesMacsRepo.findByUuid(uuid).orElse(new AntecedentesMacsEntity());

                    antecedentesMacs.setIdAntecedente(serverIdAntecedente != null ? serverIdAntecedente : idAntecedenteMovil);
                    antecedentesMacs.setIdMac(idMac);
                    antecedentesMacs.setSqlDeleted(safeInt(valor, 2));
                    antecedentesMacs.setLastModified(safeInt(valor, 3));
                    antecedentesMacs.setUuid(uuid);

                    antecedentesMacsRepo.save(antecedentesMacs);
                    antecedentesMacsGuardados++;

                } catch (Exception e) {
                    addLog(logs, "antecedentes_macs", null, null, idAntecedenteMovil, e.getMessage(), valor);
                }
            }

            response.put("success", true);
            response.put("message", "Importación procesada con arquitectura UUID");
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
            // No bloquear la sync: devolvemos parciales y el detalle del problema
            e.printStackTrace();
            response.put("success", true);
            response.put("message", "Importación completada con errores parciales (no se bloqueó la sync)");
            response.put("error", e.getMessage());
            response.put("logs", logs);
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
        Iterable<PersonasEntity> data = personasRepo.findBySqlDeletedOrSqlDeletedIsNull(0);
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
        Map<String, Object> errorJson = new HashMap<>();

        try {
            ObjectMapper mapper = new ObjectMapper();
            java.io.InputStream is = new org.springframework.core.io.ClassPathResource("schema.json").getInputStream();
            Map<String, Object> json = mapper.readValue(is, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>(){});
            
            json.put("database", bbdd);
            json.put("version", 2);
            json.put("encrypted", false);
            json.put("mode", "partial");
            
            List<Map<String, Object>> tables = (List<Map<String, Object>>) json.get("tables");

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

            for (Map<String, Object> t : tables) {
                String tName = (String) t.get("name");
                if (tName == null) continue;
                
                // Trim schema column names dynamically just in case
                List<Map<String, Object>> schema = (List<Map<String, Object>>) t.get("schema");
                if (schema != null) {
                    for (Map<String, Object> s : schema) {
                        if (s.containsKey("column")) {
                            s.put("column", ((String) s.get("column")).trim());
                        }
                    }
                }

                switch(tName) {
                    case "personas":
                        t.put("values", safeValues("personas", () -> ps.valuesPersonas(personasRepo.findBySqlDeletedOrSqlDeletedIsNull(0))));
                        break;
                    case "usuarios":
                        t.put("values", safeValues("usuarios", () -> us.valuesUsuarios(usuarioRepo.findAll())));
                        break;
                    case "controles":
                        t.put("values", safeValues("controles", () -> cs.valuesControles(controlesRepo.findAll())));
                        break;
                    case "control_embarazo":
                        t.put("values", safeValues("control_embarazo", () -> ce.valuesControlEmbarazo(controlEmbarazoRepo.findAll())));
                        break;
                    case "inmunizaciones_control":
                        t.put("values", safeValues("inmunizaciones_control", () -> ic.InmunizacionesControl(inmunizacionesControlRepo.findAll())));
                        break;
                    case "laboratorios_realizados":
                        t.put("values", safeValues("laboratorios_realizados", () -> lr.LaboratoriosRealizados(laboratoriosRealizadosRepo.findAll())));
                        break;
                    case "ubicaciones":
                        t.put("values", safeValues("ubicaciones", () -> ub.UbicacionesValues(ubicacionesRepo.findAll())));
                        break;
                    case "antecedentes":
                        t.put("values", safeValues("antecedentes", () -> an.AntecedentesValues(antecedentesRepo.findAll())));
                        break;
                    case "antecedentes_apps":
                        t.put("values", safeValues("antecedentes_apps", () -> aapps.AntecedentesAppsValues(antecedentesAppsRepo.findAll())));
                        break;
                    case "antecedentes_macs":
                        t.put("values", safeValues("antecedentes_macs", () -> amacs.AntecedentesMacsValues(antecedentesMacsRepo.findAll())));
                        break;
                    case "etmis_personas":
                        t.put("values", safeValues("etmis_personas", () -> ep.EtmisPersonasValues(etmisPersonasRepo.findAll())));
                        break;
                    case "paises":
                        t.put("values", safeValues("paises", () -> paisesServices.valuesPaises(paisesRepo.findAll())));
                        break;
                    case "areas":
                        t.put("values", safeValues("areas", () -> areaServices.valuesAreas(areasRepo.findAll())));
                        break;
                    case "parajes":
                        t.put("values", safeValues("parajes", () -> parajeService.valuesParajes(parajesRepo.findAll())));
                        break;
                }
            }

            return json;

        } catch (Exception e) {
            e.printStackTrace();
            errorJson.put("database", bbdd);
            errorJson.put("version", 2);
            errorJson.put("encrypted", false);
            errorJson.put("mode", "partial");
            errorJson.put("tables", new ArrayList<>());
            return errorJson;
        }
    }
    @GetMapping("/data/json")
    public ResponseEntity<String> getDataAsJson() throws JsonProcessingException {
        Iterable<PersonasEntity> data = personasRepo.findBySqlDeletedOrSqlDeletedIsNull(0);
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
            _device.setSqlDeleted(device.getSqlDeleted());
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



