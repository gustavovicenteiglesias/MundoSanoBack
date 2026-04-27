import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  useIonViewWillEnter,
  useIonToast,
} from "@ionic/react";
import { useState } from "react";
import { downloadOutline, checkmarkCircle } from "ionicons/icons";
import React from "react";
import moment from "moment";
import axios from "axios";
import logoAdesar from "../assest/adesar.png";
import logoUnsada from "../assest/unsada.png";
import logoMundoSano from "../assest/mundosano.png";
import { sqlite } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { CargarBase, CargarBaseProgress } from "../data/CargarBase";
import { Network } from "@capacitor/network";
import { Device } from "@capacitor/device";
import { NOMBRE_BB_DD, BASE_URL } from "../utils/constantes";
import { useHistory } from "react-router";
import {
  enrichPartialExportWithAncestors,
  SYNCABLE_TABLES,
} from "../utils/exportWithDependencies";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";
import { SyncItemLogLocalRepo } from "../repository/syncItemLogLocalRepo";
import SyncProgressModal, {
  SyncProgressView,
} from "../components/SyncProgressModal";

const LAST_SYNC_RESULT_KEY = "sync_last_result_v1";
const syncBatchLocalRepo = new SyncBatchLogLocalRepo();
const syncItemLocalRepo = new SyncItemLogLocalRepo();

const Main: React.FC<any> = () => {
  const [fechaActualizacion, setFechadeActualizacion] = useState<any>();
  const [hiddenFecha, sethiddenFecha] = useState<boolean>(false);
  const [colorLogo, setColorLogo] = useState<boolean>(false);
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [hayInternet, setHayInternet] = useState<boolean>(true);
  const [hayExport, setHayExport] = useState<boolean>(false);

  const [syncProgress, setSyncProgress] = useState<SyncProgressView>({
    isOpen: false,
    title: "Sincronizando datos",
    subtitle: "No cierres la aplicación",
    status: "idle",
    canClose: true,
  });

  const history = useHistory();
  const [presentToast] = useIonToast();

  const dbdb = async (): Promise<SQLiteDBConnection> => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
    return (ret.result && isConn) ? await sqlite.retrieveConnection(NOMBRE_BB_DD) : await sqlite.createConnection(NOMBRE_BB_DD);
  };

  const safeCloseDb = async (db?: SQLiteDBConnection | null) => {
    try { if (db) await db.close(); } catch { }
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

  // CHEQUEO LIVIANO: Solo cuenta registros, no dispara el export de la librería
  const checkPendingRecords = async (db: SQLiteDBConnection) => {
    try {
      const respDate: any = await db.query("SELECT sync_date FROM sync_table LIMIT 1");
      const rawSyncDate = respDate?.values?.[0]?.sync_date;
      let lastSyncDate = 0;
      if (typeof rawSyncDate === 'number') {
        lastSyncDate = rawSyncDate;
      } else if (typeof rawSyncDate === 'string') {
        if (rawSyncDate.includes('T')) {
          const ms = Date.parse(rawSyncDate);
          lastSyncDate = isNaN(ms) ? 0 : Math.floor(ms / 1000);
        } else {
          lastSyncDate = parseFloat(rawSyncDate) || 0;
        }
      }
      const tablas = Array.from(SYNCABLE_TABLES);
      for (const tabla of tablas) {
        const res: any = await db.query(`SELECT count(*) as count FROM ${tabla} WHERE last_modified > ?`, [lastSyncDate]);
        if (res?.values?.[0]?.count > 0) return true;
      }
      return false;
    } catch { return false; }
  };

  const refreshPendingState = async () => {
    let db: SQLiteDBConnection | null = null;
    try {
      db = await dbdb(); await db.open();
      const hasPending = await checkPendingRecords(db);

      // REGLA DE ORO: Si hay cambios locales, OCULTAMOS Importar y ponemos icono en Rojo
      if (hasPending) {
        sethiddenFecha(true); // Mostramos el ítem de "Última actualización" para ver el icono
        setHayExport(false);  // OCULTAMOS botón de Importar
        setColorLogo(false);  // Icono en ROJO
      } else {
        sethiddenFecha(true);
        setHayExport(true);   // MOSTRAR botón de Importar
        setColorLogo(true);   // Icono en VERDE (base sincronizada)
      }

      const resp: any = await db.query("SELECT * FROM sync_table LIMIT 1");
      const rawText = String(resp?.values?.[0]?.sync_date || "").trim();
      const timestamp = /^\d+$/.test(rawText) ? Number(rawText) * 1000 : new Date(rawText).getTime();
      setFechadeActualizacion(moment(timestamp).format("YYYY-MM-DD"));
    } catch (error) { console.error(error); } finally { await safeCloseDb(db); }
  };

  useIonViewWillEnter(() => {
    Network.getStatus().then(s => setHayInternet(s.connected));
    refreshPendingState();
  }, []);

  const prepareExport = async () => {
    let db: SQLiteDBConnection | null = null;
    try {
      db = await dbdb(); await db.open();
      const hasPending = await checkPendingRecords(db);
      if (!hasPending) {
        sethiddenFecha(false);
        setHayExport(true);
        presentToast({ message: "Nada para exportar.", duration: 2000, color: "success" });
        return;
      }
      sethiddenFecha(true);
      setColorLogo(false); // Rojo inicial
    } catch { } finally { await safeCloseDb(db); }
  };

  const exportJsontoApi = async () => {
    let db: SQLiteDBConnection | null = null;
    let exportConfirmed = false;
    let syncBatchId = "";
    let rechazados = 0;
    let conflictos = 0;
    let syncLogs: any[] = [];

    try {
      db = await dbdb(); await db.open();

      // DISPARAMOS EL EXPORT REAL
      const exported: any = await db.exportToJson("partial");
      const payload = exported?.export;

      if (!payload || !payload.tables || payload.tables.length === 0) {
        sethiddenFecha(false);
        return;
      }

      const enrichedPayload = await enrichPartialExportWithAncestors(db, payload);
      const currentUser = JSON.parse(sessionStorage.getItem("currenUser") || "null");
      const deviceInfo = await Device.getInfo();

      const syncMeta = {
        syncBatchId: `sync-${Date.now()}`,
        usuario: currentUser?.usuario,
        dispositivo: deviceInfo.model,
        versionApp: "3.0",
        fechaInicio: new Date().toISOString()
      };
      syncBatchId = syncMeta.syncBatchId;

      setSyncProgress({ isOpen: true, title: "Exportando", subtitle: "Sincronizando...", phase: "Sync", detail: "Enviando datos...", status: "running", canClose: false });

      const resp = await axios.post(BASE_URL + "/sqlite", { ...enrichedPayload, syncMeta });

      if (resp.data.success) {
        exportConfirmed = true;
        rechazados = resp.data.rechazados || 0;
        conflictos = resp.data.conflictosLastModified || 0;
        syncLogs = resp.data.logs || [];

        // PERSISTIR EN HISTORIAL LOCAL
        try {
          const okCount = (resp.data.laboratoriosGuardados || 0) +
            (resp.data.controlesGuardados || 0) +
            (resp.data.personasGuardadas || 0) +
            (resp.data.controlEmbarazoGuardados || 0) +
            (resp.data.inmunizacionesGuardadas || 0);

          const totalItems = okCount + rechazados;

          // 1. Iniciamos el batch
          await syncBatchLocalRepo.createBatch(syncMeta, totalItems);

          // 2. Insertamos los items de error
          if (syncLogs.length > 0) {
            const items: any[] = syncLogs.map(log => ({
              sync_batch_id: syncBatchId,
              tabla: log.tabla,
              uuid: Array.isArray(log.payload) ? log.payload[0] : null,
              id_persona: log.idPersona,
              id_control: log.idControl,
              id_referencia: log.idReferencia,
              estado: "RECHAZADO",
              motivo: log.motivo,
              payload_json: JSON.stringify(log.payload),
              created_at: new Date().toISOString()
            }));
            await syncItemLocalRepo.insertMany(items);
          }

          // 3. Finalizamos el batch con el resultado real
          await syncBatchLocalRepo.finishBatch({
            syncBatchId,
            estado: rechazados > 0 ? "PARCIAL" : "OK",
            fechaFin: new Date().toISOString(),
            totalItems,
            okCount,
            rejectedCount: rechazados,
            conflictCount: conflictos,
            mensaje: resp.data.message
          });

        } catch (logPersistenceError) {
          console.warn("No se pudo guardar el historial local:", logPersistenceError);
        }

        // El uso de los Repositories arriba CIERRA la conexión a nivel nativo.
        // Pero nuestro objeto local 'db' cree que sigue abierta.
        // SOLUCIÓN: Pedir la ruta de base de datos desde cero y forzar apertura.
        try {
          db = await dbdb();
          await db.open();
        } catch (_openError) { }

        // Guardamos el tiempo EXACTO del servidor. Prevención extrema contra NaN.
        const rawTime = Number(resp.data?.server_unix_time);
        const serverTime = Number.isFinite(rawTime) && rawTime > 0
          ? rawTime
          : Math.floor(Date.now() / 1000);

        // 1. Sync Date remoto (Margen de seguridad solo para el parámetro 'since' del server)
        await axios.post(BASE_URL + "/sync_date", { id: 0, syncDate: serverTime - 300, deviceId: deviceInfo.model });

        // 2. Sync Date local: guardamos el tiempo oficial del servidor con un margen de +2s
        // para absorber registros que tengan timestamps idénticos o ligeramente superiores.
        // La librería de base de datos exige un ISOString explícito: yyyy-MM-dd'T'HH:mm:ss.SSSZ
        await db.setSyncDate(new Date((serverTime + 2) * 1000).toISOString());

        // 3. UI - ESTADO DE ÉXITO
        setColorLogo(true);
        setHayExport(true);

        setSyncProgress(p => ({
          ...p,
          status: "success",
          detail: "Exportación finalizada y confirmada por el servidor.",
          canClose: true
        }));

        presentToast({ message: "Exportación exitosa", duration: 2500, color: "success" });
      } else {
        throw new Error(resp.data.message || "El servidor rechazó la exportación.");
      }
    } catch (error: any) {
      console.error("Error en exportJsontoApi:", error);
      setColorLogo(false);
      setSyncProgress(p => ({
        ...p,
        status: "error",
        detail: error?.message || "Ocurrió un error al enviar los datos.",
        canClose: true
      }));
    } finally {
      await safeCloseDb(db);
    }

    if (exportConfirmed) {
      const errorPersonIds = Array.from(new Set(syncLogs.map((item: any) => Number(item?.idPersona)).filter(v => Number.isFinite(v))));
      localStorage.setItem(LAST_SYNC_RESULT_KEY, JSON.stringify({ ts: new Date().toISOString(), errorPersonIds }));

      // Solo cerramos el modal automáticamente si NO hubo error en el camino
      setTimeout(() => {
        setSyncProgress(p => {
          if (p.status === "success") return { ...p, isOpen: false };
          return p;
        });
        refreshPendingState();
      }, 2000);
    }
  };

  const nuevaBBDD = async () => {
    setLoadingImport(true);
    const title = "Importación de datos";

    setSyncProgress({
      isOpen: true,
      title,
      subtitle: "No cierres la aplicación",
      phase: "Iniciando",
      detail: "Preparando importación completa...",
      status: "running",
      canClose: false,
    });

    try {
      console.log("Main: Iniciando reimportación manual full...");

      // IMPORTANTE:
      // No borramos la base acá. El borrado real queda centralizado en CargarBase({ mode: "full" }).
      // Así Main no duplica el delete y CargarBase puede simular el estado de primera instalación.
      await CargarBase({
        mode: "full",
        timeoutMs: 0,
        onProgress: (progress) => {
          setSyncProgress(formatImportProgress(progress, title));
        },
      });

      localStorage.removeItem(LAST_SYNC_RESULT_KEY);
      await refreshPendingState();

      setSyncProgress((prev) => ({
        ...prev,
        phase: "Completado",
        detail: "Importación finalizada correctamente.",
        status: "success",
        canClose: true,
        progress: 1,
      }));
    } catch (e: any) {
      console.error("Error importando:", e);

      setSyncProgress((prev) => ({
        ...prev,
        phase: "Error",
        status: "error",
        detail: e?.message || "Error al importar los datos.",
        canClose: true,
      }));

      presentToast({
        message: "Error al importar",
        duration: 2500,
        color: "danger",
      });
    } finally {
      setLoadingImport(false);
    }
  };

  return (
    <IonPage>
      <IonContent className="content-border">
        <IonGrid className="ion-align-items-center">
          <IonRow>
            <IonCol className="col_logos"><img src={logoAdesar} /></IonCol>
            <IonCol className="col_logos"><img src={logoUnsada} /></IonCol>
            <IonCol className="col_logos"><img src={logoMundoSano} /></IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={() => history.push("/personas")} color="secondary" className="button_css">Continuar</IonButton>

              {hayInternet && (
                <IonButton onClick={prepareExport} expand="block" color="secondary" className="button_css">Exportar</IonButton>
              )}

              {hayExport && hayInternet && (
                <IonButton onClick={nuevaBBDD} expand="block" color="secondary" className="button_css" disabled={loadindImport}>
                  {loadindImport ? "Importando..." : "Importar"}
                </IonButton>
              )}

              {hiddenFecha && (
                <IonItem
                  onClick={!colorLogo ? exportJsontoApi : undefined}
                  button={!colorLogo}
                  detail={false}
                  className={colorLogo ? "sync-locked" : ""}
                  style={{ "--background": "transparent", opacity: 1 }}
                >
                  <IonLabel className="ion-text-wrap">
                    {colorLogo ? "Base de datos sincronizada" : `Última actualización: ${fechaActualizacion}`}
                  </IonLabel>
                  <IonIcon
                    icon={colorLogo ? checkmarkCircle : downloadOutline}
                    color={colorLogo ? "success" : "danger"}
                  />
                </IonItem>
              )}

              <IonButton expand="block" color="medium" className="button_css" onClick={() => history.push("/sync-history")}>Historial Sync</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        <SyncProgressModal state={syncProgress} onClose={() => setSyncProgress(p => ({ ...p, isOpen: false }))} />
      </IonContent>
    </IonPage>
  );
};

export default Main;