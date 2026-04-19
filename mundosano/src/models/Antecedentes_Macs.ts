export interface Antecedentes_Macs{
    uuid?: string;
    id_antecedente:number;
    id_mac:number;
   sql_deleted
:number;
   last_modified:number;
    //usuario_modified:number;
}

export const InicialAntecedentes_Macs:Antecedentes_Macs={
    uuid: "",
    id_antecedente: 0,
    id_mac: 0,
    sql_deleted: 0,
    last_modified: 0
}