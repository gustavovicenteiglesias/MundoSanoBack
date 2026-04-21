import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
} from "@ionic/react";
import { useMemo, useState } from "react";
import { useHistory } from "react-router";
import { animationBuilder } from "../components/AnimationBuilder";
import { SyncBatchLogLocal } from "../models/SyncBatchLogLocal";
import { SyncBatchLogLocalRepo } from "../repository/syncBatchLogLocalRepo";

const repo = new SyncBatchLogLocalRepo();

const toCsvValue = (value: any): string => {
  const text = String(value ?? "");
  if (text.includes(",") || text.includes("\"") || text.includes("\n")) {
    return `"${text.replace(/"/g, "\"\"")}"`;
  }
  return text;
};

const SyncHistory: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [batches, setBatches] = useState<SyncBatchLogLocal[]>([]);
  const [search, setSearch] = useState("");
  const [estado, setEstado] = useState("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  const load = async () => {
    try {
      setBatches(await repo.listAll());
    } catch (_error) {
      presentAlert({ header: "Error", message: "No se pudo cargar historial sync", buttons: ["OK"] });
    }
  };

  useIonViewWillEnter(() => {
    load();
  });

  const filtered = useMemo(() => {
    return batches.filter((item) => {
      const matchSearch = !search || item.sync_batch_id.toLowerCase().includes(search.toLowerCase());
      const matchEstado = !estado || item.estado.toLowerCase() === estado.toLowerCase();
      const fecha = (item.fecha_inicio || "").slice(0, 10);
      const matchDesde = !fechaDesde || fecha >= fechaDesde;
      const matchHasta = !fechaHasta || fecha <= fechaHasta;
      return matchSearch && matchEstado && matchDesde && matchHasta;
    });
  }, [batches, search, estado, fechaDesde, fechaHasta]);

  const exportCsv = () => {
    const header = [
      "sync_batch_id",
      "fecha_inicio",
      "fecha_fin",
      "estado",
      "total_items",
      "ok_count",
      "rejected_count",
      "conflict_count",
      "usuario",
      "dispositivo",
      "version_app",
      "mensaje",
    ];
    const lines = [header.join(",")];
    for (const row of filtered) {
      lines.push([
        toCsvValue(row.sync_batch_id),
        toCsvValue(row.fecha_inicio),
        toCsvValue(row.fecha_fin),
        toCsvValue(row.estado),
        toCsvValue(row.total_items),
        toCsvValue(row.ok_count),
        toCsvValue(row.rejected_count),
        toCsvValue(row.conflict_count),
        toCsvValue(row.usuario),
        toCsvValue(row.dispositivo),
        toCsvValue(row.version_app),
        toCsvValue(row.mensaje),
      ].join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sync-history-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Historial Sync</IonTitle>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" routerAnimation={animationBuilder} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel position="stacked">Buscar batch</IonLabel>
          <IonInput
            value={search}
            onIonChange={(e: any) => setSearch(String(e.detail.value || ""))}
            placeholder="sync_batch_id"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Estado</IonLabel>
          <IonInput
            value={estado}
            onIonChange={(e: any) => setEstado(String(e.detail.value || ""))}
            placeholder="OK | PARCIAL | ERROR"
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Desde</IonLabel>
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Hasta</IonLabel>
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </IonItem>
        <IonButton expand="block" color="medium" onClick={exportCsv}>Exportar CSV</IonButton>
        <IonList>
          {filtered.map((item) => (
            <IonItem
              key={item.sync_batch_id}
              button
              onClick={() => history.push(`/sync-history/${encodeURIComponent(item.sync_batch_id)}`)}
            >
              <IonLabel>
                <h2>{item.sync_batch_id}</h2>
                <p>{item.fecha_inicio}</p>
                <p>Total: {item.total_items} | Rech: {item.rejected_count} | Conf: {item.conflict_count}</p>
              </IonLabel>
              <IonBadge color={item.estado === "OK" ? "success" : item.estado === "PARCIAL" ? "warning" : item.estado === "ERROR" ? "danger" : "medium"}>
                {item.estado}
              </IonBadge>
            </IonItem>
          ))}
          {filtered.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay lotes para los filtros actuales.</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SyncHistory;
