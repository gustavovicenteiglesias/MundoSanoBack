export interface Parajes{
    id_paraje:number;
    id_area:number;
    nombre:string;
    last_modified:number;
    sql_deleted:number;
   //usuario_modified:number;
}

export const InicialParajes:Parajes={
    id_paraje: 0,
    id_area: 0,
    nombre: "",
    last_modified: 0,
    sql_deleted: 0
}