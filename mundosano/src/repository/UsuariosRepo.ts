

import { sqlite, existingConn, db } from "../App"
import { SQLiteDBConnection } from "react-sqlite-hook";

import { Usuarios } from "../models/Usuarios";
import { NOMBRE_BB_DD } from "../utils/constantes";


const dbdb = async () => {
  const ret = await sqlite.checkConnectionsConsistency();
  const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
  var db: SQLiteDBConnection
  if (ret.result && isConn) {
    return db = await sqlite.retrieveConnection(NOMBRE_BB_DD);
  } else {
    return db = await sqlite.createConnection(NOMBRE_BB_DD);
  }
}

export class UsuariosRepo{
    async getUsuarioByNombre(nombre:string):Promise<Usuarios[]> {
        const db = await dbdb()
        await db.open()
        const res = await db.query(`SELECT * FROM usuarios WHERE usuario="${nombre}"`);
        await db.close()

        //console.log("Ubicaciones "+JSON.stringify(res.values))
        return res.values as Usuarios[]

    }

   
   
}