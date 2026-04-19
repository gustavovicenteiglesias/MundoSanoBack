
import { IonAccordion, IonAccordionGroup, IonButton, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonInput, IonItem, IonLabel, IonModal, IonNote, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption } from "@ionic/react"
import moment from "moment"
import { useEffect, useRef, useState } from "react"

import { useHistory } from "react-router";
import { Apps } from "../models/Apps";
import { Macs } from "../models/Macs";
import { Repository } from "../repository/Repository";

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
const FormNuevaEmbAtecedentes: React.FC<antecedentesPersona> = (persona) => {
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [datapicker1, setDataPicker1] = useState<boolean>(false)
    const [datapicker2, setDataPicker2] = useState<boolean>(false)
    const [fecha, setFecha] = useState<any>(null)
    const [fecha1, setFecha1] = useState<any>(null)
    const [fechaFUM, setFechaFUM] = useState<any>(null)
    const [fechaFUM1, setFechaFUM1] = useState<any>(null)
    const [fechaFPP, setFechaFPP] = useState<any>(null)
    const [fechaFPP1, setFechaFPP1] = useState<any>(null)
    const [macs, setMacs] = useState<any>([])
    const [apps, setApps] = useState<any>([])
    const [ante, setAnte] = useState<antecedentes>()

    const [paciente, setPaciente] = useState<persona>()
    const [error, setError] = useState<string>("")

     const repositoryApps=new Repository<Apps>("apps");
    const repositoryMacs=new Repository<Macs>("macs");

    const history = useHistory()
    const ref = useRef("")
    const fechaNacimiento = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")

        setDataPicker(false)
        setFecha(e.detail.value)
        setFecha1(dia)
    }
    const fecha_FUM = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")

        setDataPicker1(false)
        setFechaFUM(dia)
        setFechaFUM1(dia)
    }

    const fecha_FPP = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")

        setDataPicker2(false)
        setFechaFPP(dia)
        setFechaFPP1(dia)
    }

    const calculoFPP = (e: any) => {
        if (fechaFUM !== null) {
            const dia = moment(fechaFUM).add(280, 'days')

            setFechaFPP(dia.format())
            setFechaFPP1(dia.format("YYYY-MM-DD"))
        }

    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setAnte((prevProps) => ({ ...prevProps, [name]: value }));
    }

    const onSubmit = (e: any) => {
        e.preventDefault()
        if (ante?.abortos && ante?.cesareas && ante?.partos && ante?.gestas !== undefined) {
            if ((Number(ante?.abortos) + Number(ante?.cesareas) + Number(ante?.partos)) > (Number(ante?.gestas) - 1)) {

                setError("La suma de abortos , cesareas y partos no puede superar la cantidad de gestaciones ")
            } else {
                let data_antecedentes = ante;

                data_antecedentes.fum = fechaFUM;
                data_antecedentes.fpp = fechaFPP;
                data_antecedentes.fecha = new Date()
                if (fecha === "") {
                    data_antecedentes.fecha_ultimo_embarazo = null;
                } else {
                    data_antecedentes.fecha_ultimo_embarazo = fecha;
                }
                if (ante.planificado) {
                    data_antecedentes.planificado = 1
                } else {
                    data_antecedentes.planificado = 0
                }
                history.replace({state:null})
                history.push({ pathname: "/nuevaembarazadacontrol", state: { control: data_antecedentes, paciente: paciente } })
                window.location.reload()
                setError("")
            }
        }

    }

    
    useEffect(() => {

        const testDatabaseCopyFromAssets = async (): Promise<any> => {
            try {
                
               
                let res: any = await repositoryMacs.getAll();
                console.log("Macs "+JSON.stringify(res))
                setMacs(res)
                let resAPP: any = await repositoryApps.getAll();
                console.log("Apps "+JSON.stringify(resAPP))
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
        setPaciente(persona.persona)
    }, [error])

    useEffect(() => {

    }, [error])


    return (
        <IonContent>
            <form onSubmit={(e) => onSubmit(e)}>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Edad 1er Parto</IonLabel>
                            <IonInput name="edad_primer_embarazo" required onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">Fecha de último parto</IonLabel>
                            {/*<IonInput onClick={() => setDataPicker(true)} name="fecha_nacimiento">{fecha1}</IonInput>*/}
                            {fecha === null ? <IonButton id="datetimefn1" size="small" slot="end">Fecha Último Embarazo</IonButton> : <IonDatetimeButton datetime="datetimefn" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} trigger="datetimefn1" className="ion-datetime-button-overlay">
                                <IonDatetime
                                    id="datetimefn"
                                    name="fum"
                                    onIonChange={(e) => fechaNacimiento(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={fecha1}

                                />
                            </IonModal>
                            {/*datapicker && <IonDatetime presentation="date" onIonChange={(e) => fechaNacimiento(e)} value={fecha}></IonDatetime>*/}
                        </IonItem>

                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Gestaciones</IonLabel>
                            <IonInput type="number" name="gestas" required onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Partos</IonLabel>
                            <IonInput type="number" name="partos" required onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Cesareas</IonLabel>
                            <IonInput type="number" name="cesareas" required onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">Abortos</IonLabel>
                            <IonInput type="number" name="abortos" required onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonCol>

                </IonRow>
                <IonCol>
                    <div className="ion-text-center"><IonLabel color="warning"> {error} </IonLabel></div>
                </IonCol>
                <IonRow>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="floating">APPs</IonLabel>
                            <IonSelect name="app" onIonChange={(e) => handleInputChange(e)}>

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
                            <IonLabel position="floating">MACs</IonLabel>
                            <IonSelect name="mac" onIonChange={(e) => handleInputChange(e)}>
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
                            {/* <IonInput onClick={() => setDataPicker1(true)} name="fum" >{fechaFUM1}</IonInput>*/}
                            {fechaFUM === null ? <IonButton id="datetimefum1" size="small" slot="end">FUM</IonButton> : <IonDatetimeButton datetime="datetimefum" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} trigger="datetimefum1" className="ion-datetime-button-overlay">
                                <IonDatetime
                                    id="datetimefum"
                                    name="fum"
                                    onIonChange={(e) => fecha_FUM(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={fechaFUM}

                                />
                            </IonModal>
                            {/*datapicker1 && <IonDatetime presentation="date" onIonChange={(e) => fecha_FUM(e)} value={fechaFUM}></IonDatetime>*/}

                        </IonItem>
                        <IonButton expand="block" fill="outline" onClick={(e) => calculoFPP(e)}>Calcular Fecha Probable de Parto</IonButton>
                    </IonCol>
                    <IonCol>
                        <IonItem>
                            <IonLabel position="stacked">Fecha Probable de Parto</IonLabel>
                            {/*<IonInput onClick={() => setDataPicker2(true)} name="fpp">{fechaFPP1}</IonInput>*/}
                            {fechaFPP === null ? <IonButton id="datetimefpp1" size="small" slot="end">FPP</IonButton> : <IonDatetimeButton datetime="datetimefpp" slot="end"></IonDatetimeButton>}
                            <IonModal keepContentsMounted={true} trigger="datetimefpp1" className="ion-datetime-button-overlay">
                                <IonDatetime
                                    id="datetimefpp"
                                    name="fum"
                                    onIonChange={(e) => fecha_FPP(e)}
                                    presentation="date"
                                    showDefaultButtons={true}
                                    doneText="Confirmar"
                                    showClearButton
                                    cancelText="Cancelar"
                                    clearText="Limpiar"
                                    value={fechaFPP1}

                                />
                            </IonModal>
                            {/*datapicker2 && <IonDatetime presentation="date" onIonChange={(e) => fecha_FPP(e)} value={fechaFPP}></IonDatetime>*/}
                        </IonItem>

                    </IonCol>
                </IonRow>
                <IonButton type="submit" expand="block">Enviar </IonButton>
            </form>
        </IonContent>
    )
}
export default FormNuevaEmbAtecedentes