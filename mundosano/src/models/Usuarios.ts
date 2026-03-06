export interface Usuarios {
    id_usuario: number;
    usuario: string;
    password: string;
    email: string;
    nombre: string;
    nivel_acceso: number;
    sql_deleted
    : number;

    last_modified: number;
    //usuario_modified:number;

}

export const InitialUsuario: Usuarios = {
    id_usuario: 0,
    usuario: "",
    password: "",
    email: "",
    nombre: "",
    nivel_acceso: 0,
    sql_deleted: 0,
    last_modified: 0
}