package edu.unsada.apimundosano.Controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.unsada.apimundosano.models.*;
import edu.unsada.apimundosano.repositorio.*;
import edu.unsada.apimundosano.service.*;
import edu.unsada.apimundosano.utilidades.JsonSqlite;
import edu.unsada.apimundosano.utilidades.JsonSyncMeta;
import edu.unsada.apimundosano.utilidades.JsonTable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.function.Function;
import java.util.function.Supplier;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class ExportControler {

    private static final int EXPORT_VERSION = 2;
    private static final String MODE_FULL = "full";
    private static final String MODE_PARTIAL = "partial";

    private final ObjectMapper objectMapper = new ObjectMapper();

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
    private UniversalUpsertService universalUpsertService;
    @Autowired
    private SyncTableRepo syncTableRepo;
    @Autowired
    private EtmisPersonasRepo etmisPersonasRepo;
    @Autowired
    private UsuarioRepo usuarioRepo;
    @Autowired
    private PaisesRepo paisesRepo;
    @Autowired
    private AreasRepo areasRepo;
    @Autowired
    private ParajesRepo parajesRepo;
    @Autowired
    private SyncAuditService syncAuditService;

    @Value("${mundosano.app.bbdd}")
    private String bbdd;

    /*
     * IMPORTANTE:
     * - Este método debe quedar SIN @Transactional en el controller.
     * - Requiere UniversalUpsertService con:
     * - upsertSimplePkByUuid(...)
     * - upsertCompositePkByUuid(...)
     * - Las transacciones quedan encapsuladas en el service con REQUIRES_NEW.
     */

    @PostMapping("/sqlite")
    public HashMap<String, Object> postSqlite(@RequestBody JsonSqlite json) {
        HashMap<String, Object> response = new HashMap<>();
        List<Map<String, Object>> logs = new ArrayList<>();
        String syncBatchId = resolveSyncBatchId(json);

        try {
            JsonSyncMeta syncMeta = json != null ? json.getSyncMeta() : null;
            syncBatchId = syncAuditService.registerBatchStart(syncBatchId, syncMeta);
        } catch (Exception ignored) {
        }

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
        AtomicInteger conflictosLastModified = new AtomicInteger(0);

        Map<Integer, Integer> mapPersonas = new HashMap<>();
        Map<Integer, Integer> mapControles = new HashMap<>();
        Map<Integer, Integer> mapAntecedentes = new HashMap<>();
        Map<Integer, String> mapPersonaUuidByMobileId = new HashMap<>();
        Map<Integer, String> mapControlUuidByMobileId = new HashMap<>();
        Map<Integer, String> mapAntecedenteUuidByMobileId = new HashMap<>();

        try {
            Map<String, List<List>> tablas = extractTables(json);
            Map<String, List<String>> columnsByTable = loadSchemaColumns();

            List<List> personasValues = getTableValues(tablas, "personas");
            List<List> controlesValues = getTableValues(tablas, "controles");
            List<List> controlEmbarazoValues = getTableValues(tablas, "control_embarazo");
            List<List> inmunizacionesValues = getTableValues(tablas, "inmunizaciones_control");
            List<List> laboratoriosValues = getTableValues(tablas, "laboratorios_realizados");
            List<List> ubicacionesValues = getTableValues(tablas, "ubicaciones");
            List<List> antecedentesValues = getTableValues(tablas, "antecedentes");
            List<List> antecedentesAppsValues = getTableValues(tablas, "antecedentes_apps");
            List<List> antecedentesMacsValues = getTableValues(tablas, "antecedentes_macs");
            List<List> etmisValues = getTableValues(tablas, "etmis_personas");

            preScanUuids(
                    personasValues,
                    controlesValues,
                    antecedentesValues,
                    columnsByTable,
                    mapPersonaUuidByMobileId,
                    mapControlUuidByMobileId,
                    mapAntecedenteUuidByMobileId);

            /*
             * =========================
             * 1) PERSONAS (PK simple)
             * =========================
             */
            for (List valor : personasValues) {
                Map<String, Object> row = rowToMap("personas", valor, columnsByTable);
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "personas", idPersonaMovil, null, null, "UUID nulo o vacío", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    PersonasEntity nuevaPersona = new PersonasEntity();
                    nuevaPersona.setApellido(safeString(row.get("apellido")));
                    nuevaPersona.setNombre(safeString(row.get("nombre")));
                    nuevaPersona.setDocumento(safeString(row.get("documento")));
                    nuevaPersona.setFechaNacimiento(parseSqlDate(row.get("fecha_nacimiento")));
                    nuevaPersona.setIdOrigen(safeInt(row.get("id_origen")));
                    nuevaPersona.setNacionalidad(safeInt(row.get("nacionalidad")));
                    nuevaPersona.setSexo(safeString(row.get("sexo")));
                    nuevaPersona.setMadre(safeInt(row.get("madre")));
                    nuevaPersona.setAlta(safeInt(row.get("alta")));
                    nuevaPersona.setNacidoVivo(safeInt(row.get("nacido_vivo")));
                    nuevaPersona.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevaPersona.setLastModified(incomingLastModified);
                    nuevaPersona.setUuid(uuid);

                    PersonasEntity personaPersistida = universalUpsertService.upsertSimplePkByUuid(
                            uuid,
                            personasRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    if (idPersonaMovil != null) {
                                        mapPersonas.put(idPersonaMovil, existente.getIdPersona());
                                    }
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyPersona(existente, nuevaPersona);
                            },
                            nuevaPersona,
                            PersonasEntity.class,
                            "idPersona",
                            idPersonaMovil);

                    if (idPersonaMovil != null) {
                        mapPersonas.put(idPersonaMovil, personaPersistida.getIdPersona());
                    }
                    personasGuardadas++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "personas", idPersonaMovil, null, null, e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 2) CONTROLES (PK simple)
             * =========================
             */
            for (List valor : controlesValues) {
                Map<String, Object> row = rowToMap("controles", valor, columnsByTable);
                Integer idControlMovil = safeInt(row.get("id_control"));
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "controles", idPersonaMovil, idControlMovil, null, "UUID de control nulo",
                                valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    if (serverIdPersona == null) {
                        addImportLog(logs, "controles", idPersonaMovil, idControlMovil, null,
                                "No se pudo resolver id_persona por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    ControlesEntity nuevoControl = new ControlesEntity();
                    nuevoControl.setFecha(parseSqlDate(row.get("fecha")));
                    nuevoControl.setIdPersona(serverIdPersona);
                    nuevoControl.setControlNumero(safeInt(row.get("control_numero")));
                    nuevoControl.setIdEstado(safeInt(row.get("id_estado")));
                    nuevoControl.setIdSeguimientoChagas(safeInt(row.get("id_seguimiento_chagas")));
                    nuevoControl.setIdTratamientoChagas(safeInt(row.get("id_tratamiento_chagas")));
                    nuevoControl.setIdSeguimientoHiv(safeInt(row.get("id_seguimiento_hiv")));
                    nuevoControl.setIdTratamientoHiv(safeInt(row.get("id_tratamiento_hiv")));
                    nuevoControl.setIdSeguimientoSifilis(safeInt(row.get("id_seguimiento_sifilis")));
                    nuevoControl.setIdTratamientoSifilis(safeInt(row.get("id_tratamiento_sifilis")));
                    nuevoControl.setIdSeguimientoVhb(safeInt(row.get("id_seguimiento_vhb")));
                    nuevoControl.setIdTratamientoVhb(safeInt(row.get("id_tratamiento_vhb")));
                    nuevoControl.setFechaFinEmbarazo(parseSqlDate(row.get("fecha_fin_embarazo")));
                    nuevoControl.setIdTiposFinEmbarazos(safeInt(row.get("id_tipos_fin_embarazos")));
                    nuevoControl.setGeoreferencia(safeString(row.get("georeferencia")));
                    nuevoControl.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoControl.setLastModified(incomingLastModified);
                    nuevoControl.setUuid(uuid);

                    ControlesEntity controlPersistido = universalUpsertService.upsertSimplePkByUuid(
                            uuid,
                            controlesRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    if (idControlMovil != null) {
                                        mapControles.put(idControlMovil, existente.getIdControl());
                                    }
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyControl(existente, nuevoControl);
                            },
                            nuevoControl,
                            ControlesEntity.class,
                            "idControl",
                            idControlMovil);

                    if (idControlMovil != null) {
                        mapControles.put(idControlMovil, controlPersistido.getIdControl());
                    }
                    controlesGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "controles", idPersonaMovil, idControlMovil, null, e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 3) UBICACIONES (PK simple)
             * =========================
             */
            for (List valor : ubicacionesValues) {
                Map<String, Object> row = rowToMap("ubicaciones", valor, columnsByTable);
                Integer idUbicacionMovil = safeInt(row.get("id_ubicacion"));
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "ubicaciones", idPersonaMovil, null, idUbicacionMovil,
                                "UUID de ubicación nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    if (serverIdPersona == null) {
                        addImportLog(logs, "ubicaciones", idPersonaMovil, null, idUbicacionMovil,
                                "No se pudo resolver id_persona por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    UbicacionesEntity nuevaUbicacion = new UbicacionesEntity();
                    nuevaUbicacion.setIdPersona(serverIdPersona);
                    nuevaUbicacion.setIdParaje(safeInt(row.get("id_paraje")));
                    nuevaUbicacion.setIdArea(safeInt(row.get("id_area")));
                    nuevaUbicacion.setNumVivienda(safeString(row.get("num_vivienda")));
                    nuevaUbicacion.setFecha(parseSqlDate(row.get("fecha")));
                    nuevaUbicacion.setGeoreferencia(safeString(row.get("georeferencia")));
                    nuevaUbicacion.setIdPais(safeInt(row.get("id_pais")));
                    nuevaUbicacion.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevaUbicacion.setLastModified(incomingLastModified);
                    nuevaUbicacion.setUuid(uuid);

                    universalUpsertService.upsertSimplePkByUuid(
                            uuid,
                            ubicacionesRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyUbicacion(existente, nuevaUbicacion);
                            },
                            nuevaUbicacion,
                            UbicacionesEntity.class,
                            "idUbicacion",
                            idUbicacionMovil);

                    ubicacionesGuardadas++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "ubicaciones", idPersonaMovil, null, idUbicacionMovil, e.getMessage(),
                                valor);
                    }
                }
            }

            /*
             * =========================
             * 4) ANTECEDENTES (PK simple)
             * =========================
             */
            for (List valor : antecedentesValues) {
                Map<String, Object> row = rowToMap("antecedentes", valor, columnsByTable);
                Integer idAntecedenteMovil = safeInt(row.get("id_antecedente"));
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                Integer idControlMovil = safeInt(row.get("id_control"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "antecedentes", idPersonaMovil, idControlMovil, idAntecedenteMovil,
                                "UUID de antecedente nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    Integer serverIdControl = coalesceServerIdByUuid(
                            mapControles.get(idControlMovil),
                            mapControlUuidByMobileId.get(idControlMovil),
                            controlUuid -> controlesRepo.findByUuid(controlUuid)
                                    .map(ControlesEntity::getIdControl)
                                    .orElse(null));

                    if (serverIdPersona == null || serverIdControl == null) {
                        addImportLog(logs, "antecedentes", idPersonaMovil, idControlMovil, idAntecedenteMovil,
                                "No se pudo resolver relación persona/control por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    AntecedentesEntity nuevoAntecedente = new AntecedentesEntity();
                    nuevoAntecedente.setIdPersona(serverIdPersona);
                    nuevoAntecedente.setIdControl(serverIdControl);
                    nuevoAntecedente.setEdadPrimerEmbarazo(safeInt(row.get("edad_primer_embarazo")));
                    nuevoAntecedente.setFechaUltimoEmbarazo(parseSqlDate(row.get("fecha_ultimo_embarazo")));
                    nuevoAntecedente.setGestas(safeInt(row.get("gestas")));
                    nuevoAntecedente.setPartos(safeInt(row.get("partos")));
                    nuevoAntecedente.setCesareas(safeInt(row.get("cesareas")));
                    nuevoAntecedente.setAbortos(safeInt(row.get("abortos")));
                    nuevoAntecedente.setPlanificado(safeInt(row.get("planificado")));
                    nuevoAntecedente.setFum(parseSqlDate(row.get("fum")));
                    nuevoAntecedente.setFpp(parseSqlDate(row.get("fpp")));
                    nuevoAntecedente.setLastModified(incomingLastModified);
                    nuevoAntecedente.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoAntecedente.setUuid(uuid);

                    AntecedentesEntity antecedentePersistido = universalUpsertService.upsertSimplePkByUuid(
                            uuid,
                            antecedentesRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    if (idAntecedenteMovil != null) {
                                        mapAntecedentes.put(idAntecedenteMovil, existente.getIdAntecedente());
                                    }
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyAntecedente(existente, nuevoAntecedente);
                            },
                            nuevoAntecedente,
                            AntecedentesEntity.class,
                            "idAntecedente",
                            idAntecedenteMovil);

                    if (idAntecedenteMovil != null) {
                        mapAntecedentes.put(idAntecedenteMovil, antecedentePersistido.getIdAntecedente());
                    }
                    antecedentesGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "antecedentes", idPersonaMovil, idControlMovil, idAntecedenteMovil,
                                e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 5) CONTROL EMBARAZO (PK simple)
             * =========================
             */
            for (List valor : controlEmbarazoValues) {
                Map<String, Object> row = rowToMap("control_embarazo", valor, columnsByTable);
                Integer idControlEmbarazoMovil = safeInt(row.get("id_control_embarazo"));
                Integer idControlMovil = safeInt(row.get("id_control"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "control_embarazo", null, idControlMovil, idControlEmbarazoMovil,
                                "UUID de control_embarazo nulo", valor);
                        continue;
                    }

                    Integer serverIdControl = coalesceServerIdByUuid(
                            mapControles.get(idControlMovil),
                            mapControlUuidByMobileId.get(idControlMovil),
                            controlUuid -> controlesRepo.findByUuid(controlUuid)
                                    .map(ControlesEntity::getIdControl)
                                    .orElse(null));

                    if (serverIdControl == null) {
                        addImportLog(logs, "control_embarazo", null, idControlMovil, idControlEmbarazoMovil,
                                "No se pudo resolver id_control por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    ControlEmbarazoEntity nuevoControlEmbarazo = new ControlEmbarazoEntity();
                    nuevoControlEmbarazo.setIdControl(serverIdControl);
                    nuevoControlEmbarazo.setEdadGestacional(safeInt(row.get("edad_gestacional")));
                    nuevoControlEmbarazo.setEco(safeStringNotNull(row.get("eco")));
                    nuevoControlEmbarazo.setDetalleEco(safeStringNotNull(row.get("detalle_eco")));
                    nuevoControlEmbarazo.setHpv(safeStringNotNull(row.get("hpv")));
                    nuevoControlEmbarazo.setPap(safeStringNotNull(row.get("pap")));
                    nuevoControlEmbarazo.setSistolica(safeInt(row.get("sistolica")));
                    nuevoControlEmbarazo.setDiastolica(safeInt(row.get("diastolica")));
                    nuevoControlEmbarazo.setClinico(safeStringNotNull(row.get("clinico")));
                    nuevoControlEmbarazo.setObservaciones(safeStringNotNull(row.get("observaciones")));
                    nuevoControlEmbarazo.setMotivo(safeInt(row.get("motivo")));
                    nuevoControlEmbarazo.setDerivada(safeInt(row.get("derivada")));
                    nuevoControlEmbarazo.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoControlEmbarazo.setLastModified(incomingLastModified);
                    nuevoControlEmbarazo.setUuid(uuid);

                    universalUpsertService.upsertSimplePkByUuid(
                            uuid,
                            controlEmbarazoRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyControlEmbarazo(existente, nuevoControlEmbarazo);
                            },
                            nuevoControlEmbarazo,
                            ControlEmbarazoEntity.class,
                            "idControlEmbarazo",
                            idControlEmbarazoMovil);

                    controlEmbarazoGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "control_embarazo", null, idControlMovil, idControlEmbarazoMovil,
                                e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 6) INMUNIZACIONES (PK compuesta)
             * =========================
             */
            for (List valor : inmunizacionesValues) {
                Map<String, Object> row = rowToMap("inmunizaciones_control", valor, columnsByTable);
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                Integer idControlMovil = safeInt(row.get("id_control"));
                Integer idInmunizacion = safeInt(row.get("id_inmunizacion"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "inmunizaciones_control", idPersonaMovil, idControlMovil, idInmunizacion,
                                "UUID de inmunización nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    Integer serverIdControl = coalesceServerIdByUuid(
                            mapControles.get(idControlMovil),
                            mapControlUuidByMobileId.get(idControlMovil),
                            controlUuid -> controlesRepo.findByUuid(controlUuid)
                                    .map(ControlesEntity::getIdControl)
                                    .orElse(null));

                    if (serverIdPersona == null || serverIdControl == null) {
                        addImportLog(logs, "inmunizaciones_control", idPersonaMovil, idControlMovil, idInmunizacion,
                                "No se pudo resolver relación persona/control por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    InmunizacionesControlEntity nuevaInmunizacion = new InmunizacionesControlEntity();
                    nuevaInmunizacion.setIdPersona(serverIdPersona);
                    nuevaInmunizacion.setIdControl(serverIdControl);
                    nuevaInmunizacion.setIdInmunizacion(idInmunizacion);
                    nuevaInmunizacion.setEstado(safeStringNotNull(row.get("estado")));
                    nuevaInmunizacion.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevaInmunizacion.setLastModified(incomingLastModified);
                    nuevaInmunizacion.setUuid(uuid);

                    universalUpsertService.upsertCompositePkByUuid(
                            uuid,
                            inmunizacionesControlRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyInmunizacion(existente, nuevaInmunizacion);
                            },
                            nuevaInmunizacion,
                            InmunizacionesControlEntity.class);

                    inmunizacionesGuardadas++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "inmunizaciones_control", idPersonaMovil, idControlMovil, idInmunizacion,
                                e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 7) LABORATORIOS (PK compuesta)
             * =========================
             */
            for (List valor : laboratoriosValues) {
                Map<String, Object> row = rowToMap("laboratorios_realizados", valor, columnsByTable);
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                Integer idControlMovil = safeInt(row.get("id_control"));
                Integer idLaboratorio = safeInt(row.get("id_laboratorio"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "laboratorios_realizados", idPersonaMovil, idControlMovil, idLaboratorio,
                                "UUID de laboratorio nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    Integer serverIdControl = coalesceServerIdByUuid(
                            mapControles.get(idControlMovil),
                            mapControlUuidByMobileId.get(idControlMovil),
                            controlUuid -> controlesRepo.findByUuid(controlUuid)
                                    .map(ControlesEntity::getIdControl)
                                    .orElse(null));

                    if (serverIdPersona == null || serverIdControl == null) {
                        addImportLog(logs, "laboratorios_realizados", idPersonaMovil, idControlMovil, idLaboratorio,
                                "No se pudo resolver relación persona/control por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    LaboratoriosRealizadosEntity nuevoLaboratorio = new LaboratoriosRealizadosEntity();
                    nuevoLaboratorio.setIdPersona(serverIdPersona);
                    nuevoLaboratorio.setIdControl(serverIdControl);
                    nuevoLaboratorio.setIdLaboratorio(idLaboratorio);
                    nuevoLaboratorio.setTrimestre(safeInt(row.get("trimestre")));
                    nuevoLaboratorio.setFechaRealizado(parseSqlDate(row.get("fecha_realizado")));
                    nuevoLaboratorio.setFechaResultados(parseSqlDate(row.get("fecha_resultados")));
                    nuevoLaboratorio.setResultado(safeStringNotNull(row.get("resultado")));
                    nuevoLaboratorio.setIdEtmi(safeInt(row.get("id_etmi")));
                    nuevoLaboratorio.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoLaboratorio.setLastModified(incomingLastModified);
                    nuevoLaboratorio.setUuid(uuid);

                    universalUpsertService.upsertCompositePkByUuid(
                            uuid,
                            laboratoriosRealizadosRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyLaboratorio(existente, nuevoLaboratorio);
                            },
                            nuevoLaboratorio,
                            LaboratoriosRealizadosEntity.class);

                    laboratoriosGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "laboratorios_realizados", idPersonaMovil, idControlMovil, idLaboratorio,
                                e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 8) ETMIS (PK compuesta)
             * =========================
             */
            for (List valor : etmisValues) {
                Map<String, Object> row = rowToMap("etmis_personas", valor, columnsByTable);
                Integer idPersonaMovil = safeInt(row.get("id_persona"));
                Integer idEtmi = safeInt(row.get("id_etmi"));
                Integer idControlMovil = safeInt(row.get("id_control"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "etmis_personas", idPersonaMovil, idControlMovil, idEtmi,
                                "UUID de ETMI nulo", valor);
                        continue;
                    }

                    Integer serverIdPersona = coalesceServerIdByUuid(
                            mapPersonas.get(idPersonaMovil),
                            mapPersonaUuidByMobileId.get(idPersonaMovil),
                            personaUuid -> personasRepo.findByUuid(personaUuid)
                                    .map(PersonasEntity::getIdPersona)
                                    .orElse(null));

                    Integer serverIdControl = coalesceServerIdByUuid(
                            mapControles.get(idControlMovil),
                            mapControlUuidByMobileId.get(idControlMovil),
                            controlUuid -> controlesRepo.findByUuid(controlUuid)
                                    .map(ControlesEntity::getIdControl)
                                    .orElse(null));

                    if (serverIdPersona == null || serverIdControl == null) {
                        addImportLog(logs, "etmis_personas", idPersonaMovil, idControlMovil, idEtmi,
                                "No se pudo resolver relación persona/control por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    EtmisPersonasEntity nuevaEtmi = new EtmisPersonasEntity();
                    nuevaEtmi.setIdPersona(serverIdPersona);
                    nuevaEtmi.setIdEtmi(idEtmi);
                    nuevaEtmi.setIdControl(serverIdControl);
                    nuevaEtmi.setConfirmada(safeInt(row.get("confirmada")));
                    nuevaEtmi.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevaEtmi.setLastModified(incomingLastModified);
                    nuevaEtmi.setUuid(uuid);

                    universalUpsertService.upsertCompositePkByUuid(
                            uuid,
                            etmisPersonasRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyEtmi(existente, nuevaEtmi);
                            },
                            nuevaEtmi,
                            EtmisPersonasEntity.class);

                    etmisGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "etmis_personas", idPersonaMovil, idControlMovil, idEtmi, e.getMessage(),
                                valor);
                    }
                }
            }

            /*
             * =========================
             * 9) ANTECEDENTES_APPS (PK compuesta)
             * =========================
             */
            for (List valor : antecedentesAppsValues) {
                Map<String, Object> row = rowToMap("antecedentes_apps", valor, columnsByTable);
                Integer idAntecedenteMovil = safeInt(row.get("id_antecedente"));
                Integer idApp = safeInt(row.get("id_app"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "antecedentes_apps", null, null, idAntecedenteMovil,
                                "UUID de antecedente_app nulo", valor);
                        continue;
                    }

                    Integer serverIdAntecedente = coalesceServerIdByUuid(
                            mapAntecedentes.get(idAntecedenteMovil),
                            mapAntecedenteUuidByMobileId.get(idAntecedenteMovil),
                            antecedenteUuid -> antecedentesRepo.findByUuid(antecedenteUuid)
                                    .map(AntecedentesEntity::getIdAntecedente)
                                    .orElse(null));

                    if (serverIdAntecedente == null) {
                        addImportLog(logs, "antecedentes_apps", null, null, idAntecedenteMovil,
                                "No se pudo resolver id_antecedente por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    AntecedentesAppsEntity nuevoAntecedenteApp = new AntecedentesAppsEntity();
                    nuevoAntecedenteApp.setIdAntecedente(serverIdAntecedente);
                    nuevoAntecedenteApp.setIdApp(idApp);
                    nuevoAntecedenteApp.setLastModified(incomingLastModified);
                    nuevoAntecedenteApp.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoAntecedenteApp.setUuid(uuid);

                    universalUpsertService.upsertCompositePkByUuid(
                            uuid,
                            antecedentesAppsRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyAntecedenteApp(existente, nuevoAntecedenteApp);
                            },
                            nuevoAntecedenteApp,
                            AntecedentesAppsEntity.class);

                    antecedentesAppsGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "antecedentes_apps", null, null, idAntecedenteMovil, e.getMessage(), valor);
                    }
                }
            }

            /*
             * =========================
             * 10) ANTECEDENTES_MACS (PK compuesta)
             * =========================
             */
            for (List valor : antecedentesMacsValues) {
                Map<String, Object> row = rowToMap("antecedentes_macs", valor, columnsByTable);
                Integer idAntecedenteMovil = safeInt(row.get("id_antecedente"));
                Integer idMac = safeInt(row.get("id_mac"));
                String uuid = safeString(row.get("uuid"));

                try {
                    if (uuid == null || uuid.isBlank()) {
                        addImportLog(logs, "antecedentes_macs", null, null, idAntecedenteMovil,
                                "UUID de antecedente_mac nulo", valor);
                        continue;
                    }

                    Integer serverIdAntecedente = coalesceServerIdByUuid(
                            mapAntecedentes.get(idAntecedenteMovil),
                            mapAntecedenteUuidByMobileId.get(idAntecedenteMovil),
                            antecedenteUuid -> antecedentesRepo.findByUuid(antecedenteUuid)
                                    .map(AntecedentesEntity::getIdAntecedente)
                                    .orElse(null));

                    if (serverIdAntecedente == null) {
                        addImportLog(logs, "antecedentes_macs", null, null, idAntecedenteMovil,
                                "No se pudo resolver id_antecedente por UUID", valor);
                        continue;
                    }

                    Integer incomingLastModified = safeInt(row.get("last_modified"));

                    AntecedentesMacsEntity nuevoAntecedenteMac = new AntecedentesMacsEntity();
                    nuevoAntecedenteMac.setIdAntecedente(serverIdAntecedente);
                    nuevoAntecedenteMac.setIdMac(idMac);
                    nuevoAntecedenteMac.setSqlDeleted(safeInt(row.get("sql_deleted")));
                    nuevoAntecedenteMac.setLastModified(incomingLastModified);
                    nuevoAntecedenteMac.setUuid(uuid);

                    universalUpsertService.upsertCompositePkByUuid(
                            uuid,
                            antecedentesMacsRepo::findByUuid,
                            existente -> {
                                if (!shouldApplyIncomingLastModified(existente.getLastModified(),
                                        incomingLastModified)) {
                                    conflictosLastModified.incrementAndGet();
                                    throw new RuntimeException("Conflicto lastModified");
                                }
                                return copyAntecedenteMac(existente, nuevoAntecedenteMac);
                            },
                            nuevoAntecedenteMac,
                            AntecedentesMacsEntity.class);

                    antecedentesMacsGuardados++;
                } catch (Exception e) {
                    if (!"Conflicto lastModified".equals(e.getMessage())) {
                        addImportLog(logs, "antecedentes_macs", null, null, idAntecedenteMovil, e.getMessage(), valor);
                    }
                }
            }

            fillImportResponse(
                    response,
                    syncBatchId,
                    true,
                    "Importación procesada con arquitectura UUID",
                    personasGuardadas,
                    controlesGuardados,
                    controlEmbarazoGuardados,
                    inmunizacionesGuardadas,
                    laboratoriosGuardados,
                    ubicacionesGuardadas,
                    antecedentesGuardados,
                    antecedentesAppsGuardados,
                    antecedentesMacsGuardados,
                    etmisGuardados,
                    conflictosLastModified.get(),
                    logs,
                    null);

            try {
                syncAuditService.registerBatchResult(
                        syncBatchId,
                        true,
                        conflictosLastModified.get(),
                        logs,
                        null);
            } catch (Exception ignored) {
            }

            return response;
        } catch (Exception e) {
            e.printStackTrace();
            fillImportResponse(
                    response,
                    syncBatchId,
                    true,
                    "Importación completada con errores parciales (no se bloqueó la sync)",
                    personasGuardadas,
                    controlesGuardados,
                    controlEmbarazoGuardados,
                    inmunizacionesGuardadas,
                    laboratoriosGuardados,
                    ubicacionesGuardadas,
                    antecedentesGuardados,
                    antecedentesAppsGuardados,
                    antecedentesMacsGuardados,
                    etmisGuardados,
                    conflictosLastModified.get(),
                    logs,
                    e.getMessage());
            try {
                syncAuditService.registerBatchResult(
                        syncBatchId,
                        false,
                        conflictosLastModified.get(),
                        logs,
                        e.getMessage());
            } catch (Exception ignored) {
            }
            return response;
        }
    }

    @GetMapping("/sync/logs/batches")
    public Map<String, Object> getSyncBatches() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("success", true);
            response.put("batches", syncAuditService.getLatestBatches());
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "No se pudieron recuperar lotes de sincronización");
            response.put("error", e.getMessage());
            response.put("batches", new ArrayList<>());
            return response;
        }
    }

    @GetMapping("/sync/logs/batches/{syncBatchId}")
    public Map<String, Object> getSyncBatchDetail(@PathVariable String syncBatchId) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<SyncBatchLogServerEntity> batch = syncAuditService.findBatch(syncBatchId);
            if (batch.isEmpty()) {
                response.put("success", false);
                response.put("message", "No existe lote para sync_batch_id indicado");
                return response;
            }
            response.put("success", true);
            response.put("batch", batch.get());
            response.put("items", syncAuditService.findItemsByBatch(syncBatchId));
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "No se pudo recuperar detalle de sincronización");
            response.put("error", e.getMessage());
            return response;
        }
    }

    @GetMapping("/data/json3")
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDataall() {
        try {
            Map<String, Object> json = readSchemaTemplate();
            json.put("database", bbdd);
            json.put("version", EXPORT_VERSION);
            json.put("encrypted", false);
            json.put("mode", MODE_FULL);

            List<Map<String, Object>> tables = (List<Map<String, Object>>) json.get("tables");
            if (tables == null) {
                json.put("tables", new ArrayList<>());
                return json;
            }

            PersonaSrevice personaService = new PersonaSrevice();
            ControlesService controlesService = new ControlesService();
            ControlEmbarazoService controlEmbarazoService = new ControlEmbarazoService();
            InmunizacionesControlService inmunizacionesService = new InmunizacionesControlService();
            LaboratoriosRealizadosService laboratoriosService = new LaboratoriosRealizadosService();
            UbicacionesService ubicacionesService = new UbicacionesService();
            AntecedentesService antecedentesService = new AntecedentesService();
            AntecedentesApps antecedentesAppsService = new AntecedentesApps();
            AntededentesMacs antecedentesMacsService = new AntededentesMacs();
            EtmisPersonasService etmisService = new EtmisPersonasService();
            UsuarioService usuarioService = new UsuarioService();
            PaisesService paisesService = new PaisesService();
            AreasService areasService = new AreasService();
            ParajeService parajeService = new ParajeService();

            for (Map<String, Object> table : tables) {
                populateDynamicTableValues(
                        table,
                        personaService,
                        controlesService,
                        controlEmbarazoService,
                        inmunizacionesService,
                        laboratoriosService,
                        ubicacionesService,
                        antecedentesService,
                        antecedentesAppsService,
                        antecedentesMacsService,
                        etmisService,
                        usuarioService,
                        paisesService,
                        areasService,
                        parajeService);
                filterRowsWithoutUuid(table);
            }

            return json;
        } catch (Exception e) {
            e.printStackTrace();
            return emptyExportPayload(MODE_FULL);
        }
    }

    @GetMapping("/data/json3/partial")
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDataPartial(@RequestParam(value = "since", required = false) Integer since) {
        Map<String, Object> json = getDataall();
        if (json == null) {
            return emptyExportPayload(MODE_PARTIAL);
        }

        Integer effectiveSince = since;
        if (effectiveSince == null) {
            try {
                effectiveSince = syncTableRepo.buscarUltimoLast();
            } catch (Exception ignored) {
            }
        }

        Object tablesObject = json.get("tables");
        if (tablesObject instanceof List<?> && effectiveSince != null) {
            List<Map<String, Object>> tables = (List<Map<String, Object>>) tablesObject;
            for (Map<String, Object> table : tables) {
                filterRowsBySince(table, effectiveSince);
            }
        }

        json.put("mode", MODE_PARTIAL);
        if (effectiveSince != null) {
            json.put("since", effectiveSince);
        }
        return json;
    }

    @PostMapping("/sync_date")
    public HashMap<String, Object> saveSyncDate(@RequestBody SyncTableEntity sync) {
        HashMap<String, Object> response = new HashMap<>();
        try {
            SyncTableEntity syncTable = syncTableRepo.findById(0).orElse(new SyncTableEntity());
            syncTable.setId(0);
            syncTable.setSyncDate(sync.getSyncDate());
            syncTableRepo.save(syncTable);
            response.put("success", true);
        } catch (Exception e) {
            response.put("success", false);
            response.put("error", e.toString());
        }
        return response;
    }

    private void preScanUuids(List<List> personasValues,
            List<List> controlesValues,
            List<List> antecedentesValues,
            Map<String, List<String>> columnsByTable,
            Map<Integer, String> mapPersonaUuidByMobileId,
            Map<Integer, String> mapControlUuidByMobileId,
            Map<Integer, String> mapAntecedenteUuidByMobileId) {

        for (List valor : personasValues) {
            Map<String, Object> row = rowToMap("personas", valor, columnsByTable);
            Integer idPersonaMovil = safeInt(row.get("id_persona"));
            String uuidPersona = safeString(row.get("uuid"));
            if (idPersonaMovil != null && uuidPersona != null && !uuidPersona.isBlank()) {
                mapPersonaUuidByMobileId.put(idPersonaMovil, uuidPersona);
            }
        }

        for (List valor : controlesValues) {
            Map<String, Object> row = rowToMap("controles", valor, columnsByTable);
            Integer idControlMovil = safeInt(row.get("id_control"));
            String uuidControl = safeString(row.get("uuid"));
            if (idControlMovil != null && uuidControl != null && !uuidControl.isBlank()) {
                mapControlUuidByMobileId.put(idControlMovil, uuidControl);
            }
        }

        for (List valor : antecedentesValues) {
            Map<String, Object> row = rowToMap("antecedentes", valor, columnsByTable);
            Integer idAntecedenteMovil = safeInt(row.get("id_antecedente"));
            String uuidAntecedente = safeString(row.get("uuid"));
            if (idAntecedenteMovil != null && uuidAntecedente != null && !uuidAntecedente.isBlank()) {
                mapAntecedenteUuidByMobileId.put(idAntecedenteMovil, uuidAntecedente);
            }
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> readSchemaTemplate() throws IOException {
        try (InputStream is = new ClassPathResource("schema.json").getInputStream()) {
            return objectMapper.readValue(is, new TypeReference<Map<String, Object>>() {
            });
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, List<String>> loadSchemaColumns() throws IOException {
        Map<String, Object> schemaTemplate = readSchemaTemplate();
        List<Map<String, Object>> tables = (List<Map<String, Object>>) schemaTemplate.get("tables");
        Map<String, List<String>> columnsByTable = new HashMap<>();

        if (tables == null) {
            return columnsByTable;
        }

        for (Map<String, Object> table : tables) {
            String tableName = safeString(table.get("name"));
            Object schemaObject = table.get("schema");
            if (tableName == null || !(schemaObject instanceof List<?> schemaList)) {
                continue;
            }

            List<String> columns = new ArrayList<>();
            for (Object item : schemaList) {
                if (item instanceof Map<?, ?> map) {
                    Object column = map.get("column");
                    if (column != null) {
                        columns.add(column.toString().trim());
                    }
                }
            }
            columnsByTable.put(tableName, columns);
        }

        return columnsByTable;
    }

    private Map<String, List<List>> extractTables(JsonSqlite json) {
        Map<String, List<List>> tablas = new HashMap<>();
        if (json == null || json.getTables() == null) {
            return tablas;
        }

        for (JsonTable table : json.getTables()) {
            tablas.put(table.getName(), table.getValues());
        }
        return tablas;
    }

    private List<List> getTableValues(Map<String, List<List>> tablas, String tableName) {
        return tablas.getOrDefault(tableName, new ArrayList<>());
    }

    private Map<String, Object> rowToMap(String tableName, List row, Map<String, List<String>> columnsByTable) {
        Map<String, Object> mappedRow = new LinkedHashMap<>();
        List<String> columns = columnsByTable.get(tableName);
        if (row == null || columns == null) {
            return mappedRow;
        }

        int max = Math.min(row.size(), columns.size());
        for (int i = 0; i < max; i++) {
            mappedRow.put(columns.get(i), row.get(i));
        }
        return mappedRow;
    }

    private Map<String, Object> emptyExportPayload(String mode) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("database", bbdd);
        payload.put("version", EXPORT_VERSION);
        payload.put("encrypted", false);
        payload.put("mode", mode);
        payload.put("tables", new ArrayList<>());
        return payload;
    }

    private void fillImportResponse(Map<String, Object> response,
            String syncBatchId,
            boolean success,
            String message,
            int personasGuardadas,
            int controlesGuardados,
            int controlEmbarazoGuardados,
            int inmunizacionesGuardadas,
            int laboratoriosGuardados,
            int ubicacionesGuardadas,
            int antecedentesGuardados,
            int antecedentesAppsGuardados,
            int antecedentesMacsGuardados,
            int etmisGuardados,
            int conflictosLastModified,
            List<Map<String, Object>> logs,
            String error) {
        response.put("sync_batch_id", syncBatchId);
        response.put("success", success);
        response.put("message", message);
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
        response.put("conflictosLastModified", conflictosLastModified);
        response.put("rechazados", logs.size());
        response.put("logs", logs);
        if (error != null) {
            response.put("error", error);
        }
    }

    private void populateDynamicTableValues(Map<String, Object> table,
            PersonaSrevice personaService,
            ControlesService controlesService,
            ControlEmbarazoService controlEmbarazoService,
            InmunizacionesControlService inmunizacionesService,
            LaboratoriosRealizadosService laboratoriosService,
            UbicacionesService ubicacionesService,
            AntecedentesService antecedentesService,
            AntecedentesApps antecedentesAppsService,
            AntededentesMacs antecedentesMacsService,
            EtmisPersonasService etmisService,
            UsuarioService usuarioService,
            PaisesService paisesService,
            AreasService areasService,
            ParajeService parajeService) {

        String tableName = safeString(table.get("name"));
        if (tableName == null) {
            return;
        }

        switch (tableName) {
            case "personas" -> table.put("values", safeValues("personas",
                    () -> personaService.valuesPersonas(personasRepo.findBySqlDeletedOrSqlDeletedIsNull(0))));
            case "usuarios" -> table.put("values", safeValues("usuarios",
                    () -> usuarioService.valuesUsuarios(usuarioRepo.findAll())));
            case "controles" -> table.put("values", safeValues("controles",
                    () -> controlesService.valuesControles(controlesRepo.findAll())));
            case "control_embarazo" -> table.put("values", safeValues("control_embarazo",
                    () -> controlEmbarazoService.valuesControlEmbarazo(controlEmbarazoRepo.findAll())));
            case "inmunizaciones_control" -> table.put("values", safeValues("inmunizaciones_control",
                    () -> inmunizacionesService.InmunizacionesControl(inmunizacionesControlRepo.findAll())));
            case "laboratorios_realizados" -> table.put("values", safeValues("laboratorios_realizados",
                    () -> laboratoriosService.LaboratoriosRealizados(laboratoriosRealizadosRepo.findAll())));
            case "ubicaciones" -> table.put("values", safeValues("ubicaciones",
                    () -> ubicacionesService.UbicacionesValues(ubicacionesRepo.findAll())));
            case "antecedentes" -> table.put("values", safeValues("antecedentes",
                    () -> antecedentesService.AntecedentesValues(antecedentesRepo.findAll())));
            case "antecedentes_apps" -> table.put("values", safeValues("antecedentes_apps",
                    () -> antecedentesAppsService.AntecedentesAppsValues(antecedentesAppsRepo.findAll())));
            case "antecedentes_macs" -> table.put("values", safeValues("antecedentes_macs",
                    () -> antecedentesMacsService.AntecedentesMacsValues(antecedentesMacsRepo.findAll())));
            case "etmis_personas" -> table.put("values", safeValues("etmis_personas",
                    () -> etmisService.EtmisPersonasValues(etmisPersonasRepo.findAll())));
            case "paises" -> table.put("values", safeValues("paises",
                    () -> paisesService.valuesPaises(paisesRepo.findAll())));
            case "areas" -> table.put("values", safeValues("areas",
                    () -> areasService.valuesAreas(areasRepo.findAll())));
            case "parajes" -> table.put("values", safeValues("parajes",
                    () -> parajeService.valuesParajes(parajesRepo.findAll())));
            default -> {
                // tablas catálogo que quedan con los valores del schema.json
            }
        }
    }

    private List<List<Object>> safeValues(String tableName, Supplier<List<List<Object>>> supplier) {
        try {
            List<List<Object>> values = supplier.get();
            return values != null ? values : new ArrayList<>();
        } catch (Exception e) {
            System.err.println("Error exportando tabla " + tableName + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void addImportLog(List<Map<String, Object>> logs,
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
        appendJsonLine("import_sync.log", log);
    }

    private void addExportLog(String tabla, String motivo, List<Object> payload) {
        Map<String, Object> log = new HashMap<>();
        log.put("tabla", tabla);
        log.put("motivo", motivo);
        log.put("payload", payload);
        log.put("ts", LocalDateTime.now().toString());
        appendJsonLine("export_sync.log", log);
    }

    private void appendJsonLine(String fileName, Map<String, Object> log) {
        try {
            Path folder = Path.of("logs");
            Files.createDirectories(folder);
            Path file = folder.resolve(fileName);
            String line = objectMapper.writeValueAsString(log) + System.lineSeparator();
            Files.writeString(file, line, StandardCharsets.UTF_8,
                    StandardOpenOption.CREATE, StandardOpenOption.APPEND);
        } catch (IOException e) {
            System.err.println("No se pudo escribir " + fileName + ": " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private void filterRowsWithoutUuid(Map<String, Object> table) {
        String tableName = safeString(table.getOrDefault("name", "unknown"));
        List<Map<String, Object>> schema = (List<Map<String, Object>>) table.get("schema");
        List<List<Object>> values = (List<List<Object>>) table.get("values");
        if (schema == null || values == null || values.isEmpty()) {
            return;
        }

        int uuidIndex = -1;
        for (int i = 0; i < schema.size(); i++) {
            Object column = schema.get(i).get("column");
            if (column != null && "uuid".equalsIgnoreCase(column.toString().trim())) {
                uuidIndex = i;
                break;
            }
        }
        if (uuidIndex < 0) {
            return;
        }

        List<List<Object>> filtered = new ArrayList<>();
        for (List<Object> row : values) {
            if (row == null || uuidIndex >= row.size()) {
                addExportLog(tableName, "Fila sin columna UUID esperada por schema", row);
                continue;
            }
            String uuid = safeString(row.get(uuidIndex));
            if (uuid == null || uuid.isBlank()) {
                addExportLog(tableName, "UUID nulo o vacío en export", row);
                continue;
            }
            filtered.add(row);
        }
        table.put("values", filtered);
    }

    @SuppressWarnings("unchecked")
    private void filterRowsBySince(Map<String, Object> table, Integer since) {
        if (since == null) {
            return;
        }

        List<Map<String, Object>> schema = (List<Map<String, Object>>) table.get("schema");
        List<List<Object>> values = (List<List<Object>>) table.get("values");
        if (schema == null || values == null || values.isEmpty()) {
            return;
        }

        int lastModifiedIndex = -1;
        for (int i = 0; i < schema.size(); i++) {
            Object column = schema.get(i).get("column");
            if (column != null && "last_modified".equalsIgnoreCase(column.toString().trim())) {
                lastModifiedIndex = i;
                break;
            }
        }
        if (lastModifiedIndex < 0) {
            return;
        }

        List<List<Object>> filtered = new ArrayList<>();
        for (List<Object> row : values) {
            if (row == null || lastModifiedIndex >= row.size()) {
                continue;
            }
            Integer rowLastModified = safeInt(row.get(lastModifiedIndex));
            if (rowLastModified != null && rowLastModified > since) {
                filtered.add(row);
            }
        }

        table.put("values", filtered);
    }

    private Integer coalesceServerIdByUuid(Integer mappedId, String uuidRef, Function<String, Integer> finder) {
        if (mappedId != null) {
            return mappedId;
        }
        if (uuidRef == null || uuidRef.isBlank()) {
            return null;
        }
        try {
            return finder.apply(uuidRef);
        } catch (Exception ignored) {
            return null;
        }
    }

    private String resolveSyncBatchId(JsonSqlite json) {
        if (json == null || json.getSyncMeta() == null) {
            return "sync-" + UUID.randomUUID();
        }
        String fromPayload = safeString(json.getSyncMeta().getSyncBatchId());
        return fromPayload != null ? fromPayload : "sync-" + UUID.randomUUID();
    }

   private boolean shouldApplyIncomingLastModified(Integer currentLastModified, Integer incomingLastModified) {
    // Si falta alguno de los dos, no bloqueamos la sync
    if (incomingLastModified == null || currentLastModified == null) {
        return true;
    }

    // Clave del arreglo:
    // - mayor  => actualiza
    // - igual  => reintento idempotente, NO debe contarse como conflicto
    // - menor  => conflicto real
    return incomingLastModified >= currentLastModified;
}

    private Object getValue(List<?> valor, int index) {
        if (valor == null || index < 0 || index >= valor.size()) {
            return null;
        }
        return valor.get(index);
    }

    private String safeString(Object value) {
        if (value == null) {
            return null;
        }
        String text = value.toString().trim();
        if (text.isEmpty() || "null".equalsIgnoreCase(text) || "undefined".equalsIgnoreCase(text)) {
            return null;
        }
        return text;
    }

    private String safeString(List<?> valor, int index) {
        return safeString(getValue(valor, index));
    }

    private String safeStringNotNull(Object value) {
        String text = safeString(value);
        return text != null ? text : "";
    }

    private Integer safeInt(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof Integer i) {
            return i;
        }
        if (value instanceof Long l) {
            return l.intValue();
        }
        if (value instanceof Double d) {
            return d.intValue();
        }
        if (value instanceof Float f) {
            return f.intValue();
        }
        String text = safeString(value);
        if (text == null) {
            return null;
        }
        try {
            return Integer.parseInt(text);
        } catch (Exception e) {
            return null;
        }
    }
    

    private Integer safeInt(List<?> valor, int index) {
        return safeInt(getValue(valor, index));
    }

    private Date parseSqlDate(Object value) {
        try {
            String text = safeString(value);
            if (text == null) {
                return null;
            }
            if (text.length() >= 10) {
                text = text.substring(0, 10);
            }
            return Date.valueOf(LocalDate.parse(text));
        } catch (Exception e) {
            System.err.println("Fecha inválida recibida: " + value);
            return null;
        }
    }

    private PersonasEntity copyPersona(PersonasEntity target, PersonasEntity source) {
        target.setApellido(source.getApellido());
        target.setNombre(source.getNombre());
        target.setDocumento(source.getDocumento());
        target.setFechaNacimiento(source.getFechaNacimiento());
        target.setIdOrigen(source.getIdOrigen());
        target.setNacionalidad(source.getNacionalidad());
        target.setSexo(source.getSexo());
        target.setMadre(source.getMadre());
        target.setAlta(source.getAlta());
        target.setNacidoVivo(source.getNacidoVivo());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private ControlesEntity copyControl(ControlesEntity target, ControlesEntity source) {
        target.setFecha(source.getFecha());
        target.setIdPersona(source.getIdPersona());
        target.setControlNumero(source.getControlNumero());
        target.setIdEstado(source.getIdEstado());
        target.setIdSeguimientoChagas(source.getIdSeguimientoChagas());
        target.setIdTratamientoChagas(source.getIdTratamientoChagas());
        target.setIdSeguimientoHiv(source.getIdSeguimientoHiv());
        target.setIdTratamientoHiv(source.getIdTratamientoHiv());
        target.setIdSeguimientoSifilis(source.getIdSeguimientoSifilis());
        target.setIdTratamientoSifilis(source.getIdTratamientoSifilis());
        target.setIdSeguimientoVhb(source.getIdSeguimientoVhb());
        target.setIdTratamientoVhb(source.getIdTratamientoVhb());
        target.setFechaFinEmbarazo(source.getFechaFinEmbarazo());
        target.setIdTiposFinEmbarazos(source.getIdTiposFinEmbarazos());
        target.setGeoreferencia(source.getGeoreferencia());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private UbicacionesEntity copyUbicacion(UbicacionesEntity target, UbicacionesEntity source) {
        target.setIdPersona(source.getIdPersona());
        target.setIdParaje(source.getIdParaje());
        target.setIdArea(source.getIdArea());
        target.setNumVivienda(source.getNumVivienda());
        target.setFecha(source.getFecha());
        target.setGeoreferencia(source.getGeoreferencia());
        target.setIdPais(source.getIdPais());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private AntecedentesEntity copyAntecedente(AntecedentesEntity target, AntecedentesEntity source) {
        target.setIdPersona(source.getIdPersona());
        target.setIdControl(source.getIdControl());
        target.setEdadPrimerEmbarazo(source.getEdadPrimerEmbarazo());
        target.setFechaUltimoEmbarazo(source.getFechaUltimoEmbarazo());
        target.setGestas(source.getGestas());
        target.setPartos(source.getPartos());
        target.setCesareas(source.getCesareas());
        target.setAbortos(source.getAbortos());
        target.setPlanificado(source.getPlanificado());
        target.setFum(source.getFum());
        target.setFpp(source.getFpp());
        target.setLastModified(source.getLastModified());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setUuid(source.getUuid());
        return target;
    }

    private ControlEmbarazoEntity copyControlEmbarazo(ControlEmbarazoEntity target, ControlEmbarazoEntity source) {
        target.setIdControl(source.getIdControl());
        target.setEdadGestacional(source.getEdadGestacional());
        target.setEco(source.getEco());
        target.setDetalleEco(source.getDetalleEco());
        target.setHpv(source.getHpv());
        target.setPap(source.getPap());
        target.setSistolica(source.getSistolica());
        target.setDiastolica(source.getDiastolica());
        target.setClinico(source.getClinico());
        target.setObservaciones(source.getObservaciones());
        target.setMotivo(source.getMotivo());
        target.setDerivada(source.getDerivada());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private InmunizacionesControlEntity copyInmunizacion(InmunizacionesControlEntity target,
            InmunizacionesControlEntity source) {
        target.setIdPersona(source.getIdPersona());
        target.setIdControl(source.getIdControl());
        target.setIdInmunizacion(source.getIdInmunizacion());
        target.setEstado(source.getEstado());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private LaboratoriosRealizadosEntity copyLaboratorio(LaboratoriosRealizadosEntity target,
            LaboratoriosRealizadosEntity source) {
        target.setIdPersona(source.getIdPersona());
        target.setIdControl(source.getIdControl());
        target.setIdLaboratorio(source.getIdLaboratorio());
        target.setTrimestre(source.getTrimestre());
        target.setFechaRealizado(source.getFechaRealizado());
        target.setFechaResultados(source.getFechaResultados());
        target.setResultado(source.getResultado());
        target.setIdEtmi(source.getIdEtmi());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private EtmisPersonasEntity copyEtmi(EtmisPersonasEntity target, EtmisPersonasEntity source) {
        target.setIdPersona(source.getIdPersona());
        target.setIdEtmi(source.getIdEtmi());
        target.setIdControl(source.getIdControl());
        target.setConfirmada(source.getConfirmada());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }

    private AntecedentesAppsEntity copyAntecedenteApp(AntecedentesAppsEntity target, AntecedentesAppsEntity source) {
        target.setIdAntecedente(source.getIdAntecedente());
        target.setIdApp(source.getIdApp());
        target.setLastModified(source.getLastModified());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setUuid(source.getUuid());
        return target;
    }

    private AntecedentesMacsEntity copyAntecedenteMac(AntecedentesMacsEntity target, AntecedentesMacsEntity source) {
        target.setIdAntecedente(source.getIdAntecedente());
        target.setIdMac(source.getIdMac());
        target.setSqlDeleted(source.getSqlDeleted());
        target.setLastModified(source.getLastModified());
        target.setUuid(source.getUuid());
        return target;
    }
}
