export interface Inmunizaciones_Control{
    id_persona?:number;
    id_control?:number;
    id_inmunizacion?:number;
    estado?:string;
    sql_deleted?:number;
    last_modified?:number;
    //usuario_modified:number;
}

export const InicialInmunizacionesControl:Inmunizaciones_Control={
    id_persona:0,
    id_control:0,
    id_inmunizacion:0,
    estado:"",
    sql_deleted:0,
    last_modified:0
}