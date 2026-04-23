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

export type CargarBaseProgress = {
  phase:
    | "preparing"
    | "downloading"
    | "received"
    | "importing"
    | "finalizing"
    | "done"
    | "error";
  mode: SyncMode;
  message: string;
  tableCount?: number;
  tableNames?: string[];
  downloadedBytes?: number;
  totalBytes?: number;
  error?: string;
};

type CargarBaseOptions = {
  mode?: SyncMode;
  timeoutMs?: number;
  onProgress?: (progress: CargarBaseProgress) => void;
};

type CargarBaseArg = CargarBaseOptions | undefined;

const emitProgress = (
  options: CargarBaseOptions | undefined,
  progress: CargarBaseProgress
) => {
  options?.onProgress?.(progress);
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const sanitizeImportTables = (tables: any[] = []) =>
  tables.map((table) => {
    if (table?.name !== "ubicaciones" || !Array.isArray(table?.values)) {
      return table;
    }

    return {
      ...table,
      values: table.values.map((row: any[]) => {
        if (!Array.isArray(row)) return row;

        const safeRow = [...row];

        // ubicaciones:
        // 0 uuid
        // 1 id_ubicacion
        // 2 id_persona
        // 3 id_paraje
        // 4 id_area
        // 5 num_vivienda
        // 6 fecha
        // 7 georeferencia
        // 8 id_pais
        // 9 sql_deleted
        // 10 last_modified
        safeRow[5] = safeRow[5] ?? "";
        safeRow[6] = safeRow[6] ?? todayIso();
        safeRow[7] = safeRow[7] ?? "";

        return safeRow;
      }),
    };
  });

const ensureLocalSyncTable = async (db: SQLiteDBConnection) => {
  await db.createSyncTable();
  await db.setSyncDate(String(Math.floor(Date.now() / 1000)));
};

export async function CargarBase(arg?: CargarBaseArg) {
  let db: SQLiteDBConnection | null = null;

  const options: CargarBaseOptions = arg ?? {};

  const mode: SyncMode = options?.mode ?? "full";

  const endpoint =
    mode === "partial"
      ? `${BASE_URL}/data/json3/partial`
      : `${BASE_URL}/data/json3`;

  const timeoutMs = options?.timeoutMs ?? (mode === "full" ? 0 : 60000);

  emitProgress(options, {
    phase: "preparing",
    mode,
    message:
      mode === "full"
        ? "Preparando importación completa..."
        : "Preparando importación parcial...",
  });

  try {
    emitProgress(options, {
      phase: "downloading",
      mode,
      message:
        mode === "full"
          ? "Descargando base completa..."
          : "Descargando cambios...",
    });

    const resp = await axios.get(endpoint, {
      timeout: timeoutMs,
      onDownloadProgress: (event) => {
        emitProgress(options, {
          phase: "downloading",
          mode,
          message:
            mode === "full"
              ? "Descargando base completa..."
              : "Descargando cambios...",
          downloadedBytes: event.loaded,
          totalBytes: event.total ?? undefined,
        });
      },
    });

    const tableNames: string[] = Array.isArray(resp?.data?.tables)
      ? resp.data.tables
          .map((table: any) => String(table?.name ?? "").trim())
          .filter(Boolean)
      : [];

    emitProgress(options, {
      phase: "received",
      mode,
      message: "Paquete recibido desde el servidor.",
      tableCount: tableNames.length,
      tableNames,
    });

    const cleanData = {
      database: resp.data.database,
      version: resp.data.version,
      encrypted: resp.data.encrypted,
      mode: resp.data.mode,
      tables: sanitizeImportTables(resp.data.tables),
    };

    emitProgress(options, {
      phase: "importing",
      mode,
      message: `Importando ${tableNames.length} tablas en SQLite...`,
      tableCount: tableNames.length,
      tableNames,
    });

    await sqlite.importFromJson(JSON.stringify(cleanData));

    emitProgress(options, {
      phase: "finalizing",
      mode,
      message: "Finalizando metadata local...",
      tableCount: tableNames.length,
      tableNames,
    });

    try {
      db = await dbdb();
      await db.open();
      await ensureLocalSyncTable(db);
    } catch (metaError) {
      console.warn(
        "La importación terminó, pero falló metadata local:",
        metaError
      );
    } finally {
      try {
        if (db) await db.close();
      } catch {}
    }

    try {
      await axios.post(
        BASE_URL + "/sync_date",
        { id: 0, syncDate: Math.floor(Date.now() / 1000) },
        { timeout: 10000 }
      );
    } catch (syncDateError) {
      console.warn(
        "La importación terminó, pero no se pudo informar sync_date al backend:",
        syncDateError
      );
    }

    emitProgress(options, {
      phase: "done",
      mode,
      message: "Importación finalizada correctamente.",
      tableCount: tableNames.length,
      tableNames,
    });

    return {
      ok: true,
      tableCount: tableNames.length,
      tableNames,
    };
  } catch (error: any) {
    try {
      if (db) await db.close();
    } catch {}

    const message = error?.message || "No se pudo cargar la base de datos.";

    emitProgress(options, {
      phase: "error",
      mode,
      message,
      error: message,
    });

    throw error;
  }
}
