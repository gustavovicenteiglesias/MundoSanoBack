import { getDb } from "../data/db"

  export class SoloFechaControl{

    private async dropAllTriggers(db: any): Promise<void> {
        try {
            const triggers = await db.query(`SELECT name FROM sqlite_master WHERE type='trigger'`);
            const names = (triggers?.values || [])
                .map((t: any) => t?.name)
                .filter((name: any) => typeof name === "string" && name.trim().length > 0);
            for (const triggerName of names) {
                await db.execute(`DROP TRIGGER IF EXISTS ${triggerName}`);
            }
        } catch (e) {
            console.warn("[SoloFechaControl] No se pudieron limpiar triggers", e);
        }
    }
    
    async updateFecha(id:number,fecha:string):Promise<boolean>{
        try {
            const db = await getDb()
    await db.open()
    let res: any;
    try {
        res = await db.execute(`UPDATE controles SET fecha="${fecha}" WHERE id_control=${id} `)
    } catch (error:any) {
        const msg = String(error?.message || "").toLowerCase();
        if (msg.includes("no such column: id")) {
            await this.dropAllTriggers(db);
            res = await db.execute(`UPDATE controles SET fecha="${fecha}" WHERE id_control=${id} `);
        } else {
            throw error;
        }
    }
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
