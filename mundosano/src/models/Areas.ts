export interface Areas{
    id_area:number;
    id_pais:number;
    nombre:string;
    last_modified:number;
    sql_deleted:number;

    //usuario_modified:number;
}

export const InicialAreas:Areas={
    id_area: 0,
    id_pais: 0,
    nombre: "",
    last_modified: 0,
    sql_deleted: 0
}