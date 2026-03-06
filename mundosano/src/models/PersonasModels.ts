export interface Personas {
    id_persona: number;
    apellido: string;
    nombre: string;
    documento: string | null;
    fecha_nacimiento: Date | null | string;
    id_origen: number | null;
    nacionalidad: number | null;
    sexo: string | null;
    madre: number | null;
    alta: number;
    nacido_vivo: number | null;
    sql_deleted: number;

    last_modified: number;
    //usuario_modified:number;
}

export let InicialPersona:Personas={
    
        id_persona: 0,
        apellido: "",
        nombre: "",
        documento: null,
        fecha_nacimiento: null,
        id_origen: null,
        nacionalidad: null,
        sexo: null,
        madre: null,
        alta: 0,
        nacido_vivo: null,
        sql_deleted: 0,
        last_modified: 0,
     
}

