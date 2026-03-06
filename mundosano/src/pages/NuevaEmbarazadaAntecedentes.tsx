import { IonBackButton, IonButtons, IonHeader, IonLabel, IonPage, IonTitle, IonToolbar } from "@ionic/react"

import { animationBuilder } from "../components/AnimationBuilder"
import { useHistory, useLocation } from "react-router"
import FormNuevaEmbAtecedentes from "../components/FormNuevaEmbAntecedentes"
import { useState } from "react"



const NuevaEmbarazadaAntecedentes:React.FC=()=>{
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
            <FormNuevaEmbAtecedentes persona={paciente}></FormNuevaEmbAtecedentes>
        </IonPage>
    )
}
export default NuevaEmbarazadaAntecedentes