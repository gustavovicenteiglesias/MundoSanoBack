import { sqlite, existingConn, db } from "../App"
import { SQLiteDBConnection } from "react-sqlite-hook";
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

  export class SoloFechaControl{
    
    async updateFecha(id:number,fecha:string):Promise<boolean>{
        try {
            const db = await dbdb()
    await db.open()
    const res: any = await db.execute(`UPDATE controles SET fecha="${fecha}" WHERE id_control=${id} `)
    console.log(`UPDATE controles SET fecha="${fecha}" WHERE id_control=${id} `)
    await db.close()
    console.log(res)
    if (res.changes?.changes !== undefined) {
        if (res.changes.changes > 0) {
            return true;
        }
    }
    return false;
        } catch (error) {
            console.log(error)
            return false
        }
    }
  }