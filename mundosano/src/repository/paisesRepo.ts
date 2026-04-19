import { getDb } from "../data/db";

export class PaisesRepo {
  async getAll(): Promise<any[]> {
    const db = await getDb();
    await db.open();
    const res: any = await db.query("SELECT id_pais, nombre FROM paises ORDER BY nombre");
    await db.close();
    return res.values || [];
  }
}
