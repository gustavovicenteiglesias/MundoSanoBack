import { IonBackButton, IonButton, IonButtons, IonContent, IonDatetime, IonDatetimeButton, IonModal, IonHeader, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonAlert, IonCol } from "@ionic/react"

import { animationBuilder } from "../components/AnimationBuilder"
import { useHistory, useLocation } from "react-router"
import { useEffect, useState } from "react"

import { useSQLite } from "react-sqlite-hook"
import { SQLiteConnection, capSQLiteOptions, SQLiteDBConnection } from "@capacitor-community/sqlite";
import moment from "moment"
import { Controller, useForm } from "react-hook-form"
import { Geolocation } from '@capacitor/geolocation';
import { ErrorMessage } from "@hookform/error-message"
import { Repository } from "../repository/Repository"
import { Paises } from "../models/Paises"
import { Origenes } from "../models/Origenes"
import { Areas } from "../models/Areas"
import { Parajes } from "../models/Parajes"



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
const NuevaEmbarazada: React.FC = () => {


    const [fecha, setFecha] = useState<string>()
    const [fecha1, setFecha1] = useState<any>(null)
    const [origen, setOrigen] = useState<any>([])
    const [paises, setPaises] = useState<any>([])
    const [area, setArea] = useState<any>([])
    const [parajes, setParaje] = useState<any>([])
    const [paciente, setPaciente] = useState<persona>()
    const [loading, setLoading] = useState<boolean>(false)
    const [datapicker, setDataPicker] = useState<boolean>(false)
    const [error,setError]= useState<string>()
    const [showAlert, hideAlert] = useIonAlert();

    const repositoryPais=new Repository<Paises>("paises");
    const repositoryOrigenes=new Repository<Origenes>("origenes");
    const repositoryAreas=new Repository<Areas>("areas");
    const repositoryParaje=new Repository<Parajes>("parajes");

    let sqlite = useSQLite()
    const history = useHistory()
    const {
        handleSubmit,
        control,
        setValue,
        register,
        getValues,
        formState: { errors }
    } = useForm({
        defaultValues: {
            nombre: '',
            apellido: "",
            documento: null,
            fecha_nacimiento: "",
            nacionalidad:"",
            origen:"",
            pais_residencia: "",
            area_residencia: "",
            paraje_residencia: ""
        }
    });

    const fechaNacimiento = (e: any) => {
        const dia = moment(e.detail.value).format("YYYY-MM-DD")
        setDataPicker(false)
        setPaciente((prevProps) => ({ ...prevProps, fecha_nacimiento: dia }))
        setFecha1(dia)
        setFecha(e.detail.value)
        setValue('fecha_nacimiento', e.detail.value)
    }

    const printCurrentPosition = async () => {
        const coordinates = await Geolocation.getCurrentPosition()
            .then((resp) => {
                setPaciente((prevProps) => ({ ...prevProps, latitud: resp.coords.latitude }))
                setPaciente((prevProps) => ({ ...prevProps, longitud: resp.coords.longitude }))
            })
            .catch((e)=>console.log(e))

    };

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setPaciente((prevProps) => ({ ...prevProps, [name]: value }));
    }


    const onSubmit = (data: any) => {
        if(fecha1===null){
            setError("Por favor indica una fecha de nacimiento")
        }else{
            //alert(JSON.stringify(data, null, 2));
        data.alta = paciente?.alta;
        data.pais_residencia=paciente?.pais_residencia
        data.area_residencia = paciente?.area_residencia;
        data.fecha_nacimiento = data.fecha_nacimiento;
        data.latitud = paciente?.latitud;
        data.longitud = paciente?.longitud;
        data.madre = paciente?.madre;
        data.nacido_vivo = paciente?.nacido_vivo;
        data.num_vivienda = paciente?.num_vivienda;
        
        history.push({ pathname: "/nuevaembarazadaantecedentes", state: data })
        }
        
    };



    useEffect(() => {
        setPaciente((prevProps) => ({ ...prevProps, sexo: "F" }))
        setPaciente((prevProps) => ({ ...prevProps, madre: null }))
        setPaciente((prevProps) => ({ ...prevProps, alta: 0 }))
        setPaciente((prevProps) => ({ ...prevProps, nacido_vivo: null }))

        printCurrentPosition()
    }, [])

    useEffect(() => {

        const testDatabaseCopyFromAssets = async (): Promise<any> => {
            try {
                
                let res: any = await repositoryOrigenes.getAll();
                setOrigen(res)
                let respais: any = await repositoryPais.getAll();
                setPaises(respais)
                let resArea: any = await repositoryAreas.getByLastId("id_pais",paciente?.pais_residencia);
                setArea(resArea)
                let resParaje: any = await repositoryParaje.getByLastId("id_area",paciente?.area_residencia)
                setParaje(resParaje)

                
                return true;
            }
            catch (error: any) {
                return false;
            }
        }
        testDatabaseCopyFromAssets()
    }, [paciente])
    //
    
    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>

                    <IonButtons slot="start" >
                        <IonBackButton defaultHref="/personas" routerAnimation={animationBuilder} />
                    </IonButtons>

                </IonToolbar>
            </IonHeader>
            <IonContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <IonList>
                        <IonItem>
                            <IonLabel position="floating">Nombre</IonLabel>
                            <IonInput
                                onIonChange={(event: any) => {
                                    event.target.value = event.target.value.toUpperCase();
                                }}
                                {...register('nombre', {
                                    required: 'Este campo es requerido',


                                })}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="nombre"
                            as={<div style={{ color: 'red' }} />}
                        />
                        <IonItem>
                            <IonLabel position="floating">Apellido</IonLabel>
                            <IonInput
                                onIonChange={(event: any) => {
                                    event.target.value = event.target.value.toUpperCase();
                                }}
                                {...register('apellido', {
                                    required: 'Este campo es requerido',


                                })}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="apellido"
                            as={<div style={{ color: 'red' }} />}
                        />
                        <IonItem>
                            <IonLabel position="floating">Documento</IonLabel>
                            <IonInput
                                placeholder="55666888"
                                {...register('documento', {
                                    required: 'Este campo es requerido',
                                    pattern: {
                                        value: /^[\d]{1,3}\.?[\d]{3,3}\.?[\d]{3,3}$/,
                                        message: 'DNI incorrecto'
                                    },

                                })}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="documento"
                            as={<div style={{ color: 'red' }} />}
                        />
                        {/* === ION DATE TIME === */}
                        <IonItem>
                            <IonLabel position="stacked">Fecha de Nacimiento</IonLabel>
                            {fecha1 === null || fecha1 === "null" ? <IonButton onClick={(e) => setDataPicker(true)} size="small" >Fecha de Nacimiento</IonButton> : <IonDatetimeButton datetime="datetime" ></IonDatetimeButton>}

                            
                        </IonItem>

                    </IonList>
                    
                    <IonCol>
                            <div><IonLabel color="danger"> {error} </IonLabel></div>
                        </IonCol>
                    <IonList>
                        {/* 0000 SELECT ORIGEN */}
                        <IonListHeader color="secondary">
                            <IonLabel>Residencia</IonLabel>
                        </IonListHeader>
                        <IonItem>
                            <IonLabel position="floating">Origen</IonLabel>
                            <Controller
                                render={({ field }) => (
                                    <IonSelect onIonChange={(e) => { handleInputChange(e); setValue("origen", e.detail.value) }} name="origen">
                                       {origen.map((data:any,i:any)=>{
                                            return(
                                                <IonSelectOption value={data.id_origen} key={i}>{data.nombre}</IonSelectOption>
                                            )
                                        })}
                                    </IonSelect>
                                )}
                                control={control}
                                name="origen"
                                rules={{ required: 'Por favor selecciona una opción' }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="origen"
                            as={<div style={{ color: 'red' }} />}
                        />
                        <IonItem>
                            <IonLabel position="floating">Pais</IonLabel>
                            <Controller
                                render={({ field }) => (
                                    <IonSelect onIonChange={(e) => { handleInputChange(e); setValue("nacionalidad", e.detail.value) }} name="nacionalidad">
                                       {paises.map((data:any,i:any)=>{
                                            return(
                                                <IonSelectOption value={data.id_pais} key={i}>{data.nombre}</IonSelectOption>
                                            )
                                        })}
                                    </IonSelect>
                                )}
                                control={control}
                                name="nacionalidad"
                                rules={{ required: 'Por favor selecciona una opción' }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="nacionalidad"
                            as={<div style={{ color: 'red' }} />}
                        />
                    
                        {/* === SELECTS UBICACION PAIS === */}
                        <IonListHeader color="secondary">
                            <IonLabel>Ubicación</IonLabel>
                        </IonListHeader>
                        <IonItem>
                            <IonLabel position="floating">Pais</IonLabel>
                            <Controller
                                render={({ field }) => (
                                    <IonSelect onIonChange={(e) => { handleInputChange(e); setValue("pais_residencia", e.detail.value) }} name="pais_residencia">
                                       {paises.map((data:any,i:any)=>{
                                            return(
                                                <IonSelectOption value={data.id_pais} key={i}>{data.nombre}</IonSelectOption>
                                            )
                                        })}
                                       {/* <IonSelectOption value={12} >Argentina</IonSelectOption>*/}
                                       
                                    </IonSelect>
                                )}
                                control={control}
                                name="pais_residencia"
                                rules={{ required: 'Por favor selecciona una opción' }}
                            />
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name="pais_residencia"
                            as={<div style={{ color: 'red' }} />}
                        />
                        <IonItem>
                            <IonLabel position="floating" className="ion-text-wrap">Area</IonLabel>
                            <Controller
                                render={({ field }) => (
                                    <IonSelect onIonChange={(e) => { handleInputChange(e); setValue("area_residencia", e.detail.value) }} name="area_residencia">
                                        {area.map((data: any, i: any) => {
                                            return <IonSelectOption value={data.id_area} key={i}>{data.nombre}</IonSelectOption>
                                        })}

                                    </IonSelect>
                                )}
                                control={control}
                                name="area_residencia"
                                rules={{ required: 'Por favor selecciona una opción' }}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="area_residencia"
                                as={<div style={{ color: 'red' }} />}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Paraje</IonLabel>
                            <Controller
                                render={({ field }) => (

                                    <IonSelect onIonChange={e => { handleInputChange(e); setValue("paraje_residencia", e.detail.value) }} name="paraje_residencia"   >
                                        {parajes.map((data: any, i: any) => {
                                            return <IonSelectOption value={data.id_paraje} key={i}>{data.nombre}</IonSelectOption>
                                        })}

                                    </IonSelect>
                                )}
                                control={control}
                                name="paraje_residencia"
                                rules={{ required: 'Por favor selecciona una opción' }}
                            />
                            <ErrorMessage
                                errors={errors}
                                name="paraje_residencia"
                                as={<div style={{ color: 'red' }} />}
                            />
                        </IonItem>
                        <IonItem>
                            <IonLabel position="floating">Número de Vivienda</IonLabel>
                            <IonInput name="num_vivienda" type="number" onIonChange={(e) => handleInputChange(e)}></IonInput>
                        </IonItem>
                    </IonList>
                    <IonList>
                        <IonListHeader color="secondary">Geolocalización</IonListHeader>
                        <IonItem>
                            <IonLabel>Latitud</IonLabel>
                            <IonLabel>{paciente?.latitud}</IonLabel>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Longitud</IonLabel>
                            <IonLabel>{paciente?.longitud}</IonLabel>
                        </IonItem>
                    </IonList>
                    <IonModal keepContentsMounted={true} isOpen={datapicker} onDidDismiss={(e) => setDataPicker(false)} className="ion-datetime-button-overlay">
                        <IonDatetime
                            id="datetime"
                            name="fecha_nacimiento"
                            onIonChange={(e) => fechaNacimiento(e)}
                            presentation="date"
                            showDefaultButtons={true}
                            showClearButton
                            doneText="Confirmar"
                            cancelText="Cancelar"
                            clearText="Limpiar"
                            placeholder="fecha"
                            onIonCancel={(e) => setDataPicker(false)}
                            

                        />
                    </IonModal>
                    <IonButton type="submit" expand="block">{loading ? "Enviando" : "Enviar"} </IonButton>
                </form>

            </IonContent>
        </IonPage>
    )
}
export default NuevaEmbarazada