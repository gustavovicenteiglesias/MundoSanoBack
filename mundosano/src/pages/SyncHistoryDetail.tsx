import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { useState } from "react";
import { useParams } from "react-router";
import { animationBuilder } from "../components/AnimationBuilder";
import { SyncBatchLogLocal } from "../models/SyncBatchLogLocal";
import { SyncItemLogLocal } from "../models/SyncItemLogLocal";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";
import { SyncItemLogLocalRepo } from "../repository/syncItemLogLocalRepo";

const batchRepo = new SyncBatchLogLocalRepo();
const itemRepo = new SyncItemLogLocalRepo();

const toCsvValue = (value: any): string => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
};

const SyncHistoryDetail: React.FC = () => {
  const { syncBatchId } = useParams<{ syncBatchId: string }>();
  const [presentAlert] = useIonAlert();
  const [batch, setBatch] = useState<SyncBatchLogLocal | null>(null);
  const [items, setItems] = useState<SyncItemLogLocal[]>([]);

  const load = async () => {
    try {
      const id = decodeURIComponent(syncBatchId);
      setBatch(await batchRepo.getBySyncBatchId(id));
      setItems(await itemRepo.getBySyncBatchId(id));
    } catch (_error) {
      presentAlert({ header: "Error", message: "No se pudo cargar detalle sync", buttons: ["OK"] });
    }
  };

  useIonViewWillEnter(() => {
    load();
  });

  const exportDetailCsv = () => {
    const header = [
      "sync_batch_id",
      "tabla",
      "uuid",
      "id_persona",
      "id_control",
      "id_referencia",
      "estado",
      "motivo",
      "created_at",
      "payload_json",
    ];
    const lines = [header.join(",")];
    for (const row of items) {
      lines.push([
        toCsvValue(row.sync_batch_id),
        toCsvValue(row.tabla),
        toCsvValue(row.uuid),
        toCsvValue(row.id_persona),
        toCsvValue(row.id_control),
        toCsvValue(row.id_referencia),
        toCsvValue(row.estado),
        toCsvValue(row.motivo),
        toCsvValue(row.created_at),
        toCsvValue(row.payload_json),
      ].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sync-history-detail-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Detalle Sync</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/sync-history" routerAnimation={animationBuilder} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>
            <h2>{batch?.sync_batch_id || decodeURIComponent(syncBatchId)}</h2>
            <p>Inicio: {batch?.fecha_inicio || "-"}</p>
            <p>Fin: {batch?.fecha_fin || "-"}</p>
            <p>Estado: {batch?.estado || "-"}</p>
            <p>Total: {batch?.total_items || 0} | OK: {batch?.ok_count || 0} | Rech: {batch?.rejected_count || 0} | Conf: {batch?.conflict_count || 0}</p>
          </IonLabel>
        </IonItem>
        <IonButton expand="block" color="medium" onClick={exportDetailCsv}>Exportar CSV Detalle</IonButton>
        <IonList>
          {items.map((item) => (
            <IonItem key={item.id_item || `${item.sync_batch_id}-${item.created_at}-${item.tabla}`}>
              <IonLabel>
                <h3>{item.tabla} - {item.estado}</h3>
                <p>persona: {item.id_persona ?? "-"} | control: {item.id_control ?? "-"} | ref: {item.id_referencia ?? "-"}</p>
                <p>{item.motivo || "-"}</p>
              </IonLabel>
            </IonItem>
          ))}
          {items.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay items para este lote.</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SyncHistoryDetail;
