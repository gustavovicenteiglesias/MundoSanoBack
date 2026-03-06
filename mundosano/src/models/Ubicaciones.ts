export interface Ubicaciones {
    id_ubicacion: number;
    id_persona: number;
    id_paraje: number | null;
    id_area: number | null;
    num_vivienda: string | null;
    fecha: string | null;
    georeferencia: string | null;
    id_pais: number | null;
    sql_deleted: number;

    last_modified: number;
    //usuario_modified:number;
}

export const InicialUbicaciones:Ubicaciones={
    id_ubicacion: 0,
    id_persona: 0,
    id_paraje: null,
    id_area: null,
    num_vivienda: null,
    fecha: null,
    georeferencia: null,
    id_pais: null,
    sql_deleted: 0,
    last_modified: 0
}