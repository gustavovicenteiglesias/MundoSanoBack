import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

//import "./Home.css";

import { Network } from "@capacitor/network";
import { UsuariosRepo } from "../repository/UsuariosRepo";
import { useEffect, useState } from "react";
import { Repository } from "../repository/Repository";
import { Usuarios } from "../models/Usuarios";
import { IdSegunDevice } from "../models/IdSegunDevice";

import { get, post } from "../service/Apiservice";
import * as CryptoJS from "crypto-js";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { sqlite } from "../App";
import { NOMBRE_BB_DD } from "../utils/constantes";
import { CargarBase } from "../data/CargarBase";
import SyncProgressModal, { SyncProgressView } from "../components/SyncProgressModal";

const Home: React.FC = () => {
  var idDevice: string;
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [incorretPass, setincorretPass] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<Usuarios>();
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<SyncProgressView>({
    isOpen: false,
    title: "Sincronizando datos",
    subtitle: "No cierres la aplicación",
    status: "idle",
    canClose: true,
  });

  const usuariosRepo = new UsuariosRepo();
  const devicerepository = new Repository<IdSegunDevice>("idsegundevice");

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    console.log("Network status:", status);
  };
  const handleLogin = async (e: any) => {
    e.preventDefault();
    const currentUsuario = await usuariosRepo.getUsuarioByNombre(name);
    console.log("Usuario " + JSON.stringify(currentUsuario[0]));
    const hashedInputPassword = CryptoJS.MD5(password).toString();
    if (hashedInputPassword === currentUsuario[0]?.password) {
      setincorretPass(false);
      setUsuario(currentUsuario[0]);
      sessionStorage.setItem("currenUser", JSON.stringify(currentUsuario[0]));

      console.log("contraseña correcta ");
      window.location.reload();
    } else {
      setincorretPass(true);
      console.log("contraseña incorrecta ");
    }
  };

  useEffect(() => {
    logCurrentNetworkStatus();
  }, []);
  const dbdb = async (): Promise<SQLiteDBConnection> => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
    console.log(ret);
    console.log(isConn);

    if (ret.result && isConn) {
      return await sqlite.retrieveConnection(NOMBRE_BB_DD);
    } else {
      return await sqlite.createConnection(NOMBRE_BB_DD);
    }
  };
  const nuevaBBDD = async () => {
    const existeActual: any = await sqlite.isDatabase(NOMBRE_BB_DD);
    if (existeActual.result) {
      setLoadingImport(true);
      setSyncProgress({
        isOpen: true,
        title: "Importación completa",
        subtitle: "Recargando datos base del servidor",
        status: "running",
        canClose: false,
      });
      await CargarBase({
        mode: "full",
        timeoutMs: 0,
        onProgress: (p) => {
          setSyncProgress((prev) => ({
            ...prev,
            phase: phaseLabel(p.phase),
            detail: p.currentTable
              ? `${p.message}: ${p.currentTable} (${p.rowsInTable ?? 0} filas)`
              : p.message,
            progress: p.progress,
            loadedBytes: p.loadedBytes,
            totalBytes: p.totalBytes,
            status: p.phase === "done" ? "success" : p.phase === "error" ? "error" : "running",
            canClose: p.phase === "done" || p.phase === "error",
          }));
        },
      }).finally(() => setLoadingImport(false));
      return;
    }

    const db = await dbdb();
    await db.open();
    let hasData = false;
    try {
      const pending = await db.exportToJson("partial");
      hasData = !!pending?.export?.tables?.some((t: any) => Array.isArray(t.values) && t.values.length > 0);
    } catch (err:any) {
      const msg = (err?.message || "").toLowerCase();
      if (!msg.includes("object is empty") && !msg.includes("table's names failed")) {
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
      setSyncProgress({
        isOpen: true,
        title: "Importación completa",
        subtitle: "Primera carga: puede demorar varios minutos",
        status: "running",
        canClose: false,
      });
      await CargarBase({
        mode: "full",
        timeoutMs: 0,
        onProgress: (p) => {
          setSyncProgress((prev) => ({
            ...prev,
            phase: phaseLabel(p.phase),
            detail: p.error
              ? `${p.message} ${p.error}`
              : p.currentTable
                ? `${p.message}: ${p.currentTable} (${p.rowsInTable ?? 0} filas)`
                : p.message,
            progress: p.progress,
            loadedBytes: p.loadedBytes,
            totalBytes: p.totalBytes,
            status: p.phase === "done" ? "success" : p.phase === "error" ? "error" : "running",
            canClose: p.phase === "done" || p.phase === "error",
          }));
        },
      }).finally(() => setLoadingImport(false));
    }
    await db.close();
  };

  const phaseLabel = (phase?: string): string => {
    if (phase === "starting") return "Preparando";
    if (phase === "downloading") return "Descargando";
    if (phase === "importing") return "Importando";
    if (phase === "finalizing") return "Finalizando";
    if (phase === "done") return "Completado";
    if (phase === "error") return "Error";
    return "Sincronizando";
  };

  return (
    <IonPage>
      <IonContent className="ion-padding" fullscreen>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2>Iniciar sesión</h2>
          <form onSubmit={(e) => handleLogin(e)} method="post">
            <IonItem>
              <IonLabel position="floating">Usuario</IonLabel>
              <IonInput
                required
                value={name}
                placeholder="Nombre"
                onIonChange={(e) => setName(e.detail.value!)}
                color="primary"
                style={{ marginBottom: "10px" }}
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonLabel position="floating">Contraseña</IonLabel>
              <IonInput
                required
                value={password}
                placeholder="Contraseña"
                type="password"
                onIonChange={(e) => setPassword(e.detail.value!)}
                color="primary"
                style={{ marginBottom: "10px" }}
              ></IonInput>
            </IonItem>

            <IonButton expand="full" color="primary" type="submit">
              Iniciar sesión
            </IonButton>
            <IonButton
              onClick={() => nuevaBBDD()}
              expand="full"
              color="primary"
              className="button_css"
              disabled={loadindImport}
            >
              {loadindImport ? "Importando" : "Importar"}
            </IonButton>
          </form>
          <IonAlert
            isOpen={incorretPass}
            onDidDismiss={() => setincorretPass(false)}
            header="Alerta"
            subHeader="Mensaje importante"
            message="tu contraseña es incorrecta!"
            buttons={["OK"]}
          />
          <SyncProgressModal
            state={syncProgress}
            onClose={() => setSyncProgress((prev) => ({ ...prev, isOpen: false }))}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
