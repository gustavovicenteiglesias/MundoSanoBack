import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonModal,
  IonNote,
  IonPage,
  IonRow,
  IonSpinner,
  useIonViewWillEnter,
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
} from "../utils/exportWithDependencies";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";
import { SyncItemLogLocalRepo } from "../repository/syncItemLogLocalRepo";
import { SyncItemLogLocal } from "../models/SyncItemLogLocal";

const LAST_SYNC_RESULT_KEY = "sync_last_result_v1";
const syncBatchLocalRepo = new SyncBatchLogLocalRepo();
const syncItemLocalRepo = new SyncItemLogLocalRepo();

type ExportTableSummary = {
  name: string;
  count: number;
};

type ExportModalState = {
  isOpen: boolean;
  phase: "idle" | "preparing" | "sending" | "finalizing" | "done" | "error";
  message: string;
  tableSummaries: ExportTableSummary[];
  totalRows: number;
  processedRows: number;
  error?: string | null;
};

const emptyExportModal = (): ExportModalState => ({
  isOpen: false,
  phase: "idle",
  message: "",
  tableSummaries: [],
  totalRows: 0,
  processedRows: 0,
  error: null,
});

const Main: React.FC<any> = () => {
  const [fechaActualizacion, setFechadeActualizacion] = useState<any>();
  const [hiddenFecha, sethiddenFecha] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [colorLogo, setColorLogo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [hayInternet, setHayInternet] = useState<boolean>(true);

  // OJO:
  // este estado historicamente controla si se puede IMPORTAR.
  // true  => no hay pendientes locales para exportar, se puede importar
  // false => hay pendientes para exportar, NO se debe importar
  const [hayExport, setHayExport] = useState<boolean>(false);

  const [hasPendingLocalExport, setHasPendingLocalExport] = useState<boolean>(false);
  const [pendingTables, setPendingTables] = useState<ExportTableSummary[]>([]);
  const [exportModal, setExportModal] = useState<ExportModalState>(emptyExportModal());

  const history = useHistory();

  const unsubscribe = Network.addListener("networkStatusChange", (status) => {
    if (status.connected) {
      setHayInternet(true);
    } else {
      setHayInternet(false);
    }
    unsubscribe.remove();
  });

  const logCurrentNetworkStatus = async () => {
    const status = await Network.getStatus();
    if (status.connected) {
      setHayInternet(true);
    } else {
      setHayInternet(false);
    }
  };

  useIonViewWillEnter(() => {
    logCurrentNetworkStatus();
  }, []);

  const dbdb = async (): Promise<SQLiteDBConnection> => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;

    if (ret.result && isConn) {
      return await sqlite.retrieveConnection(NOMBRE_BB_DD);
    } else {
      return await sqlite.createConnection(NOMBRE_BB_DD);
    }
  };

  const safeCloseDb = async (db?: SQLiteDBConnection | null) => {
    try {
      if (db) {
        await db.close();
      }
    } catch {}
  };

  const summarizePayloadTables = (payload?: JsonExportPayload | null): ExportTableSummary[] => {
    const tables = Array.isArray(payload?.tables) ? payload!.tables : [];
    return tables
      .map((table: any) => ({
        name: String(table?.name || "sin_nombre"),
        count: Array.isArray(table?.values) ? table.values.length : 0,
      }))
      .filter((item) => item.count > 0);
  };

  const getTotalRows = (summaries: ExportTableSummary[]) =>
    summaries.reduce((acc, item) => acc + item.count, 0);

  const getPendingExportInfo = async (db: SQLiteDBConnection) => {
    try {
      const exported: any = await db.exportToJson("partial");
      const payload: JsonExportPayload | undefined = exported?.export;
      const tableSummaries = summarizePayloadTables(payload);
      const hasPending = tableSummaries.length > 0;

      return {
        payload,
        tableSummaries,
        hasPending,
      };
    } catch (err: any) {
      const msg = String(err?.message || "").toLowerCase();

      // cuando no hay nada para exportar, este plugin suele tirar este caso
      if (msg.includes("object is empty")) {
        return {
          payload: null,
          tableSummaries: [],
          hasPending: false,
        };
      }

      throw err;
    }
  };

  const readLocalSyncDateLabel = async (db: SQLiteDBConnection) => {
    try {
      const resp: any = await db.query(
        "SELECT * FROM sync_table ORDER BY id DESC LIMIT 1"
      );

      const rawSyncDate = resp?.values?.[0]?.sync_date;

      if (rawSyncDate === undefined || rawSyncDate === null) {
        return moment().format("YYYY-MM-DD");
      }

      const rawText = String(rawSyncDate).trim();

      if (/^\d+$/.test(rawText)) {
        return moment(new Date(Number(rawText) * 1000)).format("YYYY-MM-DD");
      }

      const parsed = new Date(rawText);
      if (!isNaN(parsed.getTime())) {
        return moment(parsed).format("YYYY-MM-DD");
      }

      return moment().format("YYYY-MM-DD");
    } catch {
      return moment().format("YYYY-MM-DD");
    }
  };

  const refreshPendingState = async () => {
    let db: SQLiteDBConnection | null = null;

    try {
      db = await dbdb();
      await db.open();

      const info = await getPendingExportInfo(db);

      setHasPendingLocalExport(info.hasPending);
      setHayExport(!info.hasPending);

      if (!info.hasPending) {
        setPendingTables([]);
      }

      return info;
    } catch (error) {
      console.error("No se pudo refrescar estado de exportación:", error);
      return {
        payload: null,
        tableSummaries: [],
        hasPending: false,
      };
    } finally {
      await safeCloseDb(db);
    }
  };

  useIonViewWillEnter(() => {
    void refreshPendingState();
  }, []);

  const exportJson = async () => {
    let db: SQLiteDBConnection | null = null;

    try {
      db = await dbdb();
      await db.open();

      const info = await getPendingExportInfo(db);

      setHasPendingLocalExport(info.hasPending);
      setHayExport(!info.hasPending);

      if (!info.hasPending) {
        sethiddenFecha(false);
        setPendingTables([]);
        alert("No hay datos pendientes para exportar.");
        return false;
      }

      const formattedDate = await readLocalSyncDateLabel(db);

      setData(info.payload);
      setPendingTables(info.tableSummaries);
      setFechadeActualizacion(formattedDate);
      sethiddenFecha(true);

      // mientras haya pendientes, NO debe poder importar
      setHayExport(false);

      return true;
    } catch (_error: any) {
      alert("No se pudo preparar la exportación.");
      return false;
    } finally {
      await safeCloseDb(db);
    }
  };

  const exportJsontoApi = async () => {
    const db = await dbdb();
    setLoading(true);
    let syncMeta: SyncMeta | null = null;
    let exportServerOk = false;

    try {
      await db.open();

      const info = await getPendingExportInfo(db);

      if (!info.hasPending || !info.payload) {
        sethiddenFecha(false);
        setHayExport(true);
        setPendingTables([]);
        alert("No hay datos pendientes para exportar.");
        return;
      }

      const currentUserRaw = sessionStorage.getItem("currenUser");
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      const deviceInfo = await Device.getInfo();
      const appVersion =
        (deviceInfo as any).appVersion || (deviceInfo as any).osVersion || "unknown";

      syncMeta = {
        syncBatchId: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        usuario: currentUser?.usuario ?? null,
        dispositivo: `${deviceInfo.platform || "unknown"}-${deviceInfo.model || "unknown"}`,
        versionApp: appVersion,
        fechaInicio: new Date().toISOString(),
      };

      setExportModal({
        isOpen: true,
        phase: "preparing",
        message: "Preparando datos para exportar...",
        tableSummaries: info.tableSummaries,
        totalRows: getTotalRows(info.tableSummaries),
        processedRows: 0,
        error: null,
      });

      const enrichedPayload = await enrichPartialExportWithAncestors(db, info.payload);
      const enrichedSummaries = summarizePayloadTables(enrichedPayload);
      const totalItems = getTotalRows(enrichedSummaries);

      setExportModal({
        isOpen: true,
        phase: "sending",
        message: "Enviando lote al servidor...",
        tableSummaries: enrichedSummaries,
        totalRows: totalItems,
        processedRows: 0,
        error: null,
      });

      await syncBatchLocalRepo.createBatch(syncMeta, totalItems);

      const payloadWithMeta: JsonExportPayload = { ...enrichedPayload, syncMeta };
      const resp = await axios.post(BASE_URL + "/sqlite", payloadWithMeta);

      if (!resp.data.success) {
        setColorLogo(false);

        await syncBatchLocalRepo.finishBatch({
          syncBatchId: syncMeta.syncBatchId,
          estado: "ERROR",
          fechaFin: new Date().toISOString(),
          totalItems: 0,
          okCount: 0,
          rejectedCount: 0,
          conflictCount: 0,
          mensaje: "La API devolvió success=false.",
        });

        setExportModal({
          isOpen: true,
          phase: "error",
          message: "La API devolvió success=false.",
          tableSummaries: enrichedSummaries,
          totalRows: totalItems,
          processedRows: 0,
          error: "La API devolvió success=false.",
        });

        alert("La API devolvió success=false.");
        return;
      }

      exportServerOk = true;
      setData(payloadWithMeta);

      const de = Math.floor(Date.now() / 1000);

      setExportModal((prev) => ({
        ...prev,
        phase: "finalizing",
        message: "Cerrando sincronización local y remota...",
        processedRows: prev.totalRows,
      }));

      // Local SIEMPRE en unix
      try {
        await db.setSyncDate(String(de));
      } catch (localSyncErr) {
        console.error("No se pudo actualizar sync_date local:", localSyncErr);
      }

      // Intento remoto, pero no debe romper la exportación exitosa
      try {
        await axios.post(BASE_URL + "/sync_date", {
          id: 0,
          syncDate: de,
        });
      } catch (remoteSyncErr) {
        console.error("No se pudo informar sync_date al backend:", remoteSyncErr);
      }

      setColorLogo(true);

      const rechazados = Number(resp?.data?.rechazados ?? 0);
      const conflictos = Number(resp?.data?.conflictosLastModified ?? 0);
      const syncLogs: any[] = Array.isArray(resp?.data?.logs) ? resp.data.logs : [];
      const syncBatchId = String(resp?.data?.sync_batch_id || syncMeta?.syncBatchId || "");

      const itemLogs: SyncItemLogLocal[] = syncLogs.map((log: any) => ({
        sync_batch_id: syncBatchId,
        tabla: String(log?.tabla || "unknown"),
        uuid: null,
        id_persona: Number.isFinite(Number(log?.idPersona)) ? Number(log?.idPersona) : null,
        id_control: Number.isFinite(Number(log?.idControl)) ? Number(log?.idControl) : null,
        id_referencia: Number.isFinite(Number(log?.idReferencia)) ? Number(log?.idReferencia) : null,
        estado: "RECHAZADO",
        motivo: log?.motivo ? String(log.motivo) : null,
        payload_json: log?.payload ? JSON.stringify(log.payload) : null,
        created_at: new Date().toISOString(),
      }));

      if (conflictos > 0) {
        itemLogs.push({
          sync_batch_id: syncBatchId,
          tabla: "sync_summary",
          uuid: null,
          id_persona: null,
          id_control: null,
          id_referencia: null,
          estado: "CONFLICTO",
          motivo: `Conflictos last_modified: ${conflictos}`,
          payload_json: null,
          created_at: new Date().toISOString(),
        });
      }

      try {
        await syncItemLocalRepo.insertMany(itemLogs);
      } catch (itemLogErr) {
        console.error("No se pudieron guardar item logs locales:", itemLogErr);
      }

      try {
        await syncBatchLocalRepo.finishBatch({
          syncBatchId,
          estado: rechazosOConflictos(rechazados, conflictos) ? "PARCIAL" : "OK",
          fechaFin: new Date().toISOString(),
          totalItems,
          okCount: Math.max(0, totalItems - rechazados - conflictos),
          rejectedCount: rechazados,
          conflictCount: conflictos,
          mensaje: rechazosOConflictos(rechazados, conflictos)
            ? "Exportación completada con observaciones"
            : "Exportación completada correctamente",
        });
      } catch (batchErr) {
        console.error("No se pudo cerrar batch local:", batchErr);
      }

      const errorPersonIds = Array.from(
        new Set(
          syncLogs
            .map((item: any) => Number(item?.idPersona))
            .filter((value: number) => Number.isFinite(value))
        )
      );

      localStorage.setItem(
        LAST_SYNC_RESULT_KEY,
        JSON.stringify({
          ts: new Date().toISOString(),
          syncDateUnix: de,
          rechazados,
          conflictos,
          errorPersonIds,
        })
      );

      // Luego de exportar bien, recalcular pendientes reales
      const remaining = await getPendingExportInfo(db);
      setHasPendingLocalExport(remaining.hasPending);
      setHayExport(!remaining.hasPending);
      setPendingTables(remaining.tableSummaries);

      // Si no quedan pendientes, ocultar la fecha preview
      if (!remaining.hasPending) {
        sethiddenFecha(false);
      }

      setExportModal({
        isOpen: true,
        phase: "done",
        message: rechazosOConflictos(rechazados, conflictos)
          ? "Exportación completada con observaciones."
          : "Exportación completada correctamente.",
        tableSummaries: enrichedSummaries,
        totalRows: totalItems,
        processedRows: totalItems,
        error: null,
      });

      if (rechazosOConflictos(rechazados, conflictos)) {
        alert(
          `Exportación completada con observaciones. Rechazados: ${rechazados}. Conflictos last_modified: ${conflictos}`
        );
      } else {
        alert("Exportación completada correctamente.");
      }

      setExportModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error: any) {
      setColorLogo(false);

      if (syncMeta) {
        try {
          await syncBatchLocalRepo.finishBatch({
            syncBatchId: syncMeta.syncBatchId,
            estado: "ERROR",
            fechaFin: new Date().toISOString(),
            totalItems: 0,
            okCount: 0,
            rejectedCount: 0,
            conflictCount: 0,
            mensaje: String(error?.message || "No se pudo exportar a servidor."),
          });
        } catch {}
      }

      setExportModal((prev) => ({
        ...prev,
        isOpen: true,
        phase: "error",
        message: exportServerOk
          ? "La exportación llegó al servidor, pero falló el cierre local."
          : "No se pudo exportar a servidor.",
        error: String(error?.message || "Error desconocido"),
      }));

      if (exportServerOk) {
        alert("La exportación llegó al servidor, pero falló el cierre local de sincronización.");
      } else {
        alert("No se pudo exportar a servidor.");
      }
    } finally {
      setLoading(false);
      await safeCloseDb(db);
    }
  };

  const rechazosOConflictos = (rechazados: number, conflictos: number) =>
    rechazados > 0 || conflictos > 0;

  const nuevaBBDD = async () => {
    const db = await dbdb();
    await db.open();

    try {
      const info = await getPendingExportInfo(db);

      if (info.hasPending) {
        alert("No se puede importar: hay datos locales sin exportar.");
        return;
      }

      await db.delete();
      let existe: any = await sqlite.isDatabase(NOMBRE_BB_DD);

      if (!existe.result) {
        setLoadingImport(true);
        await CargarBase().then(() => {
          setLoadingImport(false);
        });
      }
    } catch (err: any) {
      alert("No se pudo verificar/importar la base: " + String(err?.message || err));
    } finally {
      setLoadingImport(false);
      await safeCloseDb(db);
    }
  };

  const continuar = () => {
    history.push("/personas");
  };

  return (
    <IonPage>
      <IonContent className="content-border">
        <IonGrid className="ion-align-items-center">
          <IonRow>
            <IonCol className="col_logos" sizeSm="12" sizeXs="12" sizeLg="4" sizeXl="4">
              <img src={logoAdesar}></img>
            </IonCol>
            <IonCol className="col_logos" sizeSm="12" sizeXs="12" sizeLg="4" sizeXl="4">
              <img src={logoUnsada}></img>
            </IonCol>
            <IonCol className="col_logos" sizeSm="12" sizeXs="12" sizeLg="4" sizeXl="4">
              <img src={logoMundoSano}></img>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol>
              <div className="content-div"></div>

              <IonButton expand="block" onClick={continuar} color="secondary" className="button_css">
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

              {hiddenFecha && hasPendingLocalExport && (
                <IonItem onClick={() => exportJsontoApi()}>
                  <IonLabel className="ion-text-wrap">
                    Tu última actualización es del día {moment(fechaActualizacion).format("YYYY-MM-DD")}
                  </IonLabel>
                  {!loading && (
                    <IonIcon icon={downloadOutline} color={colorLogo ? "success" : "danger"}></IonIcon>
                  )}
                </IonItem>
              )}

              <IonButton
                expand="block"
                color="medium"
                className="button_css"
                onClick={() => history.push("/sync-history")}
              >
                Historial Sync
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonModal isOpen={exportModal.isOpen} backdropDismiss={false}>
          <IonContent className="ion-padding">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              {exportModal.phase !== "done" && exportModal.phase !== "error" && (
                <IonSpinner name="crescent" />
              )}
              <div>
                <strong>{exportModal.message}</strong>
                {exportModal.error && (
                  <div style={{ marginTop: 8 }}>
                    <IonNote color="danger">{exportModal.error}</IonNote>
                  </div>
                )}
              </div>
            </div>

            <IonItemDivider>
              <IonLabel>
                Procesado: {exportModal.processedRows} / {exportModal.totalRows}
              </IonLabel>
            </IonItemDivider>

            <div style={{ marginTop: 12 }}>
              {exportModal.tableSummaries.map((table) => (
                <IonItem key={table.name}>
                  <IonLabel>
                    {table.name}
                    <p>{table.count} registros</p>
                  </IonLabel>
                </IonItem>
              ))}
            </div>

            {(exportModal.phase === "done" || exportModal.phase === "error") && (
              <div style={{ marginTop: 16 }}>
                <IonButton
                  expand="block"
                  onClick={() => setExportModal(emptyExportModal())}
                >
                  Cerrar
                </IonButton>
              </div>
            )}
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Main;