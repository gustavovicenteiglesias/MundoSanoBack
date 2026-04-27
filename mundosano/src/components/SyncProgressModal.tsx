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
    <IonModal 
      isOpen={state.isOpen} 
      backdropDismiss={false}
      style={{
        "--height": "auto",
        "--width": "90%",
        "--max-width": "400px",
        "--border-radius": "16px",
        "--box-shadow": "0 28px 48px rgba(0,0,0,0.4)"
      }}
    >
      <div className="ion-padding" style={{ background: "var(--ion-background-color, #1e1e1e)", color: "var(--ion-text-color, #fff)", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "1.4rem", margin: "0 0 8px 0", fontWeight: "700", color: "var(--ion-text-color)" }}>{state.title}</h2>
        {state.subtitle ? <p style={{ fontSize: "0.9rem", color: "var(--ion-color-medium)", margin: "0 0 16px 0" }}>{state.subtitle}</p> : null}

        <div style={{ background: "var(--ion-color-step-100, #2a2a2a)", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
          {state.phase ? (
            <IonText color={statusColor(state.status)}>
              <p style={{ margin: "0 0 8px 0", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: "1px", fontWeight: "bold" }}>
                {state.phase}
              </p>
            </IonText>
          ) : null}

          {state.detail ? <p style={{ fontSize: "0.85rem", margin: "0 0 12px 0", minHeight: "2.4em" }}>{state.detail}</p> : null}

          {typeof state.progress === "number" ? (
            <>
              <IonProgressBar
                value={Math.max(0, Math.min(1, state.progress))}
                color={statusColor(state.status)}
                style={{ height: "8px", borderRadius: "4px" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.75rem", color: "var(--ion-color-medium)" }}>
                <span>{Math.round(state.progress * 100)}% Completado</span>
                {(state.loadedBytes || state.totalBytes) ? (
                  <span>{formatBytes(state.loadedBytes)} / {formatBytes(state.totalBytes)}</span>
                ) : null}
              </div>
            </>
          ) : (
            <IonProgressBar type="indeterminate" color={statusColor(state.status)} style={{ height: "6px", borderRadius: "3px" }} />
          )}
        </div>

        {typeof state.totalItems === "number" && state.totalItems > 0 ? (
          <div style={{ background: "var(--ion-color-step-100, #2a2a2a)", padding: "12px", borderRadius: "12px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--ion-color-medium)" }}>Registros totales:</span>
            <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--ion-text-color)" }}>
               {state.processedItems ?? 0} / {state.totalItems}
            </span>
          </div>
        ) : null}

        {hasTables ? (
          <div style={{ maxHeight: "150px", overflowY: "auto", background: "var(--ion-color-step-50, #161616)", borderRadius: "12px", padding: "8px" }}>
            {state.tableSummaries!.map((table) => (
              <div key={table.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px", borderBottom: "1px solid var(--ion-color-step-200)", fontSize: "0.8rem" }}>
                <span style={{ color: "var(--ion-text-color)" }}>{table.name}</span>
                <span style={{ color: "var(--ion-color-success)", fontWeight: "bold" }}>{table.count}</span>
              </div>
            ))}
          </div>
        ) : null}

        <IonButton 
          expand="block" 
          onClick={onClose} 
          disabled={!state.canClose}
          style={{ marginTop: "20px", "--border-radius": "10px", "--background": "#3880ff" }}
        >
          {state.status === "success" ? "Finalizar" : "Cerrar"}
        </IonButton>
      </div>
    </IonModal>
  );
};

export default SyncProgressModal;
