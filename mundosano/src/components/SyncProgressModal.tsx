import {
  IonButton,
  IonContent,
  IonItem,
  IonLabel,
  IonModal,
  IonProgressBar,
  IonText,
} from "@ionic/react";

export type SyncTableSummary = {
  name: string;
  count: number;
};

export type SyncProgressView = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  phase?: string;
  detail?: string;
  progress?: number | null;
  loadedBytes?: number;
  totalBytes?: number;
  status?: "idle" | "running" | "success" | "error";
  canClose?: boolean;
  tableSummaries?: SyncTableSummary[];
  processedItems?: number;
  totalItems?: number;
};

const formatBytes = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
};

const statusColor = (status?: string): string => {
  if (status === "success") return "success";
  if (status === "error") return "danger";
  return "primary";
};

const SyncProgressModal: React.FC<{
  state: SyncProgressView;
  onClose: () => void;
}> = ({ state, onClose }) => {
  const hasTables = Array.isArray(state.tableSummaries) && state.tableSummaries.length > 0;

  return (
    <IonModal isOpen={state.isOpen} backdropDismiss={false}>
      <IonContent className="ion-padding">
        <h2>{state.title}</h2>
        {state.subtitle ? <p>{state.subtitle}</p> : null}

        {state.phase ? (
          <IonText color={statusColor(state.status)}>
            <p>
              <strong>{state.phase}</strong>
            </p>
          </IonText>
        ) : null}

        {state.detail ? <p>{state.detail}</p> : null}

        {typeof state.progress === "number" ? (
          <>
            <IonProgressBar
              value={Math.max(0, Math.min(1, state.progress))}
              color={statusColor(state.status)}
            />
            <p>{Math.round(state.progress * 100)}%</p>
          </>
        ) : (
          <IonProgressBar type="indeterminate" color={statusColor(state.status)} />
        )}

        {(state.loadedBytes || state.totalBytes) ? (
          <p>
            Descargado: {formatBytes(state.loadedBytes)}
            {state.totalBytes ? ` / ${formatBytes(state.totalBytes)}` : ""}
          </p>
        ) : null}

        {typeof state.totalItems === "number" ? (
          <p>
            Procesados: {state.processedItems ?? 0} / {state.totalItems}
          </p>
        ) : null}

        {hasTables ? (
          <div style={{ marginTop: 16 }}>
            <p>
              <strong>Tablas involucradas</strong>
            </p>
            {state.tableSummaries!.map((table) => (
              <IonItem key={table.name}>
                <IonLabel>
                  {table.name}
                  <p>{table.count} registros</p>
                </IonLabel>
              </IonItem>
            ))}
          </div>
        ) : null}

        <IonButton expand="block" onClick={onClose} disabled={!state.canClose}>
          Cerrar
        </IonButton>
      </IonContent>
    </IonModal>
  );
};

export default SyncProgressModal;
