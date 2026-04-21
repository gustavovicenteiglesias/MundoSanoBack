import axios from "axios";
import { sqlite } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { BASE_URL, NOMBRE_BB_DD } from "../utils/constantes";

const dbdb = async (): Promise<SQLiteDBConnection> => {
  const ret = await sqlite.checkConnectionsConsistency();
  const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
  if (ret.result && isConn) {
    return await sqlite.retrieveConnection(NOMBRE_BB_DD);
  }
  return await sqlite.createConnection(NOMBRE_BB_DD);
};

type SyncMode = "full" | "partial";

type CargarBaseOptions = {
  mode?: SyncMode;
  since?: number | null;
  timeoutMs?: number;
  onProgress?: (progress: {
    mode: SyncMode;
    phase: "starting" | "downloading" | "importing" | "finalizing" | "done" | "error";
    message: string;
    progress?: number;
    loadedBytes?: number;
    totalBytes?: number;
    currentTable?: string;
    tableIndex?: number;
    tableTotal?: number;
    rowsInTable?: number;
    error?: string;
  }) => void;
};

type CargarBaseArg = CargarBaseOptions | number | null | undefined;

function sanitizeImportPayload(data: any): any {
  const cleanData = {
    database: data?.database,
    version: data?.version,
    encrypted: data?.encrypted,
    mode: data?.mode,
    tables: Array.isArray(data?.tables) ? data.tables : [],
  };

  const ubicacionesTable: any = cleanData.tables.find((t: any) => t?.name === "ubicaciones");
  if (ubicacionesTable?.schema && Array.isArray(ubicacionesTable.values)) {
    const columns = ubicacionesTable.schema.map((c: any) => c?.column);
    const idxNumVivienda = columns.indexOf("num_vivienda");
    const idxGeo = columns.indexOf("georeferencia");
    const idxFecha = columns.indexOf("fecha");
    const today = new Date().toISOString().slice(0, 10);

    ubicacionesTable.values = ubicacionesTable.values.map((row: any[]) => {
      if (!Array.isArray(row)) return row;
      const clone = [...row];

      if (idxNumVivienda >= 0 && (clone[idxNumVivienda] === null || clone[idxNumVivienda] === undefined)) {
        clone[idxNumVivienda] = "";
      }
      if (idxGeo >= 0 && (clone[idxGeo] === null || clone[idxGeo] === undefined)) {
        clone[idxGeo] = "";
      }
      if (idxFecha >= 0 && (clone[idxFecha] === null || clone[idxFecha] === undefined || String(clone[idxFecha]).trim() === "")) {
        clone[idxFecha] = today;
      }

      return clone;
    });
  }

  return cleanData;
}

export async function CargarBase(arg?: CargarBaseArg) {
  let db: SQLiteDBConnection | null = null;
  let options: CargarBaseOptions = {};
  let mode: SyncMode = "full";
  let progressCb: CargarBaseOptions["onProgress"] = undefined;

  try {
    options =
      typeof arg === "number" || arg === null || arg === undefined
        ? { since: arg }
        : arg;

    mode = options?.mode ?? (options?.since !== undefined && options?.since !== null ? "partial" : "full");
    progressCb = options?.onProgress;

    const endpoint =
      mode === "partial"
        ? `${BASE_URL}/data/json3/partial${options?.since !== undefined && options?.since !== null ? `?since=${options.since}` : ""}`
        : `${BASE_URL}/data/json3`;

    progressCb?.({
      mode,
      phase: "starting",
      message: mode === "full" ? "Iniciando importacion completa..." : "Iniciando importacion parcial...",
      progress: 0.02,
    });

    const timeout = options?.timeoutMs ?? (mode === "full" ? 0 : 120000);
    const resp = await axios.get(endpoint, {
      timeout,
      onDownloadProgress: (evt: any) => {
        const total = evt?.total || 0;
        const loaded = evt?.loaded || 0;
        const ratio = total > 0 ? loaded / total : undefined;
        progressCb?.({
          mode,
          phase: "downloading",
          message: "Descargando datos desde servidor...",
          progress: typeof ratio === "number" ? Math.min(0.6, ratio * 0.6) : undefined,
          loadedBytes: loaded,
          totalBytes: total || undefined,
        });
      },
    });

    const cleanData = sanitizeImportPayload(resp.data);
    const tables: any[] = Array.isArray(cleanData?.tables) ? cleanData.tables : [];
    const tableTotal = tables.length;
    for (let i = 0; i < tableTotal; i++) {
      const table = tables[i];
      const rowsInTable = Array.isArray(table?.values) ? table.values.length : 0;
      progressCb?.({
        mode,
        phase: "importing",
        message: `Preparando tabla ${i + 1} de ${tableTotal}`,
        currentTable: String(table?.name || "unknown"),
        tableIndex: i + 1,
        tableTotal,
        rowsInTable,
        progress: 0.62 + ((i + 1) / Math.max(1, tableTotal)) * 0.08,
      });
    }

    progressCb?.({
      mode,
      phase: "importing",
      message: "Importando estructura y datos en SQLite local...",
      progress: 0.7,
    });

    await sqlite.importFromJson(JSON.stringify(cleanData));

    // En web, importFromJson puede dejar la conexión en estado no abierto.
    // Recuperamos una conexión fresca y la abrimos explícitamente.
    db = await dbdb();
    await db.open();

    // createSyncTable puede fallar por estado transitorio de conexión en web.
    // Reintentamos una vez reabriendo la conexión.
    try {
      await db.createSyncTable();
    } catch (_syncTableError) {
      try {
        await db.close();
      } catch (_closeError) {
        // noop
      }
      db = await dbdb();
      await db.open();
      await db.createSyncTable();
    }

    progressCb?.({
      mode,
      phase: "finalizing",
      message: "Finalizando sincronizacion...",
      progress: 0.9,
    });

    const d = new Date();
    try {
      await db.setSyncDate(d.toISOString());
    } catch (_syncDateError) {
      // Si falla sync metadata en web, no invalidamos la importación de datos.
    }

    const de = Math.floor(Date.now() / 1000);
    await axios.post(BASE_URL + "/sync_date", {
      id: 0,
      syncDate: de,
    });

    progressCb?.({
      mode,
      phase: "done",
      message: "Importacion completada.",
      progress: 1,
    });
  } catch (error: any) {
    console.error("Error sincronizando base de datos:", error);
    progressCb?.({
      mode,
      phase: "error",
      message: "No se pudo completar la importacion.",
      error: String(error?.message || "Error desconocido"),
    });
    alert("No se pudo cargar la base de datos.");
  } finally {
    try {
      if (db) {
        await db.close();
      }
    } catch (_closeError) {
      // noop
    }
  }
}
