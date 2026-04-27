import {
  IonAlert,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
} from "@ionic/react";
import { Network } from "@capacitor/network";
import { useEffect, useRef, useState } from "react";
import * as CryptoJS from "crypto-js";
import { sqlite } from "../App";
import { UsuariosRepo } from "../repository/UsuariosRepo";
import { Usuarios } from "../models/Usuarios";
import { NOMBRE_BB_DD } from "../utils/constantes";
import { CargarBase, CargarBaseProgress } from "../data/CargarBase";
import SyncProgressModal, {
  SyncProgressView,
} from "../components/SyncProgressModal";

const Home: React.FC = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [incorretPass, setincorretPass] = useState<boolean>(false);
  const [usuario, setUsuario] = useState<Usuarios>();
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [importError, setImportError] = useState<string | null>(null);
  const hasCheckedInitialImport = useRef(false);

  const [syncProgress, setSyncProgress] = useState<SyncProgressView>({
    isOpen: false,
    title: "Sincronizando datos",
    subtitle: "No cierres la aplicación",
    status: "idle",
    canClose: true,
  });

  const usuariosRepo = new UsuariosRepo();

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    console.log("Network status:", status);
  };

  const formatImportProgress = (
    progress: CargarBaseProgress,
    title: string
  ): SyncProgressView => {
    const tableSummaries =
      progress.tableNames?.map((name) => ({
        name,
        count: 0,
      })) ?? [];

    let phase = "Sincronizando";
    if (progress.phase === "preparing") phase = "Preparando";
    if (progress.phase === "downloading") phase = "Descargando";
    if (progress.phase === "received") phase = "Paquete recibido";
    if (progress.phase === "importing") phase = "Importando";
    if (progress.phase === "finalizing") phase = "Finalizando";
    if (progress.phase === "done") phase = "Completado";
    if (progress.phase === "error") phase = "Error";

    const progressValue =
      progress.downloadedBytes && progress.totalBytes
        ? progress.downloadedBytes / progress.totalBytes
        : null;

    return {
      isOpen: true,
      title,
      subtitle: "No cierres la aplicación",
      phase,
      detail: progress.message,
      progress: progressValue,
      loadedBytes: progress.downloadedBytes,
      totalBytes: progress.totalBytes,
      status:
        progress.phase === "done"
          ? "success"
          : progress.phase === "error"
            ? "error"
            : "running",
      canClose: progress.phase === "done" || progress.phase === "error",
      tableSummaries: (progress as any).tableSummaries ?? tableSummaries,
      processedItems: (progress as any).processedItems ?? 0,
      totalItems: (progress as any).totalItems ?? progress.tableCount,
    };
  };

  const runImport = async (mode: "full" | "partial", title: string) => {
    setImportError(null);
    setLoadingImport(true);
    setSyncProgress({
      isOpen: true,
      title,
      subtitle: "No cierres la aplicación",
      phase: "Preparando",
      detail:
        mode === "full"
          ? "Preparando importación completa..."
          : "Preparando importación parcial...",
      status: "running",
      canClose: false,
      progress: null,
    });

    try {
      await CargarBase({
        mode,
        timeoutMs: mode === "full" ? 0 : 60000,
        onProgress: (progress) => {
          setSyncProgress(formatImportProgress(progress, title));
        },
      });

      setSyncProgress((prev) => ({
        ...prev,
        isOpen: true,
        phase: "Completado",
        detail: "Importación finalizada correctamente.",
        status: "success",
        canClose: true,
        progress: 1,
      }));
    } catch (error: any) {
      const message =
        error?.message || "No se pudo completar la importación.";

      setImportError(message);
      setSyncProgress((prev) => ({
        ...prev,
        isOpen: true,
        phase: "Error",
        detail: message,
        status: "error",
        canClose: true,
      }));
    } finally {
      setLoadingImport(false);
    }
  };

  const initialImportIfNeeded = async () => {
    if (hasCheckedInitialImport.current) return;
    hasCheckedInitialImport.current = true;

    try {
      const existeActual: any = await sqlite.isDatabase(NOMBRE_BB_DD);

      if (!existeActual.result) {
        await runImport("full", "Importación inicial");
      }
    } catch (error) {
      console.error("No se pudo verificar la base local:", error);
    }
  };

  const handleManualImport = async () => {
    try {
      console.log("Home: Iniciando reimportación manual full...");

      // IMPORTANTE:
      // No borramos la base acá. El borrado real queda centralizado en CargarBase({ mode: "full" }).
      await runImport("full", "Reimportación completa");
    } catch (error: any) {
      setImportError(error?.message || "No se pudo iniciar la importación.");
    }
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const currentUsuario = await usuariosRepo.getUsuarioByNombre(name);
    const hashedInputPassword = CryptoJS.MD5(password).toString();

    if (hashedInputPassword === currentUsuario[0]?.password) {
      setincorretPass(false);
      setUsuario(currentUsuario[0]);
      sessionStorage.setItem("currenUser", JSON.stringify(currentUsuario[0]));
      window.location.reload();
    } else {
      setincorretPass(true);
    }
  };

  useEffect(() => {
    logCurrentNetworkStatus();
    void initialImportIfNeeded();
  }, []);

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
              />
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
              />
            </IonItem>

            <IonButton expand="full" color="primary" type="submit">
              Iniciar sesión
            </IonButton>

            <IonButton
              onClick={() => void handleManualImport()}
              expand="full"
              color="primary"
              className="button_css"
              disabled={loadindImport}
            >
              {loadindImport ? "Importando..." : "Importar"}
            </IonButton>

            <IonNote color="medium">
              Se realizará una importación completa de la base de datos sincronizada.
            </IonNote>
          </form>

          <IonAlert
            isOpen={incorretPass}
            onDidDismiss={() => setincorretPass(false)}
            header="Alerta"
            subHeader="Mensaje importante"
            message="Tu contraseña es incorrecta."
            buttons={["OK"]}
          />

          <IonAlert
            isOpen={!!importError}
            onDidDismiss={() => setImportError(null)}
            header="Error de importación"
            message={importError || ""}
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
