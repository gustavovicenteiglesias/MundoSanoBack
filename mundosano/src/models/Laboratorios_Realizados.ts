export interface Laboratorios_Realizados{
    id_persona?:number;
    id_control?:number;
    id_laboratorio?:number;
    trimestre?:number;
    fecha_realizado?:string|null;
    fecha_resultados?:string|null;
    resultado?:string|null;
    id_etmi?:number;
    sql_deleted?:number;
   
last_modified?:number;
    //usuario_modified:number;
}

export const InicialLaboratorios:Laboratorios_Realizados={
    id_persona:0,
    id_control:0,
    id_laboratorio:0,
    trimestre:0,
    fecha_realizado:"",
    fecha_resultados:"",
    resultado:"",
    id_etmi:0,
    sql_deleted:0,
   
last_modified:0,

}