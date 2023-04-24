package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "control_emb_patologico", schema = "tripleconlast", catalog = "")
public class ControlEmbPatologicoEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_control_emb_patologico")
    private int idControlEmbPatologico;
    @Basic
    @Column(name = "id_control_embarazo")
    private int idControlEmbarazo;
    @Basic
    @Column(name = "observaciones")
    private String observaciones;
    @Basic
    @Column(name = "derivacion")
    private Short derivacion;
    @Basic
    @Column(name = "hospital")
    private String hospital;
    @Basic
    @Column(name = "tratamientos")
    private Short tratamientos;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
    @JoinColumn(name = "id_control_embarazo", referencedColumnName = "id_control_embarazo", nullable = false,insertable=false, updatable=false)
    private ControlEmbarazoEntity controlEmbarazoByIdControlEmbarazo;
    @OneToMany(mappedBy = "controlEmbPatologicoByIdControlEmbarazoPatologico")
    private Collection<EmbarazosPatologiasEntity> embarazosPatologiasByIdControlEmbPatologico;

    public int getIdControlEmbPatologico() {
        return idControlEmbPatologico;
    }

    public void setIdControlEmbPatologico(int idControlEmbPatologico) {
        this.idControlEmbPatologico = idControlEmbPatologico;
    }

    public int getIdControlEmbarazo() {
        return idControlEmbarazo;
    }

    public void setIdControlEmbarazo(int idControlEmbarazo) {
        this.idControlEmbarazo = idControlEmbarazo;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Short getDerivacion() {
        return derivacion;
    }

    public void setDerivacion(Short derivacion) {
        this.derivacion = derivacion;
    }

    public String getHospital() {
        return hospital;
    }

    public void setHospital(String hospital) {
        this.hospital = hospital;
    }

    public Short getTratamientos() {
        return tratamientos;
    }

    public void setTratamientos(Short tratamientos) {
        this.tratamientos = tratamientos;
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

        ControlEmbPatologicoEntity that = (ControlEmbPatologicoEntity) o;

        if (idControlEmbPatologico != that.idControlEmbPatologico) return false;
        if (idControlEmbarazo != that.idControlEmbarazo) return false;
        if (observaciones != null ? !observaciones.equals(that.observaciones) : that.observaciones != null)
            return false;
        if (derivacion != null ? !derivacion.equals(that.derivacion) : that.derivacion != null) return false;
        if (hospital != null ? !hospital.equals(that.hospital) : that.hospital != null) return false;
        if (tratamientos != null ? !tratamientos.equals(that.tratamientos) : that.tratamientos != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControlEmbPatologico;
        result = 31 * result + idControlEmbarazo;
        result = 31 * result + (observaciones != null ? observaciones.hashCode() : 0);
        result = 31 * result + (derivacion != null ? derivacion.hashCode() : 0);
        result = 31 * result + (hospital != null ? hospital.hashCode() : 0);
        result = 31 * result + (tratamientos != null ? tratamientos.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public ControlEmbarazoEntity getControlEmbarazoByIdControlEmbarazo() {
        return controlEmbarazoByIdControlEmbarazo;
    }

    public void setControlEmbarazoByIdControlEmbarazo(ControlEmbarazoEntity controlEmbarazoByIdControlEmbarazo) {
        this.controlEmbarazoByIdControlEmbarazo = controlEmbarazoByIdControlEmbarazo;
    }

    public Collection<EmbarazosPatologiasEntity> getEmbarazosPatologiasByIdControlEmbPatologico() {
        return embarazosPatologiasByIdControlEmbPatologico;
    }

    public void setEmbarazosPatologiasByIdControlEmbPatologico(Collection<EmbarazosPatologiasEntity> embarazosPatologiasByIdControlEmbPatologico) {
        this.embarazosPatologiasByIdControlEmbPatologico = embarazosPatologiasByIdControlEmbPatologico;
    }
}
