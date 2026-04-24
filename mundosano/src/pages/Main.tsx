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
import { downloadOutline } from "ionicons/icons";
import React from "react";
import moment from "moment";
import axios from "axios";
import logoAdesar from "../assest/adesar.png";
import logoUnsada from "../assest/unsada.png";
import logoMundoSano from "../assest/mundosano.png";
import { sqlite } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { CargarBase } from "../data/CargarBase";
import { Network } from "@capacitor/network";
import { Device } from "@capacitor/device";
import { NOMBRE_BB_DD, BASE_URL } from "../utils/constantes";
import { useHistory } from "react-router";
import {
  enrichPartialExportWithAncestors,
  JsonExportPayload,
  SyncMeta,
  SYNCABLE_TABLES,
} from "../utils/exportWithDependencies";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";
import { SyncItemLogLocalRepo } from "../repository/syncItemLogLocalRepo";
import { SyncItemLogLocal } from "../models/SyncItemLogLocal";
import SyncProgressModal, {
  SyncProgressView,
  SyncTableSummary,
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

  const nowUnix = () => Math.floor(Date.now() / 1000);

  // CHEQUEO LIVIANO: Solo cuenta registros, no dispara el export de la librería
  const checkPendingRecords = async (db: SQLiteDBConnection) => {
    try {
      const respDate: any = await db.query("SELECT sync_date FROM sync_table LIMIT 1");
      const lastSyncDate = respDate?.values?.[0]?.sync_date || "0";

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

      const lastSyncRecord = localStorage.getItem(LAST_SYNC_RESULT_KEY);

      // Si no hay pendientes, ocultamos barra y permitimos importar
      if (!hasPending) {
        sethiddenFecha(false);
        setHayExport(true);
      } else {
        setHayExport(!!lastSyncRecord); // Solo permite importar si ya sincronizó con éxito antes
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
    let de = 0;
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
        de = resp.data.server_unix_time || nowUnix();

        // 1. Sync Date remoto
        await axios.post(BASE_URL + "/sync_date", { id: 0, syncDate: de, deviceId: deviceInfo.model });

        // 2. Sync Date local en formato ISO para la librería
        const isoSyncDate = new Date(de * 1000).toISOString();
        await db.setSyncDate(isoSyncDate);

        // 3. UI
        setColorLogo(true); // VERDE
        setHayExport(true); // APARECE IMPORTAR
        presentToast({ message: "Exportación exitosa", duration: 2500, color: "success" });
      }
    } catch (error) {
      setColorLogo(false);
      setSyncProgress(p => ({ ...p, status: "error", canClose: true }));
    } finally {
      await safeCloseDb(db);
    }

    if (exportConfirmed) {
      const errorPersonIds = Array.from(new Set(syncLogs.map((item: any) => Number(item?.idPersona)).filter(v => Number.isFinite(v))));
      localStorage.setItem(LAST_SYNC_RESULT_KEY, JSON.stringify({ ts: new Date().toISOString(), errorPersonIds }));
      setTimeout(() => {
        setSyncProgress(p => ({ ...p, isOpen: false }));
        refreshPendingState();
      }, 1500);
    }
  };

  const nuevaBBDD = async () => {
    setLoadingImport(true);
    try {
      const mode = (await sqlite.isDatabase(NOMBRE_BB_DD)).result ? "partial" : "full";
      await CargarBase({ mode, timeoutMs: 60000, onProgress: () => { } });
      localStorage.removeItem(LAST_SYNC_RESULT_KEY);
      await refreshPendingState();
    } catch (e) {
      presentToast({ message: "Error al importar", color: "danger" });
    } finally { setLoadingImport(false); }
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
                <IonItem onClick={exportJsontoApi} button detail={false}>
                  <IonLabel className="ion-text-wrap">Última actualización: {fechaActualizacion}</IonLabel>
                  <IonIcon icon={downloadOutline} color={colorLogo ? "success" : "danger"} />
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