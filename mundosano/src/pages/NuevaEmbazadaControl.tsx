import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardTitle, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonTextarea, IonToolbar, useIonViewWillEnter } from "@ionic/react";
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
    gestas: 0

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
    useEffect(() => {
        if (paciente.control?.fum !== null) {
            setEdadGestacional(hoy.diff(paciente.control?.fum, "weeks"));
        }else if (paciente.control?.fpp !== null){
            setEdadGestacional((hoy.diff(paciente.control?.fpp, "weeks"))+40);
        }else{
            setEdadGestacional(0);
        }

    }, [])

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

    const handleInpuTChecks = (e: any) => {
        const name = e.target.name;
        const value = e.detail.checked
        setControl((prevProps: any) => ({ ...prevProps, [name]: value }));
    }

    const OnSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        /*Tabla control_embarazo */
        const control_embarazo: any = {};
        control_embarazo.edad_gestacional = edadGestacional;
        if (control.ecografia === "S") {
            control_embarazo.eco = "S"
        } else {
            control_embarazo.eco = control.ecografia === "N" ? "N" : control.ecografia_resultado;
        }

        control_embarazo.detalle_eco = control.eco_observaciones;
        control_embarazo.hpv = control.hpv === "N" ? "N" : control.hpv_resultado;
        control_embarazo.pap = control.pap === "N" ? "N" : control.pap_resultado;
        control_embarazo.sistolica = control.sistolica;
        control_embarazo.diastolica = control.diastolica;
        control_embarazo.clinico = control.clinico;
        control_embarazo.observaciones = control.observaciones;
        control_embarazo.motivo = control.motivo
        control_embarazo.derivada = control.derivada


        /*Laboratorio y cerologia */
        const laboratorios: any = {};
        //laboratorios.sifilis
        //Insert tabla personas
 
        let ultimo_id_persona = await repositoryPersonas.getLastRowId("id_persona") //consulta(`SELECT id_persona FROM personas WHERE id_persona BETWEEN  ${minimo} AND ${maximo} ORDER BY id_persona DESC LIMIT 1`)
        const newPersona:Personas={
            id_persona: ultimo_id_persona + 1,
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
            last_modified: Math.floor(new Date().getTime() / 1000),
           // usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        ultimo_id_persona=ultimo_id_persona+1//ultimo id_persona
        const insertPersonas=await repositoryPersonas.create(newPersona)
        if(insertPersonas)console.log("Persona insertada")
       

        
        let ultimo_id_ubicacion = await repositoryUbicacion.getLastRowId("id_ubicacion")//consulta(`SELECT id_ubicacion FROM ubicaciones WHERE id_persona BETWEEN ${minimo} AND ${maximo} ORDER BY id_persona DESC LIMIT 1`)
        let ubicacionGeo=paciente.paciente.latitud+" "+ paciente.paciente.longitud
        const newUbicacion:Ubicaciones={
            id_ubicacion: ultimo_id_ubicacion + 1,
            id_persona: ultimo_id_persona,
            id_paraje: paciente.paciente.paraje_residencia,
            id_area: paciente.paciente.area_residencia,
            num_vivienda: "",
            fecha: fecha1,
            georeferencia: ubicacionGeo,
            id_pais: paciente.paciente.pais_residencia,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        ultimo_id_ubicacion=ultimo_id_ubicacion+1
        const insertUbicaciones=await repositoryUbicacion.create(newUbicacion)
        if(insertUbicaciones)console.log("Ubicacion insertada");
       console.log("id_persona "+(ultimo_id_persona-1))
        
        
        let ultimo_id_control = await repositoryControles.getLastRowId("id_control")//consulta(`SELECT id_control FROM controles WHERE id_control BETWEEN ${minimo} AND ${maximo} ORDER BY id_control DESC LIMIT 1`)
        ultimo_id_control = ultimo_id_control + 1

        const newControles:Controles={
            id_control: ultimo_id_control,
            fecha: fecha1,
            id_persona: ultimo_id_persona,
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
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }

       
            const insertControl=await repositoryControles.create(newControles);
            if(insertControl)console.log("Control insertado");
            
        

        //insert antecedentes
        ultimo_id_control = newControles.id_control//await consulta(`SELECT id_control FROM controles WHERE id_control BETWEEN ${minimo} AND ${maximo} ORDER BY id_control DESC LIMIT 1`)
        let ultimo_id_antecedentes = await repositoryAntecedentes.getLastRowId("id_antecedente")//consulta(`SELECT id_antecedente FROM antecedentes WHERE id_antecedente BETWEEN ${minimo} AND ${maximo} ORDER BY id_antecedente DESC LIMIT 1`)
        let insertfum=paciente.control?.fum === null ? null : moment(paciente.control.fum).format("YYYY-MM-DD")
        console.log("insert "+insertfum)
        let insert_fecha_ultimo_embarazo = paciente?.control.fecha_ultimo_embarazo === null || paciente?.control.fecha_ultimo_embarazo === "null" ? null :  paciente?.control.fecha_ultimo_embarazo 
        let insertfpp=paciente.control?.fpp === null ? null : moment(paciente.control.fpp).format("YYYY-MM-DD")
        const newAntecedentes:Antecedentes={
            id_antecedente: ultimo_id_antecedentes+1, 
            id_persona: ultimo_id_persona,
            id_control: ultimo_id_control,
            edad_primer_embarazo: Number(paciente.control.edad_primer_embarazo),
            fecha_ultimo_embarazo: insert_fecha_ultimo_embarazo,
            gestas: Number(paciente.control.gestas),
            partos:Number(paciente.control.partos) ,
            cesareas:Number(paciente.control.cesareas) ,
            abortos:Number(paciente.control.abortos) ,
            planificado: paciente.control.planificado,
            fum: insertfum,
            fpp: insertfpp,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        let insertAntecedentes = await repositoryAntecedentes.create(newAntecedentes)//consulta(`INSERT INTO antecedentes(id_antecedente,id_persona,id_control,edad_primer_embarazo,
          
        if(insertAntecedentes )console.log("Insertar antecedentes")

        //si hay macs insertar en la tabla de antecedentes_apps
        
        ultimo_id_antecedentes =Number(newAntecedentes.id_antecedente) 
        const newAntecedentesApss:Antecedentes_Apps={
            id_antecedente: ultimo_id_antecedentes,
            id_app: paciente.control.app,
            last_modified: Math.floor(new Date().getTime() / 1000),
            sql_deleted: 0
           
        }
        if (paciente.control.app !== undefined) {
           //await consulta(`SELECT id_antecedente FROM antecedentes WHERE id_antecedente BETWEEN ${minimo} AND ${maximo} ORDER BY id_antecedente DESC LIMIT 1`)
           
            let apps_antecedentes = await repositoryAntecedentesApps.create(newAntecedentesApss)
            if (apps_antecedentes) console.log("Insertar antecedentes apps")
        } else {
           newAntecedentesApss.id_app=10
            let apps_antecedentes = await repositoryAntecedentesApps.create(newAntecedentesApss)
            if (apps_antecedentes) console.log("Insertar antecedentes apps")
        }

        //si hay macs insertar en la tabla de antecedentes_macs
        const newAntecedentesMacs:Antecedentes_Macs={
            id_antecedente: ultimo_id_antecedentes,
            id_mac: paciente.control.mac,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        if (paciente.control.mac !== undefined) {
            let macs_antecedente = await repositoryAntecedentesMacs.create(newAntecedentesMacs);
            if (macs_antecedente) console.log("Insertar antecedentes macs")

        } else {
            newAntecedentesMacs.id_mac = 6
            let macs_antecedente = await await repositoryAntecedentesMacs.create(newAntecedentesMacs);
            if (macs_antecedente) console.log("Insertar antecedentes macs")

        }



        //insert control embarazada
        let ultimo_id_control_embarazada = await repositoryControlEmbarazo.getLastRowId("id_control_embarazo")//consulta(`SELECT id_control_embarazo FROM control_embarazo WHERE id_control_embarazo BETWEEN ${minimo} AND ${maximo} ORDER BY id_control_embarazo DESC LIMIT 1`)
        const newControlEmbarazo:Control_Embarazo={
            id_control_embarazo: ultimo_id_control_embarazada + 1,
            id_control: ultimo_id_control,
            edad_gestacional: control_embarazo.edad_gestacional,
            eco: control_embarazo.eco,
            detalle_eco: control_embarazo.detalle_eco,
            hpv: control_embarazo.hpv,
            pap: control_embarazo.pap,
            sistolica: control_embarazo.sistolica,
            diastolica: control_embarazo.diastolica,
            clinico: control_embarazo.clinico,
            observaciones:control_embarazo.observaciones,
            motivo: control_embarazo.motivo,
            derivada: control_embarazo.derivada,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        let resp_control_embrarazo = await repositoryControlEmbarazo.create(newControlEmbarazo)
        if (resp_control_embrarazo) console.log("Insertar Control Embarazo")

        //Insert inmunizaciones
        const newInmunizacionesControl:Inmunizaciones_Control={
            id_persona: ultimo_id_persona,
            id_control: ultimo_id_control,
            id_inmunizacion: 2,
            estado: control.agripal,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        let AGRIPAL = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (AGRIPAL) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion=3
        newInmunizacionesControl.estado=control.db
        let DB = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (DB) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion=1
        newInmunizacionesControl.estado=control.tba
        let TBA = await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (TBA) console.log("Insertar Inmunizaciones Control")

        newInmunizacionesControl.id_inmunizacion=4
        newInmunizacionesControl.estado=control.vhb
        let VHB =  await repositoryInmunizacionesControl.create(newInmunizacionesControl)
        if (VHB) console.log("Insertar Inmunizaciones Control")





        //Insert Laboratorio
        const newLaboratoriosRealizados:Laboratorios_Realizados={
            id_persona: ultimo_id_persona,
            id_control: ultimo_id_control,
            id_laboratorio: 1,
            trimestre: 1,
            fecha_realizado: fecha1,
            
           
            id_etmi: 3,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }

        const newEtmisPersonas:Etmis_Personas={
            id_persona: ultimo_id_persona,
            id_etmi: 3,
            id_control: ultimo_id_control,
            confirmada: 0,
            sql_deleted: 0,
            last_modified: Math.floor(new Date().getTime() / 1000),
            //usuario_modified: currentuser?.id_usuario===undefined?0:currentuser.id_usuario
        }
        //Sifilis

        if (control.SIFILIS) {
            newLaboratoriosRealizados.resultado=control.resp_sifilis==="S"?null:control.resp_sifilis
            newLaboratoriosRealizados.fecha_resultados=control.resp_sifilis==="S"?null:fecha1
            let Resp_Sifilis = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
            if (Resp_Sifilis) console.log("Insertar Laboratorios Realizados")

            if (control.resp_sifilis === "P") {
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas Sifilis")

            }
        }
        //HIV
        
        if (control.HIV) {
            newLaboratoriosRealizados.id_laboratorio=2;
            newLaboratoriosRealizados.id_etmi=2
            newLaboratoriosRealizados.resultado = control.resp_hiv==="S"?null:control.resp_hiv;
            let resp_HIV = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados)
            if (resp_HIV) console.log("Insertar Laboratorios Realizados HIV")

            if (control.resp_hiv === "P") {
                newEtmisPersonas.id_etmi=2
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas HIV")
            }
        }
        //CHAGAS
        if (control.CHAGAS) {
            newLaboratoriosRealizados.id_laboratorio=4;
            newLaboratoriosRealizados.id_etmi=1
            newLaboratoriosRealizados.resultado = control.resp_chagas==="S"?null:control.resp_chagas;
            newLaboratoriosRealizados.fecha_resultados=control.resp_chagas==="S"?null:fecha1
            let resp_CHAGAS = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_CHAGAS) console.log("Insertar Laboratorios Realizados CHAGAS")

            if (control.resp_chagas === "P") {
                newEtmisPersonas.id_etmi=1
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas);
                if (etmis) console.log("Insertar Etmis Personas CHAGAS")
            }
        }
        //VHB
        if (control.VHB) {
            newLaboratoriosRealizados.id_laboratorio=5;
            newLaboratoriosRealizados.id_etmi=4
            newLaboratoriosRealizados.resultado = control.resp_vhb==="S"?null:control.resp_vhb;
            newLaboratoriosRealizados.fecha_resultados=control.resp_vhb==="S"?null:fecha1
            let resp_VHB = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_VHB) console.log("Insertar Laboratorios Realizados VHB")

            if (control.resp_vhb === "P") {
                newEtmisPersonas.id_etmi=4
                let etmis = await repositoryEtmisPersonas.create(newEtmisPersonas); 
                if (etmis) console.log("Insertar Etmis Personas VHB")
            }
        }

        //ESTREPTOCOCO_BETA_HEMOLÍTICO

        if (control.ESTREPTOCOCO_BETA_HEMOLÍTICO) {
            newLaboratoriosRealizados.id_laboratorio=8;
            newLaboratoriosRealizados.id_etmi=0
            newLaboratoriosRealizados.resultado = control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO;
            newLaboratoriosRealizados.fecha_resultados=control.resp_ESTREPTOCOCO_BETA_HEMOLÍTICO==="S"?null:fecha1
            let resp_EBH =  await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados); 
            if (resp_EBH) console.log("Insertar Etmis Personas ESTREPTOCOCO_BETA_HEMOLÍTICO");

        }

        //Hb
        if (control.HB) {
            let respuesta = control.resp_hb === "S" ? null : control.valor_hb
            newLaboratoriosRealizados.id_laboratorio=7;
            newLaboratoriosRealizados.id_etmi=0
            newLaboratoriosRealizados.resultado=respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_hb==="S"?null:fecha1
            let resp_HB =  await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_HB) console.log("Insertar Etmis Personas HB");

        }

        //Glucemia resp_glucemia
        if (control.GLUCEMIA) {
            let respuesta = control.resp_glucemia === "S" ? null : control.valor_glucemia
            newLaboratoriosRealizados.id_laboratorio=6;
            newLaboratoriosRealizados.id_etmi=0
            newLaboratoriosRealizados.resultado=respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_glucemia==="S"?null:fecha1
            let resp_GLUCEMIA =  await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_GLUCEMIA) console.log("Insertar Etmis Personas GLUCEMIA");

        }
        //GRUPO_FACTOR
        if (control.GRUPO_FACTOR) {
            let respuesta = control.resp_grupo_factor === "S" ? null : control.valor_grupo_factor
            newLaboratoriosRealizados.id_laboratorio=9;
            newLaboratoriosRealizados.id_etmi=0
            newLaboratoriosRealizados.resultado=respuesta
            newLaboratoriosRealizados.fecha_resultados=control.resp_grupo_factor==="S"?null:fecha1
            let resp_GRUPO_FACTOR = await repositoryLaboratoriosRealizados.create(newLaboratoriosRealizados);
            if (resp_GRUPO_FACTOR) console.log("Insertar Etmis Personas GRUPO_FACTOR");

        }


     
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
                <form onSubmit={(e:any)=>{
                        OnSubmit(e)
                        .then(()=>{
                            history.push("/personas")
                            window.location.reload()
                            setLoading(false)
                        })

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
                            <IonCardTitle>Ecografía</IonCardTitle>
                        </IonCardHeader>
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
                        <LaboratorioCerologia titulo="SIFILIS" radio={(e: any) => handleInpuTChecks(e)} radioname="SIFILIS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_sifilis" radioOpcionValue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologia titulo="HIV" radio={(e: any) => handleInpuTChecks(e)} radioname="HIV" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_hiv" radioOpcionValue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologia titulo="CHAGAS" radio={(e: any) => handleInpuTChecks(e)} radioname="CHAGAS" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_chagas" radioOpcionValue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologia titulo="VHB" radio={(e: any) => handleInpuTChecks(e)} radioname="VHB" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_vhb" radioOpcionValue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologia titulo="ESTREPTOCOCO BETA HEMOLÍTICO" radio={(e: any) => handleInpuTChecks(e)} radioname="ESTREPTOCOCO_BETA_HEMOLÍTICO" radioOpcion={["S", "P", "N"]} radioOpcionName="resp_ESTREPTOCOCO_BETA_HEMOLÍTICO" radioOpcionValue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologiaII titulo="Hb" radio={(e: any) => handleInpuTChecks(e)} radioname="HB" radioOpcion={["S", "R"]} radioOpcionName="resp_hb" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_hb" inputvalue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologiaII titulo="GLUCEMIA" radio={(e: any) => handleInpuTChecks(e)} radioname="GLUCEMIA" radioOpcion={["S", "R"]} radioOpcionName="resp_glucemia" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_glucemia" inputvalue={(e: any) => handleInputChange(e)} />
                        <LaboratorioCerologiaIII titulo="GRUPO Y FACTOR" radio={(e: any) => handleInpuTChecks(e)} radioname="GRUPO_FACTOR" radioOpcion={["S", "R"]} radioOpcionName="resp_grupo_factor" radioOpcionValue={(e: any) => handleInputChange(e)} inputname="valor_grupo_factor" inputvalue={(e: any) => handleInputChange(e)} />
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