import { IonCard, IonCheckbox, IonCol, IonItem, IonLabel, IonRadio, IonRadioGroup, IonRow } from "@ionic/react"
import { useState } from "react"

interface Props{
    titulo:string,
    radio:string,
    radioname:string,
    radioOpcion:string[]
    radioOpcionName:null
    
}

const LaboratorioCerologia: React.FC<any> = ({titulo,radio,radioname,radioOpcionName,radioOpcion,radioOpcionValue,checked,checkedResp}) => {

    const [show,setshow]=useState<boolean>(false);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        
        radioOpcionValue(e)
    }

    const handleInputChangeCheck = (e: any) => {
        const { name, value } = e.target;
        if (e.detail.checked) {
            setshow(true)
        }else{
            setshow(false)
        }

        radio(e)
    }

    return (
        <>
        <IonCard>
            <IonRow>
            <IonCol sizeXs="6">
                <IonItem>
                    <IonLabel className="ion-text-wrap">{titulo}</IonLabel>
                    <IonCheckbox slot="start" onIonChange={e=>handleInputChangeCheck(e)} name={radioname} checked={checked}></IonCheckbox>
                </IonItem>
            </IonCol>
            {show&& <IonCol sizeXs="6">
                <IonRadioGroup  name={radioOpcionName} onIonChange={e => handleInputChange(e)} value={checkedResp}>
                    <IonItem>
                        <IonLabel>Solicitado</IonLabel>
                        <IonRadio slot="end" value={radioOpcion[0]}></IonRadio>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Positivo</IonLabel>
                        <IonRadio slot="end" value={radioOpcion[1]}></IonRadio>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Negativo</IonLabel>
                        <IonRadio slot="end" value={radioOpcion[2]}></IonRadio>
                    </IonItem>

                </IonRadioGroup>
            </IonCol>}
            </IonRow>
            </IonCard>
        </>
    )
}

export default LaboratorioCerologia