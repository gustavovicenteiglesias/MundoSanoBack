import { getDb } from "../data/db"

  export class SoloFechaControl{
    
    async updateFecha(id:number,fecha:string):Promise<boolean>{
        try {
            const db = await getDb()
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
