
export interface Controles{
    id_control:number;
    fecha:Date|string;
    id_persona:number;
    control_numero:number;
    id_estado:number;
    id_seguimiento_chagas:number|null;
    id_tratamiento_chagas:number|null;
    id_seguimiento_hiv:number|null;
    id_tratamiento_hiv:number|null;
    id_seguimiento_sifilis:number|null;
    id_tratamiento_sifilis:number|null;
    id_seguimiento_vhb:number|null;
    id_tratamiento_vhb :number|null;
    fecha_fin_embarazo:Date|null;
    id_tipos_fin_embarazos:number|null;
    georeferencia:string|null;
    sql_deleted:number;
    last_modified:number;
    //usuario_modified:number;

}

export const InicialControl:Controles={
    id_control: 0,
    fecha: "",
    id_persona: 0,
    control_numero: 0,
    id_estado: 0,
    id_seguimiento_chagas: null,
    id_tratamiento_chagas: null,
    id_seguimiento_hiv: null,
    id_tratamiento_hiv: null,
    id_seguimiento_sifilis: null,
    id_tratamiento_sifilis: null,
    id_seguimiento_vhb: null,
    id_tratamiento_vhb: null,
    fecha_fin_embarazo: null,
    id_tipos_fin_embarazos: null,
    georeferencia: null,
    sql_deleted: 0,
    last_modified: 0
}