-- Script para añadir columna UUID a todas las tablas del sistema Mundo Sano

-- Tabla: antecedentes_apps
ALTER TABLE antecedentes_apps ADD COLUMN uuid VARCHAR(36);
UPDATE antecedentes_apps SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE antecedentes_apps MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_antecedentes_apps_uuid ON antecedentes_apps(uuid);

-- Tabla: antecedentes
ALTER TABLE antecedentes ADD COLUMN uuid VARCHAR(36);
UPDATE antecedentes SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE antecedentes MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_antecedentes_uuid ON antecedentes(uuid);

-- Tabla: antecedentes_macs
ALTER TABLE antecedentes_macs ADD COLUMN uuid VARCHAR(36);
UPDATE antecedentes_macs SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE antecedentes_macs MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_antecedentes_macs_uuid ON antecedentes_macs(uuid);

-- Tabla: apps
ALTER TABLE apps ADD COLUMN uuid VARCHAR(36);
UPDATE apps SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE apps MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_apps_uuid ON apps(uuid);

-- Tabla: areas
ALTER TABLE areas ADD COLUMN uuid VARCHAR(36);
UPDATE areas SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE areas MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_areas_uuid ON areas(uuid);

-- Tabla: ciudades
ALTER TABLE ciudades ADD COLUMN uuid VARCHAR(36);
UPDATE ciudades SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE ciudades MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_ciudades_uuid ON ciudades(uuid);

-- Tabla: control_embarazo
ALTER TABLE control_embarazo ADD COLUMN uuid VARCHAR(36);
UPDATE control_embarazo SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE control_embarazo MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_control_embarazo_uuid ON control_embarazo(uuid);

-- Tabla: control_emb_patologico
ALTER TABLE control_emb_patologico ADD COLUMN uuid VARCHAR(36);
UPDATE control_emb_patologico SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE control_emb_patologico MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_control_emb_patologico_uuid ON control_emb_patologico(uuid);

-- Tabla: controles
ALTER TABLE controles ADD COLUMN uuid VARCHAR(36);
UPDATE controles SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE controles MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_controles_uuid ON controles(uuid);

-- Tabla: control_puerperio
ALTER TABLE control_puerperio ADD COLUMN uuid VARCHAR(36);
UPDATE control_puerperio SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE control_puerperio MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_control_puerperio_uuid ON control_puerperio(uuid);

-- Tabla: control_rn
ALTER TABLE control_rn ADD COLUMN uuid VARCHAR(36);
UPDATE control_rn SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE control_rn MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_control_rn_uuid ON control_rn(uuid);

-- Tabla: embarazos
ALTER TABLE embarazos ADD COLUMN uuid VARCHAR(36);
UPDATE embarazos SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE embarazos MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_embarazos_uuid ON embarazos(uuid);

-- Tabla: embarazos_patologias
ALTER TABLE embarazos_patologias ADD COLUMN uuid VARCHAR(36);
UPDATE embarazos_patologias SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE embarazos_patologias MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_embarazos_patologias_uuid ON embarazos_patologias(uuid);

-- Tabla: estados
ALTER TABLE estados ADD COLUMN uuid VARCHAR(36);
UPDATE estados SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE estados MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_estados_uuid ON estados(uuid);

-- Tabla: etmis
ALTER TABLE etmis ADD COLUMN uuid VARCHAR(36);
UPDATE etmis SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE etmis MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_etmis_uuid ON etmis(uuid);

-- Tabla: etmis_personas
ALTER TABLE etmis_personas ADD COLUMN uuid VARCHAR(36);
UPDATE etmis_personas SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE etmis_personas MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_etmis_personas_uuid ON etmis_personas(uuid);

-- Tabla: eventos_adversos
ALTER TABLE eventos_adversos ADD COLUMN uuid VARCHAR(36);
UPDATE eventos_adversos SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE eventos_adversos MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_eventos_adversos_uuid ON eventos_adversos(uuid);

-- Tabla: idsegundevice
ALTER TABLE idsegundevice ADD COLUMN uuid VARCHAR(36);
UPDATE idsegundevice SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE idsegundevice MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_idsegundevice_uuid ON idsegundevice(uuid);

-- Tabla: inmunizaciones_control
ALTER TABLE inmunizaciones_control ADD COLUMN uuid VARCHAR(36);
UPDATE inmunizaciones_control SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE inmunizaciones_control MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_inmunizaciones_control_uuid ON inmunizaciones_control(uuid);

-- Tabla: inmunizaciones
ALTER TABLE inmunizaciones ADD COLUMN uuid VARCHAR(36);
UPDATE inmunizaciones SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE inmunizaciones MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_inmunizaciones_uuid ON inmunizaciones(uuid);

-- Tabla: laboratorios
ALTER TABLE laboratorios ADD COLUMN uuid VARCHAR(36);
UPDATE laboratorios SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE laboratorios MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_laboratorios_uuid ON laboratorios(uuid);

-- Tabla: laboratorios_realizados
ALTER TABLE laboratorios_realizados ADD COLUMN uuid VARCHAR(36);
UPDATE laboratorios_realizados SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE laboratorios_realizados MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_laboratorios_realizados_uuid ON laboratorios_realizados(uuid);

-- Tabla: macs
ALTER TABLE macs ADD COLUMN uuid VARCHAR(36);
UPDATE macs SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE macs MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_macs_uuid ON macs(uuid);

-- Tabla: motivo_finalizacion_tratamiento
ALTER TABLE motivo_finalizacion_tratamiento ADD COLUMN uuid VARCHAR(36);
UPDATE motivo_finalizacion_tratamiento SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE motivo_finalizacion_tratamiento MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_motivo_f_trat_uuid ON motivo_finalizacion_tratamiento(uuid);

-- Tabla: motivos_derivacion
ALTER TABLE motivos_derivacion ADD COLUMN uuid VARCHAR(36);
UPDATE motivos_derivacion SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE motivos_derivacion MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_motivos_derivacion_uuid ON motivos_derivacion(uuid);

-- Tabla: niveles_acceso
ALTER TABLE niveles_acceso ADD COLUMN uuid VARCHAR(36);
UPDATE niveles_acceso SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE niveles_acceso MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_niveles_acceso_uuid ON niveles_acceso(uuid);

-- Tabla: origenes
ALTER TABLE origenes ADD COLUMN uuid VARCHAR(36);
UPDATE origenes SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE origenes MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_origenes_uuid ON origenes(uuid);

-- Tabla: paises
ALTER TABLE paises ADD COLUMN uuid VARCHAR(36);
UPDATE paises SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE paises MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_paises_uuid ON paises(uuid);

-- Tabla: parajes
ALTER TABLE parajes ADD COLUMN uuid VARCHAR(36);
UPDATE parajes SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE parajes MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_parajes_uuid ON parajes(uuid);

-- Tabla: patologias_embarazos
ALTER TABLE patologias_embarazos ADD COLUMN uuid VARCHAR(36);
UPDATE patologias_embarazos SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE patologias_embarazos MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_patologias_e_uuid ON patologias_embarazos(uuid);

-- Tabla: patologias_rn
ALTER TABLE patologias_rn ADD COLUMN uuid VARCHAR(36);
UPDATE patologias_rn SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE patologias_rn MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_patologias_rn_uuid ON patologias_rn(uuid);

-- Tabla: personas
ALTER TABLE personas ADD COLUMN uuid VARCHAR(36);
UPDATE personas SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE personas MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_personas_uuid ON personas(uuid);

-- Tabla: provincias
ALTER TABLE provincias ADD COLUMN uuid VARCHAR(36);
UPDATE provincias SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE provincias MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_provincias_uuid ON provincias(uuid);

-- Tabla: seguimiento_chagas
ALTER TABLE seguimiento_chagas ADD COLUMN uuid VARCHAR(36);
UPDATE seguimiento_chagas SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE seguimiento_chagas MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_seguimiento_chagas_uuid ON seguimiento_chagas(uuid);

-- Tabla: seguimiento_hiv
ALTER TABLE seguimiento_hiv ADD COLUMN uuid VARCHAR(36);
UPDATE seguimiento_hiv SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE seguimiento_hiv MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_seguimiento_hiv_uuid ON seguimiento_hiv(uuid);

-- Tabla: seguimiento_sifilis
ALTER TABLE seguimiento_sifilis ADD COLUMN uuid VARCHAR(36);
UPDATE seguimiento_sifilis SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE seguimiento_sifilis MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_seguimiento_sifilis_uuid ON seguimiento_sifilis(uuid);

-- Tabla: seguimiento_vhb
ALTER TABLE seguimiento_vhb ADD COLUMN uuid VARCHAR(36);
UPDATE seguimiento_vhb SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE seguimiento_vhb MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_seguimiento_vhb_uuid ON seguimiento_vhb(uuid);

-- Tabla: sync_table
ALTER TABLE sync_table ADD COLUMN uuid VARCHAR(36);
UPDATE sync_table SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE sync_table MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_sync_table_uuid ON sync_table(uuid);

-- Tabla: tipos_embarazos
ALTER TABLE tipos_embarazos ADD COLUMN uuid VARCHAR(36);
UPDATE tipos_embarazos SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tipos_embarazos MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tipos_embarazos_uuid ON tipos_embarazos(uuid);

-- Tabla: tipos_fin_embarazos
ALTER TABLE tipos_fin_embarazos ADD COLUMN uuid VARCHAR(36);
UPDATE tipos_fin_embarazos SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tipos_fin_embarazos MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tipos_fin_e_uuid ON tipos_fin_embarazos(uuid);

-- Tabla: tratamiento_chagas
ALTER TABLE tratamiento_chagas ADD COLUMN uuid VARCHAR(36);
UPDATE tratamiento_chagas SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tratamiento_chagas MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tratamiento_chagas_uuid ON tratamiento_chagas(uuid);

-- Tabla: tratamiento_hiv
ALTER TABLE tratamiento_hiv ADD COLUMN uuid VARCHAR(36);
UPDATE tratamiento_hiv SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tratamiento_hiv MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tratamiento_hiv_uuid ON tratamiento_hiv(uuid);

-- Tabla: tratamiento_sifilis
ALTER TABLE tratamiento_sifilis ADD COLUMN uuid VARCHAR(36);
UPDATE tratamiento_sifilis SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tratamiento_sifilis MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tratamiento_sifilis_uuid ON tratamiento_sifilis(uuid);

-- Tabla: tratamiento_vhb
ALTER TABLE tratamiento_vhb ADD COLUMN uuid VARCHAR(36);
UPDATE tratamiento_vhb SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tratamiento_vhb MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tratamiento_vhb_uuid ON tratamiento_vhb(uuid);

-- Tabla: tratchagas_eventosadv
ALTER TABLE tratchagas_eventosadv ADD COLUMN uuid VARCHAR(36);
UPDATE tratchagas_eventosadv SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE tratchagas_eventosadv MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_tratchagas_e_uuid ON tratchagas_eventosadv(uuid);

-- Tabla: ubicaciones
ALTER TABLE ubicaciones ADD COLUMN uuid VARCHAR(36);
UPDATE ubicaciones SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE ubicaciones MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_ubicaciones_uuid ON ubicaciones(uuid);

-- Tabla: usuarios
ALTER TABLE usuarios ADD COLUMN uuid VARCHAR(36);
UPDATE usuarios SET uuid = UUID() WHERE uuid IS NULL;
ALTER TABLE usuarios MODIFY COLUMN uuid VARCHAR(36) NOT NULL;
CREATE UNIQUE INDEX idx_usuarios_uuid ON usuarios(uuid);
