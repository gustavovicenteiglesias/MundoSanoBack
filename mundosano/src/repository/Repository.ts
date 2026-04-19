import { getDb } from "../data/db";
const dbdb = getDb;

export class Repository<T extends object> {
    private tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    private sanitizeEntity(entity: Record<string, any>): Record<string, any> {
        return Object.fromEntries(
            Object.entries(entity).filter(([key, value]) => {
                if (key === "id") return false; // Evita romper tablas que no usan PK genérica "id"
                if (value === undefined) return false; // Evita SQL inválido: columna = undefined
                return true;
            })
        );
    }

    private async getTableColumns(db: any): Promise<Set<string>> {
        try {
            const res = await db.query(`PRAGMA table_info(${this.tableName})`);
            const cols = new Set<string>();
            for (const row of res?.values || []) {
                if (row?.name) cols.add(String(row.name));
            }
            return cols;
        } catch (error) {
            console.warn(`[Repository:${this.tableName}] No se pudieron leer columnas de tabla`, error);
            return new Set<string>();
        }
    }

    private filterEntityByColumns(entity: Record<string, any>, columns: Set<string>): Record<string, any> {
        if (columns.size === 0) return entity;
        return Object.fromEntries(
            Object.entries(entity).filter(([key]) => columns.has(key))
        );
    }

    private toSqlValue(value: any): string {
        if (value === null) return "null";
        if (typeof value === "string") {
            return `"${value.replace(/"/g, '""')}"`;
        }
        if (typeof value === "number" && !Number.isFinite(value)) {
            return "null";
        }
        if (typeof value === "boolean") {
            return value ? "1" : "0";
        }
        return String(value);
    }

    private async dropAllTriggers(db: any): Promise<void> {
        try {
            const triggers = await db.query(`SELECT name FROM sqlite_master WHERE type='trigger'`);
            const names = (triggers?.values || [])
                .map((t: any) => t?.name)
                .filter((name: any) => typeof name === "string" && name.trim().length > 0);

            for (const triggerName of names) {
                await db.execute(`DROP TRIGGER IF EXISTS ${triggerName}`);
            }
            if (names.length > 0) {
                console.warn(`[Repository:${this.tableName}] Se eliminaron triggers legacy (${names.length}) para recuperar persistencia.`);
            }
        } catch (e) {
            console.warn(`[Repository:${this.tableName}] No se pudieron limpiar triggers legacy`, e);
        }
    }

    private async executeWithRecovery(db: any, sql: string) {
        try {
            return await db.execute(sql);
        } catch (error: any) {
            const msg = String(error?.message || "").toLowerCase();
            if (msg.includes("no such column: id")) {
                await this.dropAllTriggers(db);
                return await db.execute(sql);
            }
            throw error;
        }
    }

    async getAll(): Promise<T[]> {
        try {
            const db = await getDb();
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
            const db = await getDb();
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
            const res = await db.query(`SELECT * FROM ${this.tableName} ORDER BY ${campo} DESC LIMIT 1`);
            await db.close();
            if (res.values !== undefined ) {
                if (Object.keys(res.values).length !== 0){
                    return res.values[0][campo];
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
        const res = await db.query(`SELECT * FROM ${this.tableName} ORDER BY ${campo} DESC LIMIT 1`);
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
        return 0;
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
            
            // Inyectar UUID y last_modified
            if (!(entity as any).uuid) {
                (entity as any).uuid = crypto.randomUUID();
            }
            (entity as any).last_modified = Math.floor(Date.now() / 1000);

            const tableColumns = await this.getTableColumns(db);
            const cleanEntity = this.filterEntityByColumns(
                this.sanitizeEntity(entity as Record<string, any>),
                tableColumns
            );
            const keys = Object.keys(cleanEntity).join(',');
            const values = Object.values(cleanEntity).map(value => this.toSqlValue(value)).join(',');
            if (!keys) {
                await db.close();
                return false;
            }
            console.log(`INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`)
            const res = await this.executeWithRecovery(db, `INSERT INTO ${this.tableName} (${keys}) VALUES (${values})`);

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
              if (!entities || entities.length === 0) {
                await db.close();
                return false;
              }
              
              const now = Math.floor(Date.now() / 1000);
              const tableColumns = await this.getTableColumns(db);

              const preparedEntities = entities.map(entity => {
                (entity as any).last_modified = now;
                return this.filterEntityByColumns(
                  this.sanitizeEntity(entity as Record<string, any>),
                  tableColumns
                );
              });

              const baseColumns = Object.keys(preparedEntities[0] || {});
              if (baseColumns.length === 0) {
                await db.close();
                return false;
              }

              const values = preparedEntities
                .map(cleanEntity => {
                  const rowValues = baseColumns.map(col => this.toSqlValue((cleanEntity as any)[col] ?? null)).join(",");
                  return `(${rowValues})`;
                })
                .join(",");
        
              const query = `INSERT OR REPLACE INTO ${this.tableName} (${baseColumns.join(",")}) VALUES ${values}`;
              console.log(query)
              const res = await this.executeWithRecovery(db, query);
              
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
            const tableColumns = await this.getTableColumns(db);
            if (!tableColumns.has("id_persona") || !tableColumns.has("id_control") || !tableColumns.has("id_inmunizacion")) {
                await db.close();
                return false;
            }
            const cleanEntity = this.filterEntityByColumns(
                this.sanitizeEntity(entity as Record<string, any>),
                tableColumns
            );
            const updates = Object.entries(cleanEntity).map(([key, value]) => {
                return `${key} = ${this.toSqlValue(value)}`;
            }).join(',');
            if (!updates) {
                await db.close();
                return false;
            }
            console.log(`UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion}`)
            const res = await this.executeWithRecovery(db, `UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_control=${id_control} AND id_inmunizacion=${id_inmunizacion}`);
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
        const tableColumns = await this.getTableColumns(db);
        if (!tableColumns.has("id_persona") || !tableColumns.has("id_control") || !tableColumns.has("id_laboratorio")) {
            await db.close();
            return false;
        }
        const cleanEntity = this.filterEntityByColumns(
            this.sanitizeEntity(entity as Record<string, any>),
            tableColumns
        );
        const updates = Object.entries(cleanEntity).map(([key, value]) => {
            return `${key} = ${this.toSqlValue(value)}`;
        }).join(',');
        if (!updates) {
            await db.close();
            return false;
        }
        const res = await this.executeWithRecovery(db, `UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_laboratorio=${id_laboratorio} AND id_control=${id_control}`);
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
        const tableColumns = await this.getTableColumns(db);
        if (!tableColumns.has("id_persona") || !tableColumns.has("id_control") || !tableColumns.has("id_etmi")) {
            await db.close();
            return false;
        }
        const cleanEntity = this.filterEntityByColumns(
            this.sanitizeEntity(entity as Record<string, any>),
            tableColumns
        );
        const updates = Object.entries(cleanEntity).map(([key, value]) => {
            return `${key} = ${this.toSqlValue(value)}`;
        }).join(',');
        if (!updates) {
            await db.close();
            return false;
        }
        const res = await this.executeWithRecovery(db, `UPDATE ${this.tableName} SET ${updates} WHERE id_persona=${id_persona} AND id_etmi=${id_etmis} AND id_control=${id_control}`);
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
            
            // Inyectar last_modified
            (entity as any).last_modified = Math.floor(Date.now() / 1000);
            
            //const id = (entity as any).id_persona; // Assuming id_persona field is present in all interfaces
            const tableColumns = await this.getTableColumns(db);
            if (!tableColumns.has(campo)) {
                await db.close();
                return false;
            }
            const cleanEntity = this.filterEntityByColumns(
                this.sanitizeEntity(entity as Record<string, any>),
                tableColumns
            );
            const updates = Object.entries(cleanEntity).map(([key, value]) => {
                return `${key} = ${this.toSqlValue(value)}`;
            }).join(',');
            if (!updates) {
                await db.close();
                return false;
            }
            console.log(`UPDATE ${this.tableName} SET ${updates} WHERE ${campo} = ${id}`)
            const res = await this.executeWithRecovery(db, `UPDATE ${this.tableName} SET ${updates} WHERE ${campo} = ${id}`);
        
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
