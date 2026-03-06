import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import { SQLiteDBConnection, SQLiteHook, useSQLite } from 'react-sqlite-hook';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useEffect, useState } from 'react';
import { Usuarios } from './models/Usuarios';
import DetallePaciente from './pages/DetallePaciente';
import Personas from './pages/Personas';
import Main from './pages/Main';
import { GlobalProvider } from './GlobalState';
import NuevaEmbarazada from './pages/NuevaEmbarazada';
import NuevaEmbarazadaAntecedentes from './pages/NuevaEmbarazadaAntecedentes';
import NuevaEmbarazadaControl from './pages/NuevaEmbazadaControl';
import EditControlEmbrazada from './pages/EditControlEmbarazada';
import NuevoControl from './pages/NuevoControl';
import EditarAntecedentes from './pages/EditarAntecedentes';
import { CargarBase } from './data/CargarBase';
import { NOMBRE_BB_DD } from './utils/constantes';
import NuevoAntecedentes from './pages/NuevoAntecedentes';
import NuevoEmbarazadaControl from './pages/NuevoEmbarazoControl';


interface JsonListenerInterface {
  jsonListeners: boolean,
  setJsonListeners: React.Dispatch<React.SetStateAction<boolean>>,
}
interface existingConnInterface {
  existConn: boolean,
  setExistConn: React.Dispatch<React.SetStateAction<boolean>>,
}

// Singleton SQLite Hook
export let sqlite: SQLiteHook;
// Existing Connections Store
export let existingConn: existingConnInterface;
// Is Json Listeners used
export let isJsonListeners: JsonListenerInterface;
//exportar bbdd
export let db: SQLiteDBConnection;

setupIonicReact();



const App: React.FC = () => {
  const [existConn, setExistConn] = useState(false);
  const [currentUser, setCurrentUser] = useState<Usuarios>();
  const [showEdituser, setShowEditUser] = useState<boolean>(false);
  const [showReaduser, setShowReadUser] = useState<boolean>(false);
  const [permisGeo, setPermisGeo] = useState<boolean>(false);
  
  existingConn = { existConn: existConn, setExistConn: setExistConn };

  // !!!!! if you do not want to use the progress events !!!!!
  // since react-sqlite-hook 2.1.0
  // sqlite = useSQLite()
  // before
  // sqlite = useSQLite({})
  // !!!!!                                               !!!!!
  console.log(NOMBRE_BB_DD)

  sqlite = useSQLite();

  console.log(`$$$ in App sqlite.isAvailable  ${sqlite.isAvailable} $$$`);
  const Base = async (): Promise<Boolean> => {
    try {
      const platform = (await sqlite.getPlatform()).platform;
      let existe: any = await sqlite.isDatabase(NOMBRE_BB_DD)
      if (!existe.result) {
       await  CargarBase()
       
        setExistConn(true)
        console.log("se cargo base ")
        if (platform === "web") {
          await sqlite.saveToStore(NOMBRE_BB_DD);

        }

      } else {
        await sqlite.createConnection(NOMBRE_BB_DD)
        console.log("ya tiene  base ")
        setExistConn(true)
      }
      return true
    }
    
    catch (err: any) {
      return false
    }
  }
  const CheckPermitionGeoLocation = async () => {
    const resGeo = await Geolocation.checkPermissions()
    console.log("check geo " + resGeo.coarseLocation + " web " + resGeo.location)
    if (resGeo.coarseLocation == "denied" || resGeo.location == "denied") {

      const devicePlataform = await Device.getInfo()
      if (devicePlataform.platform !== "web") {
        const res = await Geolocation.requestPermissions()
        console.log("Pido permisos" + res)
        if (res.coarseLocation == "granted" || res.location == "granted") {
          console.log("Pido permisos ok")
          setPermisGeo(true)
        }
      }



    }

  }
  useEffect(() => {
    let user = sessionStorage.getItem("currenUser")

    if (user !== null) {
      let usuario = JSON.parse(user)
      setCurrentUser(usuario)
      usuario.nivel_acceso === 1 ? setShowEditUser(true) : setShowEditUser(false)
      usuario.nivel_acceso === 2 ? setShowReadUser(true) : setShowReadUser(false)
      console.log("User " + usuario.nivel_acceso)
    }
  }, [])
  useEffect(() => {
    Base()
    CheckPermitionGeoLocation()

  }, [])


  return (
    <GlobalProvider>
    <IonApp>
    
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/home" >
            {showEdituser || showReaduser ? <Main /> : <Home />}
          </Route>
          <Route exact path="/detallePaciente" >
            {showEdituser || showReaduser ? <DetallePaciente /> : <Home />}
          </Route>
          <Route exact path="/personas" >
            {showEdituser || showReaduser ? <Personas/> : <Home />}
          </Route>
          <Route exact path='/nuevaembarazada'>
            {showEdituser || showReaduser ? <NuevaEmbarazada/> : <Home />}
          </Route>
          <Route exact path="/nuevaembarazadaantecedentes">
            {showEdituser || showReaduser ? <NuevaEmbarazadaAntecedentes/> : <Home />}
          </Route>
          <Route exact path="/nuevoantecedentes">
            {showEdituser || showReaduser ? <NuevoAntecedentes/> : <Home />}
          </Route>
          <Route exact path="/nuevaembarazadacontrol">
            {showEdituser || showReaduser ? <NuevaEmbarazadaControl/> : <Home />}
          </Route>
          <Route exact path="/editcontrol">
            {showEdituser || showReaduser ? <EditControlEmbrazada/> : <Home />}
          </Route>
          <Route exact path="/nuevocontrol">
            {showEdituser || showReaduser ? <NuevoControl/> : <Home />}
          </Route>
          <Route exact path="/editantecedentes">
            {showEdituser || showReaduser ? <EditarAntecedentes/> : <Home />}
          </Route>
          <Route exact path="/nuevoembarazocontrol">
            {showEdituser || showReaduser ? <NuevoEmbarazadaControl/> : <Home />}
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
    </GlobalProvider>
  )
  
}




export default App;
