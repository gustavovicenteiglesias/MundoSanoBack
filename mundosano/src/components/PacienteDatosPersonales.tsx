import { IonCard, IonItem, IonLabel, IonList, IonListHeader } from "@ionic/react"
import moment from "moment"

const PacienteDatosPersonales:React.FC<any>=({paciente})=>{
    const hoy =moment()
return(
    <IonCard color="light">
                    <IonList>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Nombre:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.nombre}</IonLabel>
                        </IonItem >
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Apellido:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.apellido}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Documento:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.documento}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Fecha de Nacimiento:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{moment(paciente?.fecha_nacimiento).format("YYYY-MM-DD")}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Edad:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{hoy.diff(moment(paciente?.fecha_nacimiento), "years")}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>FUM:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.antecedentes?.fum}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>FPP:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.antecedentes?.fpp}</IonLabel>
                        </IonItem>
                    </IonList>
                    <IonList>
                        <IonListHeader color="secondary">
                            <IonLabel>Ubicacion</IonLabel>
                        </IonListHeader>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Pais:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.ubicacion?.pais.toUpperCase()}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Area:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.ubicacion?.area}</IonLabel>
                        </IonItem>
                        <IonItem lines="full">
                            <IonLabel class="ion-text-wrap" slot='start'>Paraje:</IonLabel>
                            <IonLabel class="ion-text-wrap" slot='end' color="tertiary">{paciente?.ubicacion?.paraje}</IonLabel>
                        </IonItem>
                    </IonList>
                </IonCard>
)
}
export default PacienteDatosPersonales