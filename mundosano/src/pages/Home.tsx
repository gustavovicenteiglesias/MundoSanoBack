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
  IonModal,
  IonNote,
  IonSpinner,
} from "@ionic/react";
import type { CargarBaseProgress } from "../data/CargarBase";

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
import SyncProgressModal, {
  SyncProgressView,
} from "../components/SyncProgressModal";

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

  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importProgress, setImportProgress] =
    useState<CargarBaseProgress | null>(null);

  const formatBytes = (value?: number) => {
    if (value === undefined || value === null) return "";
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(2)} MB`;
  };
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
    setShowImportConfirm(false);
    setImportError(null);
    setLoadingImport(true);
    setImportProgress({
      phase: "preparing",
      mode: "full",
      message: "Preparando importación de rescate...",
    });

    try {
      const existeActual: any = await sqlite.isDatabase(NOMBRE_BB_DD);

      if (existeActual.result) {
        try {
          const existing = await dbdb();
          try {
            await existing.open();
          } catch {}
          try {
            await existing.close();
          } catch {}
          await existing.delete();
        } catch (deleteError) {
          console.warn(
            "No se pudo borrar la base local anterior, se continúa con el rescate:",
            deleteError,
          );
        }
      }

      await CargarBase({
        mode: "full",
        timeoutMs: 0,
        onProgress: setImportProgress,
      });
    } catch (error: any) {
      console.error("Error importando base de rescate:", error);
      setImportError(
        error?.message || "No se pudo completar la importación de rescate.",
      );
    } finally {
      setLoadingImport(false);
    }
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
            <IonModal isOpen={loadindImport} backdropDismiss={false}>
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Importación de rescate</IonTitle>
                </IonToolbar>
              </IonHeader>

              <IonContent className="ion-padding">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "16px",
                  }}
                >
                  <IonSpinner name="crescent" />
                  <div>
                    <strong>{importProgress?.message || "Iniciando..."}</strong>

                    <div style={{ fontSize: "0.9rem", marginTop: "6px" }}>
                      Estado: {importProgress?.phase || "preparing"} | Modo:{" "}
                      {importProgress?.mode || "full"}
                    </div>

                    {importProgress?.downloadedBytes !== undefined && (
                      <div style={{ fontSize: "0.9rem", marginTop: "6px" }}>
                        Descargado:{" "}
                        {formatBytes(importProgress.downloadedBytes)}
                        {importProgress.totalBytes
                          ? ` / ${formatBytes(importProgress.totalBytes)}`
                          : ""}
                      </div>
                    )}

                    {typeof importProgress?.tableCount === "number" && (
                      <div style={{ fontSize: "0.9rem", marginTop: "6px" }}>
                        Tablas recibidas: {importProgress.tableCount}
                      </div>
                    )}
                  </div>
                </div>

                <div
                  style={{
                    maxHeight: "50vh",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  <strong>Tablas detectadas en el paquete:</strong>

                  {importProgress?.tableNames?.length ? (
                    <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
                      {importProgress.tableNames.map((name) => (
                        <li key={name}>{name}</li>
                      ))}
                    </ul>
                  ) : (
                    <div style={{ marginTop: "10px" }}>
                      <IonNote color="medium">
                        Todavía no llegaron las tablas desde el servidor.
                      </IonNote>
                    </div>
                  )}
                </div>
              </IonContent>
            </IonModal>

            <IonAlert
              isOpen={showImportConfirm}
              onDidDismiss={() => setShowImportConfirm(false)}
              header="Importación de rescate"
              message="Esta acción reemplaza la base local para recuperar usuarios y volver a ingresar al sistema. ¿Continuar?"
              buttons={[
                { text: "Cancelar", role: "cancel" },
                {
                  text: "Importar",
                  handler: () => {
                    void nuevaBBDD();
                  },
                },
              ]}
            />

            <IonAlert
              isOpen={!!importError}
              onDidDismiss={() => setImportError(null)}
              header="Error de importación"
              message={importError || ""}
              buttons={["OK"]}
            />
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
            onClose={() =>
              setSyncProgress((prev) => ({ ...prev, isOpen: false }))
            }
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
