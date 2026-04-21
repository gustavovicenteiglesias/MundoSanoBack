import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter
} from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import { IoAddCircleOutline } from 'react-icons/io5';
import { chevronForwardOutline, cloudDoneOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline } from 'ionicons/icons';
import { animationBuilder } from "../components/AnimationBuilder";
import FilterComponent from '../components/FilterComponent';
import { PersonasRepository } from '../repository/personasRepo';
import './Personas.css';

type SyncStatus = 'ok' | 'pending' | 'error' | 'unknown';

const LAST_SYNC_RESULT_KEY = "sync_last_result_v1";

const Personas: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [personas, setPersonas] = useState<any[]>([]);
  const [syncStatusByPersona, setSyncStatusByPersona] = useState<Record<number, SyncStatus>>({});
  const [filterText, setFilterText] = useState(() => sessionStorage.getItem("personas_filter") || '');
  const [isPendientes, setIsPendientes] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [segmentEstado, setSegmentEstado] = useState<'todas' | 'embarazadas' | 'puerperas'>('todas');
  const repository = new PersonasRepository();

  const isRiesgo = (row: any): boolean => row.id_etmi !== null || (row.id_app !== 10 && row.id_app !== null);

  const getSyncStatusMap = async (rows: any[]): Promise<Record<number, SyncStatus>> => {
    const statusMap: Record<number, SyncStatus> = {};
    const lastSyncUnix = await repository.getLastSyncUnix();

    const raw = localStorage.getItem(LAST_SYNC_RESULT_KEY);
    let errorPersonIds = new Set<number>();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const ids = Array.isArray(parsed?.errorPersonIds) ? parsed.errorPersonIds : [];
        errorPersonIds = new Set(
          ids.map((value: any) => Number(value)).filter((value: number) => Number.isFinite(value))
        );
      } catch (_error) {
        errorPersonIds = new Set<number>();
      }
    }

    for (const row of rows) {
      const idPersona = Number(row?.id_persona);
      if (!Number.isFinite(idPersona)) {
        continue;
      }

      if (errorPersonIds.has(idPersona)) {
        statusMap[idPersona] = 'error';
        continue;
      }

      if (!lastSyncUnix) {
        statusMap[idPersona] = 'unknown';
        continue;
      }

      const lastModified = Number(row?.last_modified);
      if (!Number.isFinite(lastModified)) {
        statusMap[idPersona] = 'unknown';
        continue;
      }

      statusMap[idPersona] = lastModified > lastSyncUnix ? 'pending' : 'ok';
    }

    return statusMap;
  };

  useEffect(() => {
    sessionStorage.setItem("personas_filter", filterText);
  }, [filterText]);

  const loadPersonas = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await repository.getTodos();
      const pendiente = await repository.getPendientes();

      const dedupByControl = pendiente.filter(
        (thing: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.id_control === thing.id_control && t.id_persona === thing.id_persona)
      );
      const dedupByPersona = dedupByControl.filter(
        (thing: any, index: number, self: any[]) =>
          index === self.findIndex((t: any) => t.id_persona === thing.id_persona)
      );

      const rows = isPendientes ? dedupByPersona : res;
      setPersonas(rows);
      setSyncStatusByPersona(await getSyncStatusMap(rows));
      setLoading(false);
      return true;
    } catch (_error: any) {
      setLoading(false);
      presentAlert({ header: "Error", message: "No se pudieron cargar las personas", buttons: ["OK"] });
      return false;
    }
  };

  useEffect(() => {
    loadPersonas();
  }, [isPendientes]);

  useIonViewWillEnter(() => {
    loadPersonas();
  });

  const filteredItems = personas.filter((item: any) => {
    const term = filterText.toLowerCase().trim();
    if (!term && segmentEstado === 'todas') return true;

    const nombre = (item.nombre || '').toLowerCase();
    const apellido = (item.apellido || '').toLowerCase();
    const nombreCompleto = `${nombre} ${apellido}`.trim();

    const matchTexto = (
      nombre.includes(term) ||
      apellido.includes(term) ||
      nombreCompleto.includes(term) ||
      (item.nombre_pais && item.nombre_pais.toLowerCase().includes(term)) ||
      (item.etmi && item.etmi.toLowerCase().includes(term)) ||
      (item.nombre_area && item.nombre_area.toLowerCase().includes(term)) ||
      (item.nombre_paraje && item.nombre_paraje.toLowerCase().includes(term)) ||
      (item.documento && item.documento.toLowerCase().includes(term))
    );

    const estado = item.id_estado ?? item.estado;
    const matchEstado =
      segmentEstado === 'todas' ||
      estado === undefined || estado === null ||
      (segmentEstado === 'embarazadas' && (estado === 1 || estado === 'Embarazada' || estado === 'EMBARAZADA')) ||
      (segmentEstado === 'puerperas' && (estado === 2 || estado === 'Puerpera' || estado === 'PUERPERA'));

    return matchTexto && matchEstado;
  });

  const handleClear = () => {
    if (filterText) {
      setFilterText('');
    }
  };

  const getSyncVisual = (status: SyncStatus) => {
    if (status === 'ok') {
      return { icon: cloudDoneOutline, label: 'Sincronizado', className: 'sync-ok' };
    }
    if (status === 'pending') {
      return { icon: cloudUploadOutline, label: 'Pendiente', className: 'sync-pending' };
    }
    if (status === 'error') {
      return { icon: cloudOfflineOutline, label: 'Conflicto/Rechazo', className: 'sync-error' };
    }
    return { icon: cloudOutline, label: 'Desconocido', className: 'sync-unknown' };
  };

  const subHeaderComponentMemo = useMemo(() => (
    <div style={{ width: "100%" }}>
      <FilterComponent onFilter={(e: any) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      <IonLabel color="medium" style={{ paddingLeft: 8 }}>Mostrando {filteredItems.length} de {personas.length}</IonLabel>
    </div>
  ), [filterText, filteredItems.length, personas.length]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle slot="end">Paciente</IonTitle>
          <IonButtons slot="start" onClick={() => history.push("/")}>
            <IonBackButton defaultHref="/" routerAnimation={animationBuilder} />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonButton onClick={() => setIsPendientes(true)} fill="clear" slot='end'><IoAddCircleOutline size={30} />{" "}Pendientes</IonButton>
          <IonButton onClick={() => setIsPendientes(false)} fill="clear" slot='end'><IoAddCircleOutline size={30} />{" "}Ver Todos</IonButton>
          <IonButton href='/nuevaembarazada' fill="clear" slot='start'><IoAddCircleOutline size={30} />{" "}Nueva Embarazada</IonButton>
        </IonItem>

        <IonItem lines="none">
          <IonLabel>Filtrar estado</IonLabel>
          <IonSegment value={segmentEstado} onIonChange={(e) => setSegmentEstado(e.detail.value as any)}>
            <IonSegmentButton value="todas">
              <IonLabel>Todas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="embarazadas">
              <IonLabel>Embarazadas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="puerperas">
              <IonLabel>Puerperas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonItem>

        {subHeaderComponentMemo}

        <div className="sync-legend">
          <span className="sync-legend-item"><IonIcon icon={cloudDoneOutline} className="sync-cloud sync-ok" /> OK</span>
          <span className="sync-legend-item"><IonIcon icon={cloudUploadOutline} className="sync-cloud sync-pending" /> Pendiente</span>
          <span className="sync-legend-item"><IonIcon icon={cloudOfflineOutline} className="sync-cloud sync-error" /> Conflicto</span>
          <span className="sync-legend-item"><IonIcon icon={cloudOutline} className="sync-cloud sync-unknown" /> Desconocido</span>
        </div>

        <IonList className="personas-list">
          {loading && (
            <IonItem>
              <IonLabel>Cargando personas...</IonLabel>
            </IonItem>
          )}

          {!loading && filteredItems.map((row: any, index: number) => {
            const riesgo = isRiesgo(row);
            const syncStatus = syncStatusByPersona[Number(row.id_persona)] ?? 'unknown';
            const syncVisual = getSyncVisual(syncStatus);

            return (
              <IonItem
                key={`${row.id_persona}-${index}`}
                button
                detail={false}
                onClick={() => history.push({ pathname: "/detallePaciente", state: row })}
                className={`persona-item ${riesgo ? 'persona-item-risk' : ''}`}
              >
                <IonLabel>
                  <h2>{`${row.apellido || ''}, ${row.nombre || ''}`}</h2>
                  <p>ID {row.id_persona} {row.documento ? `| DNI ${row.documento}` : ''}</p>
                  <p>{row.nombre_area || '-'} | {row.nombre_paraje || '-'} | {row.nombre_pais || '-'}</p>
                  <div className="persona-badges">
                    {row.etmi && <IonBadge color="danger">ETMI: {row.etmi}</IonBadge>}
                    {row.apps && row.id_app !== 10 && <IonBadge color="danger">Patologico: {row.apps}</IonBadge>}
                  </div>
                </IonLabel>
                <div slot="end" className="persona-end">
                  <IonIcon icon={syncVisual.icon} className={`sync-cloud ${syncVisual.className}`} title={syncVisual.label} />
                  <IonIcon icon={chevronForwardOutline} className="persona-chevron" />
                </div>
              </IonItem>
            );
          })}

          {!loading && filteredItems.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay personas para mostrar con los filtros actuales.</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Personas;
