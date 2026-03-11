import { IonBackButton, IonButton, IonButtons, useIonAlert, IonContent, IonGrid, IonHeader, withIonLifeCycle, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';

import { useEffect, useMemo, useRef, useState } from 'react';

import { animationBuilder } from "../components/AnimationBuilder"
import DataTable from 'react-data-table-component';
import { useHistory } from 'react-router';
import { IoAddCircleOutline } from 'react-icons/io5';
import FilterComponent from '../components/FilterComponent';
import { PersonasRepository } from '../repository/personasRepo';
import { IonSegment, IonSegmentButton } from '@ionic/react';


//import './Home.css';

const Personas: React.FC = () => {
  const history = useHistory()
  const [presentAlert]=useIonAlert()
  const [personas, setPersonas] = useState<any>([])
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [filterText, setFilterText] = useState(() => sessionStorage.getItem("personas_filter") || '');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [isPendientes, setIsPendientes] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [segmentEstado, setSegmentEstado] = useState<'todas' | 'embarazadas' | 'puerperas'>('todas');
  const repository=new PersonasRepository()

  var result1: any = [];

  

  const handleChange = (selectedRows: any) => {
    console.log("all" + selectedRows.allSelected)
    console.log("selectedCoun" + selectedRows.selectedCount)
    //
    if ((!selectedRows.allSelected && selectedRows.selectedCount > 0 && selectedRows.selectedCount < 2) || (selectedRows.allSelected && (selectedRows.selectedCount === 1))) {

      setToggleClearRows(!toggledClearRows)
     
      history.push({ pathname: "/detallePaciente", state: selectedRows.selectedRows[0] })
      //window.location.reload()

    }
    setToggleClearRows(!toggledClearRows)
  };

  

  useEffect(() => {
    sessionStorage.setItem("personas_filter", filterText);
  }, [filterText]);

  const loadPersonas = async (): Promise<boolean> => {
    try {
      setLoading(true);
      let res = await repository.getTodos();
      let pendiente = await repository.getPendientes();

      let arr = pendiente;
      const result = arr.filter(
        (thing: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.id_control === thing.id_control && t.id_persona === thing.id_persona)
      );
      result1 = result.filter(
        (thing: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.id_persona === thing.id_persona)
      );

      isPendientes ? setPersonas(result1) : setPersonas(res);
      setLoading(false);
      return true;
    } catch (error: any) {
      setLoading(false);
      presentAlert({ header: "Error", message: "No se pudieron cargar las personas", buttons: ["OK"] });
      return false;
    }
  };

  useEffect(() => {
    loadPersonas();
  }, []);

  useIonViewWillEnter(() => {
    loadPersonas();
  });

  const conditionalRowStyles = [
    {
      when: (row: any) => row.id_etmi !== null,
      style: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        }
      }
    },
    {
      when: (row: any) => (row.id_app !== 10 && row.id_app !== null),
      style: {
        backgroundColor: 'red',
        color: 'white',
        '&:hover': {
          cursor: 'pointer',
        }
      }
    },



  ]
 


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
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <div style={{width:"100%"}}>
        <FilterComponent onFilter={((e: any) => setFilterText(e.target.value))} onClear={handleClear} filterText={filterText} />
        <IonLabel color="medium" style={{paddingLeft:8}}>Mostrando {filteredItems.length} de {personas.length}</IonLabel>
      </div>
    );
  }, [filterText, resetPaginationToggle, filteredItems.length, personas.length]);

  const columns = [

    {
      name: "Cod.Paciente",
      selector: (row: any) => row.id_persona,
      sortable: true,
    },

    {
      name: "Nombre",
      selector: (row: any) => row.nombre,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row: any) => row.apellido,
      sortable: true,
    },

    {
      name: "ETMI",
      selector: (row: any) => row.etmi,
      sortable: true,
    },
    {
      name: "PATOLÓGICO",
      selector: (row: any) => row.apps,
      sortable: true,
    },

    {
      name: "PAIS",
      selector: (row: any) => row.nombre_pais,
      sortable: true,
      omit: true
    },
  ]

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

          <IonButton onClick={()=>setIsPendientes(true)} fill="clear" slot='end'><IoAddCircleOutline size={30} />{" "}Pendientes</IonButton>
          <IonButton onClick={() => setIsPendientes(false)} fill="clear" slot='end'><IoAddCircleOutline size={30} />{" "}Ver Todos</IonButton>
          <IonButton href='/nuevaembarazada' fill="clear" slot='start'><IoAddCircleOutline size={30} />{" "}Nueva Embarazada</IonButton>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Filtrar estado</IonLabel>
          <IonSegment value={segmentEstado} onIonChange={(e)=> setSegmentEstado(e.detail.value as any)}>
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

        <DataTable
          columns={columns}
          data={filteredItems}
          selectableRows
          onSelectedRowsChange={handleChange}
          clearSelectedRows={toggledClearRows}
          conditionalRowStyles={conditionalRowStyles}
          pagination
          paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
          subHeader
          subHeaderComponent={subHeaderComponentMemo}
          persistTableHead
          progressPending={loading}

        />
      </IonContent>
    </IonPage>

  );
};

export default Personas;
