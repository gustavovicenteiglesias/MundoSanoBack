import axios from "axios";
import { sqlite } from "../App";
import { InicialPersona, Personas } from "../models/PersonasModels";
import { Antecedentes, InicialAntecedentes } from "../models/Antecedentes";
import { Antecedentes_Apps, InicialAntecedentes_Apps } from "../models/Antecedentes_Apps";
import { Antecedentes_Macs, InicialAntecedentes_Macs } from "../models/Antecedentes_Macs";
import { Control_Embarazo, InicialControlEmbarazo } from "../models/Control_Embarazo";
import { Controles, InicialControl } from "../models/Controles";
import { Etmis_Personas, InicialEtmis_Personas } from "../models/Etmis_Personas";
import { Inmunizaciones_Control, InicialInmunizacionesControl } from "../models/Inmunizaciones_Control";
import { Laboratorios_Realizados, InicialLaboratorios } from "../models/Laboratorios_Realizados";
import { Ubicaciones, InicialUbicaciones } from "../models/Ubicaciones";
import { Usuarios,InitialUsuario } from "../models/Usuarios";
import { Repository } from "../repository/Repository";
import { SQLiteDBConnection } from "react-sqlite-hook";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { BASE_URL, NOMBRE_BB_DD } from "../utils/constantes";
import { InicialPaises, Paises } from "../models/Paises";
import { Areas, InicialAreas } from "../models/Areas";
import { InicialParajes, Parajes } from "../models/Parajes";




const dbdb = async () => {
    const ret = await sqlite.checkConnectionsConsistency();
    const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
    var db: SQLiteDBConnection;
    if (ret.result && isConn) {
        return db = await sqlite.retrieveConnection(NOMBRE_BB_DD);
    } else {
        return db = await sqlite.createConnection(NOMBRE_BB_DD);
    }
}

function combinarValores<T extends object>(interfaz: T, arrays: any[][]): T[] {
    return arrays.map((elemento) => {
        const objeto = {} as T;
        Object.keys(interfaz).forEach((prop, index) => {
            objeto[prop as keyof T] = elemento[index];
        });
        return objeto;
    });
}
export async function CargarBase (){ 
    const db = await dbdb();
    const MySwal = withReactContent(Swal);
    
    try {
        const resp = await axios.get(BASE_URL+"/data/json3");
        
        // Single Source of Truth architecture: Server provided the schema AND the values!
        // Whitelist ONLY valid keys to satisfy strict Capacitor SQLite validation
        const cleanData = {
            database: resp.data.database,
            version: resp.data.version,
            encrypted: resp.data.encrypted,
            mode: resp.data.mode,
            tables: resp.data.tables
        };
        
        await sqlite.importFromJson(JSON.stringify(cleanData));

        // Create synchronisation control table implicitly
        await db.open();
        let rescrate: any = await db.createSyncTable();
        console.log(`Create Sync Table result: ${JSON.stringify(rescrate?.changes)}`);
        
        const d = new Date();
        await db.setSyncDate(d.toISOString());
        await db.close();

        const de = Math.floor(new Date().getTime() / 1000);
        const datosSync = {
            id: 0,
            syncDate: de
        };
        
        console.log(`fecha ${de}`);
        await axios.post(BASE_URL+"/sync_date", datosSync);
        
    } catch (error) {
       console.error("Error sincronizando base de datos:", error);
       alert("No se pudo cargar la base de datos.");
    }
}
