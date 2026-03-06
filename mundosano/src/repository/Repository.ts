import { sqlite, existingConn, db } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { NOMBRE_BB_DD } from "../utils/constantes";


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
const max = () => {
    const maxId = JSON.parse(localStorage.getItem("user") || "")
    if (maxId !== "") {
        console.log("MAximo " + maxId.maxId)
        return maxId.maxId
    }
}

const min = () => {
    const minId = JSON.parse(localStorage.getItem("user") || "")
    if (minId !== "") {
        console.log("Minimo " + minId.minId)
        return minId.minId
    }
}
export class Repository<T extends object> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    async getAll(): Promise<T[]> {
        try {
            const db = await dbdb();
            await db.open();
            const res = await db.query(`SELECT * FROM ${this.tableName}`);
            await db.close();
    
            return res.values as T[];
            
        } catch (error) {
            console.log(error)
            return [] 
        }
       
    }

    async getLastRow(campo: string): Promise<T[]> {
        try {
            const db = await dbdb();
        await db.open();
        const res = await db.query(`SELECT * FROM ${this.tableName} WHERE ${campo}  ORDER BY ${campo} DESC LIMIT 1`);
        await db.close();
        return res.values as T[];
            
        } catch (error) {
            console.log(error)
            return [] 
        }
        
    }
    async getByLastId(campo: string, id: any): Promise<T[]> {
        try {
            const db = await dbdb();
        await db.open();
        const res = await db.query(`SELECT * FROM ${this.tableName} WHERE ${campo}=${id}`);
        await db.close();
        return res.values as T[];
            
        } catch (error) {
            console.log(error)
            return []
        }
        
    }

    async getLastRowId(campo: string): Promise<number> {
        try {
            const db = await dbdb();
            await db.open();
            const res = await db.query(`SELECT * FROM ${this.tableName} WHERE ${campo} BETWEEN ${min()} AND ${max()} ORDER BY ${campo} DESC LIMIT 1`);
            await db.close();
            if (res.values !== undefined ) {
                if (Object.keys(res.values).length !== 0){
                    return res.values[0][campo];
                 }else{
                    return min()
                 }
                
            }
            return min();
            
        } catch (error) {
            console.log(error)
            return min()
        }
       
        
    }

    async getLastMaxControl(campo: number): Promise<number> {
        try {
            const db = await dbdb();
            await db.open();
            const res = await db.query(`SELECT MAX(control_numero) AS max_control FROM controles where id_persona=${campo}`);
            await db.close();
            if (res.values !== undefined ) {
                if (Object.keys(res.values).length !== 0){
                    console.log(res.values[0].max_control)
                    return res.values[0].max_control;
                    
                 }else{
                    return 0
                 }
                
            }
           
            return 0;
            
        } catch (error) {
            console.log(error)
            return 0
        }
       
        
    }

    async getLastRowIdControlNumero(campo: string): Promise<number> {
        try {
            const db = await dbdb();
        await db.open();
        const res = await db.query(`SELECT * FROM ${this.tableName} WHERE ${campo} BETWEEN ${min()} AND ${max()} ORDER BY ${campo} DESC LIMIT 1`);
        await db.close();
        if (res.values !== undefined ) {
            if (Object.keys(res.values).length !== 0){
                return res.values[0].control_numero;
             }else{
                return 0
             }
            
        }
        return 0;
        } catch (error) {
            console.log(error)
            return 0
        }
        
        
    }

    async getUltimoNroControlByPersona(id: number): Promise<number> {
        try {
            const db = await dbdb();
        await db.open();
        const res = await db.query(`SELECT * FROM ${this.tableName} WHERE id_persona=${id} ORDER BY id_control DESC LIMIT 1`);

        await db.close();
        if (res.values !== undefined ) {
            if (Object.keys(res.values).length !== 0){
                return res.values[0].control_numero;
             }else{
                return 0
             }
            
        }
        return min();
        } catch (error) {
            console.log(error)
            return 0
        }
        
       
    }

    async getIDlaboratoriosRealizados(id_laboratorio: number, id_persona: number, id_control: number) {
        try {
            const db = await dbdb();
            await db.open();
            console.log(`SELECT * FROM ${this.tableName} WHERE id_laboratorio=${id_laboratorio} AND id_persona=${id_persona} AND id_control=${id_control} `)
            const res = await db.query(`SELECT * FROM ${this.tableName} WHERE id_laboratorio=${id_laboratorio} AND id_persona=${id_persona} AND id_control=${id_control} `)
            await db.close();
            if (res.values !== undefined ) {
                if (Object.keys(res.values).length !== 0){
                    return res.values[0].id_laboratorio;
                 }else{
                    return 0
                 }
                
            }
            return 0;
        } catch (error) {
            console.log(error)
            return 0
        }
       
    }

    async getHayInmunizaciones( id_persona: number, id_control: number,id_inmunizacion: number,):Promise<boolean> {
        try {
            const db = await dbdb();
            await db.open();
            console.log(`SELECT * FROM ${this.tableName} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion} `)
            const res = await db.query(`SELECT * FROM ${this.tableName} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion} `)
            await db.close();
            if (res.values !== undefined ) {
                if (Object.keys(res.values).length !== 0){
                    return true
                 }else{
                    return false
                 }
                
            }
            return false;
        } catch (error) {

            console.log(error)
            return false
        }
       
    }

    async create(entity: T): Promise<boolean> {
        try {
            const db = await dbdb();
        await db.open();
        const keys = Object.keys(entity).join(',');
        const values = Object.values(entity).map(value => {
            if (value === null) {
                return "null";
            }
            return typeof value === 'string' ? `"${value}"` : value;
        }).join(',');
        console.log(`INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`)
        const res = await db.execute(`INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`);

        await db.close();

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

        async insert(entities: T[]): Promise<boolean> {
        
            try {
              const db = await dbdb();
              await db.open();
              
              const values = entities
                .map(entity => {
                  const keys = Object.keys(entity).join(',');
                  const entityValues = Object.values(entity).map(value => {
                    if (value === null) {
                      return "null";
                    }
                    return typeof value === 'string' ? `"${value}"` : value;
                  }).join(',');
        
                  return `(${entityValues})`;
                })
                .join(',');
        
              const query = `INSERT OR REPLACE INTO ${this.tableName} VALUES ${values}`;
              console.log(query)
              const res = await db.execute(query);
              
              await db.close();
        
              return res.changes?.changes !== undefined && res.changes.changes > 0;
            } catch (error) {
              console.error('Error in create:', error);
              return false;
            }
          }
    async updateInmunizaciones(entity: T, id_persona: number, id_control: number, id_inmunizacion: number): Promise<boolean> {
        try {
            const db = await dbdb();
            await db.open();
            //const id = (entity as any).id_persona; // Assuming id_persona field is present in all interfaces
            const updates = Object.entries(entity).map(([key, value]) => {
                return typeof value === 'string' ? `${key} = "${value}"` : `${key} = ${value}`;
            }).join(',');
            console.log(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion}`)
            const res = await db.execute(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion}`);
            await db.close();
            console.log(res.changes?.changes)
            if (res.changes?.changes !== undefined) {
                if (res.changes.changes > 0) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.log(error)
            return false;
        }
       

    }

    async updateLaboratoriosRealizados(entity: T, id_persona: number, id_control: number, id_laboratorio: number): Promise<boolean>{
        try {
            const db = await dbdb();
        await db.open();
        //const id = (entity as any).id_persona; // Assuming id_persona field is present in all interfaces
        const updates = Object.entries(entity).map(([key, value]) => {
            return typeof value === 'string' ? `${key} = "${value}"` : `${key} = ${value}`;
        }).join(',');
        const res = await db.execute(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_laboratorio=${id_laboratorio} AND id_control=${id_control}`);
        await db.close();
        console.log(res.changes?.changes)
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

    async updateEtmisPersonas(entity: T, id_persona: number, id_control: number, id_etmis: number): Promise<boolean>{
        try {
            const db = await dbdb();
        await db.open();
        //const id = (entity as any).id_persona; // Assuming id_persona field is present in all interfaces
        const updates = Object.entries(entity).map(([key, value]) => {
            return typeof value === 'string' ? `${key} = "${value}"` : `${key} = ${value}`;
        }).join(',');
        const res = await db.execute(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_etmi=${id_etmis} AND id_control=${id_control}`);
        console.log(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_etmi=${id_etmis} AND id_control=${id_control}`)
        await db.close();
        console.log(res.changes?.changes)
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

    

    async update(entity: T, campo: string, id: number): Promise<boolean> {
        try {
            const db = await dbdb();
        await db.open();
        //const id = (entity as any).id_persona; // Assuming id_persona field is present in all interfaces
        const updates = Object.entries(entity).map(([key, value]) => {
            return typeof value === 'string' ? `${key} = "${value}"` : `${key} = ${value}`;
        }).join(',');
        console.log(`UPDATE ${this.tableName} SET ${updates} WHERE ${campo} = ${id}`)
        const res = await db.execute(`UPDATE ${this.tableName} SET ${updates} WHERE ${campo} = ${id}`);
        
        await db.close();
        console.log(res.changes?.changes)
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

    async delete(id: number, campo: string): Promise<boolean> {
        try {
            const db = await dbdb();
        await db.open();
        const res = await db.execute(`DELETE FROM ${this.tableName} WHERE ${campo} = ${id}`);
        await db.close();
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
