import { getDb } from "../data/db";

export class ParajesRepo {
  async getAll(): Promise<any[]> {
    const db = await getDb();
    await db.open();
    const res: any = await db.query("SELECT id_paraje, nombre, id_area FROM parajes ORDER BY nombre");
    await db.close();
    return res.values || [];
  }
}
