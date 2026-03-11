import { IonBackButton, IonButton, IonButtons, IonCard, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';

import { SQLiteConnection, capSQLiteOptions, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { useEffect, useRef, useState } from 'react';
import { animationBuilder } from "../components/AnimationBuilder"
import { Repository } from "../repository/Repository";
import DataTable from 'react-data-table-component';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment'
import 'moment/locale/es';
import PacienteDatosPersonales from '../components/PacienteDatosPersonales';

import './Home.css';
import ControlesPacientes from '../components/ControlesPaciente';

import { IoCreateOutline } from "react-icons/io5";
import { NOMBRE_BB_DD } from '../utils/constantes';
import { Personas } from '../models/PersonasModels';


export interface control {
    id_control: number,
    fecha: string,
    id_persona: number,
    control_numero: number,
    id_estado: number,
    id_seguimiento_chagas?: number,
    id_tratamiento_chagas?: number,
    id_seguimiento_hiv?: number,
    id_tratamiento_hiv?: number,
    id_seguimiento_sifilis?: number,
    id_tratamiento_sifilis?: number,
    id_seguimiento_vhb?: number,
    id_tratamiento_vhb?: number,
    fecha_fin_embarazo?: number,
    id_tipos_fin_embarazos?: number,
    georeferencia?: string,
    controlembarazada?:
    {
        clinico?: string,
        detalle_eco?: string,
        diastolica?: number
        eco?: string,
        edad_gestacional?: number,
        hpv?: string,
        id_control: number,
        id_control_embarazo?: number,
        observaciones?: string
        pap?: string,
        sistolica?: number
    }
}
export interface controls extends Array<control> { }

const DetallePaciente: React.FC = () => {
    const location = useLocation();
    const [paciente, setPaciente] = useState<any>(location.state);
    const [controles, setControles] = useState<controls>([])
    const [showdetalle, setShowDetalle] = useState<boolean>(false);

    const repositoryPaciente = new Repository<Personas>("personas");

    let fecha = moment("es")
    let hoy = moment();
    let sqlite = useSQLite()
    const history = useHistory()

    const isControlObsoleto = (ctrl: any, antecedentes: any): { cerrar: boolean, fechaFin: string | null } => {
        const hoy = moment();
        const fechaControl = ctrl?.fecha ? moment(ctrl.fecha) : null;
        const fum = antecedentes?.fum ? moment(antecedentes.fum) : null;
        const fpp = antecedentes?.fpp ? moment(antecedentes.fpp) : null;

        // reglas de cierre
        if (fpp) {
            const limiteFpp = fpp.clone().add(42, 'days');
            if (limiteFpp.isBefore(hoy)) return { cerrar: true, fechaFin: fpp.format('YYYY-MM-DD') };
        }
        if (fum) {
            const limiteFum = fum.clone().add(46, 'weeks');
            if (limiteFum.isBefore(hoy)) return { cerrar: true, fechaFin: limiteFum.format('YYYY-MM-DD') };
        }
        if (fechaControl && fechaControl.isBefore(hoy.clone().subtract(365, 'days'))) {
            return { cerrar: true, fechaFin: fechaControl.format('YYYY-MM-DD') };
        }
        return { cerrar: false, fechaFin: null };
    };

    const cerrarEmbarazoLocal = async (db: SQLiteDBConnection, ctrl: any, antecedentes: any) => {
        const evalClose = isControlObsoleto(ctrl, antecedentes);
        if (!evalClose.cerrar) return false;
        const fechaFin = evalClose.fechaFin || moment().format('YYYY-MM-DD');
        await db.execute(`UPDATE controles SET id_estado=2, fecha_fin_embarazo='${fechaFin}', last_modified=${Math.floor(Date.now()/1000)} WHERE id_control=${ctrl.id_control}`);
        return true;
    };
    
    const loadPaciente = async (): Promise<boolean> => {
        try {
            const dbdb = async () => {
                const ret = await sqlite.checkConnectionsConsistency();
                const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
                var db: SQLiteDBConnection
                if (ret.result && isConn) {
                    return db = await sqlite.retrieveConnection(NOMBRE_BB_DD);
                } else {
                    return db = await sqlite.createConnection(NOMBRE_BB_DD);
                }
            }
            const db = await dbdb()
            await db.open();
            //pacientes controles, ultimo control, antecedentes y ubicacion
            let res: any = await db.query(`SELECT * FROM controles WHERE id_persona=${paciente.id_persona} ORDER BY fecha DESC`);

            let respantecedente: any = await db.query(`SELECT a.*, s.id_app,m.id_mac FROM antecedentes a LEFT JOIN antecedentes_apps s ON a.id_antecedente=s.id_antecedente LEFT JOIN antecedentes_macs m ON a.id_antecedente=m.id_antecedente WHERE a.id_persona=${paciente.id_persona}`)
            let respUbicacion: any = await db.query(`SELECT u.id_ubicacion,u.id_pais,u.id_area,u.id_paraje,u.num_vivienda,u.georeferencia, pa.nombre AS pais,a.nombre AS area, p.nombre AS paraje FROM ubicaciones u INNER JOIN parajes p ON u.id_paraje=p.id_paraje INNER JOIN areas a ON p.id_area=a.id_area INNER JOIN paises pa ON a.id_pais=pa.id_pais WHERE u.id_persona=${paciente.id_persona}`)

            for (let i = 0; i < res.values.length; i++) {
                const data = res.values[i];
                if (data.id_estado === 1) {
                    const resp = await db.query(`SELECT * FROM control_embarazo WHERE id_control=${data.id_control}`);
                    res.values[i].controlembarazada = resp?.values && resp.values.length > 0 ? resp.values[0] : undefined;

                    const respLaboratorio: any = await db.query(`SELECT l.id_laboratorio,l.fecha_realizado,l.resultado,t.nombre FROM laboratorios_realizados l INNER JOIN laboratorios t ON l.id_laboratorio=t.id_laboratorio WHERE l.id_control=${data.id_control}`);
                    res.values[i].laboratorios = respLaboratorio.values;

                    const respInmunizacion: any = await db.query(`SELECT * FROM inmunizaciones_control c INNER JOIN inmunizaciones i ON c.id_inmunizacion=i.id_inmunizacion WHERE c.id_control=${data.id_control}`);
                    res.values[i].inmunizaciones = respInmunizacion.values;
                }
            }

            setPaciente({ ...paciente, controles: res.values, antecedentes: respantecedente.values[0], ubicacion: respUbicacion.values[0] })

            setTimeout(async function () {
                db.close()
            }, 500);

            return true;
        }
        catch (error: any) {
            return false;
        }
    }

    useEffect(() => {
        setShowDetalle(true);
        loadPaciente();
    }, [])

    useIonViewWillEnter(() => {
        loadPaciente();
    });

    const handleNuevoEmbarazo = async () => {
        const dbdb = async () => {
            const ret = await sqlite.checkConnectionsConsistency();
            const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
            var db: SQLiteDBConnection
            if (ret.result && isConn) {
                return db = await sqlite.retrieveConnection(NOMBRE_BB_DD);
            } else {
                return db = await sqlite.createConnection(NOMBRE_BB_DD);
            }
        }
        const db = await dbdb();
        await db.open();
        const ultimoControl = paciente.controles?.find((c: any) => c.id_estado === 1) || null;
        if (ultimoControl) {
            await cerrarEmbarazoLocal(db, ultimoControl, paciente.antecedentes);
        }
        await db.close();
        history.push({ pathname: "/nuevoantecedentes", state: paciente })
    }


    //
    const printeco = (data: any) => {
        switch (data) {
            case "R":
                return "Normal"
                break;
            case "S":
                return "Solicitada"
                break;
            case "P":
                return "Patologica"
                break;
            default:
                return "No"
                break;
        }
    }
    const printLab = (data: any): string => {
        switch (data) {
            case "N":
                return "Negativo"
                break;
            case "S":
                return "Solicitada"
                break;
            case null:
                return "Solicitada"
                break;
            case "P":
                return "Positivo"
                break;
            default:
                return data
                break;
        }
    }
    

    const handleColor = (data: any): string => {
        switch (data) {
            case null || "S":
                return "warning"
                break;
            case null:
                return "warning"
                break;
            case null:
                return "warning"
                break;
            case "P":
                return "danger"
                break;
            case "N":
                return "success"
                break;
            default:
                return ""
                break;
        }

    }

   


    return (
        <>
        {showdetalle ? (<IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                    <IonTitle slot="end">{paciente?.apellido} {paciente?.nombre}</IonTitle>
                    <IonButtons slot="start" >
                        <IonBackButton defaultHref="/" routerAnimation={animationBuilder} />
                    </IonButtons>


                </IonToolbar>
            </IonHeader>
            <IonContent >
                <div>
                    {paciente?.controles?.length > 0 && paciente.controles[0].id_estado === 2 && (
                        <IonCard color="warning">
                            <IonCardHeader>
                                <IonCardSubtitle>Paciente puérpera. Inicie “Nuevo Embarazo” para registrar controles actuales.</IonCardSubtitle>
                            </IonCardHeader>
                        </IonCard>
                    )}
                    <IonButton expand="block" fill="outline" slot='end' onClick={() => history.push({ pathname: "/editarpersona", state: paciente })}>Editar datos personales</IonButton>
                    <IonButton expand="block" fill="outline" slot='end' onClick={handleNuevoEmbarazo}><IoCreateOutline size={32} />{" "}Nuevo Embarazo</IonButton>
                </div>
                <div>
                    <IonButton expand="block" fill="outline" slot='end' onClick={() => { history.push({ pathname: "/editantecedentes", state: paciente }) }}><IoCreateOutline size={32} />{" "}Editar Antecedentes</IonButton>
                </div>
                <div>
                    <IonButton expand="block" fill="outline" slot='end' onClick={() => history.push({ pathname: "nuevocontrol", state: paciente })}><IoCreateOutline size={32} />{" "}Nuevo Control</IonButton>
                </div>
                <PacienteDatosPersonales paciente={paciente} />

                {paciente.controles?.map((data: any, i: any) => {
                    if (data.id_estado === 2) {
                        return (
                            <IonCard key={i} color="light">
                                <IonCardHeader>
                                    <IonCardSubtitle>Fecha de control : {moment(data.fecha).format('LL')}</IonCardSubtitle>
                                </IonCardHeader>
                                <IonList>
                                    <IonItem>
                                        <IonLabel slot='start'>Estado</IonLabel>
                                        <IonLabel slot='end'>PUÉRPERA</IonLabel>
                                    </IonItem>
                                </IonList>
                            </IonCard>
                        )
                    }
                    else {
                        return (

                            <IonRow key={i}>
                                <IonCol>
                                    <IonCard color="light" >
                                        <IonCardHeader>
                                            <IonCardSubtitle >Fecha de control : {moment(data.fecha).format('LL')}</IonCardSubtitle>
                                            <IonButton fill="outline" expand="block" onClick={() => history.push({ pathname: "/editcontrol", state: { data: { data, paciente } } })}><IoCreateOutline size={32} />{" "}Editar Control</IonButton>
                                        </IonCardHeader>
                                        <IonList>
                                            <IonItem lines="full" >
                                                <IonLabel class="ion-text-wrap" slot='start'>ESTADO</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>EMBARAZADA</IonLabel>
                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>EDAD GESTACIONAL</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{data.controlembarazada?.edad_gestacional}</IonLabel>
                                            </IonItem>
                                            <IonItem lines="full" color={handleColor(data.controlembarazada?.eco)}>
                                                <IonLabel class="ion-text-wrap" slot='start' >ECO</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{printeco(data.controlembarazada?.eco || "")}</IonLabel>
                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>HPV</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{printeco(data.controlembarazada?.hpv || "")}</IonLabel>
                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>PAP</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{printeco(data.controlembarazada?.pap || "")}</IonLabel>
                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>INMUNIZACIONES</IonLabel>
                                                {data.inmunizaciones?.map((datos: any, i: any) => {
                                                    return (
                                                        <IonLabel class="ion-text-wrap" slot='end' key={i}>
                                                            {datos.estado === "S" || datos.estado === "C" ? datos.nombre : ""}
                                                        </IonLabel>
                                                    )
                                                })}

                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>CONTROL CLÍNICO</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>
                                                    {data.controlembarazada?.clinico === "N" ? "Normal\n" + data.controlembarazada?.observaciones : "Anormal\n" + data.controlembarazada?.observaciones}
                                                </IonLabel>
                                            </IonItem>
                                            <IonItem lines="full">
                                                <IonLabel class="ion-text-wrap" slot='start'>TENSIÓN ARTERIAL</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{data.controlembarazada?.sistolica}/{data.controlembarazada?.diastolica}</IonLabel>
                                            </IonItem>
                                        </IonList>
                                        <IonList >

                                            <IonItem lines="full" color="secondary">
                                                <IonLabel class="ion-text-wrap" slot='start'>LABORATORIO</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>RESULTADO</IonLabel>
                                            </IonItem>
                                            {data.laboratorios?.map((dato: any, i: any) => {
                                                return (
                                                    <IonItem lines="full" key={i} color={handleColor(dato.resultado)}>
                                                        <IonLabel class="ion-text-wrap" slot='start'>{dato.nombre}</IonLabel>
                                                        <IonLabel class="ion-text-wrap" slot='end'>{printLab(dato.resultado)}</IonLabel>
                                                    </IonItem>
                                                )
                                            })}
                                        </IonList>
                                    </IonCard>
                                </IonCol>
                            </IonRow>
                        )
                    }
                })} 
            </IonContent>
        </IonPage>) : null}
        </>
    );
};

export default DetallePaciente;
