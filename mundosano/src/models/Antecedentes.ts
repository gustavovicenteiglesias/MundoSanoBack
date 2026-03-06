export interface Antecedentes{
    id_antecedente?:number;
    id_persona?:number;
    id_control?:number;
    edad_primer_embarazo:number|null| undefined;
    fecha_ultimo_embarazo:Date|string|null;
    gestas:number|null| undefined;
    partos:number|null| undefined;
    cesareas:number|null| undefined;
    abortos:number|null| undefined;
    planificado:number|null| undefined;
    fum:Date|string|null;
    fpp:Date|string|null;
    last_modified:number;
    sql_deleted:number;
    //usuario_modified:number;

}
export const InicialAntecedentes:Antecedentes={
    id_antecedente: 0,
    id_persona: 0,
    id_control: 0,
    edad_primer_embarazo: undefined,
    fecha_ultimo_embarazo: null,
    gestas: undefined,
    partos: undefined,
    cesareas: undefined,
    abortos: undefined,
    planificado: undefined,
    fum: null,
    fpp: null,
    last_modified: 0,
    sql_deleted: 0
}