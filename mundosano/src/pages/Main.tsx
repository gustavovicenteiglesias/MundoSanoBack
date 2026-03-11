import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonRow,
  useIonViewWillEnter,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { downloadOutline } from "ionicons/icons";
import React from "react";
import moment from "moment";
import axios from "axios";
import logoAdesar from "../assest/adesar.png";
import logoUnsada from "../assest/unsada.png";
import logoMundoSano from "../assest/mundosano.png";
import { sqlite, existingConn, db } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { CargarBase } from "../data/CargarBase";
import { Network } from "@capacitor/network";
import { NOMBRE_BB_DD, BASE_URL } from "../utils/constantes";
import { useHistory } from "react-router";

const Main: React.FC<any> = () => {
  const [fechaActualizacion, setFechadeActualizacion] = useState<any>();
  const [hiddenFecha, sethiddenFecha] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [colorLogo, setColorLogo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [hayInternet, setHayInternet] = useState<boolean>(true);
  const [hayExport,setHayExport] = useState<boolean>(false);
  const history = useHistory();

  const unsubscribe = Network.addListener("networkStatusChange", (status) => {
    console.log("Network status changed", status);
    if (status.connected) {
      setHayInternet(true);
    } else {
      setHayInternet(false);
    }
  
    // Desuscribirse después de la primera ejecución
    unsubscribe.remove();
  });

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    if (status.connected) {
      setHayInternet(true);
    } else {
      setHayInternet(false);
    }
    console.log("Network status:", status);
  };

  useIonViewWillEnter(() => {
    logCurrentNetworkStatus();
  }, []);

  const dbdb = async (): Promise<SQLiteDBConnection> => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
    console.log(ret)
    console.log(isConn)
    
    if (ret.result && isConn) {
        
      return  await sqlite.retrieveConnection(NOMBRE_BB_DD);
    } else {
      return  await sqlite.createConnection(NOMBRE_BB_DD);
    }
  };
 
  useIonViewWillEnter(() => {
    const datosaexportar = async() => {
    console.log("antes del error")
      const db = await dbdb();
      console.log("despues del error")
      await db.open();
      db.exportToJson("partial")
      .then(async(resp)=>{
        console.log(resp);
        await db.close();
        setHayExport(false)
        return true
      })
      .catch(async(error) => {
        console.log(error);
        await db.close();
        setHayExport(true)
        return false
      })
    }
      
   datosaexportar()
  }, []);

  const exportJson = async () => {
    try {
      const db = await dbdb();

      await db.open();
      let horasync=await db.getSyncDate()
      console.log("horassync",horasync)
      let res: any = await db.exportToJson("partial");
      if (res.export) {
        console.log("existen datos a exportar ");
        // Creamos un objeto Date con el tiempo Unix, multiplicándolo por 1000 para convertirlo a milisegundos
        let resp: any = await db.query(
          "SELECT * FROM sync_table ORDER BY id DESC LIMIT 1"
        );

        const date = new Date(Number(resp.values[0].sync_date) * 1000);

        // Usamos los métodos de Date para obtener el año, mes y día en formato "YYYY-MM-DD"
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        // Unimos las partes para formar la fecha en formato "YYYY-MM-DD"
        const formattedDate = `${year}-${month}-${day}`;
        setData(res.export);
        setFechadeActualizacion(formattedDate);
        sethiddenFecha(true);
      }

      // setPaises(JSON.parse(res.values) )
      db.close();

      return true;
    } catch (error: any) {
      return false;
    }
  };

  const exportJsontoApi = async () => {
    const db = await dbdb();
    setLoading(true);
    axios.post(BASE_URL + "/sqlite", data).then(async (resp) => {
      console.log(resp);
      setLoading(false);
      
      if (resp.data.success) {
        setHayExport(true)
        await db.open();
        const d = new Date();
        const de = Math.floor(new Date().getTime() / 1000);
        await db.setSyncDate(d.toISOString());
        await db.close();

        const datos = {
          id: 0,
          syncDate: de,
        };

        console.log(`fecha ${de}`);
        axios.post(BASE_URL + "/sync_date", datos);
        setColorLogo(true);
      } else {
        setColorLogo(false);
      }
    });
  };

  // Función genérica para combinar los valores de los arrays con las interfaces
  function combinarValores<T extends object>(
    interfaz: T,
    arrays: any[][]
  ): T[] {
    return arrays.map((elemento) => {
      const objeto = {} as T;
      Object.keys(interfaz).forEach((prop, index) => {
        objeto[prop as keyof T] = elemento[index];
      });
      return objeto;
    });
  }

  const nuevaBBDD = async () => {
    const db = await dbdb();
    await db.open();
    let hasData = false;
    try {
      const pending = await db.exportToJson("partial");
      hasData = !!pending?.export?.tables?.some((t: any) => Array.isArray(t.values) && t.values.length > 0);
    } catch (err:any) {
      // si no hay datos o export lanza "Object is empty" lo tratamos como base vacía
      const msg = (err?.message || "").toLowerCase();
      if (!msg.includes("object is empty")) {
        await db.close();
        alert("No se pudo verificar datos locales: " + err);
        return;
      }
      hasData = false;
    }
    if (hasData) {
      await db.close();
      alert("No se puede importar: hay datos locales sin exportar.");
      return;
    }
    let borrar: any = await db.delete();
    console.log("se borro");
    let existe: any = await sqlite.isDatabase(NOMBRE_BB_DD);
    console.log(`Existe ${JSON.stringify(existe)}`);

    if (!existe.result) {
      setLoadingImport(true);
      console.log("CARGAR BASE NUEVA RRRRRRRRRR");
      const rescargar = await CargarBase().then((resp) => { 
        setLoadingImport(false);
      });
    }
    await db.close();
  };
  const continuar = () => {
    history.push("/personas");
  };
  return (
    <IonPage>
      <IonContent className="content-border">
        <IonGrid className="ion-align-items-center">
          <IonRow>
            <IonCol
              className="col_logos"
              sizeSm="12"
              sizeXs="12"
              sizeLg="4"
              sizeXl="4"
            >
              <img src={logoAdesar}></img>
            </IonCol>
            <IonCol
              className="col_logos"
              sizeSm="12"
              sizeXs="12"
              sizeLg="4"
              sizeXl="4"
            >
              <img src={logoUnsada}></img>
            </IonCol>
            <IonCol
              className="col_logos"
              sizeSm="12"
              sizeXs="12"
              sizeLg="4"
              sizeXl="4"
            >
              <img src={logoMundoSano}></img>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <div className="content-div"></div>
              <IonButton
                expand="block"
                onClick={continuar}
                color="secondary"
                className="button_css"
              >
                Continuar
              </IonButton>
              {hayInternet && (
                <IonButton
                  onClick={() => exportJson()}
                  expand="block"
                  color="secondary"
                  className="button_css"
                >
                  Exportar
                </IonButton>
              )}
              {/*<IonButton onClick={() => importJson()} expand='block' color="secondary" className='button_css'>Importar</IonButton>*/}
              {hayExport && hayInternet && (
                <IonButton
                  onClick={() => nuevaBBDD()}
                  expand="block"
                  color="secondary"
                  className="button_css"
                  disabled={loadindImport}
                >
                  {loadindImport ? "Importando" : "Importar"}
                </IonButton>
              )}
              {hiddenFecha && (
                <IonItem onClick={() => exportJsontoApi()}>
                  <IonLabel className="ion-text-wrap">
                    Tu ultima actualizacíon es del dia{" "}
                    {moment(fechaActualizacion).format("YYYY-MM-DD")}
                  </IonLabel>

                  {!loading && (
                    <IonIcon
                      icon={downloadOutline}
                      color={colorLogo ? "success" : "danger"}
                    ></IonIcon>
                  )}
                </IonItem>
              )}
              <IonLoading
                message="Por favor esperar a que termine..."
                isOpen={loading}
              />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Main;
