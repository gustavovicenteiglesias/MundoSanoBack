import { sqlite } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
const SYNC_LOGS_DB_NAME = "triplefrontera_logs";
export const getSyncLogsDb = async (): Promise<SQLiteDBConnection> => {
const ret = await sqlite.checkConnectionsConsistency();
const isConn = (await sqlite.isConnection(SYNC_LOGS_DB_NAME)).result;
if (ret.result && isConn) {
return await sqlite.retrieveConnection(SYNC_LOGS_DB_NAME);
}
return await sqlite.createConnection(SYNC_LOGS_DB_NAME);
};
const createSyncLogsSchema = async (db: SQLiteDBConnection): Promise<void>=> {
await db.execute(`
 CREATE TABLE IF NOT EXISTS sync_batch_log_local (
 sync_batch_id TEXT PRIMARY KEY NOT NULL,
 usuario TEXT NULL,
 dispositivo TEXT NULL,
 version_app TEXT NULL,
 fecha_inicio TEXT NOT NULL,
 fecha_fin TEXT NULL,
 estado TEXT NOT NULL,
 total_items INTEGER NOT NULL DEFAULT 0,
 ok_count INTEGER NOT NULL DEFAULT 0,
 rejected_count INTEGER NOT NULL DEFAULT 0,
 conflict_count INTEGER NOT NULL DEFAULT 0,
 mensaje TEXT NULL,
 sql_deleted INTEGER NOT NULL DEFAULT 0,
 last_modified INTEGER NOT NULL DEFAULT (strftime('%s','now'))
 );
 `);
await db.execute(`
 CREATE TABLE IF NOT EXISTS sync_item_log_local (
 id_item INTEGER PRIMARY KEY AUTOINCREMENT,
 sync_batch_id TEXT NOT NULL,
 tabla TEXT NOT NULL,

 uuid TEXT NULL,
 id_persona INTEGER NULL,
 id_control INTEGER NULL,
 id_referencia INTEGER NULL,
 estado TEXT NOT NULL,
 motivo TEXT NULL,
 payload_json TEXT NULL,
 created_at TEXT NOT NULL,
 sql_deleted INTEGER NOT NULL DEFAULT 0,
 last_modified INTEGER NOT NULL DEFAULT (strftime('%s','now'))
 );
 `);
await db.execute(
`CREATE INDEX IF NOT EXISTS idx_sync_item_batch ON
sync_item_log_local(sync_batch_id);`
);
await db.execute(
`CREATE INDEX IF NOT EXISTS idx_sync_item_estado ON
sync_item_log_local(estado);`
);
};
export const withSyncLogsDb = async <T>(
fn: (db: SQLiteDBConnection) => Promise<T>
): Promise<T> => {
const db = await getSyncLogsDb();
await db.open();
try {
await createSyncLogsSchema(db);
return await fn(db);
} finally {
await db.close();
}
};
export const resetSyncLogsDb = async (): Promise<void> => {
const db = await getSyncLogsDb();
await db.open();
try {
await db.execute(`DROP TABLE IF EXISTS sync_item_log_local;`);
await db.execute(`DROP TABLE IF EXISTS sync_batch_log_local;`);
await createSyncLogsSchema(db);
} finally {
await db.close();
}
};