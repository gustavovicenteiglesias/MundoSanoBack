import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonTextarea, IonToolbar, useIonViewWillEnter } from "@ionic/react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { SQLiteDBConnection, useSQLite } from "react-sqlite-hook";
import { animationBuilder } from "../components/AnimationBuilder";
import EditLaboratorio from "../components/EditLaboratorio";
import LaboratorioCerologiaII from "../components/LaboratorioCerologiaII";
import LaboratorioCerologiaIII from "../components/LaboratorioCerologiaIII";
import EditLaboratorioII from "../components/EditLaboratorioII";
import EditLaboratorioIII from "../components/EditLaboratorioIII";
import { Repository } from "../repository/Repository";
import { MotivoDeDerivacion } from "../models/MotivosDeDerivacion";

import { Control_Embarazo } from "../models/Control_Embarazo";
import { Inmunizaciones_Control } from "../models/Inmunizaciones_Control";
import { Laboratorios_Realizados } from "../models/Laboratorios_Realizados";
import { Etmis_Personas } from "../models/Etmis_Personas";
import { Controles } from "../models/Controles";
import { SoloFechaControl } from "../repository/SoloFechaControl";


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
    valor_hb: "",
    valor_glucemia: "",
    valor_grupo_factor: "",
    resp_grupo_factor: "S",
    motivo: 9,
    derivada: 0


}


const EditControlEmbrazada: React.FC = () => {
    const location = useLocation();
    const datos:any = location.state
    
    //const [datos, setdatos] = useState<any>(datoss);
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [fecha1, setFecha1] = useState<any>();
    const [paciente, setPaciente] = useState<any>();
    const [control, setControl] = useState<any>(inicial_control)
    const [edadGestacional, setEdadGestacional] = useState<any>()
    const [showEcografia, setShowEcografia] = useState<boolean>(false)
    const [eco_observa, setshowEco_observa] = useState<boolean>(false)
    const [showHpv, setShowHpv] = useState<boolean>(false)
    const [showPap, setShowPap] = useState<boolean>(false)
    const [isLoading, setLoading] = useState<boolean>(false)
    const [motivos, setMotivos] = useState<any>([])

    const repositorySoloFechaControl=new SoloFechaControl
    const repositoryMotivosDerivacion = new Repository<MotivoDeDerivacion>("motivos_derivacion")
    const repositoryControlEmbarazo = new Repository<Control_Embarazo>("control_embarazo")
    const repositoryInmunizacionesControl = new Repository<Inmunizaciones_Control>("inmunizaciones_control")
    const repositoryLaboratoriosRealizados = new Repository<Laboratorios_Realizados>("laboratorios_realizados")
    const repositoryEtmisPersonas = new Repository<Etmis_Personas>("etmis_personas")
    const hoy = moment()
    let history = useHistory()
    
    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
    }

    useEffect(()=>{
        setFecha1(datos?.data.data.fecha==="undefined"?hoy.format("YYYY-MM-DD"):datos?.data.data.fecha)
    },[])

    useIonViewWillEnter(() => {

        const testDatabaseCopyFromAssets = async (): Promise<any> => {
            try {
                let res: any = await repositoryMotivosDerivacion.getAll()
                
                setMotivos(res)
                return true;
            }
            catch (error: any) {
                return false;
            }
        }
        testDatabaseCopyFromAssets()
    }, [])

    useEffect(() => {
        //update edad gestacional 
        setControl(datos?.data.data.controlembarazada)
        
        
        setPaciente(datos?.data)
        

        

        datos.data.data?.inmunizaciones.map((data: any, i: any) => {
            switch (data.id_inmunizacion) {

                case 3:

                    setControl((prevProps: any) => ({ ...prevProps, db: data.estado }));

                    break;
                case 1:
                    return setControl((prevProps: any) => ({ ...prevProps, tba: data.estado }));
                    break;
                case 2:
                    return setControl((prevProps: any) => ({ ...prevProps, agripal: data.estado }));
                    break;
                case 4:
                    return setControl((prevProps: any) => ({ ...prevProps, vhb: data.estado }));
                    break;
                default:
                    return "No"
                    break;
            }
        })
        datos.data.data?.laboratorios.map((data: any, i: any) => {
            switch (data.nombre) {

                case "SÍFILIS":
                    setControl((prevProps: any) => ({ ...prevProps, resp_sifilis: data.resultado===null?"S":data.resultado }));
                    setControl((prevProps: any) => ({ ...prevProps, SIFILIS: true }));
                    break;
                case "HIV":
                    setControl((prevProps: any) => ({ ...prevProps, resp_hiv: data.resultado===null?"S":data.resultado }));
                    setControl((prevProps: any) => ({ ...prevProps, HIV: true }));
                    break;
                case "CHAGAS":
                    setControl((prevProps: any) => ({ ...prevProps, resp_chagas: data.resultado===null?"S":data.resultado }));
                    setControl((prevProps: any) => ({ ...prevProps, CHAGAS: true }));
                    break;
                case "VHB":
                    setControl((prevProps: any) => ({ ...prevProps, resp_vhb: data.resultado===null?"S":data.resultado}));
                    setControl((prevProps: any) => ({ ...prevProps, VHB: true }));
                    break;
                case "ESTREPTOCOCO BETA HEMOLÍTICO":
                    setControl((prevProps: any) => ({ ...prevProps, resp_ESTREPTOCOCO_BETA_HEMOLÍTICO: data.resultado===null?"S":data.resultado }));
                    setControl((prevProps: any) => ({ ...prevProps, ESTREPTOCOCO_BETA_HEMOLÍTICO: true }));
                    break;
                case "Hb":
                    if (data.resultado === "S" || data.resultado === null) {
                        setControl((prevProps: any) => ({ ...prevProps, resp_hb: "S" }));
                       
                    } else {
                        setControl((prevProps: any) => ({ ...prevProps, valor_hb: data.resultado }));
                        setControl((prevProps: any) => ({ ...prevProps, resp_hb: "R" }));
                    }

                    setControl((prevProps: any) => ({ ...prevProps, Hb: true }));
                    break;
                case "GLUCEMIA":
                    if (data.resultado === "S" || data.resultado === null) {
                        setControl((prevProps: any) => ({ ...prevProps, resp_glucemia: "S" }));
                       
                    } else {
                        setControl((prevProps: any) => ({ ...prevProps, valor_glucemia: data.resultado }));
                        setControl((prevProps: any) => ({ ...prevProps, resp_glucemia: "R" }));
                    }

                    setControl((prevProps: any) => ({ ...prevProps, GLUCEMIA: true }));
                    break;
                case "GRUPO Y FACTOR":
                    if (data.resultado === "S" || data.resultado === null) {
                        setControl((prevProps: any) => ({ ...prevProps, resp_grupo_factor: "S" }));
                       
                    } else {
                        setControl((prevProps: any) => ({ ...prevProps, valor_grupo_factor: data.resultado }));
                        setControl((prevProps: any) => ({ ...prevProps, resp_grupo_factor: "R" }));
                    }

                    setControl((prevProps: any) => ({ ...prevProps, GRUPO_FACTOR: true }));
                    break;
                default:
                    /*setControl((prevProps: any) => ({ ...prevProps, SIFILIS: data.nombre=="SÍFILIS"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, HIV: data.nombre=="HIV"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, CHAGAS: data.nombre=="CHAGAS"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, VHB: data.nombre=="VHB"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, ESTREPTOCOCO_BETA_HEMOLÍTICO: data.nombre=="ESTREPTOCOCO BETA HEMOLÍTICO"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, Hb: data.nombre=="Hb"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, GLUCEMIA: data.nombre=="GLUCEMIA"?true:false }));
                    setControl((prevProps: any) => ({ ...prevProps, GRUPO_FACTOR: data.nombre=="GRUPO Y FACTOR"?true:false }));*/
                    break;
            }
        })
        if (datos.data.data?.controlembarazada?.eco === "S") {
            setControl((prevProps: any) => ({ ...prevProps, ecografia: "S" }));
        }
        if (datos.data.data?.controlembarazada?.eco === "N") {
            setControl((prevProps: any) => ({ ...prevProps, ecografia: "N" }));
        }

        if (datos.data.data?.controlembarazada?.eco === "R" || datos.data.data?.controlembarazada?.eco === "P") {
            setControl((prevProps: any) => ({ ...prevProps, ecografia_resultado: datos.data.data?.controlembarazada?.eco }));
            setControl((prevProps: any) => ({ ...prevProps, ecografia: "T" }));
            setControl((prevProps: any) => ({ ...prevProps, eco_observaciones: datos.data.data?.controlembarazada?.detalle_eco }));
            if (datos.data.data?.controlembarazada?.eco === "P") {
                setshowEco_observa(true)
            } else {
                setshowEco_observa(false)
            }

        }

        if (datos.data.data?.controlembarazada?.hpv === "R" || datos.data.data?.controlembarazada?.hpv === "P") {
            setControl((prevProps: any) => ({ ...prevProps, hpv_resultado: datos.data.data?.controlembarazada?.hpv }));
            setControl((prevProps: any) => ({ ...prevProps, hpv: "S" }));

        }

        if (datos.data.data?.controlembarazada?.pap === "R" || datos.data.data?.controlembarazada?.pap === "P") {
            setControl((prevProps: any) => ({ ...prevProps, pap_resultado: datos.data.data?.controlembarazada?.pap }));
            setControl((prevProps: any) => ({ ...prevProps, pap: "S" }));

        }
        if (datos.data.paciente?.antecedentes.fum !== null  ) {
            setControl((prevProps: any) => ({ ...prevProps, edad_gestacional: hoy.diff(datos.data.paciente?.antecedentes.fum, "weeks") }));
        } else {
            setControl((prevProps: any) => ({ ...prevProps, edad_gestacional: 0 }));
        }

    }, [])

    
    useEffect(()=>{
        let contolemb=datos?.data.data.controlembarazada;
        if (datos?.data.paciente.antecedentes.fum !== null) {
            contolemb.edad_gestacional= hoy.diff(datos?.data.paciente.antecedentes.fum, "weeks") ;
            setEdadGestacional(hoy.diff(datos?.data.paciente.antecedentes.fum, "weeks"))
            
        }else if(datos.data.paciente.antecedentes.fpp !== null){
            setEdadGestacional((hoy.diff(datos?.data.paciente.antecedentes?.fpp, 'weeks')+40))
            
           
        }
        
        else {
            
           contolemb.edad_gestacional= 0;
           setEdadGestacional(contolemb.edad_gestacional)
        }
    },[])

    const fechaNacimiento = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")
        setDataPicker(false)
        //setPaciente((prevProps) => ({ ...prevProps, fecha_nacimiento: dia }))
        setFecha1(dia)
        //setFecha(e.detail.value)
        //setValue('fecha_nacimiento', e.detail.value)
    }
    const handleEdadGestacional=(e:any)=>{
        setEdadGestacional(e.target.value);
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

    const handleInpuTChecks = (e: any) => {
        const name = e.target.name;
        const value = e.detail.checked
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
    }

    const OnSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        /*cambiar fecha contol */
        
        let respControl= await repositorySoloFechaControl.updateFecha(datos?.data.data.id_control,fecha1);
        if(respControl)console.log("se actualizo fecha ")
        /*Tabla control_embarazo */
        const control_embarazo: any = {};

        if (control.ecografia === "S") {
            control_embarazo.eco = "S"
        } else {
            control_embarazo.eco = control.ecografia === "N" ? "N" : control.ecografia_resultado;
        }

        control_embarazo.detalle_eco = control.eco_observaciones === undefined ? "" : control.eco_observaciones;
        control_embarazo.hpv = control.hpv === "N" ? "N" : control.hpv_resultado;
        control_embarazo.pap = control.pap === "N" ? "N" : control.pap_resultado;
        control_embarazo.sistolica = control.sistolica;
        control_embarazo.diastolica = control.diastolica;
        control_embarazo.clinico = control.clinico;
        control_embarazo.observaciones = control.observaciones;
        control_embarazo.edad_gestacional = edadGestacional;
        control_embarazo.motivo = control.motivo;

        /*Laboratorio y cerologia */
        const laboratorios: any = {};







        //update control embarazada
        let newControlEmbarazo: Control_Embarazo = {
            id_control_embarazo: control.id_control_embarazo,
            id_control: control.id_control,
            edad_gestacional: Number(edadGestacional),
            eco: control_embarazo.eco,
            detalle_eco: control_embarazo.detalle_eco,
           
            hpv: control_embarazo.hpv,
            pap: control_embarazo.pap,
            sistolica: Number(control_embarazo.sistolica),
            diastolica: Number(control_embarazo.diastolica),
            clinico: control_embarazo.clinico,
            observaciones: control_embarazo.observaciones,
            motivo: control_embarazo.motivo,
            derivada: control.derivada,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),

        }
        let resp_control_embrarazo = await repositoryControlEmbarazo.update(newControlEmbarazo, "id_control_embarazo", control.id_control_embarazo)
        if (resp_control_embrarazo) console.log("Se actualizo el control medico")


        //Insert inmunizaciones
        //Agripal
        let hayInmunizacionAgripal = await repositoryInmunizacionesControl.getHayInmunizaciones(Number(paciente.data.id_persona), Number(paciente.data.id_control), 2)
        if (hayInmunizacionAgripal) {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                estado: control.agripal,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let AGRIPAL = await repositoryInmunizacionesControl.updateInmunizaciones(newInmunizacionesControl, Number(paciente.data.id_persona), Number(paciente.data.id_control), 2)
            if (AGRIPAL) console.log("Se actualizo inmunizacion agripal")
        } else {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                id_persona: paciente.data.id_persona,
                id_control: paciente.data.id_control,
                id_inmunizacion: 2,
                estado: control.agripal===undefined?"N":control.agripal,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let AGRIPAL = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
            if (AGRIPAL) console.log("Se inserto inmunizacion agripal")
        }

        //DB
        let hayInmunizacionDB = await repositoryInmunizacionesControl.getHayInmunizaciones(Number(paciente.data.id_persona), Number(paciente.data.id_control), 3)
        if (hayInmunizacionDB) {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                estado: control.db,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let DB = await repositoryInmunizacionesControl.updateInmunizaciones(newInmunizacionesControl, Number(paciente.data.id_persona), Number(paciente.data.id_control), 3)
            if (DB) console.log("Se actualizo inmunizacion db")
        } else {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                id_persona: paciente.data.id_persona,
                id_control: paciente.data.id_control,
                id_inmunizacion: 3,
                estado: control.db===undefined?"N":control.db,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let DB = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
            if (DB) console.log("Se inserto inmunizacion db")
        }

        //TBA
        let hayInmunizacionTBA = await repositoryInmunizacionesControl.getHayInmunizaciones(Number(paciente.data.id_persona), Number(paciente.data.id_control), 1)
        if (hayInmunizacionTBA) {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                estado: control.tba,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let TBA = await repositoryInmunizacionesControl.updateInmunizaciones(newInmunizacionesControl, Number(paciente.data.id_persona), Number(paciente.data.id_control), 1)
            if (TBA) console.log("Se actualizo inmunizacion tba")
        } else {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                id_persona: paciente.data.id_persona,
                id_control: paciente.data.id_control,
                id_inmunizacion: 1,
                estado: control.tba===undefined?"N":control.tba,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let TBA = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
            if (TBA) console.log("Se inserto inmunizacion tba")
        }

        //VHB
        let hayInmunizacionVHB = await repositoryInmunizacionesControl.getHayInmunizaciones(Number(paciente.data.id_persona), Number(paciente.data.id_control), 4)
        if (hayInmunizacionVHB) {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                estado: control.vhb,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let VHB = await repositoryInmunizacionesControl.updateInmunizaciones(newInmunizacionesControl, Number(paciente.data.id_persona), Number(paciente.data.id_control), 4)
            if (VHB) console.log("Se actualizo inmunizacion vhb")
        } else {
            let newInmunizacionesControl: Inmunizaciones_Control = {
                id_persona: paciente.data.id_persona,
                id_control: paciente.data.id_control,
                id_inmunizacion: 4,
                estado: control.vhb===undefined?"N":control.vhb,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let VHB = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
            if (VHB) console.log("Se inserto inmunizacion vhb")
        }







        //Insert Laboratorio
        //Sifilis

        if (control.SIFILIS) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_sifilis==="S"?null:fecha1,
                resultado: control.resp_sifilis==="S"?null:control.resp_sifilis,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 0,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(1, paciente.data.id_persona, paciente.data.id_control)
            console.log("id_laboratorio " + id_laboratorio)
            if (id_laboratorio !== 0) {
                console.log(" hay id ")

                let Resp_Sifilis = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (Resp_Sifilis) console.log("Se actualizo laboratorio sifilis")

                if (control.resp_sifilis === "P") {

                    let etmis = await repositoryEtmisPersonas.updateEtmisPersonas(newEtmisPersonas, paciente.data.id_persona, paciente.data.id_control, 3)
                    if (etmis) console.log("Updete etmi sifilis confirmado")
                }
            } else {
                console.log("no  hay id ")
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 1
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_sifilis==="S" || control.resp_sifilis===undefined ?null:fecha1
                newLaboratoriosRealizados.resultado = control.resp_sifilis===undefined||control.resp_sifilis==="S"?null:control.resp_sifilis
                newLaboratoriosRealizados.id_etmi = 3
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_Sifilis = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_Sifilis) console.log("Se inserto laboratorio nuevo de Sifilis")


                if (control.resp_sifilis === "P") {
                    newEtmisPersonas = {
                        id_persona: paciente.data.id_persona,
                        id_etmi: 3,
                        id_control: paciente.data.id_control,
                        confirmada: 1,
                        sql_deleted: 0,
                        last_modified: Math.floor(new Date().getTime() / 1000)
                    }
                    let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas)
                    if (etmis) console.log("Se inserto etmi sifilis confirmado")

                }
            }

        }
        //HIV

        if (control.HIV) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_hiv==="S"?null:fecha1,
                resultado: control.resp_hiv==="S"?null:control.resp_hiv,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(2, paciente.data.id_persona, paciente.data.id_control)
            console.log("id_laboratorio hiv " + Object.keys(id_laboratorio).length)
            if (id_laboratorio !== 0) {
                let resp_HIV = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_HIV) console.log("Se actualizo laboratorio HIV")

                if (control.resp_hiv === "P") {
                    let etmis = await repositoryEtmisPersonas.updateEtmisPersonas(newEtmisPersonas, paciente.data.id_persona, paciente.data.id_control, 2)
                    if (etmis) console.log("Se actualizo etmi hiv confirmado")
                }
            } else {
                console.log("no  hay id ")
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 2
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_hiv==="S" || control.resp_hiv===undefined?null:fecha1
                newLaboratoriosRealizados.resultado = control.resp_hiv===undefined||control.resp_hiv==="S"?null:control.resp_hiv
                newLaboratoriosRealizados.id_etmi = 2
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_hiv = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_hiv) console.log("Se inserto laboratorio nuevo de HIV")

                if (control.resp_sifilis === "P") {
                    newEtmisPersonas = {
                        id_persona: paciente.data.id_persona,
                        id_etmi: 2,
                        id_control: paciente.data.id_control,
                        confirmada: 1,
                        sql_deleted: 0,
                        last_modified: Math.floor(new Date().getTime() / 1000)
                    }
                    let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas)
                    if (etmis) console.log("Se inserto etmi hiv confirmado")

                }
            }




        }

        //CHAGAS
        if (control.CHAGAS) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_chagas==="S"?null:fecha1,
                resultado: control.resp_chagas==="S"?null:control.resp_chagas,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(4, paciente.data.id_persona, paciente.data.id_control)
            if (id_laboratorio !== 0) {
                let resp_CHAGAS = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_CHAGAS) console.log("Se actualizo laboratorio CHAGAS")


                if (control.resp_chagas === "P") {
                    let etmis = await repositoryEtmisPersonas.updateEtmisPersonas(newEtmisPersonas, paciente.data.id_persona, paciente.data.id_control, 1)
                    if (etmis) console.log("Se actualizo etmi CHAGAS confirmado")
                }
            } else {
                console.log("no  hay id ")
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 4
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_chagas==="S" || control.resp_chagas===undefined?null:fecha1
                newLaboratoriosRealizados.resultado = control.resp_chagas===undefined||control.resp_chagas==="S"?null:control.resp_chagas
                newLaboratoriosRealizados.id_etmi = 1
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_CHAGAS = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_CHAGAS) console.log("Se inserto laboratorio CHAGAS")

                if (control.resp_chagas === "P") {
                    newEtmisPersonas = {
                        id_persona: paciente.data.id_persona,
                        id_etmi: 1,
                        id_control: paciente.data.id_control,
                        confirmada: 1,
                        sql_deleted: 0,
                        last_modified: Math.floor(new Date().getTime() / 1000)
                    }
                    let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas)
                    if (etmis) console.log("Se inserto etmi chagas confirmado")

                }
            }
        }

        //VHB
        if (control.VHB) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_vhb==="S"?null:fecha1,
                resultado: control.resp_vhb==="S"?null:control.resp_vhb,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(5, paciente.data.id_persona, paciente.data.id_control)
            if (id_laboratorio !== 0) {
                let resp_VHB = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_VHB) console.log("Se actualizo laboratorio VHB")

                if (control.resp_vhb === "P") {
                    let etmis = await repositoryEtmisPersonas.updateEtmisPersonas(newEtmisPersonas, paciente.data.id_persona, paciente.data.id_control, 4)
                    if (etmis) console.log("Se actualizo etmi VHB confirmado")

                }
            } else {
                console.log("no  hay id ")
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 5
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_vhb==="S" || control.resp_vhb===undefined?null:fecha1
                newLaboratoriosRealizados.resultado = control.resp_vhb===undefined||control.resp_vhb==="S"?null:control.resp_vhb
                newLaboratoriosRealizados.id_etmi = 4
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_VHB = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_VHB) console.log("Se inserto laboratorio VHB")

                if (control.resp_vhb === "P") {
                    newEtmisPersonas = {
                        id_persona: paciente.data.id_persona,
                        id_etmi: 4,
                        id_control: paciente.data.id_control,
                        confirmada: 1,
                        sql_deleted: 0,
                        last_modified: Math.floor(new Date().getTime() / 1000)
                    }
                    let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas)
                    if (etmis) console.log("Se inserto etmi VHB confirmado")

                }
            }
        }

        //ESTREPTOCOCO_BETA_HEMOLÍTICO

        if (control.ESTREPTOCOCO_BETA_HEMOLÍTICO) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:fecha1,
                resultado: control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(8, paciente.data.id_persona, paciente.data.id_control)
            if (id_laboratorio !== 0) {

                let resp_EBH = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_EBH) console.log("Se actualizo laboratorio EBH")


            } else {
                console.log("no  hay id ")
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 8
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S" || control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO===undefined?null:fecha1
                newLaboratoriosRealizados.resultado = control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO===undefined||control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO
                newLaboratoriosRealizados.id_etmi = 0
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_EBH = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_EBH) console.log("Se inserto laboratorio EBH")

            }
        }

        //Hb

        if (control.Hb) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_hb === "S" ?null:fecha1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(6, paciente.data.id_persona, paciente.data.id_control)
            console.log("id_laboratorio " + id_laboratorio)
            if (id_laboratorio !== 0) {
                let respuesta = control.resp_hb === "S" ? null : control.valor_hb
                newLaboratoriosRealizados.resultado = respuesta
                let resp_HB = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_HB) console.log("Se actualizo laboratorio HB")

            } else {
                console.log("no  hay id ")

                let respuesta = control.resp_hb === "S" ?null : control.valor_hb
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 6
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_hb === "S" || respuesta===undefined?null:fecha1
                newLaboratoriosRealizados.resultado = respuesta===undefined?null:respuesta
                newLaboratoriosRealizados.id_etmi = 0
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_HB = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_HB) console.log("Se inserto laboratorio EBH")


            }
        }

        //Glucemia resp_glucemia

        if (control.GLUCEMIA) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = { 
                fecha_resultados: control.resp_glucemia === "S" ?null:fecha1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(7, paciente.data.id_persona, paciente.data.id_control)
            if (id_laboratorio !== 0) {
                let respuesta = control.resp_glucemia === "S" ? null : control.valor_glucemia
                newLaboratoriosRealizados.resultado = respuesta
                let resp_GLUCEMIA = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_GLUCEMIA) console.log("Se actualizo laboratorio GLUCEMIA")


            } else {
                console.log("no  hay id ")
                let respuesta = control.resp_glucemia === "S" ? null : control.valor_glucemia
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 7
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_glucemia === "S" || respuesta===undefined ?null:fecha1
                newLaboratoriosRealizados.resultado =respuesta===undefined?null:respuesta
                newLaboratoriosRealizados.id_etmi = 0
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let Resp_GLUCEMIA = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (Resp_GLUCEMIA) console.log("Se inserto laboratorio GLUCEMIA")
            }
        }
        //GRUPO_FACTOR

        if (control.GRUPO_FACTOR) {
            let newLaboratoriosRealizados: Laboratorios_Realizados = {
                fecha_resultados: control.resp_grupo_factor === "S" ?null:fecha1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }

            let newEtmisPersonas: Etmis_Personas = {
                confirmada: 1,
                sql_deleted: 0,
                last_modified: Math.floor(new Date().getTime() / 1000)
            }
            let id_laboratorio = await repositoryLaboratoriosRealizados.getIDlaboratoriosRealizados(9, paciente.data.id_persona, paciente.data.id_control)
            if (id_laboratorio !== 0) {
                let respuesta = control.resp_grupo_factor === "S" ? null : control.valor_grupo_factor
                newLaboratoriosRealizados.resultado = respuesta
                let resp_GRUPO_FACTOR = await repositoryLaboratoriosRealizados.updateLaboratoriosRealizados(newLaboratoriosRealizados, paciente.data.id_persona, paciente.data.id_control, id_laboratorio)
                if (resp_GRUPO_FACTOR) console.log("Se actualizo laboratorio GRUPO_FACTOR")


            } else {
                console.log("no  hay id ")
                let respuesta = control.resp_grupo_factor === "S" ? "S" : control.valor_grupo_factor
                newLaboratoriosRealizados.id_persona = paciente.data.id_persona
                newLaboratoriosRealizados.id_control = paciente.data.id_control
                newLaboratoriosRealizados.id_laboratorio = 9
                newLaboratoriosRealizados.trimestre = 1
                newLaboratoriosRealizados.fecha_realizado = fecha1
                newLaboratoriosRealizados.fecha_resultados = control.resp_grupo_factor === "S" || respuesta===undefined ?null:fecha1
                newLaboratoriosRealizados.resultado = respuesta===undefined?null:respuesta
                newLaboratoriosRealizados.id_etmi = 0
                newLaboratoriosRealizados.sql_deleted = 0
                newLaboratoriosRealizados.last_modified = Math.floor(new Date().getTime() / 1000)
                let resp_GRUPO_FACTOR = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
                if (resp_GRUPO_FACTOR) console.log("Se inserto laboratorio GRUPO_FACTOR")

            }
        }

        
        setLoading(false)
        return true
    }



   
    return (
        <>
            <IonPage>
                <IonHeader className="ion-no-border">
                    <IonToolbar>
                        <IonButtons slot="start" >
                            <IonBackButton defaultHref="/personas" disabled={isLoading} routerAnimation={animationBuilder} />
                        </IonButtons>
                        <IonLabel >Control {control?.id_control_embarazo} de {paciente?.paciente.nombre} {paciente?.paciente.apellido} / Fecha: {moment(paciente?.data.fecha).format("LL")}</IonLabel>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <form onSubmit={async (e:any)=>{
                        const ok = await OnSubmit(e);
                        if (ok) history.push("/personas")
                        }}>
                        <IonItem>
                            <IonLabel position="floating">Edad Gestacional ({edadGestacional } Semanas )</IonLabel>
                            <IonInput type="number"  value={edadGestacional} name="edad_gestacional" onIonChange={e => handleEdadGestacional(e)} ></IonInput>
                        </IonItem>
                         {/* === ION DATE TIME === */}
                     <IonItem>
                            <IonLabel position="stacked">{fecha1 === null || fecha1 === "null" ?"":"Fecha de Control "}</IonLabel>
                            {fecha1 === null || fecha1 === "null" ? <IonButton onClick={(e) => setDataPicker(true)} size="small" >Fecha de Control</IonButton> : <IonDatetimeButton datetime="datetime"  defaultValue={fecha1} ></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker} className="ion-datetime-button-overlay" onDidDismiss={() => setDataPicker(false)}>
                                <IonDatetime
                                    
                                    id="datetime"
                                    name="fecha_ultimocontrol"
                                    onIonChange={(e) => {
                                        const val = e.detail.value;
                                        if (val) setFecha1(val);
                                    }}
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
                                <IonCardTitle>Ecografía</IonCardTitle>
                            </IonCardHeader>
                            <IonRow>
                                <IonCol>
                                    <IonList>

                                        <IonRadioGroup onIonChange={e => handleInputChangeEcografia(e)} name="ecografia" value={control?.ecografia}>
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
                                            <IonRadioGroup onIonChange={e => handleInputChangeEco_Observa(e)} name="ecografia_resultado" value={control?.ecografia_resultado}>
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
                                                <IonInput name="eco_observaciones" onIonChange={e => handleInputChange(e)} value={control.eco_observaciones}></IonInput>
                                            </IonItem>
                                        </IonList>
                                    }
                                </IonCol>
                            </IonRow>
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
                                        <IonRadioGroup onIonChange={e => handleInputChangeHpv(e)} name="hpv" value={control?.hpv}>
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
                                            <IonRadioGroup onIonChange={e => handleInputChange(e)} name="hpv_resultado" value={control?.hpv_resultado}>
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
                                        <IonRadioGroup onIonChange={e => handleInputChangePap(e)} name="pap" value={control?.pap}>
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
                                            <IonRadioGroup onIonChange={e => handleInputChange(e)} name="pap_resultado" value={control?.pap_resultado}>
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
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="agripal" value={control?.agripal}>
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
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="db" value={control?.db}>
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
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="tba" value={control?.tba}>
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
                                        <IonRadioGroup onIonChange={e => handleInputChange(e)} name="vhb" value={control?.vhb}>
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
                            <EditLaboratorio titulo="SIFILIS" radio={(e: any) => handleInpuTChecks(e)} checked={control?.SIFILIS} radioname="SIFILIS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_sifilis" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_sifilis} />
                            <EditLaboratorio titulo="HIV" radio={(e: any) => handleInpuTChecks(e)} radioname="HIV" checked={control?.HIV} radioOpcion={["S", "P", "N"]} radioOpcionName="resp_hiv" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_hiv} />
                            <EditLaboratorio titulo="CHAGAS" radio={(e: any) => handleInpuTChecks(e)} checked={control?.CHAGAS} radioname="CHAGAS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_chagas" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_chagas} />
                            <EditLaboratorio titulo="VHB" radio={(e: any) => handleInpuTChecks(e)} radioname="VHB" checked={control?.VHB} radioOpcion={["S", "P", "N"]} radioOpcionName="resp_vhb" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_vhb} />
                            <EditLaboratorio titulo="ESTREPTOCOCO BETA HEMOLÍTICO" radio={(e: any) => handleInpuTChecks(e)} radioname="ESTREPTOCOCO_BETA_HEMOLÍTICO" checked={control?.ESTREPTOCOCO_BETA_HEMOLÍTICO} radioOpcion={["S", "P", "N"]} radioOpcionName="resp_ESTREPTOCOCO_BETA_HEMOLÍTICO" radioOpcionValue={(e: any) => handleInputChange(e)} checkedResp={control?.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO} />
                            <EditLaboratorioII titulo="Hb" radio={(e: any) => handleInpuTChecks(e)} radioname="Hb" checked={control?.Hb} radioOpcion={["S", "R"]} radioOpcionName="resp_hb" checkedResp={control?.resp_hb} radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_hb" inputvalue={(e: any) => handleInputChange(e)} checkedNumber={control?.valor_hb} />
                            <EditLaboratorioII titulo="GLUCEMIA" radio={(e: any) => handleInpuTChecks(e)} radioname="GLUCEMIA" checked={control?.GLUCEMIA} radioOpcion={["S", "R"]} radioOpcionName="resp_glucemia" checkedResp={control?.resp_glucemia} radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_glucemia" inputvalue={(e: any) => handleInputChange(e)} checkedNumber={control?.valor_glucemia} />
                            <EditLaboratorioIII titulo="GRUPO Y FACTOR" radio={(e: any) => handleInpuTChecks(e)} radioname="GRUPO_FACTOR" checked={control?.GRUPO_FACTOR} radioOpcion={["S", "R"]} radioOpcionName="resp_grupo_factor" checkedResp={control?.resp_grupo_factor} radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_grupo_factor" inputvalue={(e: any) => handleInputChange(e)} checkedNumber={control?.valor_grupo_factor} />
                        </IonCard>
                        <IonCard>
                            <IonCardHeader>
                                <IonLabel>Presìon Arterial</IonLabel>
                            </IonCardHeader>
                            <IonItem>
                                <IonLabel position="floating">Sistólica</IonLabel>
                                <IonInput type="number" name="sistolica" onIonChange={(e: any) => handleInputChange(e)} required value={control?.sistolica}> </IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="floating">Diastólica</IonLabel>
                                <IonInput type="number" name="diastolica" onIonChange={(e: any) => handleInputChange(e)} required value={control?.diastolica}></IonInput>
                            </IonItem>
                        </IonCard>

                        <IonCard>
                            <IonCardHeader>
                                <IonLabel>Control Clínico</IonLabel>
                            </IonCardHeader>
                           
                            <IonList>

                                <IonRadioGroup onIonChange={e => handleInputChange(e)} name="clinico" value={control?.clinico}>
                                    <IonItem>
                                        <IonLabel>Normal</IonLabel>
                                        <IonRadio slot="end" value="N"></IonRadio>
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel>Patologico</IonLabel>
                                        <IonRadio slot="end" value="P"></IonRadio>
                                    </IonItem>
                                </IonRadioGroup>
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
                                        <IonSelect name="motivo" onIonChange={e => handleInputChange(e)} value={control?.motivo}>

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
                                    <IonTextarea name="observaciones" onIonChange={e => handleInputChange(e)} value={control?.observaciones}></IonTextarea>
                                </IonItem>
                            </IonList>
                        </IonCard>
                        
                        <IonButton expand="block" fill="outline" type="submit" disabled={isLoading}>{isLoading ? "Guardando" : "Guardar"}</IonButton>
                    </form>
                </IonContent>
            </IonPage>
        </>
    )
}
export default EditControlEmbrazada
