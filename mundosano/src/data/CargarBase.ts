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

const safeCloseDb = async (connection?: SQLiteDBConnection | null) => {
  try {
    if (connection) {
      await connection.close();
    }
  } catch (error) {
    console.warn("CargarBase: no se pudo cerrar conexión local.", error);
  }
};

const quoteIdent = (name: string) => `"${String(name).replace(/"/g, '""')}"`;

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
  tableSummaries?: any[];
  processedItems?: number;
  totalItems?: number;
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

/**
 * Reset interno de la base local.
 *
 * No dependemos de deleteDatabase porque en algunos dispositivos / WebView / IndexedDB
 * puede quedar una conexión o store viejo.
 *
 * Esto simula el estado "no tengo base":
 * - apaga FK
 * - elimina triggers
 * - elimina vistas
 * - elimina tablas de usuario
 * - guarda store vacío si está en Web
 *
 * Después importFromJson entra sobre una base realmente limpia.
 */
const resetLocalDatabaseSchema = async () => {
  let db: SQLiteDBConnection | null = null;

  try {
    console.log("CargarBase: iniciando reset interno de base local...");

    // Intentamos cerrar cualquier conexión previa conocida por el hook.
    try {
      const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
      if (isConn) {
        await sqlite.closeConnection(NOMBRE_BB_DD, false);
        console.log("CargarBase: conexión previa cerrada desde hook.");
      }
    } catch (error) {
      console.warn(
        "CargarBase: no se pudo cerrar conexión previa desde hook, continúo.",
        error
      );
    }

    // Creamos/recuperamos conexión limpia para poder dropear todo.
    db = await dbdb();
    await db.open();

    await db.execute("PRAGMA foreign_keys = OFF;");

    const triggers: any = await db.query(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'trigger'
    `);

    for (const trigger of triggers?.values ?? []) {
      if (trigger?.name) {
        const sql = `DROP TRIGGER IF EXISTS ${quoteIdent(trigger.name)};`;
        console.log("CargarBase: eliminando trigger:", trigger.name);
        await db.execute(sql);
      }
    }

    const views: any = await db.query(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'view'
        AND name NOT LIKE 'sqlite_%'
    `);

    for (const view of views?.values ?? []) {
      if (view?.name) {
        const sql = `DROP VIEW IF EXISTS ${quoteIdent(view.name)};`;
        console.log("CargarBase: eliminando vista:", view.name);
        await db.execute(sql);
      }
    }

    const tables: any = await db.query(`
      SELECT name
      FROM sqlite_master
      WHERE type = 'table'
        AND name NOT LIKE 'sqlite_%'
    `);

    for (const table of tables?.values ?? []) {
      if (table?.name) {
        const sql = `DROP TABLE IF EXISTS ${quoteIdent(table.name)};`;
        console.log("CargarBase: eliminando tabla:", table.name);
        await db.execute(sql);
      }
    }

    await db.execute("PRAGMA foreign_keys = ON;");

    // Compactar es útil luego de borrar todo. Si falla, no corta el flujo.
    try {
      await db.execute("VACUUM;");
    } catch (vacuumError) {
      console.warn("CargarBase: VACUUM no pudo ejecutarse, continúo.", vacuumError);
    }

    await safeCloseDb(db);
    db = null;

    // En Web hay que persistir el estado limpio para no volver a leer el store viejo.
    try {
      const platform = (await sqlite.getPlatform()).platform;
      if (platform === "web") {
        const { plugin } = await sqlite.getCapacitorSQLite();
        await plugin.saveToStore({ database: NOMBRE_BB_DD });
        console.log("CargarBase: store Web limpiado correctamente.");
      }
    } catch (storeError) {
      console.warn(
        "CargarBase: no se pudo guardar store vacío en Web, continúo.",
        storeError
      );
    }

    console.log("CargarBase: reset interno finalizado correctamente.");
  } catch (error) {
    console.error("CargarBase: error crítico reseteando base local:", error);
    throw error;
  } finally {
    await safeCloseDb(db);
  }
};

const sanitizeImportTables = (tables: any[] = []) => {
  if (!Array.isArray(tables)) return [];

  return tables
    .filter(
      (table) =>
        table?.name !== "sync_batch_log_local" &&
        table?.name !== "sync_item_log_local"
    )
    .map((table) => {
      // Nos aseguramos de que 'values' siempre sea un array
      const sanitized = { ...table, triggers: [], values: table.values || [] };

      if (Array.isArray(sanitized.schema)) {
        // 1. Separar columnas de restricciones
        const columns = sanitized.schema.filter((s: any) => s.column);
        const constraints = sanitized.schema.filter((s: any) => s.constraint);

        // 2. Identificar UUID
        const originalUuidIndex = columns.findIndex(
          (s: any) => s.column?.trim().toLowerCase() === "uuid"
        );

        let reorderedColumns = [...columns];
        let uuidCol: any;

        if (originalUuidIndex !== -1) {
          [uuidCol] = reorderedColumns.splice(originalUuidIndex, 1);
        } else {
          uuidCol = { column: "uuid", value: "VARCHAR(36) NOT NULL" };
        }

        // 3. UUID como primera columna y PK del import local
        uuidCol.value = "VARCHAR(36) PRIMARY KEY NOT NULL";

        // 4. Limpiar otras columnas y restricciones
        const cleanParams = reorderedColumns.map((s: any) => {
          let val = (s.value || "").replace(/`/g, "").trim();

          if (val.toUpperCase().includes("PRIMARY KEY")) {
            val = val.toUpperCase().replace("PRIMARY KEY", "UNIQUE");
          }

          return {
            column: s.column.trim().replace(/`/g, ""),
            value: val,
          };
        });

        const cleanConstraints = constraints.map((s: any) => {
          let val = (s.value || "").replace(/`/g, "").trim();

          if (val.toUpperCase().includes("PRIMARY KEY")) {
            val = val.toUpperCase().replace("PRIMARY KEY", "UNIQUE");
          }

          return {
            constraint: s.constraint.trim().replace(/`/g, ""),
            value: val,
          };
        });

        // 5. Reconstruir schema con UUID primero
        sanitized.schema = [
          {
            column: String(uuidCol.column).replace(/`/g, ""),
            value: uuidCol.value,
          },
          ...cleanParams,
          ...cleanConstraints,
        ];

        // 6. Reordenar valores si UUID se movió
        if (Array.isArray(sanitized.values) && originalUuidIndex !== 0) {
          sanitized.values = sanitized.values.map((row: any[]) => {
            if (!Array.isArray(row)) return row;

            const newRow = [...row];

            if (originalUuidIndex !== -1 && newRow.length > originalUuidIndex) {
              const [uuidVal] = newRow.splice(originalUuidIndex, 1);
              newRow.unshift(uuidVal);
            } else if (originalUuidIndex === -1) {
              newRow.unshift(null);
            }

            return newRow;
          });
        }
      }

      // 7. Limpieza de índices
      if (Array.isArray(sanitized.indexes)) {
        sanitized.indexes = sanitized.indexes.map((idx: any) => ({
          ...idx,
          value: idx.value ? idx.value.replace(/`/g, "") : idx.value,
        }));
      }

      return sanitized;
    })
    .map((table) => {
      if (table?.name !== "ubicaciones" || !Array.isArray(table?.values)) {
        return table;
      }

      const columns: any[] = table.schema || [];
      const idxVivienda = columns.findIndex(
        (c) => c.column === "num_vivienda"
      );
      const idxFecha = columns.findIndex((c) => c.column === "fecha");
      const idxGeo = columns.findIndex((c) => c.column === "georeferencia");

      return {
        ...table,
        values: table.values.map((row: any[]) => {
          if (!Array.isArray(row)) return row;

          const safeRow = [...row];

          if (idxVivienda !== -1) {
            safeRow[idxVivienda] = safeRow[idxVivienda] ?? "";
          }

          if (idxFecha !== -1) {
            safeRow[idxFecha] = safeRow[idxFecha] ?? todayIso();
          }

          if (idxGeo !== -1) {
            safeRow[idxGeo] = safeRow[idxGeo] ?? "";
          }

          return safeRow;
        }),
      };
    });
};

const ensureLocalSyncTable = async (
  db: SQLiteDBConnection,
  serverTime?: number
) => {
  await db.createSyncTable();

  if (serverTime && serverTime > 0) {
    // Guardamos el tiempo del servidor con +2s para evitar que registros recién descargados
    // queden como pendientes por diferencias mínimas de reloj.
    await db.setSyncDate(new Date((serverTime + 2) * 1000).toISOString());
  } else {
    const res: any = await db.query("SELECT sync_date FROM sync_table LIMIT 1");

    if (!res?.values || res.values.length === 0) {
      await db.setSyncDate(new Date(1000).toISOString());
    }
  }
};

export async function CargarBase(arg?: CargarBaseArg) {
  let db: SQLiteDBConnection | null = null;

  const options: CargarBaseOptions = arg ?? {};
  const mode: SyncMode = options?.mode ?? "full";

  let endpoint = `${BASE_URL}/data/json3`;

  emitProgress(options, {
    phase: "preparing",
    mode,
    message:
      mode === "full"
        ? "Preparando importación completa..."
        : "Preparando importación parcial...",
  });

  if (mode === "partial") {
    endpoint += "/partial";

    try {
      const tempDb = await dbdb();
      await tempDb.open();

      const respDate: any = await tempDb.query(
        "SELECT sync_date FROM sync_table LIMIT 1"
      );

      const rawDate = respDate?.values?.[0]?.sync_date || "0";

      let sinceUnix = /^\d+$/.test(String(rawDate))
        ? Number(rawDate)
        : Math.floor(new Date(String(rawDate)).getTime() / 1000);

      if (isNaN(sinceUnix)) {
        console.warn(`CargarBase: sync_date no válida (${rawDate}), usando 0.`);
        sinceUnix = 0;
      }

      // Margen de seguridad de 5 minutos
      const safeSince = Math.max(0, sinceUnix - 300);

      if (safeSince > 0) {
        endpoint += `?since=${safeSince}`;
      }

      console.log(
        `Sincronización parcial iniciada desde: ${safeSince} (Raw: ${rawDate})`
      );

      await tempDb.close();
    } catch (e) {
      console.warn(
        "CargarBase: no se pudo obtener fecha local, se usará 0.",
        e
      );
    }
  }

  const timeoutMs = options?.timeoutMs ?? 0;

  try {
    if (mode === "full") {
      emitProgress(options, {
        phase: "preparing",
        mode,
        message: "Limpiando base local para importación completa...",
      });

      await resetLocalDatabaseSchema();
    }

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
      database: NOMBRE_BB_DD,
      version: Number(resp.data.version) || 2,
      encrypted: !!resp.data.encrypted,

      // Punto importante:
      // Si el usuario pidió full, forzamos full.
      // No dejamos que resp.data.mode cambie el comportamiento.
      mode: mode === "full" ? "full" : resp.data.mode || mode,

      tables: sanitizeImportTables(resp.data.tables || []),
    };

    console.log("JSON FINAL PARA SQLite:", cleanData);

    const tableSummaries: any[] = Array.isArray(resp?.data?.tables)
      ? resp.data.tables.map((t: any) => ({
          name: t.name,
          count: Array.isArray(t.values) ? t.values.length : 0,
        }))
      : [];

    const totalRecords = tableSummaries.reduce(
      (acc, curr) => acc + curr.count,
      0
    );

    emitProgress(options, {
      phase: "importing",
      mode,
      message: `Insertando ${totalRecords} registros en ${tableSummaries.length} tablas...`,
      tableCount: tableSummaries.length,
      tableNames,
      tableSummaries,
      processedItems: 0,
      totalItems: totalRecords,
    });

    try {
      await sqlite.importFromJson(JSON.stringify(cleanData));
      console.log("Importación JSON completada.");

      // En Web persistimos recién después de importar correctamente.
      try {
        const platform = (await sqlite.getPlatform()).platform;

        if (platform === "web") {
          const { plugin } = await sqlite.getCapacitorSQLite();
          await plugin.saveToStore({ database: NOMBRE_BB_DD });
          console.log("CargarBase: base importada persistida en Web Store.");
        }
      } catch (storeError) {
        console.warn(
          "CargarBase: importó, pero no se pudo persistir Web Store.",
          storeError
        );
      }

      // Limpieza agresiva de triggers importados
      const dbCleanup = await dbdb();
      await dbCleanup.open();

      const triggersFound: any = await dbCleanup.query(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'trigger'
      `);

      if (triggersFound?.values && triggersFound.values.length > 0) {
        for (const trig of triggersFound.values) {
          if (trig?.name) {
            console.log(`Eliminando trigger conflictivo: ${trig.name}`);
            await dbCleanup.execute(
              `DROP TRIGGER IF EXISTS ${quoteIdent(trig.name)};`
            );
          }
        }
      }

      await dbCleanup.close();

      try {
        const platform = (await sqlite.getPlatform()).platform;

        if (platform === "web") {
          const { plugin } = await sqlite.getCapacitorSQLite();
          await plugin.saveToStore({ database: NOMBRE_BB_DD });
          console.log(
            "CargarBase: base persistida en Web Store luego de limpiar triggers."
          );
        }
      } catch (storeError) {
        console.warn(
          "CargarBase: no se pudo persistir luego de limpiar triggers.",
          storeError
        );
      }
    } catch (importError: any) {
      console.error("Error crítico en importFromJson:", importError);
      throw new Error(
        `Error de esquema: ${importError.message}. Intente borrar datos de la app.`
      );
    }

    emitProgress(options, {
      phase: "finalizing",
      mode,
      message: "Finalizando metadata local...",
      tableCount: tableNames.length,
      tableNames,
    });

    const rawSince = Number(resp.data?.server_unix_time || resp.data?.since);
    const serverTime = Number.isFinite(rawSince) && rawSince > 0 ? rawSince : 0;

    try {
      db = await dbdb();
      await db.open();
      await ensureLocalSyncTable(db, serverTime);
    } catch (metaError) {
      console.warn(
        "La importación terminó, pero falló metadata local:",
        metaError
      );
    } finally {
      await safeCloseDb(db);
      db = null;
    }

    try {
      await axios.post(
        BASE_URL + "/sync_date",
        {
          id: 0,
          syncDate: Math.floor(Date.now() / 1000),
        },
        {
          timeout: 10000,
        }
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
    await safeCloseDb(db);

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