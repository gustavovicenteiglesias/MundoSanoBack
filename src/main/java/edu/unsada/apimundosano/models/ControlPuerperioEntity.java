package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "control_puerperio", schema = "tripleconlast", catalog = "")
public class ControlPuerperioEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_control_puerperio")
    private int idControlPuerperio;
    @Basic
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "patologico")
    private short patologico;
    @Basic
    @Column(name = "observaciones")
    private String observaciones;
    @Basic
    @Column(name = "derivacion")
    private String derivacion;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;

    public int getIdControlPuerperio() {
        return idControlPuerperio;
    }

    public void setIdControlPuerperio(int idControlPuerperio) {
        this.idControlPuerperio = idControlPuerperio;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public short getPatologico() {
        return patologico;
    }

    public void setPatologico(short patologico) {
        this.patologico = patologico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public String getDerivacion() {
        return derivacion;
    }

    public void setDerivacion(String derivacion) {
        this.derivacion = derivacion;
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

        ControlPuerperioEntity that = (ControlPuerperioEntity) o;

        if (idControlPuerperio != that.idControlPuerperio) return false;
        if (idControl != that.idControl) return false;
        if (patologico != that.patologico) return false;
        if (observaciones != null ? !observaciones.equals(that.observaciones) : that.observaciones != null)
            return false;
        if (derivacion != null ? !derivacion.equals(that.derivacion) : that.derivacion != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControlPuerperio;
        result = 31 * result + idControl;
        result = 31 * result + (int) patologico;
        result = 31 * result + (observaciones != null ? observaciones.hashCode() : 0);
        result = 31 * result + (derivacion != null ? derivacion.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }
}
