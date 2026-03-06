import { IonBackButton, IonButton, IonButtons, useIonAlert, IonContent, IonGrid, IonHeader, withIonLifeCycle, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';

import { useEffect, useMemo, useRef, useState } from 'react';

import { animationBuilder } from "../components/AnimationBuilder"
import DataTable from 'react-data-table-component';
import { useHistory } from 'react-router';
import { IoAddCircleOutline } from 'react-icons/io5';
import FilterComponent from '../components/FilterComponent';
import { PersonasRepository } from '../repository/personasRepo';


//import './Home.css';

const Personas: React.FC = () => {
  const history = useHistory()
  const [presentAlert]=useIonAlert()
  const [personas, setPersonas] = useState<any>([])
  const [toggledClearRows, setToggleClearRows] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [isPendientes, setIsPendientes] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
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

    const testDatabaseCopyFromAssets = async (): Promise<any> => {
      try {
         

          setLoading(true)
          let res = await repository.getTodos()
         
          let pendiente=await repository.getPendientes()
          //console.log("Pendientes " + JSON.stringify(pendiente))
          
          let arr = pendiente
          const result = arr.filter(
            (thing: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.id_control === thing.id_control && t.id_persona === thing.id_persona)
          );
          result1 = result.filter(
            (thing: any, index: any, self: any) =>
              index ===
              self.findIndex((t: any) => t.id_persona === thing.id_persona)
          );
          //console.log(result);
          //console.log(result1);
          isPendientes ? setPersonas(result1) : setPersonas(res)
          setLoading(false)

          // setPaises(JSON.parse(res.values) )
          

        
        return true;
      }
      catch (error: any) {
        window.location.reload();
        return false;
      }
    }
    testDatabaseCopyFromAssets()
    
  }, [])

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
 


  const filteredItems = personas.filter(
    (item: any) => item.nombre && item.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
      item.apellido && item.apellido.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre_pais && item.nombre_pais.toLowerCase().includes(filterText.toLowerCase()) ||
      item.etmi && item.etmi.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre_area && item.nombre_area.toLowerCase().includes(filterText.toLowerCase()) ||
      item.nombre_paraje && item.nombre_paraje.toLowerCase().includes(filterText.toLowerCase()) ||
      item.documento && item.documento.toLowerCase().includes(filterText.toLowerCase())
  );
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };

    return (
      <FilterComponent onFilter={((e: any) => setFilterText(e.target.value))} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);

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