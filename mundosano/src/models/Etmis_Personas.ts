export interface Etmis_Personas{
    id_persona?:number;
    id_etmi?:number;
    id_control?:number;
    confirmada?:number;
    sql_deleted?:number;
    last_modified?:number;
    //usuario_modified:number;
}

export const InicialEtmis_Personas:Etmis_Personas={
    id_persona:0,
    id_etmi:0,
    id_control:0,
    confirmada:0,
    sql_deleted:0,
    last_modified:0,
}