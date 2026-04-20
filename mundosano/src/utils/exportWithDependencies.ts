type JsonTable = {
  name: string;
  values: any[][];
};

export type JsonExportPayload = {
  database: string;
  version: number;
  encrypted: boolean;
  mode: "partial" | "full";
  tables: JsonTable[];
};

type TableInfoRow = {
  name: string;
  pk: number;
};

type ForeignKeyRow = {
  table: string; // parent table
  from: string;  // child column
  to: string;    // parent column
};

type TableMeta = {
  table: string;
  columns: string[];
  pkColumns: string[];
  foreignKeys: ForeignKeyRow[];
};

type RowObject = Record<string, any>;

const SYNCABLE_TABLES = new Set([
  "personas",
  "controles",
  "ubicaciones",
  "antecedentes",
  "control_embarazo",
  "inmunizaciones_control",
  "laboratorios_realizados",
  "etmis_personas",
  "antecedentes_apps",
  "antecedentes_macs",
]);

function arrayToRowObject(columns: string[], row: any[]): RowObject {
  const obj: RowObject = {};
  for (let i = 0; i < columns.length; i++) {
    obj[columns[i]] = row[i];
  }
  return obj;
}

function rowObjectToArray(columns: string[], row: RowObject): any[] {
  return columns.map((c) => (row[c] !== undefined ? row[c] : null));
}

function rowKey(table: string, row: RowObject, meta: TableMeta): string {
  const uuid = row["uuid"];
  if (uuid !== undefined && uuid !== null && String(uuid).trim() !== "") {
    return `${table}#uuid#${uuid}`;
  }

  if (meta.pkColumns.length > 0) {
    const pk = meta.pkColumns.map((c) => `${c}=${row[c]}`).join("|");
    return `${table}#pk#${pk}`;
  }

  return `${table}#json#${JSON.stringify(row)}`;
}

async function loadTableMeta(db: any, table: string): Promise<TableMeta> {
  const tableInfoRes = await db.query(`PRAGMA table_info(${table})`);
  const fkRes = await db.query(`PRAGMA foreign_key_list(${table})`);

  const tableInfo: TableInfoRow[] = tableInfoRes.values ?? [];
  const fksRaw = fkRes.values ?? [];

  const columns = tableInfo.map((r) => r.name);
  const pkColumns = tableInfo
    .filter((r) => Number(r.pk) > 0)
    .sort((a, b) => Number(a.pk) - Number(b.pk))
    .map((r) => r.name);

  const foreignKeys: ForeignKeyRow[] = fksRaw.map((r: any) => ({
    table: r.table,
    from: r.from,
    to: r.to,
  }));

  return {
    table,
    columns,
    pkColumns,
    foreignKeys,
  };
}

async function loadMetas(db: any, tables: string[]): Promise<Record<string, TableMeta>> {
  const entries = await Promise.all(
    tables.map(async (t) => [t, await loadTableMeta(db, t)] as const)
  );
  return Object.fromEntries(entries);
}

function orderTablesForExport(
  tables: string[],
  metas: Record<string, TableMeta>
): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const t of tables) {
    inDegree.set(t, 0);
    adj.set(t, []);
  }

  for (const t of tables) {
    const meta = metas[t];
    if (!meta) continue;

    for (const fk of meta.foreignKeys) {
      const parent = fk.table;
      const child = t;

      if (!tables.includes(parent)) continue;

      adj.get(parent)!.push(child);
      inDegree.set(child, (inDegree.get(child) ?? 0) + 1);
    }
  }

  const queue: string[] = tables.filter((t) => (inDegree.get(t) ?? 0) === 0);
  const result: string[] = [];

  while (queue.length > 0) {
    const t = queue.shift()!;
    result.push(t);

    for (const next of adj.get(t) ?? []) {
      inDegree.set(next, (inDegree.get(next) ?? 0) - 1);
      if ((inDegree.get(next) ?? 0) === 0) {
        queue.push(next);
      }
    }
  }

  for (const t of tables) {
    if (!result.includes(t)) result.push(t);
  }

  return result;
}

export async function enrichPartialExportWithAncestors(
  db: any,
  partialPayload: JsonExportPayload
): Promise<JsonExportPayload> {
  const changedTables = partialPayload.tables
    .filter((t) => Array.isArray(t.values) && t.values.length > 0)
    .map((t) => t.name)
    .filter((t) => SYNCABLE_TABLES.has(t));

 const metaTables = Array.from(
  new Set([...Array.from(SYNCABLE_TABLES), ...changedTables])
);

  const metas = await loadMetas(db, metaTables);
  const tableRowsCache = new Map<string, RowObject[]>();

  async function getAllRowsForTable(table: string): Promise<RowObject[]> {
    if (tableRowsCache.has(table)) {
      return tableRowsCache.get(table)!;
    }
    const res = await db.query(`SELECT * FROM ${table}`);
    const rows: RowObject[] = res.values ?? [];
    tableRowsCache.set(table, rows);
    return rows;
  }

  const selected = new Map<string, Map<string, RowObject>>();
  const queue: Array<{ table: string; row: RowObject }> = [];

  function addRow(table: string, row: RowObject) {
    const meta = metas[table];
    if (!meta) return;

    const key = rowKey(table, row, meta);

    if (!selected.has(table)) {
      selected.set(table, new Map());
    }

    const tableMap = selected.get(table)!;
    if (!tableMap.has(key)) {
      tableMap.set(key, row);
      queue.push({ table, row });
    }
  }

  for (const table of partialPayload.tables) {
    if (!SYNCABLE_TABLES.has(table.name)) continue;

    const meta = metas[table.name];
    if (!meta) continue;

    for (const rawRow of table.values ?? []) {
      const rowObj = arrayToRowObject(meta.columns, rawRow);
      addRow(table.name, rowObj);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentMeta = metas[current.table];
    if (!currentMeta) continue;

    for (const fk of currentMeta.foreignKeys) {
      const parentTable = fk.table;

      if (!SYNCABLE_TABLES.has(parentTable)) continue;

      const childValue = current.row[fk.from];
      if (childValue === null || childValue === undefined) continue;

      const parentRows = await getAllRowsForTable(parentTable);
      const parentMatches = parentRows.filter((r) => r[fk.to] === childValue);

      for (const parentRow of parentMatches) {
        addRow(parentTable, parentRow);
      }
    }
  }

  const orderedTables = orderTablesForExport(Array.from(selected.keys()), metas);

  const rebuiltTables: JsonTable[] = orderedTables.map((table) => {
    const meta = metas[table];
    const rows = Array.from(selected.get(table)?.values() ?? []);
    return {
      name: table,
      values: rows.map((r) => rowObjectToArray(meta.columns, r)),
    };
  });

  return {
    ...partialPayload,
    tables: rebuiltTables,
  };
}