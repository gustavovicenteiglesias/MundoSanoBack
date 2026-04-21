export interface SyncItemLogLocal {
  id_item?: number;
  sync_batch_id: string;
  tabla: string;
  uuid?: string | null;
  id_persona?: number | null;
  id_control?: number | null;
  id_referencia?: number | null;
  estado: string;
  motivo?: string | null;
  payload_json?: string | null;
  created_at: string;
}

