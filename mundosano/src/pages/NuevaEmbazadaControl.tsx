import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonTextarea, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import { useEffect, useState } from "react";
import { animationBuilder } from "../components/AnimationBuilder"
import { useHistory, useLocation } from "react-router"
import LaboratorioCerologia from "../components/LaboratorioCerologia";


import moment from "moment";
import LaboratorioCerologiaII from "../components/LaboratorioCerologiaII";
import LaboratorioCerologiaIII from "../components/LaboratorioCerologiaIII";

import { MotivoDeDerivacion } from "../models/MotivosDeDerivacion";
import { Repository } from "../repository/Repository";
import { Personas } from "../models/PersonasModels";

import { Ubicaciones } from "../models/Ubicaciones";
import { Controles } from "../models/Controles";
import { Usuarios } from "../models/Usuarios";
import { Antecedentes } from "../models/Antecedentes";
import { Antecedentes_Apps } from "../models/Antecedentes_Apps";
import { Antecedentes_Macs } from "../models/Antecedentes_Macs";
import { Control_Embarazo } from "../models/Control_Embarazo";
import { Inmunizaciones_Control } from "../models/Inmunizaciones_Control";
import { Laboratorios_Realizados } from "../models/Laboratorios_Realizados";
import { Etmis_Personas } from "../models/Etmis_Personas";

const inicial_control = {
    ecografia: "N",
    hpv: "N",
    pap: "N",
    agripal: "N",
    db: "N",
    tba: "N",
    vhb: "N",
    clinico: "N",
    ecografia_resultado: "R",
    hpv_resultado: "R",
    pap_resultado: "R",
    eco_observaciones: "",
    observaciones: "",
    detalle_eco: "",
    CHAGAS: false,
    ESTREPTOCOCO_BETA_HEMOLÍTICO: false,
    GLUCEMIA: false,
    GRUPO_FACTOR: false,
    HB: false,
    HIV: false,
    SIFILIS: false,
    VHB: false,
    resp_sifilis: "N",
    resp_hiv: "N",
    resp_chagas: "N",
    resp_vhb: "N",
    resp_ESTREPTOCOCO_BETA_HEMOLÍTICO: "N",
    resp_hb: "S",
    resp_glucemia: "S",
    motivo: 9,
    derivada: 0,
    gestas: 0,
    ECO_CHECKED: false
}

const NuevaEmbarazadaControl: React.FC = () => {

    const location = useLocation();
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [fecha1, setFecha1] = useState<any>(null)
    const [paciente, setPaciente] = useState<any>(location.state);
    const [control, setControl] = useState<any>(inicial_control)
    const [diferencia, setDiferencia] = useState<any>()
    const [showEcografia, setShowEcografia] = useState<boolean>(false)
    const [eco_observa, setshowEco_observa] = useState<boolean>(false)
    const [showHpv, setShowHpv] = useState<boolean>(false)
    const [showPap, setShowPap] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [motivos, setMotivos] = useState<any>([])
    const [currentuser,setCurrentUser]=useState<Usuarios>()
    const [edadGestacional, setEdadGestacional] = useState<any>()

    const repositoryMotivosControl=new Repository<MotivoDeDerivacion>("motivos_derivacion");
    const repositoryPersonas=new Repository<Personas>("personas");
    const repositoryUbicacion=new Repository<Ubicaciones>("ubicaciones");
    const repositoryControles=new Repository<Controles>("controles");
    const repositoryAntecedentes=new Repository<Antecedentes>("antecedentes");
    const repositoryAntecedentesApps=new Repository<Antecedentes_Apps>("antecedentes_apps")
    const repositoryAntecedentesMacs=new Repository<Antecedentes_Macs>("antecedentes_macs")
    const repositoryControlEmbarazo= new Repository<Control_Embarazo>("control_embarazo")
    const repositoryInmunizacionesControl=new Repository<Inmunizaciones_Control>("inmunizaciones_control")
    const repositoryLaboratoriosRealizados=new Repository<Laboratorios_Realizados>("laboratorios_realizados")
    const repositoryEtmisPersonas=new Repository<Etmis_Personas>("etmis_personas")

    const hoy = moment()
   
    
    let history = useHistory()
    const getTrimestre = (semanas: number) => {
        if (semanas <= 13) return 1;
        if (semanas <= 27) return 2;
        return 3;
    };

    const toInt = (value: any, fallback: number = 0): number => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const strOrEmpty = (value: any): string => value === undefined || value === null ? "" : String(value);

    // Lógica Gestacional Dinámica (Igual a NuevoControl)
    useEffect(() => {
        const fum = paciente?.control?.fum;
        const fpp = paciente?.control?.fpp;

        let semanas = 0;
        if (fum && fum !== "null") {
            semanas = hoy.diff(moment(fum), "weeks");
        } else if (fpp && fpp !== "null") {
            semanas = hoy.diff(moment(fpp), "weeks") + 40;
        }

        semanas = semanas < 0 ? 0 : semanas;
        setEdadGestacional(semanas);
        setControl((prev: any) => ({ ...prev, edad_gestacional: semanas }));
    }, [paciente]);

    useEffect(()=>{
        setFecha1(hoy.format("YYYY-MM-DD"))
        const user=sessionStorage.getItem("currenUser")
        if(user!==null){
            setCurrentUser(JSON.parse(user))
            }
            
    },[])

    useIonViewWillEnter(() => {
       
        const testDatabaseCopyFromAssets = async (): Promise<any> => {
            try {
                let res: any = await repositoryMotivosControl.getAll()//db.query("SELECT * FROM motivos_derivacion")
                console.log("Motivos " + JSON.stringify(res))
                setMotivos(res)
                return true;
            }
            catch (error: any) {
                return false;
            }
        }
        testDatabaseCopyFromAssets()
    }, [])




    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
    }

    const handleInputChangeEcografia = (e: any) => {
        const { name, value } = e.target;
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
        if (value === "T") {
            setShowEcografia(true)
        } else {
            setShowEcografia(false)
        }

    }
    const handleInputChangeEco_Observa = (e: any) => {
        const { name, value } = e.target;
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
        if (value === "P") {
            setshowEco_observa(true)
        } else {
            setshowEco_observa(false)
        }

    }
    const handleEdadGestacional=(e:any)=>{
        setEdadGestacional(e.target.value);
    }
    const handleInputChangeHpv = (e: any) => {
        const { name, value } = e.target;
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
        if (value === "S") {
            setShowHpv(true)
        } else {
            setShowHpv(false)
        }

    }

    const handleInputChangePap = (e: any) => {
        const { name, value } = e.target;
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
        if (value === "S") {
            setShowPap(true)
        } else {
            setShowPap(false)
        }

    }

    const handleEcoCheck = (e: any) => {
        const checked = e.detail.checked;
        setControl((prev: any) => {
            const next = { ...prev, ECO_CHECKED: checked };
            if (checked && prev.ecografia === "N") {
                next.ecografia = "S";
            } else if (!checked) {
                next.ecografia = "N";
                setShowEcografia(false);
            }
            return next;
        });
    }

    const handleInpuTChecks = (e: any) => {
        const name = e.target.name;
        const value = e.detail.checked
        setControl((prevProps: any) => {
            const next = { ...prevProps, [name]: value };
            
            // Lógica para marcar como Solicitada automáticamente
            const respKey = "resp_" + name.toLowerCase();
            if (value && (prevProps[respKey] === "N" || !prevProps[respKey])) {
                next[respKey] = "S";
            }
            
            // Casos especiales
            if (name === "SIFILIS" && value && prevProps.resp_sifilis === "N") next.resp_sifilis = "S";
            if (name === "HIV" && value && prevProps.resp_hiv === "N") next.resp_hiv = "S";
            if (name === "CHAGAS" && value && prevProps.resp_chagas === "N") next.resp_chagas = "S";
            if (name === "VHB" && value && prevProps.resp_vhb === "N") next.resp_vhb = "S";
            
            return next;
        });
    }

    const OnSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        const now = Math.floor(Date.now() / 1000);

        // Insert tabla personas
        let ultimo_id_persona = await repositoryPersonas.getLastRowId("id_persona")
        const current_id_persona = toInt(ultimo_id_persona) + 1;

        const newPersona: Personas = {
            id_persona: current_id_persona,
            apellido: paciente.paciente.apellido,
            nombre: paciente.paciente.nombre,
            documento: paciente.paciente.documento,
            fecha_nacimiento: moment(paciente.paciente.fecha_nacimiento).format("YYYY-MM-DD"),
            id_origen: paciente.paciente.origen,
            nacionalidad: paciente.paciente.nacionalidad,
            sexo: "F",
            madre: paciente.paciente.madre,
            alta: paciente.paciente.alta,
            nacido_vivo: paciente.paciente.nacido_vivo,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryPersonas.create(newPersona)
        console.log("Persona insertada ID:", current_id_persona);

        // Ubicacion
        let ultimo_id_ubicacion = await repositoryUbicacion.getLastRowId("id_ubicacion")
        let ubicacionGeo = paciente.paciente.latitud + " " + paciente.paciente.longitud
        const newUbicacion: Ubicaciones = {
            id_ubicacion: toInt(ultimo_id_ubicacion) + 1,
            id_persona: current_id_persona,
            id_paraje: paciente.paciente.paraje_residencia,
            id_area: paciente.paciente.area_residencia,
            num_vivienda: "",
            fecha: fecha1,
            georeferencia: ubicacionGeo,
            id_pais: paciente.paciente.pais_residencia,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryUbicacion.create(newUbicacion)
        console.log("Ubicacion insertada");

        // Control
        let ultimo_id_control = await repositoryControles.getLastRowId("id_control")
        const current_id_control = toInt(ultimo_id_control) + 1;

        const newControles: Controles = {
            id_control: current_id_control,
            fecha: fecha1,
            id_persona: current_id_persona,
            control_numero: 1,
            id_estado: 1,
            id_seguimiento_chagas: null,
            id_tratamiento_chagas: null,
            id_seguimiento_hiv: null,
            id_tratamiento_hiv: null,
            id_seguimiento_sifilis: null,
            id_tratamiento_sifilis: null,
            id_seguimiento_vhb: null,
            id_tratamiento_vhb: null,
            fecha_fin_embarazo: null,
            id_tipos_fin_embarazos: null,
            georeferencia: null,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryControles.create(newControles);
        console.log("Control insertado ID:", current_id_control);

        // Antecedentes
        let ultimo_id_antecedentes = await repositoryAntecedentes.getLastRowId("id_antecedente")
        let insertfum = paciente.control?.fum === null ? null : moment(paciente.control.fum).format("YYYY-MM-DD")
        let insertfpp = paciente.control?.fpp === null ? null : moment(paciente.control.fpp).format("YYYY-MM-DD")
        let insert_fecha_ultimo_embarazo = paciente?.control.fecha_ultimo_embarazo === null || paciente?.control.fecha_ultimo_embarazo === "null" ? null : paciente?.control.fecha_ultimo_embarazo

        const newAntecedentes: Antecedentes = {
            id_antecedente: toInt(ultimo_id_antecedentes) + 1,
            id_persona: current_id_persona,
            id_control: current_id_control,
            edad_primer_embarazo: toInt(paciente.control.edad_primer_embarazo),
            fecha_ultimo_embarazo: insert_fecha_ultimo_embarazo,
            gestas: toInt(paciente.control.gestas),
            partos: toInt(paciente.control.partos),
            cesareas: toInt(paciente.control.cesareas),
            abortos: toInt(paciente.control.abortos),
            planificado: paciente.control.planificado,
            fum: insertfum,
            fpp: insertfpp,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryAntecedentes.create(newAntecedentes)
        const current_id_antecedente = newAntecedentes.id_antecedente;

        // Antecedentes Apps
        const newAntecedentesApss: Antecedentes_Apps = {
            id_antecedente: toInt(current_id_antecedente),
            id_app: paciente.control.app || 10,
            last_modified: now,
            sql_deleted: 0
        }
        await repositoryAntecedentesApps.create(newAntecedentesApss)

        // Antecedentes Macs
        const newAntecedentesMacs: Antecedentes_Macs = {
            id_antecedente: toInt(current_id_antecedente),
            id_mac: paciente.control.mac || 6,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryAntecedentesMacs.create(newAntecedentesMacs);

        // Control Embarazo
        let ultimo_id_control_embarazada = await repositoryControlEmbarazo.getLastRowId("id_control_embarazo")
        const newControlEmbarazo: Control_Embarazo = {
            id_control_embarazo: toInt(ultimo_id_control_embarazada) + 1,
            id_control: current_id_control,
            edad_gestacional: toInt(edadGestacional),
            eco: control.ecografia === "S" ? "S" : (control.ecografia === "N" ? "N" : control.ecografia_resultado),
            detalle_eco: strOrEmpty(control.eco_observaciones),
            hpv: control.hpv === "N" ? "N" : control.hpv_resultado,
            pap: control.pap === "N" ? "N" : control.pap_resultado,
            sistolica: toInt(control.sistolica),
            diastolica: toInt(control.diastolica),
            clinico: strOrEmpty(control.clinico),
            observaciones: strOrEmpty(control.observaciones),
            motivo: toInt(control.motivo),
            derivada: toInt(control.derivada),
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryControlEmbarazo.create(newControlEmbarazo)

        // Inmunizaciones
        const newInmunizacionesControl: Inmunizaciones_Control = {
            id_persona: current_id_persona,
            id_control: current_id_control,
            id_inmunizacion: 2,
            estado: control.agripal,
            sql_deleted: 0,
            last_modified: now,
        }
        await repositoryInmunizacionesControl.create(newInmunizacionesControl) // AGRIPAL

        newInmunizacionesControl.id_inmunizacion = 3
        newInmunizacionesControl.estado = control.db
        await repositoryInmunizacionesControl.create(newInmunizacionesControl) // DB

        newInmunizacionesControl.id_inmunizacion = 1
        newInmunizacionesControl.estado = control.tba
        await repositoryInmunizacionesControl.create(newInmunizacionesControl) // TBA

        newInmunizacionesControl.id_inmunizacion = 4
        newInmunizacionesControl.estado = control.vhb
        await repositoryInmunizacionesControl.create(newInmunizacionesControl) // VHB

        // Laboratorios
        const currentTrimestre = getTrimestre(toInt(edadGestacional));
        const baseLab: Laboratorios_Realizados = {
            id_persona: current_id_persona,
            id_control: current_id_control,
            id_laboratorio: 1,
            trimestre: currentTrimestre,
            fecha_realizado: fecha1,
            id_etmi: 3,
            sql_deleted: 0,
            last_modified: now,
        }

        const baseEtmi: Etmis_Personas = {
            id_persona: current_id_persona,
            id_etmi: 3,
            id_control: current_id_control,
            confirmada: 0,
            sql_deleted: 0,
            last_modified: now,
        }

        // Sifilis
        if (control.SIFILIS) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 1,
                id_etmi: 3,
                resultado: control.resp_sifilis,
                fecha_resultados: control.resp_sifilis === "S" ? null : fecha1
            });
            if (control.resp_sifilis === "P") {
                await repositoryEtmisPersonas.create({ ...baseEtmi, id_etmi: 3 });
            }
        }

        // HIV
        if (control.HIV) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 2,
                id_etmi: 2,
                resultado: control.resp_hiv,
                fecha_resultados: control.resp_hiv === "S" ? null : fecha1
            });
            if (control.resp_hiv === "P") {
                await repositoryEtmisPersonas.create({ ...baseEtmi, id_etmi: 2 });
            }
        }

        // CHAGAS
        if (control.CHAGAS) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 4,
                id_etmi: 1,
                resultado: control.resp_chagas,
                fecha_resultados: control.resp_chagas === "S" ? null : fecha1
            });
            if (control.resp_chagas === "P") {
                await repositoryEtmisPersonas.create({ ...baseEtmi, id_etmi: 1 });
            }
        }

        // VHB
        if (control.VHB) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 5,
                id_etmi: 4,
                resultado: control.resp_vhb,
                fecha_resultados: control.resp_vhb === "S" ? null : fecha1
            });
            if (control.resp_vhb === "P") {
                await repositoryEtmisPersonas.create({ ...baseEtmi, id_etmi: 4 });
            }
        }

        // Otros Labs
        if (control.ESTREPTOCOCO_BETA_HEMOLÍTICO) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 8,
                id_etmi: 0,
                resultado: control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO,
                fecha_resultados: control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO === "S" ? null : fecha1
            });
        }

        if (control.HB) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 7,
                id_etmi: 0,
                resultado: control.resp_hb === "S" ? "S" : control.valor_hb,
                fecha_resultados: control.resp_hb === "S" ? null : fecha1
            });
        }

        if (control.GLUCEMIA) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 6,
                id_etmi: 0,
                resultado: control.resp_glucemia === "S" ? "S" : control.valor_glucemia,
                fecha_resultados: control.resp_glucemia === "S" ? null : fecha1
            });
        }

        if (control.GRUPO_FACTOR) {
            await repositoryLaboratoriosRealizados.create({
                ...baseLab,
                id_laboratorio: 9,
                id_etmi: 0,
                resultado: control.resp_grupo_factor === "S" ? "S" : control.valor_grupo_factor,
                fecha_resultados: control.resp_grupo_factor === "S" ? null : fecha1
            });
        }

        setLoading(false);
        return true;
    }

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref="/personas" disabled={isLoading} routerAnimation={animationBuilder} />
                    </IonButtons>
                    <IonLabel >Controles de {paciente?.paciente.nombre} {paciente?.paciente.apellido}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={async (e: any) => {
                    const ok = await OnSubmit(e);
                    if (ok) history.push("/personas");
                }}>
                    <IonItem>
                        <IonLabel position="floating">Edad Gestacional ({edadGestacional } Semanas )</IonLabel>
                        <IonInput type="number"  value={edadGestacional} name="edad_gestacional" onIonChange={e => handleEdadGestacional(e)} ></IonInput>
                    </IonItem>
                     {/* === ION DATE TIME === */}
                     <IonItem>
                            <IonLabel position="stacked">{fecha1 === null || fecha1 === "null" ?"":"Fecha de Control"}</IonLabel>
                            {fecha1 === null || fecha1 === "null" ? <IonButton onClick={(e) => setDataPicker(true)} size="small" >Fecha de Control</IonButton> : <IonDatetimeButton datetime="datetime" defaultValue={fecha1}></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker} className="ion-datetime-button-overlay" onDidDismiss={() => setDataPicker(false)}>
                                <IonDatetime
                                    
                                    id="datetime"
                                    name="fecha_ultimocontrol"
                                    onIonChange={(e) => setFecha1(e.target.value)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={fecha1}
                                    onIonCancel={() => setDataPicker(false)}

                                />
                            </IonModal>
                            
                        </IonItem>
                    {/* Ecografia */}
                    <IonCard>
                        <IonCardHeader>
                            <IonItem lines="none">
                                <IonCheckbox slot="start" checked={control?.ecografia !== "N"} onIonChange={handleEcoCheck}></IonCheckbox>
                                <IonCardTitle>Ecografía</IonCardTitle>
                            </IonItem>
                        </IonCardHeader>
                        {(control?.ecografia !== "N" || control?.ECO_CHECKED) && (
                            <IonRow>
                                <IonCol>
                                    <IonList>
                                        <IonRadioGroup onIonChange={e => handleInputChangeEcografia(e)} name="ecografia" value={control.ecografia}>
                                            <IonItem>
                                                <IonLabel>Si</IonLabel>
                                                <IonRadio slot="end" value="T"></IonRadio>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>No</IonLabel>
                                                <IonRadio slot="end" value="N"></IonRadio>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Solicitada</IonLabel>
                                                <IonRadio slot="end" value="S"></IonRadio>
                                            </IonItem>
                                        </IonRadioGroup>
                                    </IonList>
                                </IonCol>
                                <IonCol>
                                    {showEcografia &&
                                        <IonList>
                                            <IonRadioGroup onIonChange={e => handleInputChangeEco_Observa(e)} name="ecografia_resultado" value={control.ecografia_resultado}>
                                                <IonItem>
                                                    <IonLabel>Normal</IonLabel>
                                                    <IonRadio slot="end" value="R"></IonRadio>
                                                </IonItem>
                                                <IonItem>
                                                    <IonLabel color="danger">Patológica</IonLabel>
                                                    <IonRadio slot="end" value="P"></IonRadio>
                                                </IonItem>
                                            </IonRadioGroup>
                                        </IonList>}
                                </IonCol>
                                <IonCol>
                                    {eco_observa && showEcografia &&
                                        <IonList>
                                            <IonItem>
                                                <IonLabel position="floating">Observaciones</IonLabel>
                                                <IonInput name="eco_observaciones" onIonChange={e => handleInputChange(e)}></IonInput>
                                            </IonItem>
                                        </IonList>
                                    }
                                </IonCol>
                            </IonRow>
                        )}
                    </IonCard>

                    <IonCard color="light">
                        <IonCardHeader>
                            <IonCardTitle>Cargar Laboratorios / Serologías del:</IonCardTitle>
                        </IonCardHeader>
                        <LaboratorioCerologia titulo="SIFILIS" radio={(e: any) => handleInpuTChecks(e)} radioname="SIFILIS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_sifilis" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_sifilis} />
                        <LaboratorioCerologia titulo="HIV" radio={(e: any) => handleInpuTChecks(e)} radioname="HIV" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_hiv" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_hiv} />
                        <LaboratorioCerologia titulo="CHAGAS" radio={(e: any) => handleInpuTChecks(e)} radioname="CHAGAS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_chagas" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_chagas} />
                        <LaboratorioCerologia titulo="VHB" radio={(e: any) => handleInpuTChecks(e)} radioname="VHB" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_vhb" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_vhb} />
                        <LaboratorioCerologia titulo="ESTREPTOCOCO BETA HEMOLÍTICO" radio={(e: any) => handleInpuTChecks(e)} radioname="ESTREPTOCOCO_BETA_HEMOLÍTICO" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_ESTREPTOCOCO_BETA_HEMOLÍTICO" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO} />
                        <LaboratorioCerologiaII titulo="Hb" radio={(e: any) => handleInpuTChecks(e)} radioname="HB" radioOpcion={["S", "R"]} radioOpcionName="resp_hb" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_hb" inputvalue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_hb} />
                        <LaboratorioCerologiaII titulo="GLUCEMIA" radio={(e: any) => handleInpuTChecks(e)} radioname="GLUCEMIA" radioOpcion={["S", "R"]} radioOpcionName="resp_glucemia" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_glucemia" inputvalue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_glucemia} />
                        <LaboratorioCerologiaIII titulo="GRUPO Y FACTOR" radio={(e: any) => handleInpuTChecks(e)} radioname="GRUPO_FACTOR" radioOpcion={["S", "R"]} radioOpcionName="resp_grupo_factor" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_grupo_factor" inputvalue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_grupo_factor} />
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonLabel>Presìon Arterial</IonLabel>
                        </IonCardHeader>
                        <IonItem>
                            <IonLabel position="floating">Sistólica</IonLabel>
                            <IonInput type="number" name="sistolica" onIonChange={(e: any) => handleInputChange(e)} required></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Diastólica</IonLabel>
                            <IonInput type="number" name="diastolica" onIonChange={(e: any) => handleInputChange(e)} required></IonInput>
                        </IonItem>
                    </IonCard>

                    <IonCard>
                        <IonCardHeader>
                            <IonLabel>Control Clínico</IonLabel>
                        </IonCardHeader>

                        <IonList>

                            <IonRadioGroup onIonChange={e => handleInputChange(e)} name="clinico" value={control.clinico}>

                                <IonItem>
                                    <IonLabel>Normal</IonLabel>
                                    <IonRadio slot="end" value="N"></IonRadio>
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Patologico</IonLabel>
                                    <IonRadio slot="end" value="P"></IonRadio>
                                </IonItem>
                            </IonRadioGroup>
                        </IonList>
                        <IonList>
                            <IonListHeader>
                                <IonLabel>Derivada</IonLabel>
                            </IonListHeader>
                            <IonRadioGroup onIonChange={e => handleInputChangeEcografia(e)} name="derivada" value={control.derivada}>
                                <IonItem>
                                    <IonLabel>Si</IonLabel>
                                    <IonRadio slot="end" value={1}></IonRadio>
                                </IonItem>

                                <IonItem>
                                    <IonLabel>No</IonLabel>
                                    <IonRadio slot="end" value={0}></IonRadio>
                                </IonItem>
                            </IonRadioGroup>

                            <IonRadioGroup>
                                <IonItem>
                                    <IonLabel>Motivos de Derivacíon</IonLabel>
                                    <IonSelect name="motivo" onIonChange={e => handleInputChange(e)}>

                                        {motivos.map((data: any, i: any) => {
                                            return (
                                                <IonSelectOption value={data.id_motivo} key={i}>{data.nombre}</IonSelectOption>
                                            )
                                        })}
                                    </IonSelect>
                                </IonItem>
                            </IonRadioGroup>
                            <IonItem>
                                <IonLabel position="floating">Observaciones</IonLabel>
                                <IonTextarea name="observaciones" onIonChange={e => handleInputChange(e)}></IonTextarea>
                            </IonItem>
                        </IonList>
                    </IonCard>
                    
                    <IonButton expand="block" fill="outline" type="submit" disabled={isLoading}>{isLoading ? "Guardando" : "Guardar"}</IonButton>
                </form>
            </IonContent>
        </IonPage>


    )

}

export default NuevaEmbarazadaControl