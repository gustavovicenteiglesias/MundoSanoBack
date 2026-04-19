export interface Paciente {
    id_persona?: number,
    apellido?: string,
    nombre?: string,
    documento?: string,
    fecha_nacimiento?: string,
    origen?: number,
    nacionalidad?: number,
    sexo?: string,
    madre?: number | null,
    alta?: number,
    nacido_vivo?: number | null,
    pais_residencia?: number,
    area_residencia?: number,
    paraje_residencia?: number,
    num_vivienda?: number,
    latitud?: number | null,
    longitud?: number | null,
    formLLeno?: boolean
    georeferencia?:string
}

export let InicialPacienteValues:Paciente={
    id_persona: 0,
    apellido: "",
    nombre: "",
    documento: "",
    fecha_nacimiento: "",
    origen: 0,
    nacionalidad: 0,
    sexo: "F",
    madre:  null,
    alta: 0,
    nacido_vivo:  null,
    pais_residencia: 0,
    area_residencia: 0,
    paraje_residencia: 0,
    num_vivienda: 0,
    latitud: null,
    longitud:  null,
    formLLeno: true,
    georeferencia:""
}