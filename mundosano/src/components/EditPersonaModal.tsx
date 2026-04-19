import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonInput, IonItem, IonLabel, IonModal, IonTitle, IonToolbar } from "@ionic/react";
import { useState } from "react";
import { getDb } from "../data/db";
import moment from "moment";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  paciente: any;
  onSaved: (updates: any) => void;
}

const EditPersonaModal: React.FC<Props> = ({ isOpen, onClose, paciente, onSaved }) => {
  const [form, setForm] = useState({
    nombre: paciente?.nombre || "",
    apellido: paciente?.apellido || "",
    documento: paciente?.documento || "",
    fecha_nacimiento: paciente?.fecha_nacimiento || ""
  });

  const handleChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    const db = await getDb();
    await db.open();
    await db.execute(`UPDATE personas SET nombre='${form.nombre}', apellido='${form.apellido}', documento='${form.documento}', fecha_nacimiento='${moment(form.fecha_nacimiento).format("YYYY-MM-DD")}' WHERE id_persona=${paciente.id_persona}`);
    await db.close();
    onSaved(form);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Editar datos personales</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onClose}>Cerrar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={form.nombre} onIonChange={e => handleChange("nombre", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Apellido</IonLabel>
          <IonInput value={form.apellido} onIonChange={e => handleChange("apellido", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput value={form.documento} onIonChange={e => handleChange("documento", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Fecha de nacimiento</IonLabel>
          <IonDatetime
            presentation="date"
            value={form.fecha_nacimiento}
            onIonChange={e => handleChange("fecha_nacimiento", e.detail.value!)}
          />
        </IonItem>
        <IonButton expand="block" className="ion-margin-top" onClick={save}>Guardar</IonButton>
      </IonContent>
    </IonModal>
  );
};

export default EditPersonaModal;
