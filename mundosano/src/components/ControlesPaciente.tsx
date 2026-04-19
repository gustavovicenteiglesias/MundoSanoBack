import { IonCard, IonCardHeader, IonCardSubtitle, IonCol, IonItem, IonLabel, IonList, IonRow } from "@ionic/react";
import moment from "moment";

const ControlesPacientes:React.FC<any>=({controles})=>{
    const printeco = (data: any) => {
        switch (data) {
            case "R":
                return "Normal"
                break;
            case "P":
                return "Patologica"
                break;
            default:
                return "No"
                break;
        }
    }
    
    return(
        <>
        {controles.map((data: any, i: any) => {
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
                            <IonCard color="light">
                                <IonCardHeader>
                                    <IonCardSubtitle>Fecha de control : {moment(data.fecha).format('LL')}</IonCardSubtitle>
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
                                    <IonItem lines="full">
                                        <IonLabel class="ion-text-wrap" slot='start'>ECO</IonLabel>
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
                                                    {datos.estado === "S" ? datos.nombre : ""}
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
                                            <IonItem lines="full" key={i}>
                                                <IonLabel class="ion-text-wrap" slot='start'>{dato.nombre}</IonLabel>
                                                <IonLabel class="ion-text-wrap" slot='end'>{dato.resultado}</IonLabel>
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
        </>
    )
        
    
}
export default ControlesPacientes