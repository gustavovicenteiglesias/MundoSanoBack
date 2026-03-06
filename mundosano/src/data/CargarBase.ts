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
import { datos } from "./exportarIII..last";
import { Repository } from "../repository/Repository";
import { SQLiteDBConnection } from "react-sqlite-hook";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content';
import { BASE_URL, NOMBRE_BB_DD } from "../utils/constantes";
import { InicialPaises, Paises } from "../models/Paises";
import { Areas, InicialAreas } from "../models/Areas";
import { InicialParajes, Parajes } from "../models/Parajes";

const query=`DROP TRIGGER "control_embarazo_trigger_last_modified";
CREATE TRIGGER control_embarazo_trigger_last_modified AFTER UPDATE ON control_embarazo FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE control_embarazo SET last_modified = (strftime('%s','now')) WHERE id_control_embarazo=OLD.id_control_embarazo; END;
DROP TRIGGER "antecedentes_apps_trigger_last_modified";
CREATE TRIGGER antecedentes_apps_trigger_last_modified AFTER UPDATE ON antecedentes_apps FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN     UPDATE antecedentes_apps SET last_modified= (strftime('%s', 'now')) WHERE id_antecedente=OLD.id_antecedente;  END;
DROP TRIGGER "antecedentes_trigger_last_modified";
CREATE TRIGGER antecedentes_trigger_last_modified AFTER UPDATE ON antecedentes FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE antecedentes SET last_modified = (strftime('%s','now')) WHERE id_antecedente=OLD.id_antecedente; END;
DROP TRIGGER "antecedentes_macs_trigger_last_modified";
CREATE TRIGGER antecedentes_macs_trigger_last_modified AFTER UPDATE ON antecedentes_apps FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN     UPDATE antecedentes_macs SET last_modified= (strftime('%s', 'now')) WHERE id_antecedente=OLD.id_antecedente;  END;
DROP TRIGGER "apps_trigger_last_modified";
CREATE TRIGGER apps_trigger_last_modified AFTER UPDATE ON apps FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE apps SET last_modified = (strftime('%s','now')) WHERE id_app=OLD.id_app; END;
DROP TRIGGER "areas_trigger_last_modified";
CREATE TRIGGER areas_trigger_last_modified AFTER UPDATE ON areas FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE areas SET last_modified = (strftime('%s','now')) WHERE id_area=OLD.id_area; END;
DROP TRIGGER "ciudades_trigger_last_modified";
CREATE TRIGGER ciudades_trigger_last_modified AFTER UPDATE ON ciudades FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE ciudades SET last_modified = (strftime('%s','now')) WHERE id_ciudad=OLD.id_ciudad; END;
DROP TRIGGER "control_emb_patologico_trigger_last_modified";
CREATE TRIGGER control_emb_patologico_trigger_last_modified AFTER UPDATE ON control_emb_patologico FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE control_emb_patologico SET last_modified = (strftime('%s','now')) WHERE id_control_emb_patologico=OLD.id_control_emb_patologico; END;
DROP TRIGGER "control_embarazo_trigger_last_modified";
CREATE TRIGGER control_embarazo_trigger_last_modified AFTER UPDATE ON control_embarazo FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE control_embarazo SET last_modified = (strftime('%s','now')) WHERE id_control_embarazo=OLD.id_control_embarazo; END;
DROP TRIGGER "control_puerperio_trigger_last_modified";
CREATE TRIGGER control_puerperio_trigger_last_modified AFTER UPDATE ON control_puerperio FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE control_puerperio SET last_modified = (strftime('%s','now')) WHERE id_control_puerperio=OLD.id_control_puerperio; END;
DROP TRIGGER "control_rn_trigger_last_modified";
CREATE TRIGGER control_rn_trigger_last_modified AFTER UPDATE ON control_rn FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE control_rn SET last_modified = (strftime('%s','now')) WHERE id_control_rn=OLD.id_control_rn; END;
DROP TRIGGER "controles_trigger_last_modified";
CREATE TRIGGER controles_trigger_last_modified AFTER UPDATE ON controles FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE controles SET last_modified = (strftime('%s','now')) WHERE id_control=OLD.id_control; END;
DROP TRIGGER "embarazos_patologias_trigger_last_modified";
CREATE TRIGGER embarazos_patologias_trigger_last_modified AFTER UPDATE ON embarazos_patologias FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE embarazos_patologias SET last_modified = (strftime('%s','now')) WHERE id_control_emb_patologico=OLD.id_control_emb_patologico; END;
DROP TRIGGER "embarazos_trigger_last_modified";
CREATE TRIGGER embarazos_trigger_last_modified AFTER UPDATE ON embarazos FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE embarazos SET last_modified = (strftime('%s','now')) WHERE id_control=OLD.id_control AND id_persona=OLD.id_persona AND id_tipo_embarazo=OLD.id_tipo_embarazo; END;
DROP TRIGGER "estados_trigger_last_modified";
CREATE TRIGGER estados_trigger_last_modified AFTER UPDATE ON estados FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE estados SET last_modified = (strftime('%s','now')) WHERE id_estado=OLD.id_estado; END;
DROP TRIGGER "etmis_personas_trigger_last_modified";
CREATE TRIGGER etmis_personas_trigger_last_modified AFTER UPDATE ON etmis_personas FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE etmis_personas SET last_modified = (strftime('%s','now')) WHERE id_etmi=OLD.id_etmi AND id_persona=OLD.id_persona AND id_control=OLD.id_control; END;
DROP TRIGGER "inmunizaciones_control_trigger_last_modified";
CREATE TRIGGER inmunizaciones_control_trigger_last_modified AFTER UPDATE ON inmunizaciones_control FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE inmunizaciones_control SET last_modified = (strftime('%s','now')) WHERE id_persona=OLD.id_persona AND id_control=OLD.id_control AND id_inmunizacion=OLD.id_inmunizacion ; END;
DROP TRIGGER "laboratorios_realizados_trigger_last_modified";
CREATE TRIGGER laboratorios_realizados_trigger_last_modified AFTER UPDATE ON laboratorios_realizados FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE laboratorios_realizados SET last_modified = (strftime('%s','now')) WHERE id_laboratorio=OLD.id_laboratorio AND id_control=OLD.id_control; END;
DROP  TRIGGER "personas_trigger_last_modified";
CREATE TRIGGER personas_trigger_last_modified AFTER UPDATE ON personas FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE personas SET last_modified = (strftime('%s','now')) WHERE id_persona=OLD.id_persona; END;
DROP TRIGGER "ubicaciones_trigger_last_modified";
CREATE TRIGGER ubicaciones_trigger_last_modified AFTER UPDATE ON ubicaciones FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE ubicaciones SET last_modified = (strftime('%s','now')) WHERE id_ubicacion=OLD.id_ubicacion; END;
DROP TRIGGER "usuarios_trigger_last_modified";
CREATE TRIGGER usuarios_trigger_last_modified AFTER UPDATE ON usuarios FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified BEGIN UPDATE usuarios SET last_modified = (strftime('%s','now')) WHERE id_usuario=OLD.id_usuario; END;
`


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

    const repositoryPersonas = new Repository<Personas>("personas");
    const repositoryUbicacion = new Repository<Ubicaciones>("ubicaciones");
    const repositoryControles = new Repository<Controles>("controles");
    const repositoryAntecedentes = new Repository<Antecedentes>("antecedentes");
    const repositoryAntecedentesApps = new Repository<Antecedentes_Apps>("antecedentes_apps")
    const repositoryAntecedentesMacs = new Repository<Antecedentes_Macs>("antecedentes_macs")
    const repositoryControlEmbarazo = new Repository<Control_Embarazo>("control_embarazo")
    const repositoryInmunizacionesControl = new Repository<Inmunizaciones_Control>("inmunizaciones_control")
    const repositoryLaboratoriosRealizados = new Repository<Laboratorios_Realizados>("laboratorios_realizados")
    const repositoryEtmisPersonas = new Repository<Etmis_Personas>("etmis_personas")
    const repositoryUsuarios = new Repository<Usuarios>("usuarios")
    const repositoryPaises=new  Repository<Paises>('paises');
    const repositoryAreas=new   Repository<Areas>('areas');
    const repositoryParajes=new Repository<Parajes>('parajes')

    //
    const MySwal = withReactContent(Swal)
    await sqlite.importFromJson(JSON.stringify(datos))

    //testDatabaseCopyFromAssets()
    let valores: { [key: string]: any[][] } = {
        personas: [],
        ubicaciones: [],
        controles: [],
        control_embarazo: [],
        laboratorios_realizados:[],
        inmunizaciones_control: [],
        antecedentes: [],
        antecedentes_apps: [],
        antecedentes_macs: [],
        etmis_personas: [],
        usuarios:[],
        paises:[],
        areas: [],
        parajes:[],
    };
    try {
        await axios.get(BASE_URL+"/data/json3")
        .then(async (resp) => {
            console.log(resp.data.tables)
            resp.data.tables.map((dato: any, i: any) => {
                console.log(dato.name)
                if (valores.hasOwnProperty(dato.name)) {
                    dato.values.forEach((data2: any) => {
                        valores[dato.name].push(data2);
                    });
                }
            })
            const persona: Personas[] = combinarValores<Personas>(InicialPersona, valores.personas);
            const ubicaciones: Ubicaciones[] = combinarValores<Ubicaciones>(InicialUbicaciones, valores.ubicaciones)
            const controles: Controles[] = combinarValores<Controles>(InicialControl, valores.controles);
            const control_embarazo: Control_Embarazo[] = combinarValores<Control_Embarazo>(InicialControlEmbarazo, valores.control_embarazo);
            const inmunizaciones_control: Inmunizaciones_Control[] = combinarValores<Inmunizaciones_Control>(InicialInmunizacionesControl, valores.inmunizaciones_control);
            const antecedentes: Antecedentes[] = combinarValores<Antecedentes>(InicialAntecedentes, valores.antecedentes);
            const antecedentes_apps: Antecedentes_Apps[] = combinarValores<Antecedentes_Apps>(InicialAntecedentes_Apps, valores.antecedentes_apps);
            const antecedentes_macs: Antecedentes_Macs[] = combinarValores<Antecedentes_Macs>(InicialAntecedentes_Macs, valores.antecedentes_macs);
            const etmis_personas: Etmis_Personas[] = combinarValores<Etmis_Personas>(InicialEtmis_Personas, valores.etmis_personas);
            const laboratoriosRealizados:Laboratorios_Realizados[]=combinarValores<Laboratorios_Realizados>(InicialLaboratorios,valores.laboratorios_realizados)
            const usuario:Usuarios[]=combinarValores<Usuarios>(InitialUsuario,valores.usuarios);
            const area:Areas[]=combinarValores<Areas>(InicialAreas,valores.areas);
            const paises:Paises[]=combinarValores<Paises>(InicialPaises,valores.paises);
            const parajes:Parajes[]=combinarValores<Parajes>(InicialParajes,valores.parajes);
            
            await repositoryPersonas.insert(persona)
                .then(async (resp) => {
                    console.log("Inserto personas")
                    await repositoryUbicacion.insert(ubicaciones)
                        .then(async (resp) => {
                            console.log("Inserto ubicaciones")
                            await repositoryControles.insert(controles)
                                .then(async (resp) => {
                                    console.log("Inserto controles")
                                    await repositoryControlEmbarazo.insert(control_embarazo)
                                        .then(async (resp) => {
                                            console.log("Inserto control_embarazo")
                                            await repositoryInmunizacionesControl.insert(inmunizaciones_control)
                                                .then(async (resp) => {
                                                    console.log("Inserto inmunizaciones_control")
                                                    await repositoryAntecedentes.insert(antecedentes)
                                                        .then(async (resp) => {
                                                            console.log("Inserto antecedentes")
                                                            await repositoryAntecedentesApps.insert(antecedentes_apps)
                                                                .then(async (resp) => {
                                                                    console.log("Inserto antecedentes_apps")
                                                                    await repositoryAntecedentesMacs.insert(antecedentes_macs)
                                                                        .then(async (resp) => {
                                                                            console.log("Inserto antecedentes_macs")
                                                                            await repositoryEtmisPersonas.insert(etmis_personas)
                                                                                .then(async (resp) => {
                                                                                    console.log("Inserto etmis_personas")
                                                                                    await repositoryLaboratoriosRealizados.insert(laboratoriosRealizados)
                                                                                    .then(async (resp) => {
                                                                                        console.log("Inserto laboratorios")
                                                                                        await repositoryUsuarios.insert(usuario)
                                                                                        .then(async(resp)=>{
                                                                                            console.log("Inserto usuarios")
                                                                                            await repositoryPaises.insert(paises)
                                                                                            .then(async(resp)=>{
                                                                                                console.log("Inserto paises")
                                                                                                await repositoryAreas.insert(area)
                                                                                                .then(async(resp)=>{
                                                                                                    console.log("Inserto area")
                                                                                                    await repositoryParajes.insert(parajes)
                                                                                                    .then(async(resp)=>{
                                                                                                        console.log("inserto paraje")
                                                                                                        await db.open();
                                                                                                        let rescrate: any = await db.createSyncTable();
                                                                                                        console.log(`Create Table ${JSON.stringify(rescrate.changes)}`)
                                                                                                        //creo un punto de restauracion en fecha 
                                                                                                        const d = new Date();
                                                                                                        await db.setSyncDate(d.toISOString());
                                                                                                        await db.execute(query)
                                                                                                        await db.close()
                                                                                
                                                                                                        const de = Math.floor(new Date().getTime() / 1000);
                                                                                                        const datos = {
                                                                                                            id: 0,
                                                                                                            syncDate: de
                                                                                                        }
                                                                                                        
                                                                                                        console.log(`fecha ${de}`)
                                                                                                        axios.post(BASE_URL+"/sync_date", datos)
                                                                                                    })
                                                                                                })
                                                                                            })
                                                                                        })
                                                                                        
                                                                                        
                                                                                        
                                                                                    })
                                                                                })
                                                                        })
                                                                })
                                                        })
                                                })
                                        })
                                })

                        })

                })

               

        })         
    } catch (error) {
       alert("No hay internet")
   
    }
}