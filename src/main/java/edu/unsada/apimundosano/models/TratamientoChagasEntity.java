package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
@Table(name = "tratamiento_chagas", schema = "tripleconlast", catalog = "")
public class TratamientoChagasEntity {

    @Id
    @Column(name = "id_tratamiento_chagas")
    private int idTratamientoChagas;
    @Basic
    @Column(name = "droga")
    private String droga;
    @Basic
    @Column(name = "dosis_diaria")
    private String dosisDiaria;
    @Basic
    @Column(name = "fecha_inicio")
    private Date fechaInicio;
    @Basic
    @Column(name = "peso_inicial")
    private Double pesoInicial;
    @Basic
    @Column(name = "fecha_finalizacion")
    private Date fechaFinalizacion;
    @Basic
    @Column(name = "peso_final")
    private Double pesoFinal;
    @Basic
    @Column(name = "id_motivo_finalizacion")
    private Integer idMotivoFinalizacion;
    @Basic
    @Column(name = "otros_eventos_adversos")
    private String otrosEventosAdversos;
    @Basic
    @Column(name = "observaciones")
    private String observaciones;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "tratamientoChagasByIdTratamientoChagas")
    private Collection<ControlesEntity> controlesByIdTratamientoChagas;

    public int getIdTratamientoChagas() {
        return idTratamientoChagas;
    }

    public void setIdTratamientoChagas(int idTratamientoChagas) {
        this.idTratamientoChagas = idTratamientoChagas;
    }

    public String getDroga() {
        return droga;
    }

    public void setDroga(String droga) {
        this.droga = droga;
    }

    public String getDosisDiaria() {
        return dosisDiaria;
    }

    public void setDosisDiaria(String dosisDiaria) {
        this.dosisDiaria = dosisDiaria;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Double getPesoInicial() {
        return pesoInicial;
    }

    public void setPesoInicial(Double pesoInicial) {
        this.pesoInicial = pesoInicial;
    }

    public Date getFechaFinalizacion() {
        return fechaFinalizacion;
    }

    public void setFechaFinalizacion(Date fechaFinalizacion) {
        this.fechaFinalizacion = fechaFinalizacion;
    }

    public Double getPesoFinal() {
        return pesoFinal;
    }

    public void setPesoFinal(Double pesoFinal) {
        this.pesoFinal = pesoFinal;
    }

    public Integer getIdMotivoFinalizacion() {
        return idMotivoFinalizacion;
    }

    public void setIdMotivoFinalizacion(Integer idMotivoFinalizacion) {
        this.idMotivoFinalizacion = idMotivoFinalizacion;
    }

    public String getOtrosEventosAdversos() {
        return otrosEventosAdversos;
    }

    public void setOtrosEventosAdversos(String otrosEventosAdversos) {
        this.otrosEventosAdversos = otrosEventosAdversos;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Byte getSqlDeleted() {
        return sqlDeleted;
    }

    public void setSqlDeleted(Byte sqlDeleted) {
        this.sqlDeleted = sqlDeleted;
    }

    public Integer getLastModified() {
        return lastModified;
    }

    public void setLastModified(Integer lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TratamientoChagasEntity that = (TratamientoChagasEntity) o;

        if (idTratamientoChagas != that.idTratamientoChagas) return false;
        if (droga != null ? !droga.equals(that.droga) : that.droga != null) return false;
        if (dosisDiaria != null ? !dosisDiaria.equals(that.dosisDiaria) : that.dosisDiaria != null) return false;
        if (fechaInicio != null ? !fechaInicio.equals(that.fechaInicio) : that.fechaInicio != null) return false;
        if (pesoInicial != null ? !pesoInicial.equals(that.pesoInicial) : that.pesoInicial != null) return false;
        if (fechaFinalizacion != null ? !fechaFinalizacion.equals(that.fechaFinalizacion) : that.fechaFinalizacion != null)
            return false;
        if (pesoFinal != null ? !pesoFinal.equals(that.pesoFinal) : that.pesoFinal != null) return false;
        if (idMotivoFinalizacion != null ? !idMotivoFinalizacion.equals(that.idMotivoFinalizacion) : that.idMotivoFinalizacion != null)
            return false;
        if (otrosEventosAdversos != null ? !otrosEventosAdversos.equals(that.otrosEventosAdversos) : that.otrosEventosAdversos != null)
            return false;
        if (observaciones != null ? !observaciones.equals(that.observaciones) : that.observaciones != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTratamientoChagas;
        result = 31 * result + (droga != null ? droga.hashCode() : 0);
        result = 31 * result + (dosisDiaria != null ? dosisDiaria.hashCode() : 0);
        result = 31 * result + (fechaInicio != null ? fechaInicio.hashCode() : 0);
        result = 31 * result + (pesoInicial != null ? pesoInicial.hashCode() : 0);
        result = 31 * result + (fechaFinalizacion != null ? fechaFinalizacion.hashCode() : 0);
        result = 31 * result + (pesoFinal != null ? pesoFinal.hashCode() : 0);
        result = 31 * result + (idMotivoFinalizacion != null ? idMotivoFinalizacion.hashCode() : 0);
        result = 31 * result + (otrosEventosAdversos != null ? otrosEventosAdversos.hashCode() : 0);
        result = 31 * result + (observaciones != null ? observaciones.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdTratamientoChagas() {
        return controlesByIdTratamientoChagas;
    }

    public void setControlesByIdTratamientoChagas(Collection<ControlesEntity> controlesByIdTratamientoChagas) {
        this.controlesByIdTratamientoChagas = controlesByIdTratamientoChagas;
    }
}
