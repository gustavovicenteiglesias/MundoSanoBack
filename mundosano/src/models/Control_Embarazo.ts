export interface Control_Embarazo{
    id_control_embarazo: number;
    id_control:number;
    edad_gestacional:number;
    eco:string;
    detalle_eco:string;
    hpv:string;
    pap:string;
    sistolica:number;
    diastolica:number;
    clinico:string;
    observaciones:string;
    motivo:number;
    derivada:number;
    sql_deleted:number;
    last_modified:number;
    //usuario_modified:number;
}

export const InicialControlEmbarazo:Control_Embarazo={
    id_control_embarazo: 0,
    id_control: 0,
    edad_gestacional: 0,
    eco: "",
    detalle_eco: "",
    hpv: "",
    pap: "",
    sistolica: 0,
    diastolica: 0,
    clinico: "",
    observaciones: "",
    motivo: 0,
    derivada: 0,
    sql_deleted: 0,
    last_modified: 0
}