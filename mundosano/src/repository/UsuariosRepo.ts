

import { Usuarios } from "../models/Usuarios";
import { getDb } from "../data/db";

export class UsuariosRepo{
    async getUsuarioByNombre(nombre:string):Promise<Usuarios[]> {
        const db = await getDb()
        await db.open()
        const res = await db.query(`SELECT * FROM usuarios WHERE usuario="${nombre}"`);
        await db.close()

        //console.log("Ubicaciones "+JSON.stringify(res.values))
        return res.values as Usuarios[]

    }

   
   
}
