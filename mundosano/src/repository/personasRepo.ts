

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
    SELECT
      p.id_persona,
      p.nombre,
      p.apellido,
      p.documento,
      p.fecha_nacimiento,
      p.last_modified,
      MAX(
        COALESCE(p.last_modified, 0),
        COALESCE((
          SELECT MAX(c3.last_modified)
          FROM controles c3
          WHERE c3.id_persona = p.id_persona
            AND (c3.sql_deleted = 0 OR c3.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(ce.last_modified)
          FROM control_embarazo ce
          INNER JOIN controles c4 ON c4.id_control = ce.id_control
          WHERE c4.id_persona = p.id_persona
            AND (c4.sql_deleted = 0 OR c4.sql_deleted IS NULL)
            AND (ce.sql_deleted = 0 OR ce.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(ic.last_modified)
          FROM inmunizaciones_control ic
          WHERE ic.id_persona = p.id_persona
            AND (ic.sql_deleted = 0 OR ic.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(lr.last_modified)
          FROM laboratorios_realizados lr
          WHERE lr.id_persona = p.id_persona
            AND (lr.sql_deleted = 0 OR lr.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(a2.last_modified)
          FROM antecedentes a2
          WHERE a2.id_persona = p.id_persona
            AND (a2.sql_deleted = 0 OR a2.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(aa.last_modified)
          FROM antecedentes_apps aa
          INNER JOIN antecedentes a3 ON a3.id_antecedente = aa.id_antecedente
          WHERE a3.id_persona = p.id_persona
            AND (a3.sql_deleted = 0 OR a3.sql_deleted IS NULL)
            AND (aa.sql_deleted = 0 OR aa.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(am.last_modified)
          FROM antecedentes_macs am
          INNER JOIN antecedentes a4 ON a4.id_antecedente = am.id_antecedente
          WHERE a4.id_persona = p.id_persona
            AND (a4.sql_deleted = 0 OR a4.sql_deleted IS NULL)
            AND (am.sql_deleted = 0 OR am.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(ep.last_modified)
          FROM etmis_personas ep
          WHERE ep.id_persona = p.id_persona
            AND (ep.sql_deleted = 0 OR ep.sql_deleted IS NULL)
        ), 0),
        COALESCE((
          SELECT MAX(u2.last_modified)
          FROM ubicaciones u2
          WHERE u2.id_persona = p.id_persona
            AND (u2.sql_deleted = 0 OR u2.sql_deleted IS NULL)
        ), 0)
      ) AS sync_max_last_modified,
      e.id_etmi,
      w.nombre AS etmi,
      s.id_app,
      f.nombre AS apps,
      u.id_pais,
      u.id_area,
      u.id_paraje,
      u.num_vivienda,
      u.georeferencia,
      pa.nombre AS nombre_pais,
      areas.nombre AS nombre_area,
      je.nombre AS nombre_paraje,
      c.id_estado
    FROM personas p
    LEFT JOIN etmis_personas e ON p.id_persona = e.id_persona
    LEFT JOIN etmis w ON e.id_etmi = w.id_etmi
    LEFT JOIN antecedentes a ON p.id_persona = a.id_persona
    LEFT JOIN antecedentes_apps s ON a.id_antecedente = s.id_antecedente
    LEFT JOIN apps f ON s.id_app = f.id_app
    LEFT JOIN ubicaciones u ON p.id_persona = u.id_persona
    LEFT JOIN paises pa ON u.id_pais = pa.id_pais
    LEFT JOIN areas ON u.id_area = areas.id_area
    LEFT JOIN parajes je ON u.id_paraje = je.id_paraje
    LEFT JOIN controles c
      ON c.id_persona = p.id_persona
     AND c.id_control = (
        SELECT c2.id_control
        FROM controles c2
        WHERE c2.id_persona = p.id_persona
        ORDER BY c2.fecha DESC
        LIMIT 1
     )
    WHERE madre IS NULL
      AND (p.sql_deleted = 0 OR p.sql_deleted IS NULL)
    ORDER BY p.id_persona ASC
  `)
  await db.close()

  return res.values as any[]
}
  //trae los pendientes
  async getPendientes(): Promise<any[]> {
  const db = await getDb()
  await db.open()
  const res: any = await db.query(`
    SELECT
      c.id_control,
      em.eco,
      l.resultado,
      p.id_persona,
      p.nombre,
      p.apellido,
      p.documento,
      p.fecha_nacimiento,
      p.last_modified,
      MAX(
        COALESCE(p.last_modified, 0),
        COALESCE(c.last_modified, 0),
        COALESCE(em.last_modified, 0),
        COALESCE(l.last_modified, 0),
        COALESCE(e.last_modified, 0),
        COALESCE(a.last_modified, 0),
        COALESCE(s.last_modified, 0),
        COALESCE(u.last_modified, 0)
      ) AS sync_max_last_modified,
      e.id_etmi,
      w.nombre AS etmi,
      s.id_app,
      f.nombre AS apps,
      u.id_pais,
      pa.nombre AS nombre_pais,
      areas.nombre AS nombre_area,
      je.nombre AS nombre_paraje
    FROM control_embarazo em
    LEFT JOIN controles c ON c.id_control = em.id_control
    INNER JOIN laboratorios_realizados l ON c.id_control = l.id_control
    INNER JOIN personas p ON c.id_persona = p.id_persona
    LEFT JOIN etmis_personas e ON p.id_persona = e.id_persona
    LEFT JOIN etmis w ON e.id_etmi = w.id_etmi
    LEFT JOIN antecedentes a ON p.id_persona = a.id_persona
    LEFT JOIN antecedentes_apps s ON a.id_antecedente = s.id_antecedente
    LEFT JOIN apps f ON s.id_app = f.id_app
    LEFT JOIN ubicaciones u ON p.id_persona = u.id_persona
    LEFT JOIN paises pa ON u.id_pais = pa.id_pais
    LEFT JOIN areas ON u.id_area = areas.id_area
    LEFT JOIN parajes je ON u.id_paraje = je.id_paraje
    WHERE
      (em.eco = "S" OR l.resultado IS NULL OR l.resultado = "S")
      AND (p.sql_deleted = 0 OR p.sql_deleted IS NULL)
  `)
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
    const uuid = (personas as any).uuid || crypto.randomUUID();
    const lastMod = Math.floor(Date.now() / 1000);
    const res = await db.execute("INSERT INTO personas (id_persona,apellido,nombre,documento,fecha_nacimiento,id_origen,nacionalidad,sexo,madre,alta,nacido_vivo,uuid,last_modified)" +
      `VALUES (${personas.id_persona},"${personas.apellido}","${personas.nombre}","${personas.documento}","${moment(personas.fecha_nacimiento).format("YYYY-MM-DD")}",${personas.id_origen},${personas.nacionalidad},"${personas.sexo}",${personas.madre},${personas.alta},${personas.nacido_vivo},"${uuid}",${lastMod})`)
    console.log("insert " + JSON.stringify(res.changes))
    await db.close()
    return true
  } 
  //Update 
  async update(personas: Personas): Promise<any> {
    const db = await getDb()
    await db.open()
    const lastMod = Math.floor(Date.now() / 1000);
    let res = await db.execute(`UPDATE personas SET apellido = "${personas.apellido}", nombre = "${personas.nombre}", documento = "${personas.documento}", fecha_nacimiento = "${moment(personas.fecha_nacimiento).format("YYYY-MM-DD")}", id_origen = ${personas.id_origen}, nacionalidad = ${personas.nacionalidad}, sexo = "${personas.sexo}", madre=${personas.madre}, alta=${personas.alta}, nacido_vivo=${personas.nacido_vivo}, last_modified=${lastMod} WHERE id_persona=${personas.id_persona}`)
    console.log("update " + JSON.stringify(res.changes))
    await db.close()
    return true
  }

 async getLastSyncUnix(): Promise<number | null> {
  const db = await getDb()
  await db.open()
  try {
    const res: any = await db.query(
      "SELECT MAX(CAST(sync_date AS INTEGER)) AS sync_date FROM sync_table"
    )
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
async getSyncMaxLastModifiedByPersonIds(ids: number[]): Promise<Record<number, number>> {
  if (!ids.length) return {}

  const validIds = ids
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))

  if (!validIds.length) return {}

  const db = await getDb()
  await db.open()

  try {
    const inClause = validIds.join(",")

    const res: any = await db.query(`
      SELECT
        p.id_persona,
        MAX(
          COALESCE(p.last_modified, 0),
          COALESCE((
            SELECT MAX(c.last_modified)
            FROM controles c
            WHERE c.id_persona = p.id_persona
              AND (c.sql_deleted = 0 OR c.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ce.last_modified)
            FROM control_embarazo ce
            INNER JOIN controles c2 ON c2.id_control = ce.id_control
            WHERE c2.id_persona = p.id_persona
              AND (c2.sql_deleted = 0 OR c2.sql_deleted IS NULL)
              AND (ce.sql_deleted = 0 OR ce.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ic.last_modified)
            FROM inmunizaciones_control ic
            WHERE ic.id_persona = p.id_persona
              AND (ic.sql_deleted = 0 OR ic.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(lr.last_modified)
            FROM laboratorios_realizados lr
            WHERE lr.id_persona = p.id_persona
              AND (lr.sql_deleted = 0 OR lr.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(a.last_modified)
            FROM antecedentes a
            WHERE a.id_persona = p.id_persona
              AND (a.sql_deleted = 0 OR a.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(aa.last_modified)
            FROM antecedentes_apps aa
            INNER JOIN antecedentes a2 ON a2.id_antecedente = aa.id_antecedente
            WHERE a2.id_persona = p.id_persona
              AND (a2.sql_deleted = 0 OR a2.sql_deleted IS NULL)
              AND (aa.sql_deleted = 0 OR aa.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(am.last_modified)
            FROM antecedentes_macs am
            INNER JOIN antecedentes a3 ON a3.id_antecedente = am.id_antecedente
            WHERE a3.id_persona = p.id_persona
              AND (a3.sql_deleted = 0 OR a3.sql_deleted IS NULL)
              AND (am.sql_deleted = 0 OR am.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ep.last_modified)
            FROM etmis_personas ep
            WHERE ep.id_persona = p.id_persona
              AND (ep.sql_deleted = 0 OR ep.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(u.last_modified)
            FROM ubicaciones u
            WHERE u.id_persona = p.id_persona
              AND (u.sql_deleted = 0 OR u.sql_deleted IS NULL)
          ), 0)
        ) AS max_last_modified
      FROM personas p
      WHERE p.id_persona IN (${inClause})
    `)

    const map: Record<number, number> = {}

    for (const row of res?.values ?? []) {
      const idPersona = Number(row?.id_persona)
      const maxLastModified = Number(row?.max_last_modified)

      if (Number.isFinite(idPersona) && Number.isFinite(maxLastModified)) {
        map[idPersona] = maxLastModified
      }
    }

    return map
  } finally {
    await db.close()
  }
}
async getSyncStatusByPersonIds(ids: number[]): Promise<Record<number, number>> {
  const validIds = ids
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));

  if (!validIds.length) return {};

  const db = await getDb();
  await db.open();

  try {
    const inClause = validIds.join(",");

    const res: any = await db.query(`
      SELECT
        p.id_persona,
        MAX(
          COALESCE(p.last_modified, 0),
          COALESCE((
            SELECT MAX(c.last_modified)
            FROM controles c
            WHERE c.id_persona = p.id_persona
              AND (c.sql_deleted = 0 OR c.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ce.last_modified)
            FROM control_embarazo ce
            INNER JOIN controles c2 ON c2.id_control = ce.id_control
            WHERE c2.id_persona = p.id_persona
              AND (c2.sql_deleted = 0 OR c2.sql_deleted IS NULL)
              AND (ce.sql_deleted = 0 OR ce.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ic.last_modified)
            FROM inmunizaciones_control ic
            WHERE ic.id_persona = p.id_persona
              AND (ic.sql_deleted = 0 OR ic.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(lr.last_modified)
            FROM laboratorios_realizados lr
            WHERE lr.id_persona = p.id_persona
              AND (lr.sql_deleted = 0 OR lr.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(a.last_modified)
            FROM antecedentes a
            WHERE a.id_persona = p.id_persona
              AND (a.sql_deleted = 0 OR a.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(aa.last_modified)
            FROM antecedentes_apps aa
            INNER JOIN antecedentes a2 ON a2.id_antecedente = aa.id_antecedente
            WHERE a2.id_persona = p.id_persona
              AND (a2.sql_deleted = 0 OR a2.sql_deleted IS NULL)
              AND (aa.sql_deleted = 0 OR aa.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(am.last_modified)
            FROM antecedentes_macs am
            INNER JOIN antecedentes a3 ON a3.id_antecedente = am.id_antecedente
            WHERE a3.id_persona = p.id_persona
              AND (a3.sql_deleted = 0 OR a3.sql_deleted IS NULL)
              AND (am.sql_deleted = 0 OR am.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(ep.last_modified)
            FROM etmis_personas ep
            WHERE ep.id_persona = p.id_persona
              AND (ep.sql_deleted = 0 OR ep.sql_deleted IS NULL)
          ), 0),
          COALESCE((
            SELECT MAX(u.last_modified)
            FROM ubicaciones u
            WHERE u.id_persona = p.id_persona
              AND (u.sql_deleted = 0 OR u.sql_deleted IS NULL)
          ), 0)
        ) AS max_last_modified
      FROM personas p
      WHERE p.id_persona IN (${inClause})
    `);

    const out: Record<number, number> = {};

    for (const row of res?.values ?? []) {
      const idPersona = Number(row?.id_persona);
      const maxLastModified = Number(row?.max_last_modified);

      if (Number.isFinite(idPersona) && Number.isFinite(maxLastModified)) {
        out[idPersona] = maxLastModified;
      }
    }

    return out;
  } finally {
    await db.close();
  }
}
}


