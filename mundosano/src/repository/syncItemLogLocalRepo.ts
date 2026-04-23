import { withSyncLogsDb } from "../data/syncLogsDb";
import { SyncItemLogLocal } from "../models/SyncItemLogLocal";
const esc = (value: any): string => String(value ?? "").replace(/'/g, "''");
const toNumberOrNull = (value: any): string => {
if (value === null || value === undefined || value === "") return "NULL";
const n = Number(value);
return Number.isFinite(n) ? String(n) : "NULL";
};
export class SyncItemLogLocalRepo {
async insertMany(items: SyncItemLogLocal[]): Promise<void> {
if (!items.length) return;
await withSyncLogsDb(async (db) => {
for (const item of items) {
await db.execute(
`INSERT INTO sync_item_log_local
 (sync_batch_id, tabla, uuid, id_persona, id_control,
id_referencia, estado, motivo, payload_json, created_at)
 VALUES (
 '${esc(item.sync_batch_id)}',
 '${esc(item.tabla)}',
${item.uuid ? `'${esc(item.uuid)}'` : "NULL"},
${toNumberOrNull(item.id_persona)},
${toNumberOrNull(item.id_control)},
${toNumberOrNull(item.id_referencia)},
 '${esc(item.estado)}',
${item.motivo ? `'${esc(item.motivo)}'` : "NULL"},
${item.payload_json ? `'${esc(item.payload_json)}'` : "NULL"},
 '${esc(item.created_at)}'
 )`
);
}
});
}

async getBySyncBatchId(syncBatchId: string): Promise<SyncItemLogLocal[]> {
return withSyncLogsDb(async (db) => {
const res: any = await db.query(
`SELECT id_item, sync_batch_id, tabla, uuid, id_persona, id_control,
id_referencia, estado, motivo, payload_json, created_at
 FROM sync_item_log_local
 WHERE sync_batch_id = '${esc(syncBatchId)}'
 ORDER BY id_item ASC`
);
return (res?.values ?? []) as SyncItemLogLocal[];
});
}
}
