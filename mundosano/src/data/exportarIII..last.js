import { NOMBRE_BB_DD } from "../utils/constantes"

export const datos={
    
    "database": NOMBRE_BB_DD
,
    "version": 1,
    "encrypted": false,
    "mode": "full",
    "tables": [
        {
            "name": "estados",
            "schema": [
                {
                    "column": "id_estado",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(150)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "estados_trigger_last_modified",
                    "logic": "BEGIN      UPDATE estados SET last_modified= (strftime('%s', 'now')) WHERE id_estado=OLD.id_estado;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "EMBARAZADA",
                    0,
                    1681778734
                ],
                [
                    2,
                    "PUÉRPERA",
                    0,
                    1681778734
                ],
                [
                    3,
                    "RECIÉN NACIDO",
                    0,
                    1681778734
                ]
            ]
        },
        {
            "name": "personas",
            "schema": [
                {
                    "column": "id_persona",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "apellido",
                    "value": "VARCHAR(200)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(200)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "documento",
                    "value": "VARCHAR(40)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "fecha_nacimiento",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "id_origen",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "nacionalidad",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "sexo",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "madre",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "alta",
                    "value": "SMALLINT  NULL DEFAULT 0"
                },
                {
                    "column": "nacido_vivo",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "fk_origenes_idx",
                    "value": "`id_origen` DESC"
                },
                {
                    "name": "fk_personas_paises",
                    "value": "`nacionalidad` DESC"
                },
                {
                    "name": "madre",
                    "value": "`madre` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "personas_trigger_last_modified",
                    "logic": "BEGIN      UPDATE apps SET last_modified= (strftime('%s', 'now')) WHERE id_persona=OLD.id_persona;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            
        },
        {
            "name": "apps",
            "schema": [
                {
                    "column": "id_app",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_apps_UNIQUE",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "apps_trigger_last_modified",
                    "logic": "BEGIN      UPDATE apps SET last_modified= (strftime('%s', 'now')) WHERE id_app=OLD.id_app;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    8,
                    "CHAGAS",
                    0,
                    1681778571
                ],
                [
                    3,
                    "DBT",
                    0,
                    1681778571
                ],
                [
                    5,
                    "ECLAMPSIA",
                    0,
                    1681778571
                ],
                [
                    1,
                    "HTA GESTACIONAL",
                    0,
                    1681778571
                ],
                [
                    2,
                    "HTA-DBT GESTACIONAL",
                    0,
                    1681778571
                ],
                [
                    10,
                    "NINGUNO",
                    0,
                    1681778571
                ],
                [
                    4,
                    "PREECLAMPSIA",
                    0,
                    1681778571
                ],
                [
                    7,
                    "SIFILIS",
                    0,
                    1681778571
                ],
                [
                    6,
                    "TBC",
                    0,
                    1681778571
                ],
                [
                    9,
                    "TOXOPLASMOSIS",
                    0,
                    1681778571
                ]
            ]
        },
        {
            "name": "seguimiento_chagas",
            "schema": [
                {
                    "column": "id_seguimiento_chagas",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "examen_clinico",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_examen",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "ecg",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_ecg",
                    "value": "TEXT  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "hepatograma",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "ecocardiograma",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "tele_rx_torax",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "got",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "gpt",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "fal",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "parasitemia",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "serologia_10",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "serologia_12",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "serologia_24",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "detalle_got",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_gpt",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_hepatograma",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_ecocardiograma",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_fal",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_rx_torax",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "hemograma",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "detalle_hemograma",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "paises",
            "schema": [
                {
                    "column": "id_pais",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "codigo",
                    "value": "VARCHAR(3)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(150)  NOT NULL  COLLATE NOCASE"
                },
                {
                     "column": "last_modified",
                     "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                 },
                  {
                     "column": "sql_deleted",
                     "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                 }
            ],
            "indexes": [
                {
                    "name": "codigo",
                    "value": "`codigo` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "nombre",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "paises_derivacion_trigger_last_modified",
                    "logic": "BEGIN      UPDATE paises SET last_modified= (strftime('%s', 'now')) WHERE id_pais=OLD.id_pais;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            
        },
        {
            "name": "provincias",
            "schema": [
                {
                    "column": "id_provincia",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(30)  NOT NULL  COLLATE BINARY"
                },
                {
                    "column": "id_pais",
                    "value": "INT  NOT NULL DEFAULT 1"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`fk_provincias_paises`",
                    "value": "FOREIGN KEY (`id_pais`) REFERENCES paises (`id_pais`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_pais_provincias",
                    "value": "`id_pais` DESC"
                }
            ],
            "values": [
                [
                    1,
                    "Buenos Aires",
                    12,
                    0,
                    1681778962
                ],
                [
                    2,
                    "Catamarca",
                    12,
                    0,
                    1681778962
                ],
                [
                    3,
                    "Chaco",
                    12,
                    0,
                    1681778962
                ],
                [
                    4,
                    "Chubut",
                    12,
                    0,
                    1681778962
                ],
                [
                    5,
                    "Cordoba",
                    12,
                    0,
                    1681778962
                ],
                [
                    6,
                    "Corrientes",
                    12,
                    0,
                    1681778962
                ],
                [
                    7,
                    "Capital Federal",
                    12,
                    0,
                    1681778962
                ],
                [
                    8,
                    "Entre Rios",
                    12,
                    0,
                    1681778962
                ],
                [
                    9,
                    "Formosa",
                    12,
                    0,
                    1681778962
                ],
                [
                    10,
                    "Jujuy",
                    12,
                    0,
                    1681778962
                ],
                [
                    11,
                    "La Pampa",
                    12,
                    0,
                    1681778962
                ],
                [
                    12,
                    "La Rioja",
                    12,
                    0,
                    1681778962
                ],
                [
                    13,
                    "Mendoza",
                    12,
                    0,
                    1681778962
                ],
                [
                    14,
                    "Misiones",
                    12,
                    0,
                    1681778962
                ],
                [
                    15,
                    "Neuquen",
                    12,
                    0,
                    1681778962
                ],
                [
                    16,
                    "Rio Negro",
                    12,
                    0,
                    1681778962
                ],
                [
                    17,
                    "Salta",
                    12,
                    0,
                    1681778962
                ],
                [
                    18,
                    "San Juan",
                    12,
                    0,
                    1681778962
                ],
                [
                    19,
                    "San Luis",
                    12,
                    0,
                    1681778962
                ],
                [
                    20,
                    "Santa Cruz",
                    12,
                    0,
                    1681778962
                ],
                [
                    21,
                    "Santa Fe",
                    12,
                    0,
                    1681778962
                ],
                [
                    22,
                    "Santiago del Estero",
                    12,
                    0,
                    1681778962
                ],
                [
                    23,
                    "Tierra del Fuego",
                    12,
                    0,
                    1681778962
                ],
                [
                    24,
                    "Tucuman",
                    12,
                    0,
                    1681778962
                ],
                [
                    25,
                    "Chuquisaca",
                    27,
                    0,
                    1681778962
                ],
                [
                    26,
                    "Cochabamba",
                    27,
                    0,
                    1681778962
                ],
                [
                    27,
                    "El Beni",
                    27,
                    0,
                    1681778962
                ],
                [
                    28,
                    "La Paz",
                    27,
                    0,
                    1681778962
                ],
                [
                    29,
                    "Oruro",
                    27,
                    0,
                    1681778962
                ],
                [
                    30,
                    "Pando",
                    27,
                    0,
                    1681778962
                ],
                [
                    31,
                    "Potosi",
                    27,
                    0,
                    1681778962
                ],
                [
                    32,
                    "Santa Cruz",
                    27,
                    0,
                    1681778962
                ],
                [
                    33,
                    "Tarija",
                    27,
                    0,
                    1681778962
                ],
                [
                    34,
                    "Alto Parana",
                    177,
                    0,
                    1681778962
                ],
                [
                    35,
                    "Amambay",
                    177,
                    0,
                    1681778962
                ],
                [
                    36,
                    "Boqueron",
                    177,
                    0,
                    1681778962
                ],
                [
                    37,
                    "Caaguazu",
                    177,
                    0,
                    1681778962
                ],
                [
                    38,
                    "Caazapa",
                    177,
                    0,
                    1681778962
                ],
                [
                    39,
                    "Central",
                    177,
                    0,
                    1681778962
                ],
                [
                    40,
                    "Concepcion",
                    177,
                    0,
                    1681778962
                ],
                [
                    41,
                    "Cordillera",
                    177,
                    0,
                    1681778962
                ],
                [
                    42,
                    "Guaira",
                    177,
                    0,
                    1681778962
                ],
                [
                    43,
                    "Itapua",
                    177,
                    0,
                    1681778962
                ],
                [
                    44,
                    "Misiones",
                    177,
                    0,
                    1681778962
                ],
                [
                    45,
                    "Neembucu",
                    177,
                    0,
                    1681778962
                ],
                [
                    46,
                    "Paraguari",
                    177,
                    0,
                    1681778962
                ],
                [
                    47,
                    "Presidente Hayes",
                    177,
                    0,
                    1681778962
                ],
                [
                    48,
                    "San Pedro",
                    177,
                    0,
                    1681778962
                ],
                [
                    49,
                    "Canindeyu",
                    177,
                    0,
                    1681778962
                ],
                [
                    50,
                    "Chaco",
                    177,
                    0,
                    1681778962
                ],
                [
                    51,
                    "Nueva Asuncion",
                    177,
                    0,
                    1681778962
                ],
                [
                    52,
                    "Alto Paraguay",
                    177,
                    0,
                    1681778962
                ]
            ]
        },
        {
            "name": "motivos_derivacion",
            "schema": [
                {
                    "column": "id_motivo",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(25)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "motivos_derivacion_trigger_last_modified",
                    "logic": "BEGIN      UPDATE motivos_derivacion SET last_modified= (strftime('%s', 'now')) WHERE id_motivo=OLD.id_motivo;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "HTA",
                    0,
                    1681778863
                ],
                [
                    2,
                    "DBT",
                    0,
                    1681778863
                ],
                [
                    3,
                    "PREECLAMPSIA",
                    0,
                    1681778863
                ],
                [
                    4,
                    "ANEMIA",
                    0,
                    1681778863
                ],
                [
                    5,
                    "SEVERA",
                    0,
                    1681778863
                ],
                [
                    6,
                    "RCIU",
                    0,
                    1681778863
                ],
                [
                    7,
                    "AMENAZA DE PARTO",
                    0,
                    1681778863
                ],
                [
                    8,
                    "FECHA DE PARTO",
                    0,
                    1681778863
                ],
                [
                    9,
                    "OTRO",
                    0,
                    1681778863
                ]
            ]
        },
        {
            "name": "seguimiento_hiv",
            "schema": [
                {
                    "column": "id_seguimiento_hiv",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "antecedente",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "carga_viral",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "medico_cargo",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "derivacion_hospital",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "test_rapido_pareja",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "derivacion_hospital_pareja",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "medico_cargo_pareja",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "proviral_cargaviral",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "seguimiento_sifilis",
            "schema": [
                {
                    "column": "id_seguimiento_sifilis",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "pareja_fecha_realizado",
                    "value": "TIMESTAMP  NULL DEFAULT NULL"
                },
                {
                    "column": "pareja_fecha_resultados",
                    "value": "TIMESTAMP  NULL DEFAULT NULL"
                },
                {
                    "column": "pareja_resultado",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "pareja_tratamiento",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_mes_seguimiento",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "rn_examen_medico",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_vdrl",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_rx_osea",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_sedimento_orina",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_got",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_gpt",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_lcr",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_oftalmologico",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "rn_auditivo",
                    "value": "CHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "seguimiento_vhb",
            "schema": [
                {
                    "column": "id_seguimiento_vhb",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "antihbc",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "derivacion_hospital",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "antihbs",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "vacuna12hs",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "gammaglobulina_1248",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "tipos_fin_embarazos",
            "schema": [
                {
                    "column": "id_tipos_fin_embarazos",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "values": [
                [
                    1,
                    "PARTO",
                    0,
                    1681779100
                ],
                [
                    2,
                    "CESAREA",
                    0,
                    1681779100
                ],
                [
                    3,
                    "ABORTO",
                    0,
                    1681779100
                ]
            ]
        },
       
        {
            "name": "tratamiento_chagas",
            "schema": [
                {
                    "column": "id_tratamiento_chagas",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "droga",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "dosis_diaria",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "fecha_inicio",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "peso_inicial",
                    "value": "FLOAT(0,0)  NULL DEFAULT NULL"
                },
                {
                    "column": "fecha_finalizacion",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "peso_final",
                    "value": "FLOAT(0,0)  NULL DEFAULT NULL"
                },
                {
                    "column": "id_motivo_finalizacion",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "otros_eventos_adversos",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "observaciones",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "id_motivo_finalizacion",
                    "value": "`id_motivo_finalizacion` DESC"
                }
            ]
        },
        {
            "name": "etmis",
            "schema": [
                {
                    "column": "id_etmi",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_etmis_UNIQUE",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "etmis_trigger_last_modified",
                    "logic": "BEGIN      UPDATE etmis SET last_modified= (strftime('%s', 'now')) WHERE id_etmi=OLD.id_etmi;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    0,
                    "NINGUNO",
                    0,
                    1681778745
                ],
                [
                    1,
                    "CHAGAS",
                    0,
                    1681778745
                ],
                [
                    2,
                    "HIV",
                    0,
                    1681778745
                ],
                [
                    3,
                    "SIFILIS",
                    0,
                    1681778745
                ],
                [
                    4,
                    "VHB",
                    0,
                    1681778745
                ]
            ]
        },
        {
            "name": "inmunizaciones",
            "schema": [
                {
                    "column": "id_inmunizacion",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_inmi_UNIQUE",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "inmunizaciones_trigger_last_modified",
                    "logic": "BEGIN      UPDATE inmunizaciones SET last_modified= (strftime('%s', 'now')) WHERE id_inmunizacion=OLD.id_inmunizacion;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    2,
                    "A GRIPAL",
                    0,
                    1681778781
                ],
                [
                    3,
                    "DB",
                    0,
                    1681778781
                ],
                [
                    1,
                    "TBA",
                    0,
                    1681778781
                ],
                [
                    4,
                    "VHB",
                    0,
                    1681778781
                ]
            ]
        },
        {
            "name": "tratamiento_hiv",
            "schema": [
                {
                    "column": "id_tratamiento_hiv",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "droga",
                    "value": "VARCHAR(45)  NOT NULL DEFAULT 'AZT DURANTE 1 MES' COLLATE NOCASE"
                },
                {
                    "column": "medico_tratante",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "laboratorios",
            "schema": [
                {
                    "column": "id_laboratorio",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "resultado",
                    "value": "VARCHAR(1)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "confirmacion",
                    "value": "SMALLINT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_labo_UNIQUE",
                    "value": "`nombre` DESC,`confirmacion` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "laboratorios_trigger_last_modified",
                    "logic": "BEGIN      UPDATE laboratorios SET last_modified= (strftime('%s', 'now')) WHERE id_laboratorio=OLD.id_laboratorio;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "SÍFILIS",
                    "B",
                    0,
                    0,
                    1681778803
                ],
                [
                    2,
                    "HIV",
                    "B",
                    0,
                    0,
                    1681778803
                ],
                [
                    4,
                    "CHAGAS",
                    "B",
                    0,
                    0,
                    1681778803
                ],
                [
                    5,
                    "VHB",
                    "B",
                    0,
                    0,
                    1681778803
                ],
                [
                    6,
                    "Hb",
                    "N",
                    0,
                    0,
                    1681778803
                ],
                [
                    7,
                    "GLUCEMIA",
                    "N",
                    0,
                    0,
                    1681778803
                ],
                [
                    8,
                    "ESTREPTOCOCO BETA HEMOLÍTICO",
                    "B",
                    0,
                    0,
                    1681778803
                ],
                [
                    9,
                    "GRUPO Y FACTOR",
                    "L",
                    0,
                    0,
                    1681778803
                ],
                [
                    11,
                    "MICROMÉTODO",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    12,
                    "PARASITEMIA",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    13,
                    "VDRL CUANTITATIVO",
                    "M",
                    1,
                    0,
                    1681778803
                ],
                [
                    14,
                    "PCR/CV",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    15,
                    "antiHBc",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    16,
                    "antiHBs",
                    "N",
                    1,
                    0,
                    1681778803
                ],
                [
                    17,
                    "HBs",
                    "N",
                    1,
                    0,
                    1681778803
                ],
                [
                    18,
                    "FTA-ABS",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    19,
                    "HAI",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    20,
                    "ELISA",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    21,
                    "WB",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    22,
                    "HBsAg",
                    "B",
                    1,
                    0,
                    1681778803
                ],
                [
                    23,
                    "IFI",
                    "B",
                    1,
                    0,
                    1681778803
                ]
            ]
        },
        {
            "name": "eventos_adversos",
            "schema": [
                {
                    "column": "id_evento_adverso",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "TEXT  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "eventos_adversos_trigger_last_modified",
                    "logic": "BEGIN      UPDATE eventos_adversos SET last_modified= (strftime('%s', 'now')) WHERE id_evento_adverso=OLD.id_evento_adverso;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "CEFALEAS",
                    0,
                    1681778771
                ],
                [
                    2,
                    "EPIGASTRALGIA",
                    0,
                    1681778771
                ],
                [
                    3,
                    "CÓLICOS",
                    0,
                    1681778771
                ],
                [
                    4,
                    "DIARREA",
                    0,
                    1681778771
                ],
                [
                    5,
                    "NÁUSEAS",
                    0,
                    1681778771
                ],
                [
                    6,
                    "VÓMITOS",
                    0,
                    1681778771
                ],
                [
                    7,
                    "ANOREXIA",
                    0,
                    1681778771
                ],
                [
                    8,
                    "IRRITABILIDAD",
                    0,
                    1681778771
                ],
                [
                    9,
                    "TEMBLOR",
                    0,
                    1681778771
                ],
                [
                    10,
                    "PARESTESIA",
                    0,
                    1681778771
                ],
                [
                    11,
                    "MAREO",
                    0,
                    1681778771
                ],
                [
                    12,
                    "DISTENCIÓN ABDOMINAL",
                    0,
                    1681778771
                ],
                [
                    13,
                    "FIEBRE",
                    0,
                    1681778771
                ],
                [
                    14,
                    "ELEVACIÓN DE TRANSAMINASAS",
                    0,
                    1681778771
                ],
                [
                    15,
                    "EOSINOFILIA",
                    0,
                    1681778771
                ],
                [
                    16,
                    "PLAQUETOPENIA",
                    0,
                    1681778771
                ],
                [
                    17,
                    "LEUCOPENIA",
                    0,
                    1681778771
                ],
                [
                    18,
                    "SÍNDROME DE STEVENS-JOHNSON",
                    0,
                    1681778771
                ],
                [
                    19,
                    "OTROS",
                    0,
                    1681778771
                ]
            ]
        },
        {
            "name": "tratamiento_sifilis",
            "schema": [
                {
                    "column": "id_tratamiento_sifilis",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "droga",
                    "value": "VARCHAR(100)  NOT NULL DEFAULT 'PENICILINA BENZATINICA 2400000' COLLATE NOCASE"
                },
                {
                    "column": "fecha_dosis",
                    "value": "DATE  NOT NULL"
                },
                {
                    "column": "fecha_fin_tratamiento",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "dosis_numero",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "macs",
            "schema": [
                {
                    "column": "id_mac",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "macs_trigger_last_modified",
                    "logic": "BEGIN      UPDATE macs SET last_modified= (strftime('%s', 'now')) WHERE id_mac=OLD.id_mac;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "IMPLANTE",
                    0,
                    1681778838
                ],
                [
                    2,
                    "DIU",
                    0,
                    1681778838
                ],
                [
                    3,
                    "ORAL",
                    0,
                    1681778838
                ],
                [
                    4,
                    "INYECTABLE",
                    0,
                    1681778838
                ],
                [
                    5,
                    "BARRERA",
                    0,
                    1681778838
                ],
                [
                    6,
                    "NINGUNO",
                    0,
                    1681778838
                ]
            ]
        },
        {
            "name": "tratamiento_vhb",
            "schema": [
                {
                    "column": "id_tratamiento_vhb",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ]
        },
        {
            "name": "controles",
            "schema": [
                {
                    "column": "id_control",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "fecha",
                    "value": "DATE  NOT NULL"
                },
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "control_numero",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_estado",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_seguimiento_chagas",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_tratamiento_chagas",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_seguimiento_hiv",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_tratamiento_hiv",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_seguimiento_sifilis",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_tratamiento_sifilis",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_seguimiento_vhb",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_tratamiento_vhb",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "fecha_fin_embarazo",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "id_tipos_fin_embarazos",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "georeferencia",
                    "value": "VARCHAR(30)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`controles_ibfk_1`",
                    "value": "FOREIGN KEY (`id_seguimiento_chagas`) REFERENCES seguimiento_chagas (`id_seguimiento_chagas`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_2`",
                    "value": "FOREIGN KEY (`id_seguimiento_hiv`) REFERENCES seguimiento_hiv (`id_seguimiento_hiv`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_3`",
                    "value": "FOREIGN KEY (`id_seguimiento_sifilis`) REFERENCES seguimiento_sifilis (`id_seguimiento_sifilis`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_4`",
                    "value": "FOREIGN KEY (`id_seguimiento_vhb`) REFERENCES seguimiento_vhb (`id_seguimiento_vhb`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_5`",
                    "value": "FOREIGN KEY (`id_tratamiento_chagas`) REFERENCES tratamiento_chagas (`id_tratamiento_chagas`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_6`",
                    "value": "FOREIGN KEY (`id_tratamiento_hiv`) REFERENCES tratamiento_hiv (`id_tratamiento_hiv`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_7`",
                    "value": "FOREIGN KEY (`id_tratamiento_sifilis`) REFERENCES tratamiento_sifilis (`id_tratamiento_sifilis`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`controles_ibfk_9`",
                    "value": "FOREIGN KEY (`id_tratamiento_vhb`) REFERENCES tratamiento_vhb (`id_tratamiento_vhb`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`fk_controles_estado`",
                    "value": "FOREIGN KEY (`id_estado`) REFERENCES estados (`id_estado`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_controles_personas`",
                    "value": "FOREIGN KEY (`id_persona`) REFERENCES personas (`id_persona`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`fk_tipo_fin_emb`",
                    "value": "FOREIGN KEY (`id_tipos_fin_embarazos`) REFERENCES tipos_fin_embarazos (`id_tipos_fin_embarazos`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "fecha",
                    "value": "`fecha` DESC,`id_persona` DESC,`control_numero` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "fk_Estado_idx",
                    "value": "`id_estado` DESC"
                },
                {
                    "name": "id_seguimiento_chagas",
                    "value": "`id_seguimiento_chagas` DESC"
                },
                {
                    "name": "id_seguimiento_hiv",
                    "value": "`id_seguimiento_hiv` DESC"
                },
                {
                    "name": "id_seguimiento_sifilis",
                    "value": "`id_seguimiento_sifilis` DESC"
                },
                {
                    "name": "id_tratamiento_chagas_controles",
                    "value": "`id_tratamiento_chagas` DESC"
                },
                {
                    "name": "id_tratamiento_hiv",
                    "value": "`id_tratamiento_hiv` DESC"
                },
                {
                    "name": "id_tratamiento_sifilis",
                    "value": "`id_tratamiento_sifilis` DESC"
                },
                {
                    "name": "id_seguimiento_vhb",
                    "value": "`id_seguimiento_vhb` DESC"
                },
                {
                    "name": "id_tratamiento_vhb",
                    "value": "`id_tratamiento_vhb` DESC"
                },
                {
                    "name": "id_persona",
                    "value": "`id_persona` DESC"
                },
                {
                    "name": "id_tipos_fin_embarazos",
                    "value": "`id_tipos_fin_embarazos` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "controles_trigger_last_modified",
                    "logic": "BEGIN  UPDATE controles SET last_modified= strftime('%s', 'now') WHERE id_control=OLD.id_control;END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "motivo_finalizacion_tratamiento",
            "schema": [
                {
                    "column": "id_motivo_finalizacion_tratamiento",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "motivo_finalizacion_tratamiento_trigger_last_modified",
                    "logic": "BEGIN      UPDATE motivo_finalizacion_tratamiento SET last_modified= (strftime('%s', 'now')) WHERE id_motivo_finalizacion_tratamiento=OLD.id_motivo_finalizacion_tratamiento;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "TRATAMIENTO COMPLETO",
                    0,
                    1681778853
                ],
                [
                    2,
                    "SUSPENDIDO POR EVENTOS ADVERSOS",
                    0,
                    1681778853
                ],
                [
                    3,
                    "SUSPENDIDO POR OTRAS RAZONES",
                    0,
                    1681778853
                ],
                [
                    4,
                    "SUSPENDIDO POR EMBARAZO",
                    0,
                    1681778853
                ],
                [
                    5,
                    "ABANDONADO",
                    0,
                    1681778853
                ]
            ]
        },
        {
            "name": "patologias_embarazos",
            "schema": [
                {
                    "column": "id_patologia_embarazo",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(80)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_pe_UNIQUE",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "values": [
                [
                    14,
                    "ALTERACIONES ENCONTRADAS EN LA VITALIDAD FETAL (MF - LCF)",
                    0,
                    1681778934
                ],
                [
                    1,
                    "ANEMIA",
                    0,
                    1681778934
                ],
                [
                    15,
                    "APP",
                    0,
                    1681778934
                ],
                [
                    8,
                    "CARDIOPATÍA",
                    0,
                    1681778934
                ],
                [
                    6,
                    "DBT GESTACIONAL",
                    0,
                    1681778934
                ],
                [
                    10,
                    "ECLAMPSIA",
                    0,
                    1681778934
                ],
                [
                    7,
                    "EMBARAZO MÚLTIPLE",
                    0,
                    1681778934
                ],
                [
                    11,
                    "HEMORRAGIAS 1° TRIM",
                    0,
                    1681778934
                ],
                [
                    12,
                    "HEMORRAGIAS 2° TRIM",
                    0,
                    1681778934
                ],
                [
                    13,
                    "HEMORRAGIAS 3° TRIM",
                    0,
                    1681778934
                ],
                [
                    5,
                    "HTA GESTACIONAL",
                    0,
                    1681778934
                ],
                [
                    2,
                    "ITU",
                    0,
                    1681778934
                ],
                [
                    17,
                    "OTRAS",
                    0,
                    1681778934
                ],
                [
                    3,
                    "OTRAS INFECCIONES",
                    0,
                    1681778934
                ],
                [
                    9,
                    "PREECLAMPSIA",
                    0,
                    1681778934
                ],
                [
                    16,
                    "RCIU",
                    0,
                    1681778934
                ],
                [
                    4,
                    "TBC",
                    0,
                    1681778934
                ]
            ]
        },
        {
            "name": "niveles_acceso",
            "schema": [
                {
                    "column": "id_nivel_acceso",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "acceso",
                    "value": "VARCHAR(50)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "triggers": [
                {
                    "name": "niveles_acceso_derivacion_trigger_last_modified",
                    "logic": "BEGIN      UPDATE niveles_acceso SET last_modified= (strftime('%s', 'now')) WHERE id_nivel_acceso=OLD.id_nivel_acceso;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "FULL",
                    0,
                    1681778875
                ],
                [
                    2,
                    "CONSULTA",
                    0,
                    1681778875
                ]
            ]
        },
        {
            "name": "origenes",
            "schema": [
                {
                    "column": "id_origen",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(100)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_origenes",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "origenes_derivacion_trigger_last_modified",
                    "logic": "BEGIN      UPDATE origenes SET last_modified= (strftime('%s', 'now')) WHERE id_origen=OLD.id_origen;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    2,
                    "CRIOLLA",
                    0,
                    1681778890
                ],
                [
                    1,
                    "ORIGINARIA",
                    0,
                    1681778890
                ]
            ]
        },
        {
            "name": "areas",
            "schema": [
                {
                    "column": "id_area",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_pais",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(100)  NOT NULL  COLLATE NOCASE"
                },
                {
                     "column": "last_modified",
                     "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                 },
                  {
                     "column": "sql_deleted",
                     "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                 },
                {
                    "constraint": "`fk_paises`",
                    "value": "FOREIGN KEY (`id_pais`) REFERENCES paises (`id_pais`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_pais",
                    "value": "`id_pais` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "areas_trigger_last_modified",
                    "logic": "BEGIN      UPDATE areas SET last_modified= (strftime('%s', 'now')) WHERE id_area=OLD.id_area;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "ciudades",
            "schema": [
                {
                    "column": "id_ciudad",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(30)  NOT NULL  COLLATE BINARY"
                },
                {
                    "column": "id_provincia",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`fk_ciudad_provincias`",
                    "value": "FOREIGN KEY (`id_provincia`) REFERENCES provincias (`id_provincia`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_provincia",
                    "value": "`id_provincia` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "ciudades_trigger_last_modified",
                    "logic": "BEGIN      UPDATE ciudades SET last_modified= (strftime('%s', 'now')) WHERE id_ciudad=OLD.id_ciudad;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            "values": [
                [
                    1,
                    "Aroma",
                    33,
                    0,
                    1681778613
                ],
                [
                    2,
                    "Caracas",
                    32,
                    0,
                    1681778613
                ],
                [
                    3,
                    "Cochabamba",
                    26,
                    0,
                    1681778613
                ],
                [
                    4,
                    "Cruz",
                    32,
                    0,
                    1681778613
                ],
                [
                    5,
                    "La Paz",
                    28,
                    0,
                    1681778613
                ],
                [
                    6,
                    "Oruro",
                    30,
                    0,
                    1681778613
                ],
                [
                    7,
                    "Quillacollo",
                    26,
                    0,
                    1681778613
                ],
                [
                    8,
                    "Riberalta",
                    27,
                    0,
                    1681778613
                ],
                [
                    9,
                    "Santa Cruz",
                    27,
                    0,
                    1681778613
                ],
                [
                    10,
                    "Santa Cruz De La Sierra",
                    33,
                    0,
                    1681778613
                ],
                [
                    11,
                    "Sucre",
                    25,
                    0,
                    1681778613
                ],
                [
                    12,
                    "Tarija",
                    29,
                    0,
                    1681778613
                ],
                [
                    13,
                    "Trinidad",
                    27,
                    0,
                    1681778613
                ],
                [
                    14,
                    "Ulupicas",
                    29,
                    0,
                    1681778613
                ],
                [
                    15,
                    "Ciudad Del Este",
                    34,
                    0,
                    1681778613
                ],
                [
                    16,
                    "Fernando De La Mora",
                    39,
                    0,
                    1681778613
                ],
                [
                    17,
                    "Hernandarias",
                    34,
                    0,
                    1681778613
                ],
                [
                    18,
                    "Hohenau",
                    44,
                    0,
                    1681778613
                ],
                [
                    19,
                    "Loma Plata",
                    36,
                    0,
                    1681778613
                ],
                [
                    20,
                    "Los Cedrales",
                    34,
                    0,
                    1681778613
                ],
                [
                    21,
                    "Luque",
                    39,
                    0,
                    1681778613
                ],
                [
                    22,
                    "Mariano Roque Alonso",
                    39,
                    0,
                    1681778613
                ],
                [
                    23,
                    "Obligado",
                    44,
                    0,
                    1681778613
                ],
                [
                    24,
                    "Pilar",
                    46,
                    0,
                    1681778613
                ],
                [
                    25,
                    "Presidente Franco",
                    34,
                    0,
                    1681778613
                ],
                [
                    26,
                    "San Lorenzo",
                    39,
                    0,
                    1681778613
                ],
                [
                    27,
                    "Santa Rita",
                    34,
                    0,
                    1681778613
                ],
                [
                    28,
                    "28 De Septiembre",
                    1,
                    0,
                    1681778613
                ],
                [
                    29,
                    "6 De Septiembre",
                    1,
                    0,
                    1681778613
                ],
                [
                    30,
                    "A. Brown",
                    1,
                    0,
                    1681778613
                ],
                [
                    31,
                    "Abasto",
                    1,
                    0,
                    1681778613
                ],
                [
                    32,
                    "Abra Rica",
                    24,
                    0,
                    1681778613
                ],
                [
                    33,
                    "Acassuso",
                    1,
                    0,
                    1681778613
                ],
                [
                    34,
                    "Aguilar",
                    10,
                    0,
                    1681778613
                ],
                [
                    35,
                    "Aldo Bonzi",
                    1,
                    0,
                    1681778613
                ],
                [
                    36,
                    "Alem",
                    1,
                    0,
                    1681778613
                ],
                [
                    37,
                    "Allen",
                    16,
                    0,
                    1681778613
                ],
                [
                    38,
                    "Almirante Brown",
                    7,
                    0,
                    1681778613
                ],
                [
                    39,
                    "Alsina",
                    1,
                    0,
                    1681778613
                ],
                [
                    40,
                    "Alta Gracia",
                    5,
                    0,
                    1681778613
                ],
                [
                    41,
                    "Alvear",
                    21,
                    0,
                    1681778613
                ],
                [
                    42,
                    "Arrecifes",
                    1,
                    0,
                    1681778613
                ],
                [
                    43,
                    "Arroyo Dulce",
                    1,
                    0,
                    1681778613
                ],
                [
                    44,
                    "Asturias",
                    1,
                    0,
                    1681778613
                ],
                [
                    45,
                    "Avellaneda",
                    1,
                    0,
                    1681778613
                ],
                [
                    46,
                    "Avellaneda",
                    21,
                    0,
                    1681778613
                ],
                [
                    47,
                    "Ayacucho",
                    1,
                    0,
                    1681778613
                ],
                [
                    48,
                    "Azul",
                    1,
                    0,
                    1681778613
                ],
                [
                    49,
                    "Balbastro",
                    7,
                    0,
                    1681778613
                ],
                [
                    50,
                    "Balcarce",
                    1,
                    0,
                    1681778613
                ],
                [
                    51,
                    "Ballester",
                    1,
                    0,
                    1681778613
                ],
                [
                    52,
                    "Balnearia",
                    5,
                    0,
                    1681778613
                ],
                [
                    53,
                    "Bancalari",
                    1,
                    0,
                    1681778613
                ],
                [
                    54,
                    "Banfield",
                    1,
                    0,
                    1681778613
                ],
                [
                    55,
                    "Bariloche",
                    1,
                    0,
                    1681778613
                ],
                [
                    56,
                    "Barrancas Viejo",
                    21,
                    0,
                    1681778613
                ],
                [
                    57,
                    "Barrio San Patricio",
                    1,
                    0,
                    1681778613
                ],
                [
                    58,
                    "Beccar",
                    1,
                    0,
                    1681778613
                ],
                [
                    59,
                    "Belgrano",
                    22,
                    0,
                    1681778613
                ],
                [
                    60,
                    "Bell Ville",
                    5,
                    0,
                    1681778613
                ],
                [
                    61,
                    "Bella Vista",
                    1,
                    0,
                    1681778613
                ],
                [
                    62,
                    "Benavides",
                    1,
                    0,
                    1681778613
                ],
                [
                    63,
                    "Berazategui",
                    1,
                    0,
                    1681778613
                ],
                [
                    64,
                    "Berisso",
                    1,
                    0,
                    1681778613
                ],
                [
                    65,
                    "Bernal",
                    1,
                    0,
                    1681778613
                ],
                [
                    66,
                    "Billinghurst",
                    1,
                    0,
                    1681778613
                ],
                [
                    67,
                    "Bordenave",
                    1,
                    0,
                    1681778613
                ],
                [
                    68,
                    "Bosch",
                    1,
                    0,
                    1681778613
                ],
                [
                    69,
                    "Bosques",
                    1,
                    0,
                    1681778613
                ],
                [
                    70,
                    "Boulogne",
                    1,
                    0,
                    1681778613
                ],
                [
                    71,
                    "Bowen",
                    13,
                    0,
                    1681778613
                ],
                [
                    72,
                    "Bragado",
                    1,
                    0,
                    1681778613
                ],
                [
                    73,
                    "Brandsen",
                    1,
                    0,
                    1681778613
                ],
                [
                    74,
                    "Buenos Aires",
                    7,
                    0,
                    1681778613
                ],
                [
                    75,
                    "Burzaco",
                    1,
                    0,
                    1681778613
                ],
                [
                    76,
                    "C. De Mayo",
                    1,
                    0,
                    1681778613
                ],
                [
                    77,
                    "Caleta Olivia",
                    20,
                    0,
                    1681778613
                ],
                [
                    78,
                    "Campana",
                    1,
                    0,
                    1681778613
                ],
                [
                    79,
                    "Canning",
                    1,
                    0,
                    1681778613
                ],
                [
                    80,
                    "Caraza",
                    1,
                    0,
                    1681778613
                ],
                [
                    81,
                    "Carlos Casares",
                    1,
                    0,
                    1681778613
                ],
                [
                    82,
                    "Carlos Pellegrini",
                    21,
                    0,
                    1681778613
                ],
                [
                    83,
                    "Carlos Tejedor",
                    1,
                    0,
                    1681778613
                ],
                [
                    84,
                    "Carmen",
                    23,
                    0,
                    1681778613
                ],
                [
                    85,
                    "Carreras",
                    21,
                    0,
                    1681778613
                ],
                [
                    86,
                    "Caseros",
                    1,
                    0,
                    1681778613
                ],
                [
                    87,
                    "Casilda",
                    21,
                    0,
                    1681778613
                ],
                [
                    88,
                    "Castelar",
                    1,
                    0,
                    1681778613
                ],
                [
                    89,
                    "Catamarca",
                    2,
                    0,
                    1681778613
                ],
                [
                    90,
                    "Catriel",
                    16,
                    0,
                    1681778613
                ],
                [
                    91,
                    "Centenario",
                    1,
                    0,
                    1681778613
                ],
                [
                    92,
                    "Cevallos",
                    11,
                    0,
                    1681778613
                ],
                [
                    93,
                    "Chacabuco",
                    1,
                    0,
                    1681778613
                ],
                [
                    94,
                    "Chacarita",
                    7,
                    0,
                    1681778613
                ],
                [
                    95,
                    "Chivilcoy",
                    1,
                    0,
                    1681778613
                ],
                [
                    96,
                    "Choele Choel",
                    16,
                    0,
                    1681778613
                ],
                [
                    97,
                    "Cipolleti",
                    16,
                    0,
                    1681778613
                ],
                [
                    98,
                    "Cipolletti",
                    16,
                    0,
                    1681778613
                ],
                [
                    99,
                    "City Bell",
                    1,
                    0,
                    1681778613
                ],
                [
                    100,
                    "Ciudad Evita",
                    1,
                    0,
                    1681778613
                ],
                [
                    101,
                    "Ciudad Universitaria",
                    24,
                    0,
                    1681778613
                ],
                [
                    102,
                    "Ciudadela",
                    1,
                    0,
                    1681778613
                ],
                [
                    103,
                    "Claypole",
                    1,
                    0,
                    1681778613
                ],
                [
                    104,
                    "Coillun-Co",
                    15,
                    0,
                    1681778613
                ],
                [
                    105,
                    "Colonia Caroya",
                    5,
                    0,
                    1681778613
                ],
                [
                    106,
                    "Comandante L. Piedrabuena",
                    7,
                    0,
                    1681778613
                ],
                [
                    107,
                    "Comandante Nicanor Otamendi",
                    1,
                    0,
                    1681778613
                ],
                [
                    108,
                    "Comodoro Rivadavia",
                    7,
                    0,
                    1681778613
                ],
                [
                    109,
                    "Conchitas",
                    1,
                    0,
                    1681778613
                ],
                [
                    110,
                    "Concordia",
                    8,
                    0,
                    1681778613
                ],
                [
                    111,
                    "Corral De Bustos",
                    5,
                    0,
                    1681778613
                ],
                [
                    112,
                    "Corrientes",
                    6,
                    0,
                    1681778613
                ],
                [
                    113,
                    "Crespo",
                    8,
                    0,
                    1681778613
                ],
                [
                    114,
                    "Cruz Del Eje",
                    5,
                    0,
                    1681778613
                ],
                [
                    115,
                    "Darregueira",
                    1,
                    0,
                    1681778613
                ],
                [
                    116,
                    "De Mayo",
                    14,
                    0,
                    1681778613
                ],
                [
                    117,
                    "Del Viso",
                    1,
                    0,
                    1681778613
                ],
                [
                    118,
                    "Derechos De La Ancianidad",
                    1,
                    0,
                    1681778613
                ],
                [
                    119,
                    "Derqui",
                    1,
                    0,
                    1681778613
                ],
                [
                    120,
                    "Diamante",
                    1,
                    0,
                    1681778613
                ],
                [
                    121,
                    "Diamante",
                    8,
                    0,
                    1681778613
                ],
                [
                    122,
                    "Dolores",
                    1,
                    0,
                    1681778613
                ],
                [
                    123,
                    "Domselaar",
                    1,
                    0,
                    1681778613
                ],
                [
                    124,
                    "Don Torcuato",
                    1,
                    0,
                    1681778613
                ],
                [
                    125,
                    "Drabble",
                    1,
                    0,
                    1681778613
                ],
                [
                    126,
                    "El Calafate",
                    20,
                    0,
                    1681778613
                ],
                [
                    127,
                    "El Chorrillo",
                    19,
                    0,
                    1681778613
                ],
                [
                    128,
                    "El Dorado",
                    1,
                    0,
                    1681778613
                ],
                [
                    129,
                    "El Hoyo",
                    22,
                    0,
                    1681778613
                ],
                [
                    130,
                    "El Palomar",
                    1,
                    0,
                    1681778613
                ],
                [
                    131,
                    "El Retiro",
                    5,
                    0,
                    1681778613
                ],
                [
                    132,
                    "El Talar",
                    1,
                    0,
                    1681778613
                ],
                [
                    133,
                    "El Verano",
                    1,
                    0,
                    1681778613
                ],
                [
                    134,
                    "Eldorado",
                    14,
                    0,
                    1681778613
                ],
                [
                    135,
                    "Embalse",
                    5,
                    0,
                    1681778613
                ],
                [
                    136,
                    "Ensenada",
                    1,
                    0,
                    1681778613
                ],
                [
                    137,
                    "Escobar",
                    1,
                    0,
                    1681778613
                ],
                [
                    138,
                    "Esmeralda",
                    21,
                    0,
                    1681778613
                ],
                [
                    139,
                    "Espeleta",
                    1,
                    0,
                    1681778613
                ],
                [
                    140,
                    "Esperanza",
                    21,
                    0,
                    1681778613
                ],
                [
                    141,
                    "Esquel",
                    7,
                    0,
                    1681778613
                ],
                [
                    142,
                    "Ezeiza",
                    1,
                    0,
                    1681778613
                ],
                [
                    143,
                    "Ezpeleta",
                    1,
                    0,
                    1681778613
                ],
                [
                    144,
                    "F. Alvarez",
                    1,
                    0,
                    1681778613
                ],
                [
                    145,
                    "F. Paz",
                    21,
                    0,
                    1681778613
                ],
                [
                    146,
                    "Federal",
                    8,
                    0,
                    1681778613
                ],
                [
                    147,
                    "Fiorito",
                    1,
                    0,
                    1681778613
                ],
                [
                    148,
                    "Firmat",
                    21,
                    0,
                    1681778613
                ],
                [
                    149,
                    "Florencio Varela",
                    1,
                    0,
                    1681778613
                ],
                [
                    150,
                    "Flores",
                    7,
                    0,
                    1681778613
                ],
                [
                    151,
                    "Floresta",
                    7,
                    0,
                    1681778613
                ],
                [
                    152,
                    "Florida",
                    1,
                    0,
                    1681778613
                ],
                [
                    153,
                    "Formosa",
                    9,
                    0,
                    1681778613
                ],
                [
                    154,
                    "Fuentes",
                    21,
                    0,
                    1681778613
                ],
                [
                    155,
                    "Fulton",
                    1,
                    0,
                    1681778613
                ],
                [
                    156,
                    "Funes",
                    21,
                    0,
                    1681778613
                ],
                [
                    157,
                    "General Alvear",
                    1,
                    0,
                    1681778613
                ],
                [
                    158,
                    "General Belgrano",
                    1,
                    0,
                    1681778613
                ],
                [
                    159,
                    "General E. Godoy",
                    16,
                    0,
                    1681778613
                ],
                [
                    160,
                    "General Pacheco",
                    1,
                    0,
                    1681778613
                ],
                [
                    161,
                    "General Pico",
                    11,
                    0,
                    1681778613
                ],
                [
                    162,
                    "General Roca",
                    16,
                    0,
                    1681778613
                ],
                [
                    163,
                    "General Villegas",
                    1,
                    0,
                    1681778613
                ],
                [
                    164,
                    "Gerli",
                    1,
                    0,
                    1681778613
                ],
                [
                    165,
                    "Germania",
                    1,
                    0,
                    1681778613
                ],
                [
                    166,
                    "Girondo",
                    1,
                    0,
                    1681778613
                ],
                [
                    167,
                    "Glew",
                    1,
                    0,
                    1681778613
                ],
                [
                    168,
                    "Gobernador Castro",
                    1,
                    0,
                    1681778613
                ],
                [
                    169,
                    "Gobernador Monteverde",
                    1,
                    0,
                    1681778613
                ],
                [
                    170,
                    "Godoy Cruz",
                    13,
                    0,
                    1681778613
                ],
                [
                    171,
                    "Gonnet",
                    1,
                    0,
                    1681778613
                ],
                [
                    172,
                    "Goya",
                    6,
                    0,
                    1681778613
                ],
                [
                    173,
                    "Granadero Baigorria",
                    21,
                    0,
                    1681778613
                ],
                [
                    174,
                    "Grand Bourg",
                    1,
                    0,
                    1681778613
                ],
                [
                    175,
                    "Gualeguay",
                    8,
                    0,
                    1681778613
                ],
                [
                    176,
                    "Guernica",
                    1,
                    0,
                    1681778613
                ],
                [
                    177,
                    "Haedo",
                    1,
                    0,
                    1681778613
                ],
                [
                    178,
                    "Herrera Vegas",
                    1,
                    0,
                    1681778613
                ],
                [
                    179,
                    "Hilario",
                    18,
                    0,
                    1681778613
                ],
                [
                    180,
                    "Hilario Ascasubi",
                    1,
                    0,
                    1681778613
                ],
                [
                    181,
                    "Hughes",
                    21,
                    0,
                    1681778613
                ],
                [
                    182,
                    "Hurlingham",
                    1,
                    0,
                    1681778613
                ],
                [
                    183,
                    "I. Casanova",
                    1,
                    0,
                    1681778613
                ],
                [
                    184,
                    "Ingeniero Budge",
                    1,
                    0,
                    1681778613
                ],
                [
                    185,
                    "Ingeniero Maschwitz",
                    1,
                    0,
                    1681778613
                ],
                [
                    186,
                    "Iraizoz",
                    1,
                    0,
                    1681778613
                ],
                [
                    187,
                    "Isidro Casanova",
                    1,
                    0,
                    1681778613
                ],
                [
                    188,
                    "J.F. Ibarra",
                    1,
                    0,
                    1681778613
                ],
                [
                    189,
                    "J.M. Bosch",
                    1,
                    0,
                    1681778613
                ],
                [
                    190,
                    "J.M. Gutierrez",
                    1,
                    0,
                    1681778613
                ],
                [
                    191,
                    "Juan Vucetich",
                    1,
                    0,
                    1681778613
                ],
                [
                    192,
                    "Jujuy",
                    10,
                    0,
                    1681778613
                ],
                [
                    193,
                    "Justiniano Posse",
                    5,
                    0,
                    1681778613
                ],
                [
                    194,
                    "L. De Zamora",
                    1,
                    0,
                    1681778613
                ],
                [
                    195,
                    "La Cesira",
                    5,
                    0,
                    1681778613
                ],
                [
                    196,
                    "La Invencible",
                    1,
                    0,
                    1681778613
                ],
                [
                    197,
                    "La Pampa",
                    5,
                    0,
                    1681778613
                ],
                [
                    198,
                    "La Paternal",
                    7,
                    0,
                    1681778613
                ],
                [
                    199,
                    "La Paz",
                    1,
                    0,
                    1681778613
                ],
                [
                    200,
                    "La Plata",
                    1,
                    0,
                    1681778613
                ],
                [
                    201,
                    "La Reja",
                    1,
                    0,
                    1681778613
                ],
                [
                    202,
                    "La Rioja",
                    12,
                    0,
                    1681778613
                ],
                [
                    203,
                    "Laferrere",
                    1,
                    0,
                    1681778613
                ],
                [
                    204,
                    "Laguna Larga",
                    5,
                    0,
                    1681778613
                ],
                [
                    205,
                    "Lamarque",
                    16,
                    0,
                    1681778613
                ],
                [
                    206,
                    "Las Calles",
                    5,
                    0,
                    1681778613
                ],
                [
                    207,
                    "Las Delicias",
                    22,
                    0,
                    1681778613
                ],
                [
                    208,
                    "Las Flores",
                    22,
                    0,
                    1681778613
                ],
                [
                    209,
                    "Las Heras",
                    5,
                    0,
                    1681778613
                ],
                [
                    210,
                    "Las Parejas",
                    21,
                    0,
                    1681778613
                ],
                [
                    211,
                    "Las Perdices",
                    5,
                    0,
                    1681778613
                ],
                [
                    212,
                    "Las Varillas",
                    5,
                    0,
                    1681778613
                ],
                [
                    213,
                    "Lavalle",
                    22,
                    0,
                    1681778613
                ],
                [
                    214,
                    "Libertad",
                    1,
                    0,
                    1681778613
                ],
                [
                    215,
                    "Lima",
                    1,
                    0,
                    1681778613
                ],
                [
                    216,
                    "Linch",
                    1,
                    0,
                    1681778613
                ],
                [
                    217,
                    "Lincoln",
                    1,
                    0,
                    1681778613
                ],
                [
                    218,
                    "Liniers",
                    7,
                    0,
                    1681778613
                ],
                [
                    219,
                    "Llavallol",
                    1,
                    0,
                    1681778613
                ],
                [
                    220,
                    "Lobos",
                    1,
                    0,
                    1681778613
                ],
                [
                    221,
                    "Lomas De Zamora",
                    1,
                    0,
                    1681778613
                ],
                [
                    222,
                    "Lomas Del Mirador",
                    1,
                    0,
                    1681778613
                ],
                [
                    223,
                    "Longchamps",
                    1,
                    0,
                    1681778613
                ],
                [
                    224,
                    "Los Antiguos",
                    20,
                    0,
                    1681778613
                ],
                [
                    225,
                    "Los Cardales",
                    1,
                    0,
                    1681778613
                ],
                [
                    226,
                    "Los Perales",
                    7,
                    0,
                    1681778613
                ],
                [
                    227,
                    "Los Polvorines",
                    1,
                    0,
                    1681778613
                ],
                [
                    228,
                    "Los Surgentes",
                    5,
                    0,
                    1681778613
                ],
                [
                    229,
                    "Lugones",
                    22,
                    0,
                    1681778613
                ],
                [
                    230,
                    "Luro",
                    1,
                    0,
                    1681778613
                ],
                [
                    231,
                    "M. Acosta",
                    1,
                    0,
                    1681778613
                ],
                [
                    232,
                    "Madryn",
                    4,
                    0,
                    1681778613
                ],
                [
                    233,
                    "Manfredi",
                    5,
                    0,
                    1681778613
                ],
                [
                    234,
                    "Manzanares",
                    1,
                    0,
                    1681778613
                ],
                [
                    235,
                    "Maquinista Savio",
                    1,
                    0,
                    1681778613
                ],
                [
                    236,
                    "Mar Del Plata",
                    1,
                    0,
                    1681778613
                ],
                [
                    237,
                    "Marcelo Torcuato De Alvear",
                    7,
                    0,
                    1681778613
                ],
                [
                    238,
                    "Marcos Paz",
                    1,
                    0,
                    1681778613
                ],
                [
                    239,
                    "Mariano H. Alfonzo",
                    1,
                    0,
                    1681778613
                ],
                [
                    240,
                    "Mataderos",
                    7,
                    0,
                    1681778613
                ],
                [
                    241,
                    "Mauricio Hirch",
                    1,
                    0,
                    1681778613
                ],
                [
                    242,
                    "Mendiolaza",
                    5,
                    0,
                    1681778613
                ],
                [
                    243,
                    "Mendoza",
                    13,
                    0,
                    1681778613
                ],
                [
                    244,
                    "Mercedes",
                    19,
                    0,
                    1681778613
                ],
                [
                    245,
                    "Merlo",
                    1,
                    0,
                    1681778613
                ],
                [
                    246,
                    "Miramar",
                    1,
                    0,
                    1681778613
                ],
                [
                    247,
                    "Moguehua",
                    1,
                    0,
                    1681778613
                ],
                [
                    248,
                    "Monte Castro",
                    7,
                    0,
                    1681778613
                ],
                [
                    249,
                    "Monte Chingolo",
                    1,
                    0,
                    1681778613
                ],
                [
                    250,
                    "Monte Grande",
                    1,
                    0,
                    1681778613
                ],
                [
                    251,
                    "Munro",
                    1,
                    0,
                    1681778613
                ],
                [
                    252,
                    "Naranjito",
                    24,
                    0,
                    1681778613
                ],
                [
                    253,
                    "Navarro",
                    22,
                    0,
                    1681778613
                ],
                [
                    254,
                    "Necochea",
                    1,
                    0,
                    1681778613
                ],
                [
                    255,
                    "Neild",
                    1,
                    0,
                    1681778613
                ],
                [
                    256,
                    "Nueve De Julio",
                    1,
                    0,
                    1681778613
                ],
                [
                    257,
                    "Oliva",
                    5,
                    0,
                    1681778613
                ],
                [
                    258,
                    "Oliveros",
                    21,
                    0,
                    1681778613
                ],
                [
                    259,
                    "Olivia",
                    5,
                    0,
                    1681778613
                ],
                [
                    260,
                    "Olivos",
                    1,
                    0,
                    1681778613
                ],
                [
                    261,
                    "Ostende",
                    1,
                    0,
                    1681778613
                ],
                [
                    262,
                    "Paso De Los Libres",
                    6,
                    0,
                    1681778613
                ],
                [
                    263,
                    "Paso Del Rey",
                    1,
                    0,
                    1681778613
                ],
                [
                    264,
                    "Pedro Luro",
                    1,
                    0,
                    1681778613
                ],
                [
                    265,
                    "Pellegrini",
                    1,
                    0,
                    1681778613
                ],
                [
                    266,
                    "Pergamino",
                    1,
                    0,
                    1681778613
                ],
                [
                    267,
                    "Pico Truncado",
                    20,
                    0,
                    1681778613
                ],
                [
                    268,
                    "Piedra Pintada",
                    5,
                    0,
                    1681778613
                ],
                [
                    269,
                    "Pilar",
                    21,
                    0,
                    1681778613
                ],
                [
                    270,
                    "Pinamar",
                    1,
                    0,
                    1681778613
                ],
                [
                    271,
                    "Piquete Cabado",
                    17,
                    0,
                    1681778613
                ],
                [
                    272,
                    "Plottier",
                    15,
                    0,
                    1681778613
                ],
                [
                    273,
                    "Polvorines",
                    1,
                    0,
                    1681778613
                ],
                [
                    274,
                    "Pontevedra",
                    1,
                    0,
                    1681778613
                ],
                [
                    275,
                    "Posadas",
                    14,
                    0,
                    1681778613
                ],
                [
                    276,
                    "Presidente Derqui",
                    1,
                    0,
                    1681778613
                ],
                [
                    277,
                    "Puan",
                    1,
                    0,
                    1681778613
                ],
                [
                    278,
                    "Puerto Madero",
                    7,
                    0,
                    1681778613
                ],
                [
                    279,
                    "Puerto Madryn",
                    4,
                    0,
                    1681778613
                ],
                [
                    280,
                    "Pujol",
                    1,
                    0,
                    1681778613
                ],
                [
                    281,
                    "Punta Alta",
                    1,
                    0,
                    1681778613
                ],
                [
                    282,
                    "Punta Indio",
                    1,
                    0,
                    1681778613
                ],
                [
                    283,
                    "Quilmes",
                    1,
                    0,
                    1681778613
                ],
                [
                    284,
                    "R. De Escalada",
                    1,
                    0,
                    1681778613
                ],
                [
                    285,
                    "Rafael Calzada",
                    1,
                    0,
                    1681778613
                ],
                [
                    286,
                    "Rafael Castillo",
                    1,
                    0,
                    1681778613
                ],
                [
                    287,
                    "Rafaela",
                    21,
                    0,
                    1681778613
                ],
                [
                    288,
                    "Ramos Otero",
                    1,
                    0,
                    1681778613
                ],
                [
                    289,
                    "Ranelagh",
                    1,
                    0,
                    1681778613
                ],
                [
                    290,
                    "Rawson",
                    4,
                    0,
                    1681778613
                ],
                [
                    291,
                    "Reconquista",
                    21,
                    0,
                    1681778613
                ],
                [
                    292,
                    "Remedios De Escalada",
                    1,
                    0,
                    1681778613
                ],
                [
                    293,
                    "Resistencia",
                    3,
                    0,
                    1681778613
                ],
                [
                    294,
                    "Rivadavia",
                    13,
                    0,
                    1681778613
                ],
                [
                    295,
                    "Rodriguez",
                    21,
                    0,
                    1681778613
                ],
                [
                    296,
                    "Rojas",
                    1,
                    0,
                    1681778613
                ],
                [
                    297,
                    "Rosa",
                    1,
                    0,
                    1681778613
                ],
                [
                    298,
                    "Rosario",
                    21,
                    0,
                    1681778613
                ],
                [
                    299,
                    "Rosario Del Tala",
                    8,
                    0,
                    1681778613
                ],
                [
                    300,
                    "Rufino",
                    21,
                    0,
                    1681778613
                ],
                [
                    301,
                    "Saladillo",
                    5,
                    0,
                    1681778613
                ],
                [
                    302,
                    "Saladillo",
                    21,
                    0,
                    1681778613
                ],
                [
                    303,
                    "Salsipuedes",
                    5,
                    0,
                    1681778613
                ],
                [
                    304,
                    "Salta",
                    17,
                    0,
                    1681778613
                ],
                [
                    305,
                    "Salto",
                    1,
                    0,
                    1681778613
                ],
                [
                    306,
                    "San Antonio",
                    21,
                    0,
                    1681778613
                ],
                [
                    307,
                    "San Antonio De Areco",
                    1,
                    0,
                    1681778613
                ],
                [
                    308,
                    "San Antonio De Padua",
                    1,
                    0,
                    1681778613
                ],
                [
                    309,
                    "San Antonio Oeste",
                    16,
                    0,
                    1681778613
                ],
                [
                    310,
                    "San Bernardo",
                    22,
                    0,
                    1681778613
                ],
                [
                    311,
                    "San Carlos",
                    22,
                    0,
                    1681778613
                ],
                [
                    312,
                    "San Carlos De Bariloche",
                    16,
                    0,
                    1681778613
                ],
                [
                    313,
                    "San Cayetano",
                    1,
                    0,
                    1681778613
                ],
                [
                    314,
                    "San Clemente",
                    5,
                    0,
                    1681778613
                ],
                [
                    315,
                    "San Fernando",
                    1,
                    0,
                    1681778613
                ],
                [
                    316,
                    "San Francisco Solano",
                    1,
                    0,
                    1681778613
                ],
                [
                    317,
                    "San Genaro",
                    21,
                    0,
                    1681778613
                ],
                [
                    318,
                    "San Guillermo",
                    21,
                    0,
                    1681778613
                ],
                [
                    319,
                    "San Isidro",
                    1,
                    0,
                    1681778613
                ],
                [
                    320,
                    "San Jorge",
                    21,
                    0,
                    1681778613
                ],
                [
                    321,
                    "San Juan",
                    18,
                    0,
                    1681778613
                ],
                [
                    322,
                    "San Justo",
                    1,
                    0,
                    1681778613
                ],
                [
                    323,
                    "San Justo",
                    22,
                    0,
                    1681778613
                ],
                [
                    324,
                    "San Luis",
                    19,
                    0,
                    1681778613
                ],
                [
                    325,
                    "San Manuel",
                    1,
                    0,
                    1681778613
                ],
                [
                    326,
                    "San Manuel",
                    22,
                    0,
                    1681778613
                ],
                [
                    327,
                    "San Miguel",
                    11,
                    0,
                    1681778613
                ],
                [
                    328,
                    "San Miguel Del Monte",
                    1,
                    0,
                    1681778613
                ],
                [
                    329,
                    "San Pedro",
                    1,
                    0,
                    1681778613
                ],
                [
                    330,
                    "San Rafael",
                    13,
                    0,
                    1681778613
                ],
                [
                    331,
                    "San Ricardo",
                    21,
                    0,
                    1681778613
                ],
                [
                    332,
                    "San Telmo",
                    7,
                    0,
                    1681778613
                ],
                [
                    333,
                    "San Vicente",
                    1,
                    0,
                    1681778613
                ],
                [
                    334,
                    "Sanford",
                    21,
                    0,
                    1681778613
                ],
                [
                    335,
                    "Santa Cruz",
                    22,
                    0,
                    1681778613
                ],
                [
                    336,
                    "Santa Fe",
                    21,
                    0,
                    1681778613
                ],
                [
                    337,
                    "Santa Rosa",
                    11,
                    0,
                    1681778613
                ],
                [
                    338,
                    "Santa Rosa De Calamuchita",
                    5,
                    0,
                    1681778613
                ],
                [
                    339,
                    "Santa Teresita",
                    1,
                    0,
                    1681778613
                ],
                [
                    340,
                    "Santiago Del Estero",
                    22,
                    0,
                    1681778613
                ],
                [
                    341,
                    "Santos Lugares",
                    22,
                    0,
                    1681778613
                ],
                [
                    342,
                    "Sarmiento",
                    21,
                    0,
                    1681778613
                ],
                [
                    343,
                    "Suipacha",
                    1,
                    0,
                    1681778613
                ],
                [
                    344,
                    "Sunchales",
                    21,
                    0,
                    1681778613
                ],
                [
                    345,
                    "Tablada",
                    1,
                    0,
                    1681778613
                ],
                [
                    346,
                    "Tandil",
                    1,
                    0,
                    1681778613
                ],
                [
                    347,
                    "Temperley",
                    1,
                    0,
                    1681778613
                ],
                [
                    348,
                    "Tigre",
                    1,
                    0,
                    1681778613
                ],
                [
                    349,
                    "Todd",
                    1,
                    0,
                    1681778613
                ],
                [
                    350,
                    "Tornquist",
                    1,
                    0,
                    1681778613
                ],
                [
                    351,
                    "Tortuguitas",
                    1,
                    0,
                    1681778613
                ],
                [
                    352,
                    "Trelew",
                    4,
                    0,
                    1681778613
                ],
                [
                    353,
                    "Trenque Lauquen",
                    1,
                    0,
                    1681778613
                ],
                [
                    354,
                    "Tres Arroyos",
                    1,
                    0,
                    1681778613
                ],
                [
                    355,
                    "Turdera",
                    1,
                    0,
                    1681778613
                ],
                [
                    356,
                    "Ucacha",
                    5,
                    0,
                    1681778613
                ],
                [
                    357,
                    "Ushuaia",
                    23,
                    0,
                    1681778613
                ],
                [
                    358,
                    "Valle Hermoso",
                    5,
                    0,
                    1681778613
                ],
                [
                    359,
                    "Varela",
                    7,
                    0,
                    1681778613
                ],
                [
                    360,
                    "Venado Tuerto",
                    21,
                    0,
                    1681778613
                ],
                [
                    361,
                    "Victoria",
                    8,
                    0,
                    1681778613
                ],
                [
                    362,
                    "Viedma",
                    16,
                    0,
                    1681778613
                ],
                [
                    363,
                    "Villa Aberastain",
                    18,
                    0,
                    1681778613
                ],
                [
                    364,
                    "Villa Adelina",
                    1,
                    0,
                    1681778613
                ],
                [
                    365,
                    "Villa Alianza",
                    1,
                    0,
                    1681778613
                ],
                [
                    366,
                    "Villa Ansaldi",
                    1,
                    0,
                    1681778613
                ],
                [
                    367,
                    "Villa Augusta",
                    1,
                    0,
                    1681778613
                ],
                [
                    368,
                    "Villa Ballester",
                    1,
                    0,
                    1681778613
                ],
                [
                    369,
                    "Villa Barilari",
                    1,
                    0,
                    1681778613
                ],
                [
                    370,
                    "Villa Basso",
                    1,
                    0,
                    1681778613
                ],
                [
                    371,
                    "Villa Carlos Paz",
                    5,
                    0,
                    1681778613
                ],
                [
                    372,
                    "Villa D. Sobral",
                    1,
                    0,
                    1681778613
                ],
                [
                    373,
                    "Villa De Los Patricios",
                    1,
                    0,
                    1681778613
                ],
                [
                    374,
                    "Villa De Mayo",
                    1,
                    0,
                    1681778613
                ],
                [
                    375,
                    "Villa Diamante",
                    1,
                    0,
                    1681778613
                ],
                [
                    376,
                    "Villa Dolores",
                    5,
                    0,
                    1681778613
                ],
                [
                    377,
                    "Villa Elisa",
                    1,
                    0,
                    1681778613
                ],
                [
                    378,
                    "Villa Gesell",
                    1,
                    0,
                    1681778613
                ],
                [
                    379,
                    "Villa Giambruno",
                    1,
                    0,
                    1681778613
                ],
                [
                    380,
                    "Villa Iglesias",
                    1,
                    0,
                    1681778613
                ],
                [
                    381,
                    "Villa La Angostura",
                    15,
                    0,
                    1681778613
                ],
                [
                    382,
                    "Villa Las Rosas",
                    5,
                    0,
                    1681778613
                ],
                [
                    383,
                    "Villa Luro",
                    7,
                    0,
                    1681778613
                ],
                [
                    384,
                    "Villa Luzuriaga",
                    1,
                    0,
                    1681778613
                ],
                [
                    385,
                    "Villa Madero",
                    1,
                    0,
                    1681778613
                ],
                [
                    386,
                    "Villa Nueva",
                    22,
                    0,
                    1681778613
                ],
                [
                    387,
                    "Villa Ocampo",
                    21,
                    0,
                    1681778613
                ],
                [
                    388,
                    "Villa Progreso",
                    1,
                    0,
                    1681778613
                ],
                [
                    389,
                    "Villa Recondo",
                    1,
                    0,
                    1681778613
                ],
                [
                    390,
                    "Villa Reichembach",
                    1,
                    0,
                    1681778613
                ],
                [
                    391,
                    "Villa Residencial Laguna Brava",
                    1,
                    0,
                    1681778613
                ],
                [
                    392,
                    "Villa Sarmiento",
                    1,
                    0,
                    1681778613
                ],
                [
                    393,
                    "Villaguay",
                    8,
                    0,
                    1681778613
                ],
                [
                    394,
                    "Virreyes",
                    1,
                    0,
                    1681778613
                ],
                [
                    395,
                    "Wilde",
                    1,
                    0,
                    1681778613
                ],
                [
                    396,
                    "Yerba Buena",
                    24,
                    0,
                    1681778613
                ],
                [
                    397,
                    "Yocsina",
                    5,
                    0,
                    1681778613
                ],
                [
                    398,
                    "Zapala",
                    15,
                    0,
                    1681778613
                ]
            ]
        },
        {
            "name": "control_embarazo",
            "schema": [
                {
                    "column": "id_control_embarazo",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "edad_gestacional",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "eco",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "detalle_eco",
                    "value": "TEXT  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "hpv",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "pap",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sistolica",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "diastolica",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "clinico",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "observaciones",
                    "value": "TEXT  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "motivo",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "derivada",
                    "value": "SMALLINT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`control_embarazo_ibfk_1`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`fk_motivo`",
                    "value": "FOREIGN KEY (`motivo`) REFERENCES motivos_derivacion (`id_motivo`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_control",
                    "value": "`id_control` DESC"
                },
                {
                    "name": "fk_motivo",
                    "value": "`motivo` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "control_embarazo_trigger_last_modified",
                    "logic": "BEGIN  UPDATE control_embarazo SET last_modified= (strftime('%s', 'now')) WHERE id_control_embarazo=OLD.id_control_embarazo;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "patologias_rn",
            "schema": [
                {
                    "column": "id_patologias_Rn",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "values": [
                [
                    1,
                    "PREMATURO",
                    0,
                    1681778944
                ],
                [
                    2,
                    "RCIU",
                    0,
                    1681778944
                ],
                [
                    3,
                    "HIJO DE MADRE DBT",
                    0,
                    1681778944
                ],
                [
                    4,
                    "DEPRIMIDO NEONATAL",
                    0,
                    1681778944
                ],
                [
                    5,
                    "SOSPECHA DE SEPSIS",
                    0,
                    1681778944
                ],
                [
                    6,
                    "HIPERBILIRRUBINEMIA",
                    0,
                    1681778944
                ],
                [
                    7,
                    "BAJO PESO",
                    0,
                    1681778944
                ],
                [
                    8,
                    "HIPOTIROIDISMO CONGÉNITO",
                    0,
                    1681778944
                ],
                [
                    9,
                    "SÍNDROME GENÉTICO / MALFORMACIONES",
                    0,
                    1681778944
                ],
                [
                    10,
                    "LABIO LEPORINO",
                    0,
                    1681778944
                ]
            ]
        },
        {
            "name": "parajes",
            "schema": [
                {
                    "column": "id_paraje",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_area",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(100)  NOT NULL  COLLATE NOCASE"
                },
                {
                     "column": "last_modified",
                     "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                 },
                  {
                     "column": "sql_deleted",
                     "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                 },
                {
                    "constraint": "`fk_areas`",
                    "value": "FOREIGN KEY (`id_area`) REFERENCES areas (`id_area`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_area",
                    "value": "`id_area` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "parajes_derivacion_trigger_last_modified",
                    "logic": "BEGIN      UPDATE parajes SET last_modified= (strftime('%s', 'now')) WHERE id_paraje=OLD.id_paraje;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            
        },
        {
            "name": "control_emb_patologico",
            "schema": [
                {
                    "column": "id_control_emb_patologico",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_control_embarazo",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "observaciones",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "derivacion",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "hospital",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "tratamientos",
                    "value": "SMALLINT  NULL DEFAULT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`fk_control_emb`",
                    "value": "FOREIGN KEY (`id_control_embarazo`) REFERENCES control_embarazo (`id_control_embarazo`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_control_embarazo",
                    "value": "`id_control_embarazo` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "triggers": [
                {
                    "name": "control_emb_patologico_trigger_last_modified",
                    "logic": "BEGIN      UPDATE control_emb_patologico SET last_modified= (strftime('%s', 'now')) WHERE id_control_emb_patologico=OLD.id_control_emb_patologico;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ]
        },
        {
            "name": "control_puerperio",
            "schema": [
                {
                    "column": "id_control_puerperio",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "patologico",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "observaciones",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "derivacion",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`fk_control_puer_control`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_control_puerperio",
                    "value": "`id_control_puerperio` DESC,`id_control` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "fk_control_puer_control",
                    "value": "`id_control` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "control_puerperio_trigger_last_modified",
                    "logic": "BEGIN      UPDATE control_puerperio SET last_modified= (strftime('%s', 'now')) WHERE id_control_puerperio=OLD.id_control_puerperio;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "control_rn",
            "schema": [
                {
                    "column": "id_control_rn",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "edad_gestacional",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "peso",
                    "value": "FLOAT(0,0)  NOT NULL"
                },
                {
                    "column": "labio_leporino",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "s_genetico_malformaciones",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "hipotiroidismo_congenito",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "bajo_peso",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "hiperbilirrubinemia",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "sospecha_de_sepsis",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "deprimido_neonatal",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "madre_dbt",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "prematuro",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "rciu",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "hijo_de_madre_dbt",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "derivacion",
                    "value": "TEXT  NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "`fk_controlrn_control`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "id_control_rn",
                    "value": "`id_control_rn` DESC,`id_control` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "fk_controlrn_control",
                    "value": "`id_control` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "control_rn_trigger_last_modified",
                    "logic": "BEGIN      UPDATE control_rn SET last_modified= (strftime('%s', 'now')) WHERE id_control_rn=OLD.id_control_rn;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "tipos_embarazos",
            "schema": [
                {
                    "column": "id_tipo_embarazo",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "nombre_UNIQUE",
                    "value": "`nombre` DESC",
                    "mode": "UNIQUE"
                }
            ],
            "values": [
                [
                    3,
                    "ETMI",
                    0,
                    1681779065
                ],
                [
                    1,
                    "NORMAL",
                    0,
                    1681779065
                ],
                [
                    2,
                    "PATOLÓGICO",
                    0,
                    1681779065
                ]
            ]
        },
       
        {
            "name": "embarazos",
            "schema": [
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_tipo_embarazo",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "CPK_id_persona_id_control_id_tipo_embarazo",
                    "value": "PRIMARY KEY (id_persona,id_control,id_tipo_embarazo)"
                },
                {
                    "constraint": "`fk_embarazos_controles`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_embarazos_personas`",
                    "value": "FOREIGN KEY (`id_persona`) REFERENCES personas (`id_persona`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_embarazos_tipo_embarazo`",
                    "value": "FOREIGN KEY (`id_tipo_embarazo`) REFERENCES tipos_embarazos (`id_tipo_embarazo`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                }
            ],
            "indexes": [
                {
                    "name": "fk_persona_idx",
                    "value": "`id_persona` DESC"
                },
                {
                    "name": "fk_control_embarazos_idx",
                    "value": "`id_control` DESC"
                },
                {
                    "name": "fk_tipo_embarazo_idx",
                    "value": "`id_tipo_embarazo` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "embarazos_trigger_last_modified",
                    "logic": "BEGIN      UPDATE embarazos SET last_modified= (strftime('%s', 'now')) WHERE id_persona=OLD.id_persona;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ]
        },
        {
            "name": "embarazos_patologias",
            "schema": [
                {
                    "column": "id_control_embarazo_patologico",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_patologia_embarazo",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "CPK_id_control_embarazo_patologico_id_patologia_embarazo",
                    "value": "PRIMARY KEY (id_control_embarazo_patologico,id_patologia_embarazo)"
                },
                {
                    "constraint": "`fk_control_emba_pat`",
                    "value": "FOREIGN KEY (`id_control_embarazo_patologico`) REFERENCES control_emb_patologico (`id_control_emb_patologico`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                },
                {
                    "constraint": "`fk_pat_embs`",
                    "value": "FOREIGN KEY (`id_patologia_embarazo`) REFERENCES patologias_embarazos (`id_patologia_embarazo`) ON DELETE RESTRICT ON UPDATE RESTRICT"
                }
            ],
            "indexes": [
                {
                    "name": "fk_pat_embs",
                    "value": "`id_patologia_embarazo` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "embarazos_patologias_trigger_last_modified",
                    "logic": "BEGIN      UPDATE embarazos_patologias SET last_modified= (strftime('%s', 'now')) WHERE id_control_emb_patologico=OLD.id_control_emb_patologico;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ]
        },
        {
            "name": "etmis_personas",
            "schema": [
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_etmi",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "confirmada",
                    "value": "SMALLINT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "CPK_id_persona_id_etmi_id_control",
                    "value": "PRIMARY KEY (id_persona,id_etmi,id_control)"
                },
                {
                    "constraint": "`fk_etmis_personas_control`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_etmis_personas_etmi`",
                    "value": "FOREIGN KEY (`id_etmi`) REFERENCES etmis (`id_etmi`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_etmis_personas_personas`",
                    "value": "FOREIGN KEY (`id_persona`) REFERENCES personas (`id_persona`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                }
            ],
            "indexes": [
                {
                    "name": "fk_etmi_idx",
                    "value": "`id_etmi` DESC"
                },
                {
                    "name": "fk_control_ep_idx",
                    "value": "`id_control` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "etmis_personas_trigger_last_modified",
                    "logic": "BEGIN      UPDATE etmis_personas SET last_modified= (strftime('%s', 'now')) WHERE id_persona=OLD.id_persona;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
           
            "name": "inmunizaciones_control",
            "schema": [
                
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_inmunizacion",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "estado",
                    "value": "CHAR(1)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },

                {
                    "constraint": "CPK_id_persona_id_control_id_inmunizacion",
                    "value": "PRIMARY KEY (id_persona,id_control,id_inmunizacion)"
                },
                {
                    "constraint": "`fk_inmunicaciones_control_control`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_inmunicaciones_control_inmunizacion`",
                    "value": "FOREIGN KEY (`id_inmunizacion`) REFERENCES inmunizaciones (`id_inmunizacion`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_inmunicaciones_control_persona`",
                    "value": "FOREIGN KEY (`id_persona`) REFERENCES personas (`id_persona`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                }
            ],
           
            "indexes": [
                {
                    "name": "fk_inmunizaciones_control_control",
                    "value": "`id_control` DESC"
                },
                {
                    "name": "fk_inmunizaciones_control_inmunizacion",
                    "value": "`id_inmunizacion` DESC"
                },
                {
                    "name": "fk_inmunizaciones_control_persona",
                    "value": "`id_persona` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "inmunizaciones_control_trigger_last_modified",
                    "logic": "BEGIN      UPDATE inmunizaciones_control SET last_modified= (strftime('%s', 'now')) WHERE id_inmunizacion=OLD.id_inmunizacion;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "laboratorios_realizados",
            "schema": [
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_laboratorio",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "trimestre",
                    "value": "SMALLINT  NOT NULL"
                },
                {
                    "column": "fecha_realizado",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "fecha_resultados",
                    "value": "DATE  NULL DEFAULT NULL"
                },
                {
                    "column": "resultado",
                    "value": "VARCHAR(45)  NULL DEFAULT NULL COLLATE NOCASE"
                },
                {
                    "column": "id_etmi",
                    "value": "INT  NOT NULL DEFAULT 0"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
               
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "CPK_id_persona_id_control_id_laboratorio_trimestre_id_etmi",
                    "value": "PRIMARY KEY (id_persona,id_control,id_laboratorio,trimestre,id_etmi)"
                },
                 
                {
                    "constraint": "`fk_laboratorios_realizados_control`",
                    "value": "FOREIGN KEY (`id_control`) REFERENCES controles (`id_control`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_laboratorios_realizados_laboratorio`",
                    "value": "FOREIGN KEY (`id_laboratorio`) REFERENCES laboratorios (`id_laboratorio`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "`fk_laboratorios_realizados_etmis`",
                    "value": "FOREIGN KEY (`id_etmi`) REFERENCES etmis (`id_etmi`) ON DELETE NO ACTION ON UPDATE NO ACTION"
                }
            ],
            "indexes": [
                {
                    "name": "fk_control_idx",
                    "value": "`id_control` DESC"
                },
                {
                    "name": "fk_laboratorio_idx",
                    "value": "`id_laboratorio` DESC"
                },
                {
                    "name": "fk_etmis_idx",
                    "value": "`id_etmi` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "laboratorios_realizados_trigger_last_modified",
                    "logic": "BEGIN  UPDATE laboratorios_realizados SET last_modified= strftime('%s', 'now') WHERE id_persona=OLD.id_persona ; END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
          
        },
        {
            "name": "tratchagas_eventosadv",
            "schema": [
                {
                    "column": "id_tratamiento_chagas",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_evento_adverso",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "id_tratamiento_chagas",
                    "value": "`id_tratamiento_chagas` DESC"
                },
                {
                    "name": "id_evento_adverso",
                    "value": "`id_evento_adverso` DESC"
                }
            ]
        },
        {
            "name": "ubicaciones",
            "schema": [
                {
                    "column": "id_ubicacion",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "id_persona",
                    "value": "INT  NOT NULL"
                },
                {
                    "column": "id_paraje",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "id_area",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "num_vivienda",
                    "value": "VARCHAR(10)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "fecha",
                    "value": "DATE  NOT NULL"
                },
                {
                    "column": "georeferencia",
                    "value": "VARCHAR(30)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "id_pais",
                    "value": "INT  NULL DEFAULT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                }
            ],
            "indexes": [
                {
                    "name": "ck",
                    "value": "`id_persona` DESC,`id_paraje` DESC,`id_area` DESC,`num_vivienda` DESC,`fecha` DESC,`id_pais` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "fk_paises_idx",
                    "value": "`id_pais` DESC"
                },
                {
                    "name": "fk_ubicaciones_areas",
                    "value": "`id_area` DESC"
                },
                {
                    "name": "fk_ubicaciones_parajes",
                    "value": "`id_paraje` DESC"
                }
            ],
            "triggers": [
                {
                    "name": "ubicaciones_trigger_last_modified",
                    "logic": "BEGIN     UPDATE ubicaciones SET last_modified= (strftime('%s', 'now')) WHERE id_ubicacion=OLD.id_ubicacion;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
         
        },
        {
            "name": "usuarios",
            "schema": [
                {
                    "column": "id_usuario",
                    "value": "INT PRIMARY KEY NOT NULL"
                },
                {
                    "column": "usuario",
                    "value": "VARCHAR(50)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "password",
                    "value": "VARCHAR(128)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "email",
                    "value": "VARCHAR(150)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "nombre",
                    "value": "VARCHAR(100)  NOT NULL  COLLATE NOCASE"
                },
                {
                    "column": "nivel_acceso",
                    "value": "INT  NOT NULL"
                },
               {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                 {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK (sql_deleted IN (0, 1))"
                }
            ],
            "indexes": [
                {
                    "name": "usuario",
                    "value": "`usuario` DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "nivel_acceso",
                    "value": "`nivel_acceso` DESC"
                }
            ],"triggers": [
                {
                    "name": "usuarios_trigger_last_modified",
                    "logic": "BEGIN     UPDATE usuarios SET last_modified= (strftime('%s', 'now')) WHERE id_usuario=OLD.id_usuario;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
            
        },
        {
            "name": "antecedentes",
            "schema": [
                {
                    "column": "id_antecedente",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "id_persona",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "id_control",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "edad_primer_embarazo",
                    "value": "INT DEFAULT NULL"
                },
                {
                    "column": "fecha_ultimo_embarazo",
                    "value": "DATE DEFAULT NULL"
                },
                {
                    "column": "gestas",
                    "value": "INT DEFAULT 0"
                },
                {
                    "column": "partos",
                    "value": "INT DEFAULT 0"
                },
                {
                    "column": "cesareas",
                    "value": "INT DEFAULT 0"
                },
                {
                    "column": "abortos",
                    "value": "INT DEFAULT 0"
                },
                {
                    "column": "planificado",
                    "value": "SMALLINT DEFAULT NULL"
                },
                {
                    "column": "fum",
                    "value": "DATE DEFAULT NULL"
                },
                {
                    "column": "fpp",
                    "value": "DATE DEFAULT NULL"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK(sql_deleted IN (0, 1))"
                },
                {
                    "constraint": "fk_antecedentes_persona",
                    "value": "FOREIGN KEY(id_persona) REFERENCES personas(id_persona) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "fk_antecedentes_control",
                    "value": "FOREIGN KEY(id_control) REFERENCES controles(id_control) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "CPK_id_antecedente",
                    "value": "PRIMARY KEY(id_antecedente)"
                }
            ],
            "indexes": [
                {
                    "name": "ck_ante",
                    "value": "id_persona DESC",
                    "mode": "UNIQUE"
                },
                {
                    "name": "fk_control_ante_idx",
                    "value": "id_control DESC"
                }
            ],
            "triggers": [
                {
                    "name": "antecedentes_trigger_last_modified",
                    "logic": "BEGIN     UPDATE antecedentes SET last_modified= (strftime('%s', 'now')) WHERE id_antecedente=OLD.id_antecedente;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
          
        },
        {
            "name": "antecedentes_apps",
            "schema": [
                {
                    "column": "id_antecedente",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "id_app ",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "last_modified ",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK(sql_deleted IN (0, 1))"
                },
                {
                    "constraint": "fk_antecedentes_apps_apps",
                    "value": "FOREIGN KEY(id_app) REFERENCES apps(id_app) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "fk_antecedentes_apps_antecedentes",
                    "value": "FOREIGN KEY(id_antecedente) REFERENCES antecedentes(id_antecedente) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "CPK_id_antecedente_id_app",
                    "value": "PRIMARY KEY(id_antecedente,id_app)"
                }
            ],
            "indexes": [
                
                {
                    "name": "fk_apps_idx",
                    "value": "id_app DESC"
                }
            ],
            "triggers": [
                {
                    "name": "antecedentes_apps_trigger_last_modified",
                    "logic": "BEGIN      UPDATE antecedentes_apps SET last_modified= (strftime('%s', 'now')) WHERE id_antecedente=OLD.id_antecedente;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        },
        {
            "name": "antecedentes_macs",
            "schema": [
                {
                    "column": "id_antecedente",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "id_mac",
                    "value": "INT NOT NULL"
                },
                {
                    "column": "sql_deleted",
                    "value": "BOOLEAN DEFAULT 0 CHECK(sql_deleted IN (0, 1))"
                },
                {
                    "column": "last_modified",
                    "value": "INTEGER DEFAULT (strftime('%s', 'now'))"
                },
                {
                    "constraint": "fk_antecedentes_macs_antecedentes",
                    "value": "FOREIGN KEY(id_antecedente) REFERENCES antecedentes(id_antecedente) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "fk_antecedentes_macs_macs",
                    "value": "FOREIGN KEY(id_mac) REFERENCES macs(id_mac) ON DELETE NO ACTION ON UPDATE NO ACTION"
                },
                {
                    "constraint": "CPK_id_antecedente_id_mac",
                    "value": "PRIMARY KEY(id_antecedente,id_mac)"
                }
            ],
            "indexes": [
                {
                    "name": "fk_macs_idx",
                    "value": "id_mac DESC"
                }
            ],
            "triggers": [
                {
                    "name": "antecedentes_macs_trigger_last_modified",
                    "logic": "BEGIN      UPDATE antecedentes_macs SET last_modified= (strftime('%s', 'now')) WHERE id_antecedente=OLD.id_antecedente;  END",
                    "condition": "FOR EACH ROW WHEN NEW.last_modified < OLD.last_modified",
                    "timeevent": "AFTER UPDATE ON"
                }
            ],
           
        }
    ]
}