
import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonInput, IonItem, IonLabel, IonModal, IonNote, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, useIonViewWillEnter } from "@ionic/react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"

import { useHistory } from "react-router";
import { Repository } from "../repository/Repository";
import { Antecedentes_Apps } from "../models/Antecedentes_Apps";
import { Antecedentes_Macs } from "../models/Antecedentes_Macs";
import { Antecedentes } from "../models/Antecedentes";
import { Apps } from "../models/Apps";
import { Macs } from "../models/Macs";

interface antecedentes {
    id_antecedente?: number,
    id_persona?: number,
    id_control?: number,
    edad_primer_embarazo?: number | null,
    fecha_ultimo_embarazo: string | null,
    gestas?: number | 0,
    partos?: number | 0,
    cesareas?: number | 0,
    abortos?: number | 0,
    planificado?: number | null,
    fum: string | null,
    fpp: string | null,
    fecha?: Date,
    id_app: number | null,
    id_mac: number | null

}
interface antecedentesPersona {
    persona: persona
}
interface persona {
    id_persona?: number,
    apellido?: string,
    nombre?: string,
    documento?: string,
    fecha_nacimiento?: string,
    id_origen?: number,
    nacionalidad?: number,
    sexo?: string,
    madre?: number | null,
    alta?: number,
    nacido_vivo?: number | null,
    pais_residencia?: number,
    area_residencia?: number,
    paraje_residencia?: number,
    num_vivienda?: number,
    latitud?: number | null,
    longitud?: number | null,
    formLLeno?: boolean

}
const FormNuevaEmbAtecedentes: React.FC<any> = ({ datos }) => {
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [datapicker1, setDataPicker1] = useState<boolean>(false)
    const [datapicker2, setDataPicker2] = useState<boolean>(false)
    const [macs, setMacs] = useState<Antecedentes_Macs[]>([])
    const [apps, setApps] = useState<Antecedentes_Apps[]>([])
    const [ante, setAnte] = useState<any>()
    const [paciente, setPaciente] = useState<any>()
    const [error, setError] = useState<string>("")
    const [isLoading, setLoading] = useState<boolean>(false)

    const repositoryAntecedentesApps= new Repository<Antecedentes_Apps>("antecedentes_apps");
    const repositoryAntecedentesMacs= new Repository<Antecedentes_Macs>("antecedentes_macs");
    const repositoryAntecedentes=new Repository<Antecedentes>("antecedentes")
    const repositoryApps=new Repository<Apps>("apps");
    const repositoryMacs=new Repository<Macs>("macs");

    const history = useHistory()
    const ref = useRef("")
    const GuardarOnSutmit = async (data: antecedentes): Promise<any> => {
        try {
            
            let update_fecha_ultimo_embarazo = data.fecha_ultimo_embarazo === null || data.fecha_ultimo_embarazo === "null" ? null :  data.fecha_ultimo_embarazo 
            let update_fum = data?.fum === null || data?.fum === "null" ? null : data.fum 
            let update_fpp = data?.fpp === null || data?.fpp === "null" ? null : data.fpp 

            let newAntecedentes:Antecedentes={
                
                edad_primer_embarazo:Number(data.edad_primer_embarazo) ,
                fecha_ultimo_embarazo: update_fecha_ultimo_embarazo,
                gestas:data.gestas,
                partos: data.partos,
                cesareas: data.cesareas,
                abortos: data.abortos,
                planificado: data.planificado,
                fum: update_fum,
                fpp: update_fpp,
                last_modified: Math.floor(new Date().getTime() / 1000),
                sql_deleted: 0
            }
            let res: any = await repositoryAntecedentes.update(newAntecedentes,"id_antecedente",Number(data.id_antecedente))
            if(res)console.log("Se actualizo antecedentes")

            if (datos.antecedentes.id_app === null) {
                
                let newAntecedentesApps:Antecedentes_Apps={
                    id_antecedente:Number(data.id_antecedente) ,
                    id_app: 10,
                    sql_deleted: 0,
                    last_modified: Math.floor(new Date().getTime() / 1000)
                }
                let insert_ante = datos.id_app === data.id_app ? null : await repositoryAntecedentesApps.create(newAntecedentesApps);
                
            } else {
                let newAntecedentesApps:Antecedentes_Apps={
                    id_antecedente:Number(data.id_antecedente) ,
                    id_app:Number(data.id_app),
                    sql_deleted: 0,
                    last_modified: Math.floor(new Date().getTime() / 1000)
                    }
                const res_app_antecedentes = data.id_app !== null ? await repositoryAntecedentesApps.update(newAntecedentesApps,"id_antecedente",Number(data.id_antecedente)): null
               }

            if (datos.antecedentes.id_mac === null) {
                let newAntecedentesMacs:Antecedentes_Macs={
                    id_antecedente: Number(data.id_antecedente),
                    id_mac: 6,
                    sql_deleted: 0,
                    last_modified: Math.floor(new Date().getTime() / 1000)
                }
                let insert_antes = datos.id_mac === data.id_mac ? null : await repositoryAntecedentesMacs.create(newAntecedentesMacs)
            } else {
                let newAntecedentesMacs:Antecedentes_Macs={
                    id_antecedente: Number(data.id_antecedente),
                    id_mac: Number(data.id_mac),
                    sql_deleted: 0,
                    last_modified: Math.floor(new Date().getTime() / 1000)
                }
                let res_mac_antecedentes = data.id_mac !== null ? await repositoryAntecedentesMacs.update(newAntecedentesMacs,"id_antecedente",Number(data.id_antecedente)):null
              }

            return true;
        }
        catch (error: any) {
            return false;
        }
    }

    const fechaNacimiento = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")
        const diahoy = moment().format("YYYY-MM-DD")
        setDataPicker(false)
        //setFecha(e.detail.value)
        //setFecha1(dia)
        const { name, value } = e.target;

        if (dia !== "Fecha inválida") setAnte((prevProps: any) => ({ ...prevProps, [name]: dia }));

    }
    const fecha_FUM = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")

        setDataPicker1(false)
        const { name, value } = e.target;
        if (dia !== "Fecha inválida") setAnte((prevProps: any) => ({ ...prevProps, [name]: dia }))
    }

    const fecha_FPP = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")
        setDataPicker2(false)
        const { name, value } = e.target;
        if (dia !== "Fecha inválida") setAnte((prevProps: any) => ({ ...prevProps, [name]: dia }));
    }

    const calculoFPP = (e: any) => {
        if (ante?.fum !== null) {
            const dia = moment(ante?.fum).add(280, 'days').format("YYYY-MM-DD")
            setAnte((prevProps: any) => ({ ...prevProps, fpp: dia }));
        }

    }

    const calculoFUM = (e: any) => {
        const dia = moment(ante?.fpp).add(-280, 'days').format("YYYY-MM-DD")
        setAnte((prevProps: any) => ({ ...prevProps, fum: dia }));
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setAnte((prevProps: any) => ({ ...prevProps, [name]: value }));
    }

    const onSubmit = (e: any) => {
        e.preventDefault()





        if (ante?.abortos !== undefined && ante?.cesareas !== undefined && ante?.partos !== undefined && ante?.gestas !== undefined) {
            if ((Number(ante?.abortos) + Number(ante?.cesareas) + Number(ante?.partos)) > (Number(ante?.gestas) - 1)) {

                setError("La suma de abortos , cesareas y partos no puede superar la cantidad de gestaciones ")
            } else {
                let data_antecedentes = ante;

                data_antecedentes.fecha = new Date()

                if (ante.planificado) {
                    data_antecedentes.planificado = 1
                } else {
                    data_antecedentes.planificado = 0
                }
                //let persona = paciente
                // persona.antecedentes=data_antecedentes
                GuardarOnSutmit(data_antecedentes)
                .then(()=>{
                    setError("")
                    history.push("/personas")
                    window.location.reload()
                })

                
               

                   
                    //window.location.reload()
               
            }
        }
    }

   
    useEffect(() => {

        const testDatabaseCopyFromAssets = async (): Promise<any> => {
            try {
                
               
                let res: any = await repositoryMacs.getAll();
                
                setMacs(res)
                let resAPP: any = await repositoryApps.getAll();
                
                setApps(resAPP)
              
                return true;
            }
            catch (error: any) {
                return false;
            }
        }
        testDatabaseCopyFromAssets()
    }, [])
    useEffect(() => {
        setAnte(datos.antecedentes)
        setPaciente(datos)
    }, [])

    useEffect(() => {

    }, [error])
    
    return (
        <IonContent>
            <form onSubmit={(e) => onSubmit(e)}>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Edad 1er Parto</IonLabel>
                            <IonInput name="edad_primer_embarazo" required onIonChange={(e) => handleInputChange(e)} value={ante?.edad_primer_embarazo}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">Fecha de último parto</IonLabel>
                            {/* <IonInput onClick={() => setDataPicker(true)} name="fecha_ultimo_embarazo" value={ante?.fecha_ultimo_embarazo}></IonInput>*/}
                            
                            {ante?.fecha_ultimo_embarazo === null || ante?.fecha_ultimo_embarazo === "null" ? <IonButton onClick={() => setDataPicker(true)} size="small" slot="end">Fecha Último Embarazo</IonButton> : <IonDatetimeButton datetime="datetimeultimo" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker} className="ion-datetime-button-overlay" onDidDismiss={() => setDataPicker(false)}>
                                <IonDatetime
                                    id="datetimeultimo"
                                    name="fecha_ultimo_embarazo"
                                    onIonChange={(e) => fechaNacimiento(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={ante?.fecha_ultimo_embarazo}
                                    onIonCancel={() => setDataPicker(false)}

                                />
                            </IonModal>
                            {/*datapicker && <IonDatetime presentation="date" name="fecha_ultimo_embarazo" onIonChange={(e) => fechaNacimiento(e)} value={ante?.fecha_ultimo_embarazo}></IonDatetime>*/}
                        </IonItem>

                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Gestaciones</IonLabel>
                            <IonInput type="number" name="gestas" required onIonChange={(e) => handleInputChange(e)} value={ante?.gestas}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Partos</IonLabel>
                            <IonInput type="number" name="partos" required onIonChange={(e) => handleInputChange(e)} value={ante?.partos}></IonInput>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Cesareas</IonLabel>
                            <IonInput type="number" name="cesareas" required onIonChange={(e) => handleInputChange(e)} value={ante?.cesareas}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Abortos</IonLabel>
                            <IonInput type="number" name="abortos" required onIonChange={(e) => handleInputChange(e)} value={ante?.abortos}></IonInput>
                        </IonItem>
                    </IonCol>

                </IonRow>
                <IonCol>
                    <div className="ion-text-center"><IonLabel color="warning"> {error} </IonLabel></div>
                </IonCol>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">APPs</IonLabel>
                            <IonSelect name="id_app" onIonChange={(e) => handleInputChange(e)} value={ante?.id_app}>

                                {apps?.map((data: any, i: any) => {
                                    return (
                                        <IonSelectOption value={data.id_app} key={i}>{data.nombre}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">MACs</IonLabel>
                            <IonSelect name="id_mac" onIonChange={(e) => handleInputChange(e)} value={ante?.id_mac}>
                                {macs?.map((data: any, i: any) => {

                                    return (
                                        <IonSelectOption value={data.id_mac} key={i}>{data.nombre}</IonSelectOption>
                                    )
                                })}
                            </IonSelect>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRadioGroup allowEmptySelection={true} name="planificado" onIonChange={(e) => handleInputChange(e)} >
                    <IonItem lines="full" >
                        <IonLabel className="ion-text-wrap">Embarazo Planificado</IonLabel>
                        <IonRadio slot="end" value={true} ></IonRadio>
                    </IonItem>
                </IonRadioGroup>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">Fecha Última Menstruación</IonLabel>
                            {/*<IonInput onClick={() => setDataPicker1(true)} name="fum" >{ante?.fum}</IonInput>*/}
                            <IonButton onClick={() => setAnte((prevProps: any) => ({ ...prevProps, fum: null }))} size="small" slot="end">Limpiar</IonButton>
                            {ante?.fum === null || ante?.fum === "null" ? <IonButton onClick={(e) => setDataPicker1(true)} size="small" slot="end">Fum</IonButton> : <IonDatetimeButton datetime="datetimeeditarfum" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker1} className="ion-datetime-button-overlay" onDidDismiss={(e) => setDataPicker1(false)}>
                                <IonDatetime
                                
                                    id="datetimeeditarfum"
                                    name="fum"
                                    onIonChange={(e) => fecha_FUM(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={ante?.fum}
                                    onIonCancel={(e) => setDataPicker1(false)}
                                >
  
                                </IonDatetime>
                            </IonModal>

                            {/*datapicker1 && <IonDatetime presentation="date" name="fum" onIonChange={(e) => fecha_FUM(e)} value={moment(ante?.fum).format("YYYY-MM-DD")}></IonDatetime>*/}

                        </IonItem>
                        <IonButton expand="block" fill="outline" onClick={(e) => calculoFPP(e)}>Calcular Fecha Probable de Parto</IonButton>
                        {/* <IonButton expand="block" fill="outline" onClick={(e) => calculoFUM(e)}>Calcular Fecha Ultimo Embarazo</IonButton>*/}
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">Fecha Probable de Parto</IonLabel>
                            {/* <IonInput onClick={() => setDataPicker2(true)} name="fpp">{ante?.fpp}</IonInput>*/}
                            {ante?.fpp === null || ante?.fpp === "null" ? <IonButton onClick={(e) => setDataPicker2(true)} size="small" slot="end">FPP</IonButton> : <IonDatetimeButton datetime="datetimeeditarfpp" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} isOpen={datapicker2} className="ion-datetime-button-overlay" onDidDismiss={(e) => setDataPicker2(false)}>
                                <IonDatetime
                                    id="datetimeeditarfpp"
                                    name="fpp"
                                    onIonChange={(e) => fecha_FPP(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={ante?.fpp}
                                    onIonCancel={(e) => setDataPicker2(false)}


                                />
                            </IonModal>
                            {/*datapicker2 && <IonDatetime presentation="date" name="fpp" onIonChange={(e) => fecha_FPP(e)} value={moment(ante?.fpp).format("YYYY-MM-DD")}></IonDatetime>*/}
                        </IonItem>

                    </IonCol>
                </IonRow>
                <IonButton type="submit" expand="block">Enviar </IonButton>
            </form>
        </IonContent>
    )
}
export default FormNuevaEmbAtecedentes