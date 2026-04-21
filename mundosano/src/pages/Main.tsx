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
import { enrichPartialExportWithAncestors, JsonExportPayload, SyncMeta } from "../utils/exportWithDependencies";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";
import { SyncItemLogLocalRepo } from "../repository/syncItemLogLocalRepo";
import { SyncItemLogLocal } from "../models/SyncItemLogLocal";

const LAST_SYNC_RESULT_KEY = "sync_last_result_v1";
const syncBatchLocalRepo = new SyncBatchLogLocalRepo();
const syncItemLocalRepo = new SyncItemLogLocalRepo();

const Main: React.FC<any> = () => {
  const [fechaActualizacion, setFechadeActualizacion] = useState<any>();
  const [hiddenFecha, sethiddenFecha] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [colorLogo, setColorLogo] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadindImport, setLoadingImport] = useState<boolean>(false);
  const [hayInternet, setHayInternet] = useState<boolean>(true);
  const [hayExport, setHayExport] = useState<boolean>(false);
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

  useIonViewWillEnter(() => {
    const datosaexportar = async () => {
      const db = await dbdb();
      await db.open();
      db.exportToJson("partial")
        .then(async () => {
          await db.close();
          setHayExport(false);
          return true;
        })
        .catch(async () => {
          await db.close();
          setHayExport(true);
          return false;
        });
    };

    datosaexportar();
  }, []);

  const exportJson = async () => {
    try {
      const db = await dbdb();

      await db.open();
      let res: any = await db.exportToJson("partial");
      if (res.export) {
        let resp: any = await db.query(
          "SELECT * FROM sync_table ORDER BY id DESC LIMIT 1"
        );

        const date = new Date(Number(resp.values[0].sync_date) * 1000);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        setData(res.export);
        setFechadeActualizacion(formattedDate);
        sethiddenFecha(true);
      }

      db.close();

      return true;
    } catch (_error: any) {
      return false;
    }
  };

  const exportJsontoApi = async () => {
    const db = await dbdb();
    setLoading(true);
    let syncMeta: SyncMeta | null = null;

    try {
      await db.open();

      const exported: any = await db.exportToJson("partial");
      const partialPayload: JsonExportPayload | undefined = exported?.export;

      if (!partialPayload?.tables?.length) {
        alert("No hay datos pendientes para exportar.");
        return;
      }

      const enrichedPayload = await enrichPartialExportWithAncestors(db, partialPayload);
      const totalItems = (enrichedPayload.tables || []).reduce(
        (acc: number, table: any) => acc + (Array.isArray(table?.values) ? table.values.length : 0),
        0
      );

      const currentUserRaw = sessionStorage.getItem("currenUser");
      const currentUser = currentUserRaw ? JSON.parse(currentUserRaw) : null;
      const deviceInfo = await Device.getInfo();
      const appVersion = (deviceInfo as any).appVersion || (deviceInfo as any).osVersion || "unknown";
      syncMeta = {
        syncBatchId: `sync-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        usuario: currentUser?.usuario ?? null,
        dispositivo: `${deviceInfo.platform || "unknown"}-${deviceInfo.model || "unknown"}`,
        versionApp: appVersion,
        fechaInicio: new Date().toISOString(),
      };

      await syncBatchLocalRepo.createBatch(syncMeta, totalItems);
      const payloadWithMeta: JsonExportPayload = { ...enrichedPayload, syncMeta };

      const resp = await axios.post(BASE_URL + "/sqlite", payloadWithMeta);

      if (resp.data.success) {
        setData(payloadWithMeta);
        setHayExport(true);

        const d = new Date();
        const de = Math.floor(Date.now() / 1000);

        await db.setSyncDate(d.toISOString());

        const datos = {
          id: 0,
          syncDate: de,
        };

        await axios.post(BASE_URL + "/sync_date", datos);
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

        await syncItemLocalRepo.insertMany(itemLogs);
        await syncBatchLocalRepo.finishBatch({
          syncBatchId,
          estado: (rechazados > 0 || conflictos > 0) ? "PARCIAL" : "OK",
          fechaFin: new Date().toISOString(),
          totalItems: itemLogs.length,
          okCount: Math.max(0, itemLogs.length - rechazados - conflictos),
          rejectedCount: rechazados,
          conflictCount: conflictos,
          mensaje: (rechazados > 0 || conflictos > 0) ? "Exportacion completada con observaciones" : "Exportacion completada correctamente",
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

        if (rechazados > 0 || conflictos > 0) {
          alert(`Exportacion completada con observaciones. Rechazados: ${rechazados}. Conflictos last_modified: ${conflictos}`);
        } else {
          alert("Exportacion completada correctamente.");
        }
      } else {
        setColorLogo(false);
        if (syncMeta) {
          await syncBatchLocalRepo.finishBatch({
            syncBatchId: syncMeta.syncBatchId,
            estado: "ERROR",
            fechaFin: new Date().toISOString(),
            totalItems: 0,
            okCount: 0,
            rejectedCount: 0,
            conflictCount: 0,
            mensaje: "La API devolvio success=false.",
          });
        }
        alert("La API devolvio success=false.");
      }
    } catch (error: any) {
      setColorLogo(false);
      if (syncMeta) {
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
      }
      alert("No se pudo exportar a servidor.");
    } finally {
      setLoading(false);
      await db.close();
    }
  };

  const nuevaBBDD = async () => {
    const db = await dbdb();
    await db.open();
    let hasData = false;
    try {
      const pending = await db.exportToJson("partial");
      hasData = !!pending?.export?.tables?.some((t: any) => Array.isArray(t.values) && t.values.length > 0);
    } catch (err: any) {
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
    await db.delete();
    let existe: any = await sqlite.isDatabase(NOMBRE_BB_DD);

    if (!existe.result) {
      setLoadingImport(true);
      await CargarBase().then(() => {
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
                <IonButton onClick={() => exportJson()} expand="block" color="secondary" className="button_css">
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
                    Tu ultima actualizacion es del dia {moment(fechaActualizacion).format("YYYY-MM-DD")}
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
              <IonLoading message="Por favor esperar a que termine..." isOpen={loading} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Main;
