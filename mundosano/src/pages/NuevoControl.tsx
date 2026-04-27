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
import { Controles } from "../models/Controles";
import { Control_Embarazo } from "../models/Control_Embarazo";
import { Inmunizaciones_Control } from "../models/Inmunizaciones_Control";
import { Laboratorios_Realizados } from "../models/Laboratorios_Realizados";
import { Etmis_Personas } from "../models/Etmis_Personas";
import { Personas } from "../models/PersonasModels";
interface antecedentes {
    id_antecedente?: number,
    id_persona?: number,
    id_control?: number,
    edad_primer_embarazo?: number | null,
    fecha_ultimo_embarazo?: string | null,
    gestas?: number | 0,
    partos?: number | 0,
    cesareas?: number | 0,
    abortos?: number | 0,
    planificado?: number | null,
    fum?: string | null,
    fpp?: string | null,
    fecha?: Date,
    id_app: number | null,
    id_mac: number | null

}
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
    derivada: 0

}

const NuevoControl: React.FC = () => {
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [fecha1, setFecha1] = useState<any>(null)
    const location = useLocation();
    const [paciente, setPaciente] = useState<any>(location.state);
    const [control, setControl] = useState<any>(inicial_control)
    const [diferencia, setDiferencia] = useState<any>()
    const [showEcografia, setShowEcografia] = useState<boolean>(false)
    const [eco_observa, setshowEco_observa] = useState<boolean>(false)
    const [showHpv, setShowHpv] = useState<boolean>(false)
    const [showPap, setShowPap] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [motivos, setMotivos] = useState<any>([])

    const repositoryMotivosControl = new Repository<MotivoDeDerivacion>("motivos_derivacion");
    const repositoryControles = new Repository<Controles>("controles");
    const repositoryControlEmbarazo = new Repository<Control_Embarazo>("control_embarazo")
    const repositoryInmunizacionesControl = new Repository<Inmunizaciones_Control>("inmunizaciones_control")
    const repositoryLaboratoriosRealizados = new Repository<Laboratorios_Realizados>("laboratorios_realizados")
    const repositoryEtmisPersonas = new Repository<Etmis_Personas>("etmis_personas")
    const repositoryPersonas = new Repository<Personas>("personas");

    const hoy = moment()

     
    let history = useHistory()
    
    const [edadGestacional, setEdadGestacional] = useState<any>()

    useEffect(() => {
        const fum = paciente?.antecedentes?.fum;
        const fpp = paciente?.antecedentes?.fpp;

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

    const getTrimestre = (semanas: number) => {
        if (semanas <= 13) return 1;
        if (semanas <= 27) return 2;
        return 3;
    };

    useIonViewWillEnter(() => {
        setFecha1(hoy.format("YYYY-MM-DD"))
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


    const fechaNacimiento = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")
        setDataPicker(false)
        //setPaciente((prevProps) => ({ ...prevProps, fecha_nacimiento: dia }))
        setFecha1(dia)
        //setFecha(e.detail.value)
        //setValue('fecha_nacimiento', e.detail.value)
    }

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
            
            // Casos especiales de nombres de campos que no siguen el patrón resp_nombre
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
        const toInt = (value: any, fallback: number = 0): number => {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : fallback;
        };
        const strOrEmpty = (value: any): string => value === undefined || value === null ? "" : String(value);

        /*Tabla control_embarazo */
        const control_embarazo: any = {};
        control_embarazo.edad_gestacional = toInt(edadGestacional);
        if (control.ecografia === "S") {
            control_embarazo.eco = "S"
        } else {
            control_embarazo.eco = control.ecografia === "N" ? "N" : control.ecografia_resultado;
        }

        control_embarazo.detalle_eco = control.eco_observaciones === null ? null : control.eco_observaciones;
        control_embarazo.hpv = control.hpv === "N" ? "N" : control.hpv_resultado;
        control_embarazo.pap = control.pap === "N" ? "N" : control.pap_resultado;
        control_embarazo.sistolica = control.sistolica;
        control_embarazo.diastolica = control.diastolica;
        control_embarazo.clinico = control.clinico;
        control_embarazo.observaciones = control.observaciones;
        control_embarazo.motivo = control.motivo
        control_embarazo.derivada = control.derivada

        const now = Math.floor(Date.now() / 1000);
        const idPersona = toInt(paciente?.id_persona);

        if (!idPersona) {
            console.error("No se pudo obtener el ID de la persona");
            setLoading(false);
            return;
        }

        // Insert control
        // Actualizamos al padre para que el Partial Sync lo incluya y no haya rechazos
        await repositoryPersonas.update({ last_modified: now } as any, "id_persona", idPersona);

        let resp_numero_control = await repositoryMotivosControl.getLastMaxControl(idPersona);

        let ultimo_id_control = await repositoryControles.getLastRowId("id_control")

        let c = toInt(ultimo_id_control) + 1
        const actual_id_control = c;
        let n = toInt(resp_numero_control) + 1
        const newControles: Controles = {
            id_control: c,
            fecha: fecha1,
            id_persona: idPersona,
            control_numero: n,
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
            last_modified: now
        };

        let insert_control = await repositoryControles.create(newControles);
        if (insert_control) console.log("Se inserto el control nro " + n);

        setTimeout(() => {

            //history.push("/personas")
            // window.location.reload()
        }, 1000)
        //antecedentes_insert(paciente?.antecedente,Number(ultimo_id_control[0].id_control))

        //insert control embarazada
        let ultimo_id_control_embarazada = await repositoryControlEmbarazo.getLastRowId("id_control_embarazo")
        let newControlEmbarazo: Control_Embarazo = {
            id_control_embarazo: toInt(ultimo_id_control_embarazada) + 1,
            id_control: actual_id_control,
            edad_gestacional: toInt(control_embarazo.edad_gestacional),
            eco: strOrEmpty(control_embarazo.eco),
            detalle_eco: strOrEmpty(control_embarazo.detalle_eco),
            hpv: strOrEmpty(control_embarazo.hpv),
            pap: strOrEmpty(control_embarazo.pap),
            sistolica: toInt(control_embarazo.sistolica),
            diastolica: toInt(control_embarazo.diastolica),
            clinico: strOrEmpty(control_embarazo.clinico),
            observaciones: strOrEmpty(control_embarazo.observaciones),
            motivo: toInt(control_embarazo.motivo),
            derivada: toInt(control_embarazo.derivada),
            sql_deleted: 0,
            last_modified: now
        }
        let resp_control_embrarazo = await repositoryControlEmbarazo.create(newControlEmbarazo)

        //Insert inmunizaciones

        const newInmunizacionesControl: Inmunizaciones_Control = {
            id_persona: idPersona,
            id_control: actual_id_control,
            id_inmunizacion: 2,
            estado: control.agripal,
            sql_deleted: 0,
            last_modified: now,
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        let AGRIPAL = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (AGRIPAL) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion = 3
        newInmunizacionesControl.estado = control.db
        newInmunizacionesControl.last_modified = now;
        let DB = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (DB) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion = 1
        newInmunizacionesControl.estado = control.tba
        newInmunizacionesControl.last_modified = now;
        let TBA = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (TBA) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion = 4
        newInmunizacionesControl.estado = control.vhb
        newInmunizacionesControl.last_modified = now;
        let VHB = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (VHB) console.log("Insertar Inmunizaciones Control")






        //Insert Laboratorio
        const newLaboratoriosRealizados: Laboratorios_Realizados = {
            id_persona: idPersona,
            id_control: actual_id_control,
            id_laboratorio: 1,
            trimestre: getTrimestre(toInt(edadGestacional)),
            fecha_realizado: fecha1,
            
            
            id_etmi: 3,
            sql_deleted: 0,
            last_modified: now,
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }

        const newEtmisPersonas: Etmis_Personas = {
            id_persona: idPersona,
            id_etmi: 3,
            id_control: actual_id_control,
            confirmada: 1,
            sql_deleted: 0,
            last_modified: now,
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        //Sifilis

        if (control.SIFILIS) {
            newLaboratoriosRealizados.resultado = control.resp_sifilis;
            newLaboratoriosRealizados.fecha_resultados= control.resp_sifilis==="S"?null:fecha1
            let Resp_Sifilis = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
            if (Resp_Sifilis) console.log("Insertar Laboratorios Realizados")

            if (control.resp_sifilis === "P") {
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas Sifilis")

            }
        }
        //HIV

        if (control.HIV) {
            newLaboratoriosRealizados.id_laboratorio = 2;
            newLaboratoriosRealizados.id_etmi = 2
            newLaboratoriosRealizados.fecha_resultados=control.resp_hiv==="S"?null:fecha1
            newLaboratoriosRealizados.resultado = control.resp_hiv;
            let resp_HIV = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
            if (resp_HIV) console.log("Insertar Laboratorios Realizados HIV")

            if (control.resp_hiv === "P") {
                newEtmisPersonas.id_etmi = 2
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas HIV")
            }
        }
        //CHAGAS
        if (control.CHAGAS) {
            newLaboratoriosRealizados.id_laboratorio = 4;
            newLaboratoriosRealizados.id_etmi = 1
            newLaboratoriosRealizados.resultado = control.resp_chagas;
            newLaboratoriosRealizados.fecha_resultados=control.resp_chagas==="S"?null:fecha1;
            let resp_CHAGAS = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_CHAGAS) console.log("Insertar Laboratorios Realizados CHAGAS")

            if (control.resp_chagas === "P") {
                newEtmisPersonas.id_etmi = 1
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas CHAGAS")
            }
        }
        //VHB
        if (control.VHB) {
            newLaboratoriosRealizados.id_laboratorio = 5;
            newLaboratoriosRealizados.id_etmi = 4
            newLaboratoriosRealizados.resultado = control.resp_vhb;
            newLaboratoriosRealizados.fecha_resultados=control.resp_vhb==="S"?null:fecha1
            let resp_VHB = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_VHB) console.log("Insertar Laboratorios Realizados VHB")

            if (control.resp_vhb === "P") {
                newEtmisPersonas.id_etmi = 4
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas VHB")
            }
        }

        //ESTREPTOCOCO_BETA_HEMOLÍTICO

        if (control.ESTREPTOCOCO_BETA_HEMOLÍTICO) {
            newLaboratoriosRealizados.id_laboratorio = 8;
            newLaboratoriosRealizados.id_etmi = 0
            newLaboratoriosRealizados.resultado = control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO;
            newLaboratoriosRealizados.fecha_resultados=control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:fecha1
            let resp_EBH = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_EBH) console.log("Insertar Etmis Personas ESTREPTOCOCO_BETA_HEMOLÍTICO");

        }

        //Hb
        if (control.HB) {
            let respuesta = control.resp_hb === "S" ? "S" : control.valor_hb
            newLaboratoriosRealizados.id_laboratorio = 7;
            newLaboratoriosRealizados.id_etmi = 0
            newLaboratoriosRealizados.resultado = respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_hb==="S"?null:fecha1
            let resp_HB = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_HB) console.log("Insertar Etmis Personas HB");

        }

        //Glucemia resp_glucemia
        if (control.GLUCEMIA) {
            let respuesta = control.resp_glucemia === "S" ? "S" : control.valor_glucemia
            newLaboratoriosRealizados.id_laboratorio = 6;
            newLaboratoriosRealizados.id_etmi = 0
            newLaboratoriosRealizados.resultado = respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_glucemia==="S"?null:fecha1
            let resp_GLUCEMIA = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_GLUCEMIA) console.log("Insertar Etmis Personas GLUCEMIA");

        }
        //GRUPO_FACTOR
        if (control.GRUPO_FACTOR) {
            let respuesta = control.resp_grupo_factor === "S" ? "S" : control.valor_grupo_factor
            newLaboratoriosRealizados.id_laboratorio = 9;
            newLaboratoriosRealizados.id_etmi = 0
            newLaboratoriosRealizados.resultado = respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_grupo_factor==="S"?null:fecha1
            let resp_GRUPO_FACTOR = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_GRUPO_FACTOR) console.log("Insertar Etmis Personas GRUPO_FACTOR");

        }


        
        setLoading(false)
        return true
    }


   

    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref="/personas" disabled={isLoading} routerAnimation={animationBuilder} />
                    </IonButtons>
                    <IonLabel >Controles de {paciente?.nombre} {paciente?.apellido} </IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={async (e:any)=>{
                        const ok = await OnSubmit(e);
                        if (ok) history.push("/personas");
                        }}>
                    <IonItem>
                        <IonLabel position="floating">Edad Gestacional (FUM {moment(paciente?.antecedentes?.fum).format("LL")})</IonLabel>
                        <IonInput type="number" value={edadGestacional} name="edad_gestacional" onIonChange={e => setEdadGestacional(e.detail.value)} ></IonInput>
                    </IonItem>
                     {/* === ION DATE TIME === */}
                     <IonItem>
                            <IonLabel position="stacked">{fecha1 ? "Fecha de Control" : "Elegir fecha de control"}</IonLabel>
                            {fecha1 === null || fecha1 === "null" ? <IonButton color="dark" onClick={(e) => setDataPicker(true)} size="small" >Fecha de Control</IonButton> : <IonDatetimeButton color="dark" datetime="datetime" defaultValue={fecha1} ></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker} className="ion-datetime-button-overlay" onDidDismiss={() => setDataPicker(false)}>
                                <IonDatetime
                                    
                                    id="datetime"
                                    name="fecha_ultimocontrol"
                                    onIonChange={(e) => setFecha1(e.detail.value)}
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
                            <IonLabel position="stacked" color="medium">Seleccionada: {fecha1 ? moment(fecha1).format("DD/MM/YYYY") : "—"}</IonLabel>
                            
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
                                                <IonLabel>Solicitada</IonLabel>
                                                <IonRadio slot="end" value="S"></IonRadio>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>Realizada (Si)</IonLabel>
                                                <IonRadio slot="end" value="T"></IonRadio>
                                            </IonItem>
                                            <IonItem>
                                                <IonLabel>No</IonLabel>
                                                <IonRadio slot="end" value="N"></IonRadio>
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
                                { showEcografia &&
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
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>TESTS</IonCardTitle>
                        </IonCardHeader>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>HPV</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChangeHpv(e)} name="hpv" value={control.hpv}>
                                        <IonItem>
                                            <IonLabel>Si</IonLabel>
                                            <IonRadio slot="end" value="S"></IonRadio>
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>

                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                            <IonCol>
                                {showHpv &&
                                    <IonList>
                                        <IonListHeader>
                                            <IonLabel></IonLabel>
                                        </IonListHeader>
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="hpv_resultado" value={control.hpv_resultado}>
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
                        </IonRow>
                        <IonRow>
                            <IonCol>
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>PAP</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChangePap(e)} name="pap" value={control.pap}>
                                        <IonItem>
                                            <IonLabel>Si</IonLabel>
                                            <IonRadio slot="end" value="S"></IonRadio>
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>

                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                            <IonCol>
                                {showPap &&
                                    <IonList>
                                        <IonListHeader>
                                            <IonLabel></IonLabel>
                                        </IonListHeader>
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="pap_resultado" value={control.pap_resultado}>
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
                        </IonRow>
                    </IonCard>
                    <IonCard>
                        <IonCardHeader>
                            <IonCardTitle>Inmunizaciones</IonCardTitle>
                        </IonCardHeader>
                        <IonRow>
                            <IonCol >
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>A GRIPAL</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChange(e)} name="agripal" value={control.agripal}>
                                        <IonItem>
                                            <IonLabel>Si</IonLabel>
                                            <IonRadio slot="end" value="S"></IonRadio>
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>

                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                            <IonCol>
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>DB</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChange(e)} name="db" value={control.db}>
                                        <IonItem>
                                            <IonLabel>Previa</IonLabel>
                                            <IonRadio slot="end" value="P"></IonRadio>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>Colocada</IonLabel>
                                            <IonRadio slot="end" value="C"></IonRadio>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>

                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                            <IonCol>
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>TBA</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChange(e)} name="tba" value={control.tba}>
                                        <IonItem>
                                            <IonLabel>Si</IonLabel>
                                            <IonRadio slot="end" value="S"></IonRadio>
                                        </IonItem>

                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>
                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                            <IonCol>
                                <IonList>
                                    <IonListHeader>
                                        <IonLabel>VHB</IonLabel>
                                    </IonListHeader>
                                    <IonRadioGroup onIonChange={e => handleInputChange(e)} name="vhb" value={control.vhb}>
                                        <IonItem>
                                            <IonLabel>Previa</IonLabel>
                                            <IonRadio slot="end" value="P"></IonRadio>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>Colocada</IonLabel>
                                            <IonRadio slot="end" value="C"></IonRadio>
                                        </IonItem>
                                        <IonItem>
                                            <IonLabel>No</IonLabel>
                                            <IonRadio slot="end" value="N"></IonRadio>
                                        </IonItem>

                                    </IonRadioGroup>
                                </IonList>
                            </IonCol>
                        </IonRow>
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

export default NuevoControl
