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
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  useIonAlert,
  useIonViewWillEnter
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IoAddCircleOutline } from 'react-icons/io5';
import { chevronForwardOutline, cloudDoneOutline, cloudOfflineOutline, cloudOutline, cloudUploadOutline } from 'ionicons/icons';
import { animationBuilder } from "../components/AnimationBuilder";
import FilterComponent from '../components/FilterComponent';
import { PersonasRepository } from '../repository/personasRepo';
import "./Personas.css";
import { chevronBackOutline } from 'ionicons/icons';

type SyncStatus = 'ok' | 'pending' | 'error' | 'unknown';

const LAST_SYNC_RESULT_KEY = "sync_last_result_v1";
const PAGE_LIMIT = 20;

const Personas: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();
  const [personas, setPersonas] = useState<any[]>([]);
  const [syncStatusByPersona, setSyncStatusByPersona] = useState<Record<number, SyncStatus>>({});
  const [filterText, setFilterText] = useState(() => sessionStorage.getItem("personas_filter") || '');
  const [isPendientes, setIsPendientes] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [infiniteDisabled, setInfiniteDisabled] = useState(false);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [segmentEstado, setSegmentEstado] = useState<'todas' | 'embarazadas' | 'puerperas'>('todas');
  const repository = new PersonasRepository();

  const isRiesgo = (row: any): boolean => row.id_etmi !== null || (row.id_app !== 10 && row.id_app !== null);

  const getSyncStatusMap = async (rows: any[]): Promise<Record<number, SyncStatus>> => {
    const statusMap: Record<number, SyncStatus> = {};

    // 1. Obtener fecha de sync y normalizarla a número
    const rawSyncDate = await repository.getLastSyncUnix();
    //console.log("rawSyncDate", rawSyncDate);
    // Si es ISO, Date.parse lo convierte a ms, si es Unix "1777..." lo manejamos
    const lastSyncUnix = !rawSyncDate
      ? 0
      : typeof rawSyncDate === 'number'
        ? rawSyncDate
        : isNaN(Number(rawSyncDate))
          ? Date.parse(rawSyncDate) / 1000
          : Number(rawSyncDate);
    const raw = localStorage.getItem(LAST_SYNC_RESULT_KEY);
    let errorPersonIds = new Set<number>();

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const ids = Array.isArray(parsed?.errorPersonIds) ? parsed.errorPersonIds : [];
        errorPersonIds = new Set(ids.map((v: any) => Number(v)).filter((v: number) => Number.isFinite(v)));
      } catch { }
    }

    const personIds = rows.map((row: any) => Number(row?.id_persona)).filter((v: number) => Number.isFinite(v));
    const maxLastModifiedByPersona = await repository.getSyncStatusByPersonIds(personIds);

    for (const row of rows) {
      const idPersona = Number(row?.id_persona);
      if (!Number.isFinite(idPersona)) continue;

      const maxLastModified = Number(maxLastModifiedByPersona[idPersona]);
      //console.log("maxLastModified", maxLastModified);
      //console.log("lastSyncUnix", lastSyncUnix);

      // --- NUEVA LÓGICA DE PRIORIDADES ---

      // 1. ¿Tiene cambios pendientes? (Esto manda sobre el error)
      // Si el usuario modificó algo, la nube DEBE ser Ámbar (pending) aunque antes haya fallado.
      if (maxLastModified > lastSyncUnix) {
        statusMap[idPersona] = "pending";
        continue;
      }

      // 2. Si no tiene cambios nuevos, ¿el último envío dio error?
      if (errorPersonIds.has(idPersona)) {
        statusMap[idPersona] = "error";
        continue;
      }

      // 3. Si no tiene cambios y no hay error, está sincronizado
      if (lastSyncUnix > 0 && maxLastModified <= lastSyncUnix) {
        statusMap[idPersona] = "ok";
      } else {
        statusMap[idPersona] = "unknown";
      }
    }
    //console.log("statusMap", statusMap);
    return statusMap;
  };

  useEffect(() => {
    sessionStorage.setItem("personas_filter", filterText);
  }, [filterText]);

  const loadPersonas = async (reset: boolean = false): Promise<boolean> => {
    try {
      if (reset) {
        setLoading(true);
        setOffset(0);
        setInfiniteDisabled(false);
      }

      const currentOffset = reset ? 0 : offset;
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

      const baseRows = isPendientes ? dedupByPersona : res;

      // Aplicamos los filtros aquí para poder paginar el resultado antes de guardarlo en el estado
      const filtered = baseRows.filter((item: any) => {
        const term = filterText.toLowerCase().trim();
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

      setTotalFiltered(filtered.length);

      // Tomamos solo el "pedazo" (chunk) que corresponde a la página actual
      const chunk = filtered.slice(currentOffset, currentOffset + PAGE_LIMIT);
      
      if (reset) {
        setPersonas(chunk);
        setSyncStatusByPersona(await getSyncStatusMap(chunk));
      } else {
        setPersonas(prev => [...prev, ...chunk]);
        const newStatuses = await getSyncStatusMap(chunk);
        setSyncStatusByPersona(prev => ({ ...prev, ...newStatuses }));
      }

      const nextOffset = currentOffset + PAGE_LIMIT;
      setOffset(nextOffset);
      
      // Si ya mostramos todo, desactivamos el scroll infinito
      if (nextOffset >= filtered.length) {
        setInfiniteDisabled(true);
      }

      return true;
    } catch (_error: any) {
      presentAlert({ header: "Error", message: "No se pudieron cargar las personas", buttons: ["OK"] });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async (ev: any) => {
    await loadPersonas(false);
    ev.target.complete();
  };

  useEffect(() => {
    sessionStorage.setItem("personas_filter", filterText);
    loadPersonas(true); // Recargar desde cero cuando cambien los filtros
  }, [isPendientes, segmentEstado, filterText]);

  useIonViewWillEnter(() => {
    loadPersonas(true);
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

  const subHeaderComponent = (
    <div style={{ width: "100%" }}>
      <FilterComponent onFilter={(e: any) => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
      <IonLabel color="medium" style={{ paddingLeft: 12, fontSize: '0.9em', fontWeight: 500 }}>
        Mostrando {personas.length} de {totalFiltered} registros
      </IonLabel>
    </div>
  );

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle slot="end">Paciente</IonTitle>
          <IonButtons slot="start" >
            <IonButton onClick={() => history.push("/")}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', padding: '4px 8px', borderBottom: '1px solid #eee' }}>
          <IonButton href='/nuevaembarazada' fill="clear" style={{ '--padding-start': '4px' }}>
            <IoAddCircleOutline size={26} />
            <span style={{ marginLeft: '6px', fontSize: '13px', fontWeight: 'bold', textTransform: 'none' }}>Nueva Embarazada</span>
          </IonButton>
          <div style={{ display: 'flex' }}>
            <IonButton onClick={() => setIsPendientes(true)} fill="clear" color={isPendientes ? "primary" : "dark"}>
              <span style={{ fontSize: '13px', textTransform: 'none' }}>{isPendientes ? "● " : ""}Pendientes</span>
            </IonButton>
            <div style={{ width: '1px', height: '20px', backgroundColor: '#ccc', alignSelf: 'center', margin: '0 2px' }}></div>
            <IonButton onClick={() => setIsPendientes(false)} fill="clear" color={!isPendientes ? "primary" : "dark"}>
              <span style={{ fontSize: '13px', textTransform: 'none' }}>{!isPendientes ? "● " : ""}Todos</span>
            </IonButton>
          </div>
        </div>

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

        {subHeaderComponent}

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

          {!loading && personas.map((row: any, index: number) => {
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

          {!loading && personas.length === 0 && (
            <IonItem>
              <IonLabel color="medium">No hay personas para mostrar con los filtros actuales.</IonLabel>
            </IonItem>
          )}
        </IonList>

        <IonInfiniteScroll
          threshold="100px"
          disabled={infiniteDisabled}
          onIonInfinite={loadMore}
        >
          <IonInfiniteScrollContent
            loadingText="Cargando más personas..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default Personas;
