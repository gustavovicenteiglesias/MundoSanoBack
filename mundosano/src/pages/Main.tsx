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
  const [data, setData] = useState<any>();
  const [colorLogo, setColorLogo] = useState<boolean>(false);
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [hayInternet, setHayInternet] = useState<boolean>(true);

  // true => se puede importar
  // false => hay pendientes locales y primero hay que exportar
  const [hayExport, setHayExport] = useState<boolean>(false);

  const [pendingSummaries, setPendingSummaries] = useState<SyncTableSummary[]>(
    []
  );

  const [syncProgress, setSyncProgress] = useState<SyncProgressView>({
    isOpen: false,
    title: "Sincronizando datos",
    subtitle: "No cierres la aplicación",
    status: "idle",
    canClose: true,
  });

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

  const nowUnix = () => Math.floor(Date.now() / 1000);

  const ensureSyncTableReady = async (db: SQLiteDBConnection) => {
    try {
      await db.createSyncTable();

      const resp: any = await db.query(
        "SELECT * FROM sync_table LIMIT 1"
      );

      const hasSyncDate =
        Array.isArray(resp?.values) &&
        resp.values.length > 0 &&
        resp.values[0]?.sync_date !== undefined &&
        resp.values[0]?.sync_date !== null &&
        String(resp.values[0].sync_date).trim() !== "";

      if (!hasSyncDate) {
        await db.setSyncDate(String(nowUnix()));
      }
    } catch (error) {
      console.error("No se pudo preparar sync_table local:", error);
    }
  };

  const summarizePayloadTables = (
    payload?: JsonExportPayload | null
  ): SyncTableSummary[] => {
    const tables = Array.isArray(payload?.tables) ? payload!.tables : [];
    return tables
      .map((table: any) => ({
        name: String(table?.name || "sin_nombre"),
        count: Array.isArray(table?.values) ? table.values.length : 0,
      }))
      .filter((item) => item.count > 0);
  };

  const getTotalRows = (tables: SyncTableSummary[]) =>
    tables.reduce((acc, item) => acc + item.count, 0);

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

      if (
        msg.includes("object is empty") ||
        msg.includes("no sync_table available")
      ) {
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
        "SELECT * FROM sync_table LIMIT 1"
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
      await ensureSyncTableReady(db);

      const info = await getPendingExportInfo(db);

      setHayExport(!info.hasPending);
      setPendingSummaries(info.tableSummaries);

      if (!info.hasPending) {
        sethiddenFecha(false);
      }
    } catch (error) {
      console.error("No se pudo refrescar estado de exportación:", error);
    } finally {
      await safeCloseDb(db);
    }
  };

  useIonViewWillEnter(() => {
    void logCurrentNetworkStatus();
    void refreshPendingState();
  }, []);

  const exportJson = async () => {
    let db: SQLiteDBConnection | null = null;

    try {
      db = await dbdb();
      await db.open();
      await ensureSyncTableReady(db);

      const info = await getPendingExportInfo(db);

      if (!info.hasPending) {
        setHayExport(true);
        sethiddenFecha(false);
        setPendingSummaries([]);
        alert("No hay datos pendientes para exportar.");
        return false;
      }

      const formattedDate = await readLocalSyncDateLabel(db);

      setData(info.payload);
      setPendingSummaries(info.tableSummaries);
      setFechadeActualizacion(formattedDate);
      sethiddenFecha(true);

      // si hay pendientes locales, no se debe poder importar
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
  let syncMeta: SyncMeta | null = null;
  let exportServerOk = false;

  try {
    await db.open();
    await ensureSyncTableReady(db);

    const info = await getPendingExportInfo(db);

    if (!info.hasPending || !info.payload) {
      setHayExport(true);
      sethiddenFecha(false);
      setPendingSummaries([]);
      alert("No hay datos pendientes para exportar.");
      return;
    }

    const enrichedPayload = await enrichPartialExportWithAncestors(
      db,
      info.payload
    );
    const exportSummaries = summarizePayloadTables(enrichedPayload);
    const totalItems = getTotalRows(exportSummaries);

    const currentUserRaw = sessionStorage.getItem("currenUser");
    const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
    const deviceInfo = await Device.getInfo();
    const appVersion =
      (deviceInfo as any).appVersion ||
      (deviceInfo as any).osVersion ||
      "unknown";

    syncMeta = {
      syncBatchId: `sync-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      usuario: currentUser?.usuario ?? null,
      dispositivo: `${deviceInfo.platform || "unknown"}-${
        deviceInfo.model || "unknown"
      }`,
      versionApp: appVersion,
      fechaInicio: new Date().toISOString(),
    };

    setSyncProgress({
      isOpen: true,
      title: "Exportando datos",
      subtitle: "No cierres la aplicación",
      phase: "Preparando",
      detail: "Armando lote de exportación...",
      status: "running",
      canClose: false,
      progress: null,
      tableSummaries: exportSummaries,
      processedItems: 0,
      totalItems,
    });

    await syncBatchLocalRepo.createBatch(syncMeta, totalItems);

    const payloadWithMeta: JsonExportPayload = {
      ...enrichedPayload,
      syncMeta,
    };

    setSyncProgress((prev) => ({
      ...prev,
      phase: "Exportando",
      detail: "Enviando lote al servidor...",
      progress: null,
    }));

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

      setSyncProgress((prev) => ({
        ...prev,
        phase: "Error",
        detail: "La API devolvió success=false.",
        status: "error",
        canClose: true,
      }));

      alert("La API devolvió success=false.");
      return;
    }

    exportServerOk = true;

    const de = nowUnix();

    setSyncProgress((prev) => ({
      ...prev,
      phase: "Finalizando",
      detail: "Actualizando sync_date local y remoto...",
      processedItems: totalItems,
    }));

    // Si sqlite respondió OK, esto ya cuenta como exportación exitosa
    setData(payloadWithMeta);
    setColorLogo(true);
    setHayExport(true);
    sethiddenFecha(false);
    setPendingSummaries([]);

    // Local en unix
    try {
      await db.setSyncDate(String(de));
    } catch (localSyncErr) {
      console.error("No se pudo actualizar sync_date local:", localSyncErr);
    }

    // Intento remoto, sin romper la exportación exitosa
    try {
      await axios.post(BASE_URL + "/sync_date", {
        id: 0,
        syncDate: de,
      });
    } catch (remoteSyncErr) {
      console.error("No se pudo informar sync_date al backend:", remoteSyncErr);
    }

    const rechazados = Number(resp?.data?.rechazados ?? 0);
    const conflictos = Number(resp?.data?.conflictosLastModified ?? 0);
    const syncLogs: any[] = Array.isArray(resp?.data?.logs)
      ? resp.data.logs
      : [];
    const syncBatchId = String(
      resp?.data?.sync_batch_id || syncMeta?.syncBatchId || ""
    );

    const itemLogs: SyncItemLogLocal[] = syncLogs.map((log: any) => ({
      sync_batch_id: syncBatchId,
      tabla: String(log?.tabla || "unknown"),
      uuid: null,
      id_persona: Number.isFinite(Number(log?.idPersona))
        ? Number(log?.idPersona)
        : null,
      id_control: Number.isFinite(Number(log?.idControl))
        ? Number(log?.idControl)
        : null,
      id_referencia: Number.isFinite(Number(log?.idReferencia))
        ? Number(log?.idReferencia)
        : null,
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

    // Postproceso local: si falla, NO debe anular una exportación ya exitosa
    try {
      await syncItemLocalRepo.insertMany(itemLogs);

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

      await refreshPendingState();
    } catch (postProcessErr) {
      console.error(
        "Falló el postproceso local de exportación:",
        postProcessErr
      );
    }

    setSyncProgress((prev) => ({
      ...prev,
      phase: "Completado",
      detail: rechazosOConflictos(rechazados, conflictos)
        ? "Exportación completada con observaciones."
        : "Exportación completada correctamente.",
      status: "success",
      canClose: true,
      progress: 1,
    }));

    if (rechazosOConflictos(rechazados, conflictos)) {
      alert(
        `Exportación completada con observaciones. Rechazados: ${rechazados}. Conflictos last_modified: ${conflictos}`
      );
    } else {
      alert("Exportación completada correctamente.");
    }
  } catch (error: any) {
    if (!exportServerOk) {
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

      setSyncProgress((prev) => ({
        ...prev,
        isOpen: true,
        phase: "Error",
        detail: String(error?.message || "No se pudo exportar a servidor."),
        status: "error",
        canClose: true,
      }));

      alert("No se pudo exportar a servidor.");
    } else {
      console.error("La exportación llegó al servidor, pero falló el cierre local:", error);

      setSyncProgress((prev) => ({
        ...prev,
        isOpen: true,
        phase: "Completado",
        detail:
          "La exportación llegó al servidor. Hubo un problema en el cierre local.",
        status: "success",
        canClose: true,
        progress: 1,
      }));

      setColorLogo(true);
      setHayExport(true);
      sethiddenFecha(false);
      setPendingSummaries([]);
    }
  } finally {
    await safeCloseDb(db);
  }
};

  const rechazosOConflictos = (rechazados: number, conflictos: number) =>
    rechazados > 0 || conflictos > 0;

  const nuevaBBDD = async () => {
    const db = await dbdb();

    try {
      await db.open();
      await ensureSyncTableReady(db);

      const info = await getPendingExportInfo(db);

      if (info.hasPending) {
        alert("No se puede importar: hay datos locales sin exportar.");
        return;
      }

      setLoadingImport(true);

      const existeActual: any = await sqlite.isDatabase(NOMBRE_BB_DD);
      const mode = existeActual.result ? "partial" : "full";

      setSyncProgress({
        isOpen: true,
        title: "Importando datos",
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

      await CargarBase({
        mode,
        timeoutMs: mode === "full" ? 0 : 60000,
        onProgress: (progress) => {
          const phaseMap: Record<string, string> = {
            preparing: "Preparando",
            downloading: "Descargando",
            received: "Paquete recibido",
            importing: "Importando",
            finalizing: "Finalizando",
            done: "Completado",
            error: "Error",
          };

          setSyncProgress({
            isOpen: true,
            title: "Importando datos",
            subtitle: "No cierres la aplicación",
            phase: phaseMap[progress.phase] || "Sincronizando",
            detail: progress.message,
            loadedBytes: progress.downloadedBytes,
            totalBytes: progress.totalBytes,
            tableSummaries:
              progress.tableNames?.map((name) => ({
                name,
                count: 0,
              })) ?? [],
            totalItems: progress.tableCount,
            processedItems:
              progress.phase === "done" ? progress.tableCount ?? 0 : 0,
            status:
              progress.phase === "done"
                ? "success"
                : progress.phase === "error"
                ? "error"
                : "running",
            canClose:
              progress.phase === "done" || progress.phase === "error",
            progress:
              progress.downloadedBytes && progress.totalBytes
                ? progress.downloadedBytes / progress.totalBytes
                : null,
          });
        },
      });

      await refreshPendingState();

      setSyncProgress((prev) => ({
        ...prev,
        phase: "Completado",
        detail: "Importación finalizada correctamente.",
        status: "success",
        canClose: true,
        progress: 1,
      }));
    } catch (err: any) {
      setSyncProgress((prev) => ({
        ...prev,
        isOpen: true,
        phase: "Error",
        detail: String(err?.message || "No se pudo importar."),
        status: "error",
        canClose: true,
      }));
      alert("No se pudo importar.");
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
                    Tu última actualización es del día{" "}
                    {moment(fechaActualizacion).format("YYYY-MM-DD")}
                  </IonLabel>
                  <IonIcon
                    icon={downloadOutline}
                    color={colorLogo ? "success" : "danger"}
                  ></IonIcon>
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

        <SyncProgressModal
          state={syncProgress}
          onClose={() =>
            setSyncProgress((prev) => ({ ...prev, isOpen: false }))
          }
        />
      </IonContent>
    </IonPage>
  );
};

export default Main;
