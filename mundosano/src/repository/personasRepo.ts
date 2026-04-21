

import { Personas } from "../models/PersonasModels"
import moment from "moment"
import { getDb } from "../data/db";

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



export class PersonasRepository {

  //trae la tabla personas todo 
  async getTodos(): Promise<any[]> {
    const db = await getDb()
    await db.open()
    const res: any = await db.query(`
      SELECT p.id_persona,p.nombre,p.apellido,p.documento,p.fecha_nacimiento,
             p.last_modified,
             e.id_etmi,w.nombre AS etmi,
             s.id_app,f.nombre AS apps,
             u.id_pais,u.id_area,u.id_paraje,u.num_vivienda,u.georeferencia,
             pa.nombre AS nombre_pais,areas.nombre AS nombre_area,je.nombre AS nombre_paraje,
             c.id_estado
      FROM personas p 
      LEFT JOIN etmis_personas e ON p.id_persona=e.id_persona 
      LEFT join etmis w ON e.id_etmi=w.id_etmi 
      LEFT join antecedentes a ON p.id_persona=a.id_persona 
      LEFT JOIN antecedentes_apps s ON a.id_antecedente=s.id_antecedente 
      LEFT JOIN apps f ON s.id_app=f.id_app 
      LEFT JOIN ubicaciones u ON p.id_persona=u.id_persona 
      LEFT JOIN paises pa ON u.id_pais=pa.id_pais 
      LEFT JOIN areas ON u.id_area=areas.id_area 
      LEFT JOIN parajes je ON u.id_paraje=je.id_paraje 
      LEFT JOIN controles c ON c.id_persona=p.id_persona AND c.id_control = (SELECT c2.id_control FROM controles c2 WHERE c2.id_persona=p.id_persona ORDER BY c2.fecha DESC LIMIT 1)
      WHERE madre IS NULL AND (p.sql_deleted = 0 OR p.sql_deleted IS NULL)
      ORDER BY p.id_persona ASC`)
    await db.close()

    return res.values as any[]
  }
  //trae los pendientes
  async getPendientes(): Promise<any[]> {
    const db = await getDb()
    await db.open()
    const res: any = await db.query("SELECT c.id_control,em.eco,l.resultado,p.id_persona,p.id_persona,p.nombre,p.apellido,p.documento,p.fecha_nacimiento,p.last_modified, e.id_etmi,w.nombre AS etmi , s.id_app, s.id_app,f.nombre AS apps,u.id_pais,pa.nombre AS nombre_pais,areas.nombre AS nombre_area,je.nombre AS nombre_paraje FROM control_embarazo em LEFT JOIN controles c ON c.id_control=em.id_control "
      + " INNER JOIN laboratorios_realizados l ON c.id_control=l.id_control"
      + " INNER JOIN personas p ON c.id_persona=p.id_persona"
      + " LEFT JOIN etmis_personas e ON p.id_persona=e.id_persona"
      + " LEFT join etmis w ON e.id_etmi=w.id_etmi"
      + " LEFT join antecedentes a ON p.id_persona=a.id_persona "
      + " LEFT JOIN antecedentes_apps s ON a.id_antecedente=s.id_antecedente "
      + " LEFT JOIN apps f ON s.id_app=f.id_app "
      + " LEFT JOIN ubicaciones u ON p.id_persona=u.id_persona "
      + " LEFT JOIN paises pa ON u.id_pais=pa.id_pais"
      + " LEFT JOIN areas ON u.id_area=areas.id_area "
      + " LEFT JOIN parajes je ON u.id_paraje=je.id_paraje"
      + ` WHERE (em.eco="S" OR l.resultado IS NULL OR l.resultado="S") AND (p.sql_deleted = 0 OR p.sql_deleted IS NULL) `)
    await db.close()

    return res.values as any[]
  }
  //traer todas las personas

  async getAll(): Promise<Personas[]> {
    const db = await getDb()
    await db.open()
    const res = await db.query("SELECT * FROM personas WHERE (sql_deleted = 0 OR sql_deleted IS NULL)")
    console.log("personas repositorio " + JSON.stringify(res.values))
    await db.close()

    return res.values as Personas[]
  }
  //ultimo id_persona en un  rango 
  async ultimoIdPersona(): Promise<Personas[]> {
    const db = await getDb()
    await db.open()
    const res = await db.query(`SELECT * FROM personas WHERE id_persona BETWEEN ${min()} AND ${max()} ORDER BY id_persona DESC LIMIT 1`)

    await db.close()
    return res.values as Personas[]
  }
  //Crear nuevo
  async crear(personas: Personas): Promise<any> {
    const db = await getDb()
    await db.open()
    const res = await db.execute("INSERT INTO personas (id_persona,apellido,nombre,documento,fecha_nacimiento,id_origen,nacionalidad,sexo,madre,alta,nacido_vivo)" +
      `VALUES (${personas.id_persona},"${personas.apellido}","${personas.nombre}","${personas.documento}","${moment(personas.fecha_nacimiento).format("YYYY-MM-DD")}",${personas.id_origen},${personas.nacionalidad},"${personas.sexo}",${personas.madre},${personas.alta},${personas.nacido_vivo})`)
    console.log("insert " + JSON.stringify(res.changes))
    await db.close()
    return true
  } 
  //Update 
  async update(personas: Personas): Promise<any> {
    const db = await getDb()
    await db.open()
    let res = await db.execute(`UPDATE personas SET apellido = "${personas.apellido}", nombre = "${personas.nombre}", documento = "${personas.documento}", fecha_nacimiento = "${moment(personas.fecha_nacimiento).format("YYYY-MM-DD")}", id_origen = ${personas.id_origen}, nacionalidad = ${personas.nacionalidad}, sexo = "${personas.sexo}", madre=${personas.madre}, alta=${personas.alta}, nacido_vivo=${personas.nacido_vivo} WHERE id_persona=${personas.id_persona}`)
    console.log("update " + JSON.stringify(res.changes))
    await db.close()
    return true
  }

  async getLastSyncUnix(): Promise<number | null> {
    const db = await getDb()
    await db.open()
    try {
      const res: any = await db.query("SELECT sync_date FROM sync_table ORDER BY id DESC LIMIT 1")
      const value = res?.values?.[0]?.sync_date
      if (value === null || value === undefined) {
        return null
      }
      const parsed = Number(value)
      return Number.isFinite(parsed) ? parsed : null
    } catch (_error) {
      return null
    } finally {
      await db.close()
    }
  }

}


