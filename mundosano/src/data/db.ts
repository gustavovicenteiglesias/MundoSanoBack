import { sqlite } from "../App";
import { SQLiteDBConnection } from "react-sqlite-hook";
import { NOMBRE_BB_DD } from "../utils/constantes";

export const getDb = async (): Promise<SQLiteDBConnection> => {
  const ret = await sqlite.checkConnectionsConsistency();
  const isConn = (await sqlite.isConnection(NOMBRE_BB_DD)).result;
  if (ret.result && isConn) {
    return sqlite.retrieveConnection(NOMBRE_BB_DD);
  }
  return sqlite.createConnection(NOMBRE_BB_DD);
};

export const withDb = async <T>(fn: (db: SQLiteDBConnection) => Promise<T>): Promise<T> => {
  const db = await getDb();
  await db.open();
  try {
    return await fn(db);
  } finally {
    await db.close();
  }
};
