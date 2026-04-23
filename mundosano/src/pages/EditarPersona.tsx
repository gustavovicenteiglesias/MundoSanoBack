import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToolbar, IonSelect, IonSelectOption, useIonToast } from "@ionic/react";
import { useHistory, useLocation } from "react-router";
import { useEffect, useState } from "react";
import moment from "moment";
import { getDb } from "../data/db";
import { animationBuilder } from "../components/AnimationBuilder";
import { PaisesRepo } from "../repository/paisesRepo";
import { AreasRepo } from "../repository/areasRepo";
import { ParajesRepo } from "../repository/parajesRepo";
import { Geolocation } from "@capacitor/geolocation";

const EditarPersona: React.FC = () => {
  const location = useLocation<any>();
  const history = useHistory();
  const [presentToast] = useIonToast();
  const paciente = location.state;

  const [form, setForm] = useState({
    nombre: paciente?.nombre || "",
    apellido: paciente?.apellido || "",
    documento: paciente?.documento || "",
    fecha_nacimiento: paciente?.fecha_nacimiento || "",
    id_pais: paciente?.ubicacion?.id_pais || "",
    id_area: paciente?.ubicacion?.id_area || "",
    id_paraje: paciente?.ubicacion?.id_paraje || "",
    num_vivienda: paciente?.ubicacion?.num_vivienda || "",
    georeferencia: paciente?.ubicacion?.georeferencia || ""
  });

  const [paises, setPaises] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [parajes, setParajes] = useState<any[]>([]);

  useEffect(() => {
    const loadCatalogos = async () => {
      const pr = new PaisesRepo();
      const ar = new AreasRepo();
      const pa = new ParajesRepo();
      setPaises(await pr.getAll());
      setAreas(await ar.getAll());
      setParajes(await pa.getAll());
    };
    loadCatalogos();
  }, []);

  const onChange = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const save = async () => {
    if (!form.id_pais || !form.id_area || !form.id_paraje) {
      presentToast({ message: "Debe seleccionar país, área y paraje", duration: 3000, color: "warning", position: "top" });
      return;
    }
    const db = await getDb();
    await db.open();
    const lastMod = Math.floor(Date.now() / 1000);
    await db.execute(`UPDATE personas SET nombre='${form.nombre}', apellido='${form.apellido}', documento='${form.documento}', fecha_nacimiento='${moment(form.fecha_nacimiento).format("YYYY-MM-DD")}', last_modified=${lastMod} WHERE id_persona=${paciente.id_persona}`);

    const ubic = await db.query(`SELECT * FROM ubicaciones WHERE id_persona=${paciente.id_persona} LIMIT 1`);
    if (ubic.values && ubic.values.length > 0) {
      const id_ubicacion = ubic.values[0].id_ubicacion;
      await db.execute(`UPDATE ubicaciones SET id_pais=${form.id_pais || 'NULL'}, id_area=${form.id_area || 'NULL'}, id_paraje=${form.id_paraje || 'NULL'}, num_vivienda='${form.num_vivienda || ''}', georeferencia='${form.georeferencia || ''}', last_modified=${Math.floor(Date.now()/1000)} WHERE id_ubicacion=${id_ubicacion}`);
    } else {
      await db.execute(`INSERT INTO ubicaciones (id_persona,id_paraje,id_area,num_vivienda,fecha,georeferencia,id_pais,sql_deleted,last_modified) VALUES (${paciente.id_persona}, ${form.id_paraje || 'NULL'}, ${form.id_area || 'NULL'}, '${form.num_vivienda || ''}', '${moment().format("YYYY-MM-DD")}', '${form.georeferencia || ''}', ${form.id_pais || 'NULL'}, 0, ${Math.floor(Date.now()/1000)})`);
    }
    await db.close();
    history.goBack();
  };

  const obtenerGeo = async () => {
    try {
      const perm = await Geolocation.checkPermissions();
      if (perm.location === "denied") {
        const req = await Geolocation.requestPermissions();
        if (req.location === "denied") return;
      }
      const pos = await Geolocation.getCurrentPosition();
      const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
      setForm(prev => ({ ...prev, georeferencia: coords }));
    } catch (e) {
      console.error("geo", e);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Editar Persona</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/detallePaciente" routerAnimation={animationBuilder}/>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={form.nombre} onIonChange={e => onChange("nombre", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Apellido</IonLabel>
          <IonInput value={form.apellido} onIonChange={e => onChange("apellido", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Documento</IonLabel>
          <IonInput value={form.documento} onIonChange={e => onChange("documento", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Fecha de nacimiento</IonLabel>
          <IonInput type="date" value={moment(form.fecha_nacimiento).format("YYYY-MM-DD")} onIonChange={e => onChange("fecha_nacimiento", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">País</IonLabel>
          <IonSelect interface="popover" value={form.id_pais} placeholder="Seleccione país" onIonChange={e => onChange("id_pais", e.detail.value!)}>
            {paises.map(p => <IonSelectOption key={p.id_pais} value={p.id_pais}>{p.nombre}</IonSelectOption>)}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Área</IonLabel>
          <IonSelect interface="popover" value={form.id_area} placeholder="Seleccione área" onIonChange={e => onChange("id_area", e.detail.value!)}>
            {areas.filter(a => !form.id_pais || a.id_pais === form.id_pais).map(a => <IonSelectOption key={a.id_area} value={a.id_area}>{a.nombre}</IonSelectOption>)}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Paraje</IonLabel>
          <IonSelect interface="popover" value={form.id_paraje} placeholder="Seleccione paraje" onIonChange={e => onChange("id_paraje", e.detail.value!)}>
            {parajes.filter(p => !form.id_area || p.id_area === form.id_area).map(p => <IonSelectOption key={p.id_paraje} value={p.id_paraje}>{p.nombre}</IonSelectOption>)}
          </IonSelect>
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Nro vivienda / referencia</IonLabel>
          <IonInput value={form.num_vivienda} onIonChange={e => onChange("num_vivienda", e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Geo referencia</IonLabel>
          <IonInput value={form.georeferencia} onIonChange={e => onChange("georeferencia", e.detail.value!)} />
        </IonItem>
        <IonButton expand="block" fill="outline" className="ion-margin-top" onClick={obtenerGeo}>Obtener ubicación</IonButton>

        <IonButton expand="block" className="ion-margin-top" onClick={save}>Guardar</IonButton>
      </IonContent>
    </IonPage>
  );
};

export default EditarPersona;
