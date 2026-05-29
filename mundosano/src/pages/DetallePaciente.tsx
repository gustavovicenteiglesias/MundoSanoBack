import { IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonActionSheet, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';

import { capSQLiteOptions, SQLiteDBConnection } from "@capacitor-community/sqlite";
import { useEffect, useState } from 'react';
import { sqlite } from '../App';
import { animationBuilder } from "../components/AnimationBuilder"
import { Repository } from "../repository/Repository";
import DataTable from 'react-data-table-component';
import { useHistory, useLocation } from 'react-router';
import moment from 'moment'
import 'moment/locale/es';
import PacienteDatosPersonales from '../components/PacienteDatosPersonales';
import { ellipsisVerticalOutline, addOutline, createOutline, pencilOutline, chevronForwardOutline } from 'ionicons/icons';
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
    const [presentActionSheet] = useIonActionSheet();
    const [showdetalle, setShowDetalle] = useState<boolean>(false);

    const repositoryPaciente = new Repository<Personas>("personas");

    let fecha = moment("es")
    let hoy = moment();
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
        try {
            const evalClose = isControlObsoleto(ctrl, antecedentes);
            if (!evalClose.cerrar) return false;
            const fechaFin = evalClose.fechaFin || moment().format('YYYY-MM-DD');
            const now = Math.floor(Date.now() / 1000);

            const query = `UPDATE controles SET id_estado=2, fecha_fin_embarazo='${fechaFin}', last_modified=${now} WHERE id_control=${ctrl.id_control}`;
            console.log("Ejecutando cierre de embarazo:", query);

            // Usamos run en lugar de execute para sentencias simples
            await db.run(query);
            return true;
        } catch (error) {
            console.error("Error en cerrarEmbarazoLocal:", error);
            throw error;
        }
    };

    const loadPaciente = async (): Promise<boolean> => {
        let db: SQLiteDBConnection | null = null;
        try {
            const dbdb = async () => {
                const ret = await sqlite.checkConnectionsConsistency();
                const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
                if (ret.result && isConn) {
                    return await sqlite.retrieveConnection(NOMBRE_BB_DD);
                } else {
                    return await sqlite.createConnection(NOMBRE_BB_DD);
                }
            }
            db = await dbdb()
            await db.open();

            // pacintes controles, ultimo control, antecedentes y ubicacion
            let res: any = await db.query(`SELECT * FROM controles WHERE id_persona=${paciente.id_persona} ORDER BY fecha DESC`);
            
            console.log("DEBUG controles persona", paciente.id_persona, res.values);

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
            return true;
        }
        catch (error: any) {
            console.error("Error en loadPaciente:", error);
            return false;
        } finally {
            if (db) {
                try { await db.close(); } catch (e) { }
            }
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
        let db: SQLiteDBConnection | null = null;
        try {
            const dbdb = async () => {
                const ret = await sqlite.checkConnectionsConsistency();
                const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
                if (ret.result && isConn) {
                    return await sqlite.retrieveConnection(NOMBRE_BB_DD);
                } else {
                    return await sqlite.createConnection(NOMBRE_BB_DD);
                }
            }
            db = await dbdb();
            await db.open();
            const ultimoControl = paciente.controles?.find((c: any) => c.id_estado === 1) || null;
            if (ultimoControl) {
                await cerrarEmbarazoLocal(db, ultimoControl, paciente.antecedentes);
            }
            history.push({ pathname: "/nuevoantecedentes", state: paciente })
        } catch (e) {
            console.error("Error en handleNuevoEmbarazo:", e);
        } finally {
            if (db) {
                try { await db.close(); } catch (e) { }
            }
        }
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
            case "S":
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
    
    const presentActions = () => {
        presentActionSheet({
            header: 'Acciones',
            buttons: [
                {
                    text: 'Nuevo Control',
                    icon: addOutline,
                    handler: () => {
                        history.push({ pathname: "/nuevocontrol", state: paciente });
                    }
                },
                {
                    text: 'Nuevo Embarazo',
                    icon: createOutline, // Usamos createOutline para "Nuevo Embarazo"
                    handler: () => {
                        handleNuevoEmbarazo();
                    }
                },
                {
                    text: 'Editar datos personales',
                    icon: pencilOutline,
                    handler: () => {
                        history.push({ pathname: "/editarpersona", state: paciente });
                    }
                },
                {
                    text: 'Editar Antecedentes',
                    icon: pencilOutline,
                    handler: () => { history.push({ pathname: "/editantecedentes", state: paciente }) }
                },
                { text: 'Cancelar', role: 'cancel' }
            ]
        });
    };




    return (
        <IonPage>
            {showdetalle ? (
                <>
                <IonHeader className="ion-no-border">
                    <IonToolbar>
                        <IonTitle slot="end">{paciente?.apellido} {paciente?.nombre}</IonTitle>
                        <IonButtons slot="start" >
                            <IonBackButton defaultHref="/personas" routerAnimation={animationBuilder} />
                        </IonButtons>
                        <IonButtons slot="end">
                            <IonButton onClick={presentActions}>
                                <IonIcon icon={ellipsisVerticalOutline} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent >
                        {paciente?.controles?.length > 0 && paciente.controles[0].id_estado === 2 && (
                            <IonCard color="warning">
                                <IonCardHeader>
                                    <IonCardSubtitle>Paciente puérpera. Inicie “Nuevo Embarazo” para registrar controles actuales.</IonCardSubtitle>
                                </IonCardHeader>
                            </IonCard>
                        )}
                        {/* Sección de Antecedentes y Datos Clave */}
                        <IonCard className="ion-margin-bottom" style={{ borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: 'none' }}>
                            <IonGrid className="ion-no-padding ion-padding-vertical">
                                <IonRow className="ion-padding-horizontal">
                                    <IonCol size="6">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Documento</IonLabel>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>{paciente?.documento || '-'}</div>
                                    </IonCol>
                                    <IonCol size="6">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Edad</IonLabel>
                                        <div style={{ fontSize: '1rem', fontWeight: 'bold', marginTop: '2px' }}>
                                            {paciente?.fecha_nacimiento ? hoy.diff(moment(paciente.fecha_nacimiento), 'years') + ' años' : '-'}
                                        </div>
                                    </IonCol>
                                </IonRow>
                                
                                <IonRow className="ion-padding-horizontal ion-margin-top">
                                    <IonCol size="12">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fecha de Nacimiento</IonLabel>
                                        <div style={{ fontSize: '0.9rem', marginTop: '2px' }}>{paciente?.fecha_nacimiento ? moment(paciente.fecha_nacimiento).format('LL') : '-'}</div>
                                    </IonCol>
                                </IonRow>

                                <IonRow className="ion-margin-top" style={{ borderTop: '1px solid var(--ion-color-step-150)', paddingTop: '10px' }}>
                                    <IonCol size="6" className="ion-padding-start">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FUM</IonLabel>
                                        <div style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>
                                            {paciente?.antecedentes?.fum && paciente.antecedentes.fum !== "null" ? moment(paciente.antecedentes.fum).format('DD/MM/YYYY') : '—'}
                                        </div>
                                    </IonCol>
                                    <IonCol size="6" className="ion-padding-start">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FPP</IonLabel>
                                        <div style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>
                                            {paciente?.antecedentes?.fpp && paciente.antecedentes.fpp !== "null" ? moment(paciente.antecedentes.fpp).format('DD/MM/YYYY') : '—'}
                                        </div>
                                    </IonCol>
                                </IonRow>
                                 <IonRow className="ion-margin-top" style={{ borderTop: '1px solid var(--ion-color-step-150)', paddingTop: '10px' }}>
                                    <IonCol size="6" className="ion-padding-start">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pais</IonLabel>
                                        <div style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>
                                            {paciente?.ubicacion?.pais ? paciente.ubicacion.pais.toUpperCase() : '—'}
                                        </div>
                                    </IonCol>
                                    <IonCol size="6" className="ion-padding-start">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Area</IonLabel>
                                        <div style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>
                                            {paciente?.ubicacion?.area || '—'}
                                        </div>
                                    </IonCol>
                                    <IonCol size="6" className="ion-padding-start">
                                        <IonLabel color="medium" style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Paraje</IonLabel>
                                        <div style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1rem', marginTop: '2px' }}>
                                            {paciente?.ubicacion?.paraje || '—'}
                                        </div>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonCard>

                   { /*<PacienteDatosPersonales paciente={paciente} />*/}
                    {paciente.controles?.map((data: any, i: any) => {
                        if (data.id_estado === 2) {
                            return (
                                <IonCard key={i} className="ion-margin-bottom" style={{ borderRadius: '12px', border: '1px solid var(--ion-color-step-200)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                    <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
                                        <IonCardSubtitle style={{ margin: 0 }}>Fecha de control : {moment(data.fecha).format('LL')}</IonCardSubtitle>
                                        <IonIcon icon={chevronForwardOutline} color="medium" />
                                    </IonCardHeader>
                                    <IonCardContent className="ion-no-padding">
                                    <IonList lines="none">
                                        <IonItem>
                                            <IonLabel slot='start'>Estado</IonLabel>
                                            <IonLabel slot='end'>PUÉRPERA</IonLabel>
                                        </IonItem>
                                    </IonList>
                                    </IonCardContent>
                                </IonCard>
                            )
                        }
                        else {
                            return (

                                <IonRow key={i} className="ion-margin-bottom" onClick={() => history.push({ pathname: "/editcontrol", state: { data: { data, paciente } } })}>
                                    <IonCol>
                                        <IonCard style={{ borderRadius: '12px', border: '1px solid var(--ion-color-step-200)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                            <IonCardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ion-color-step-150)', paddingBottom: '10px' }}>
                                                <IonCardSubtitle style={{ margin: 0, fontWeight: '600' }}>Fecha de control : {moment(data.fecha).format('LL')}</IonCardSubtitle>
                                                <IonIcon icon={chevronForwardOutline} color="primary" />
                                            </IonCardHeader>
                                            <IonCardContent>
                                            <IonList lines="none">
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
                                                    <IonLabel class="ion-text-wrap" slot='end'>
                                                        {data.inmunizaciones?.filter((datos: any) => datos.estado === "S" || datos.estado === "C").map((datos: any) => datos.nombre).join(', ') || '-'}
                                                    </IonLabel>
                                                </IonItem>
                                                <IonItem lines="full">
                                                    <IonLabel class="ion-text-wrap" slot='start'>CONTROL CLÍNICO</IonLabel>
                                                    <IonLabel class="ion-text-wrap" slot='end'>{data.controlembarazada?.clinico === "N" ? "Normal" : "Anormal"}{data.controlembarazada?.observaciones && ` (${data.controlembarazada?.observaciones})`}</IonLabel>
                                                </IonItem>
                                                <IonItem lines="full">
                                                    <IonLabel class="ion-text-wrap" slot='start'>TENSIÓN ARTERIAL</IonLabel>
                                                    <IonLabel class="ion-text-wrap" slot='end'>{data.controlembarazada?.sistolica}/{data.controlembarazada?.diastolica}</IonLabel>
                                                </IonItem>
                                            </IonList>
                                            <IonList className="ion-margin-top">

                                                <IonItemDivider color="secondary">
                                                    <IonLabel class="ion-text-wrap" slot='start'>LABORATORIO</IonLabel>
                                                    <IonLabel class="ion-text-wrap" slot='end'>RESULTADO</IonLabel>
                                                </IonItemDivider>
                                                {data.laboratorios?.map((dato: any, i: any) => {
                                                    return (
                                                        <IonItem lines="full" key={i} color={handleColor(dato.resultado)}>
                                                            <IonLabel class="ion-text-wrap" slot='start'>{dato.nombre}</IonLabel>
                                                            <IonLabel class="ion-text-wrap" slot='end'>{printLab(dato.resultado)}</IonLabel>
                                                        </IonItem>
                                                    )
                                                })}
                                            </IonList>
                                            </IonCardContent>
                                        </IonCard>
                                    </IonCol>
                                </IonRow>
                            )
                        }
                    })}
                </IonContent>
                </>
            ) : null}
        </IonPage>
    );
};

export default DetallePaciente;
