import { withDb } from "../data/db";
import { SyncBatchLogLocal, SyncMetaPayload } from "../models/SyncBatchLogLocal";

const toNumber = (value: any, fallback = 0): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};
const esc = (value: any): string => String(value ?? "").replace(/'/g, "''");

export class SyncBatchLogLocalRepo {
  async createBatch(meta: SyncMetaPayload, totalItems: number): Promise<void> {
    await withDb(async (db) => {
      await db.execute(
        `INSERT INTO sync_batch_log_local
          (sync_batch_id, usuario, dispositivo, version_app, fecha_inicio, estado, total_items, ok_count, rejected_count, conflict_count, mensaje)
         VALUES (
           '${esc(meta.syncBatchId)}',
           ${meta.usuario ? `'${esc(meta.usuario)}'` : "NULL"},
           ${meta.dispositivo ? `'${esc(meta.dispositivo)}'` : "NULL"},
           ${meta.versionApp ? `'${esc(meta.versionApp)}'` : "NULL"},
           '${esc(meta.fechaInicio)}',
           'PENDIENTE',
           ${toNumber(totalItems)},
           0, 0, 0, NULL
         )`
      );
    });
  }

  async finishBatch(args: {
    syncBatchId: string;
    estado: string;
    fechaFin: string;
    totalItems: number;
    okCount: number;
    rejectedCount: number;
    conflictCount: number;
    mensaje?: string | null;
  }): Promise<void> {
    await withDb(async (db) => {
      await db.execute(
        `UPDATE sync_batch_log_local
         SET fecha_fin = '${esc(args.fechaFin)}',
             estado = '${esc(args.estado)}',
             total_items = ${toNumber(args.totalItems)},
             ok_count = ${toNumber(args.okCount)},
             rejected_count = ${toNumber(args.rejectedCount)},
             conflict_count = ${toNumber(args.conflictCount)},
             mensaje = ${args.mensaje ? `'${esc(args.mensaje)}'` : "NULL"},
             last_modified = strftime('%s','now')
         WHERE sync_batch_id = '${esc(args.syncBatchId)}'`
      );
    });
  }

  async listAll(): Promise<SyncBatchLogLocal[]> {
    return withDb(async (db) => {
      const res: any = await db.query(
        `SELECT sync_batch_id, usuario, dispositivo, version_app, fecha_inicio, fecha_fin, estado, total_items, ok_count, rejected_count, conflict_count, mensaje
         FROM sync_batch_log_local
         WHERE (sql_deleted = 0 OR sql_deleted IS NULL)
         ORDER BY fecha_inicio DESC`
      );
      return (res?.values ?? []).map((row: any) => ({
        ...row,
        total_items: toNumber(row.total_items),
        ok_count: toNumber(row.ok_count),
        rejected_count: toNumber(row.rejected_count),
        conflict_count: toNumber(row.conflict_count),
      })) as SyncBatchLogLocal[];
    });
  }

  async getBySyncBatchId(syncBatchId: string): Promise<SyncBatchLogLocal | null> {
    return withDb(async (db) => {
      const res: any = await db.query(
        `SELECT sync_batch_id, usuario, dispositivo, version_app, fecha_inicio, fecha_fin, estado, total_items, ok_count, rejected_count, conflict_count, mensaje
         FROM sync_batch_log_local
         WHERE sync_batch_id = '${esc(syncBatchId)}'
         LIMIT 1`,
      );
      const row = res?.values?.[0];
      if (!row) return null;
      return {
        ...row,
        total_items: toNumber(row.total_items),
        ok_count: toNumber(row.ok_count),
        rejected_count: toNumber(row.rejected_count),
        conflict_count: toNumber(row.conflict_count),
      } as SyncBatchLogLocal;
    });
  }
}
