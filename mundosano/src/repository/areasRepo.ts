import { getDb } from "../data/db";

export class AreasRepo {
  async getAll(): Promise<any[]> {
    const db = await getDb();
    await db.open();
    const res: any = await db.query("SELECT id_area, nombre, id_pais FROM areas ORDER BY nombre");
    await db.close();
    return res.values || [];
  }
}
