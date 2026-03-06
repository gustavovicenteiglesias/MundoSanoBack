import { IonBackButton, IonButtons, IonHeader, IonLabel, IonPage, IonText, IonTitle, IonToolbar } from "@ionic/react"

import { animationBuilder } from "../components/AnimationBuilder"
import { useHistory, useLocation } from "react-router"
import FormNuevaEmbAtecedentes from "../components/FormNuevaEmbAntecedentes"
import { useState } from "react"
import FormNuevoAtecedentes from "../components/FormNuevoAntecedente"



const NuevoAntecedentes:React.FC=()=>{
    const location = useLocation();
    const [paciente, setPaciente] = useState<any>(location.state);
    const history=useHistory()
    
   
    return(
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar>
                   <IonButtons slot="start" >
                        <IonBackButton defaultHref="/personas" routerAnimation={animationBuilder} />
                    </IonButtons>
                   <IonLabel >Antecedentes de {paciente?.nombre} {paciente?.apellido}</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonText color="primary" className="ion-text-center">
               <h3>Nuevo Embarazo</h3> 
            </IonText>
            <FormNuevoAtecedentes datos={paciente}></FormNuevoAtecedentes>
        </IonPage>
    )
}
export default NuevoAntecedentes