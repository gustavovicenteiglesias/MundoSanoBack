export interface Paises{
    id_pais:number;
    codigo:string;
    nombre:string;
    last_modified:number;
    sql_deleted:number;
  }

  export const InicialPaises:Paises= {
      id_pais: 0,
      codigo: "",
      nombre: "",
      last_modified: 0,
      sql_deleted: 0
  }