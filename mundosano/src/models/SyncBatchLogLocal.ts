export interface SyncBatchLogLocal {
  sync_batch_id: string;
  usuario?: string | null;
  dispositivo?: string | null;
  version_app?: string | null;
  fecha_inicio: string;
  fecha_fin?: string | null;
  estado: string;
  total_items: number;
  ok_count: number;
  rejected_count: number;
  conflict_count: number;
  mensaje?: string | null;
}

export type SyncMetaPayload = {
  syncBatchId: string;
  usuario?: string | null;
  dispositivo?: string | null;
  versionApp?: string | null;
  fechaInicio: string;
};

