package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "embarazos", schema = "tripleconlast", catalog = "")
@IdClass(EmbarazosEntityPK.class)
public class EmbarazosEntity {

    @Id
    @Column(name = "id_persona")
    private int idPersona;

    @Id
    @Column(name = "id_control")
    private int idControl;

    @Id
    @Column(name = "id_tipo_embarazo")
    private int idTipoEmbarazo;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
 @JoinColumn(name = "id_persona", referencedColumnName = "id_persona", nullable = false,insertable=false, updatable=false)
    private PersonasEntity personasByIdPersona;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;
    @ManyToOne
    @JoinColumn(name = "id_tipo_embarazo", referencedColumnName = "id_tipo_embarazo",insertable=false, updatable=false)
    private TiposEmbarazosEntity tiposEmbarazosByIdTipoEmbarazo;

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public int getIdTipoEmbarazo() {
        return idTipoEmbarazo;
    }

    public void setIdTipoEmbarazo(int idTipoEmbarazo) {
        this.idTipoEmbarazo = idTipoEmbarazo;
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

        EmbarazosEntity that = (EmbarazosEntity) o;

        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (idTipoEmbarazo != that.idTipoEmbarazo) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idControl;
        result = 31 * result + idTipoEmbarazo;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public PersonasEntity getPersonasByIdPersona() {
        return personasByIdPersona;
    }

    public void setPersonasByIdPersona(PersonasEntity personasByIdPersona) {
        this.personasByIdPersona = personasByIdPersona;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }

    public TiposEmbarazosEntity getTiposEmbarazosByIdTipoEmbarazo() {
        return tiposEmbarazosByIdTipoEmbarazo;
    }

    public void setTiposEmbarazosByIdTipoEmbarazo(TiposEmbarazosEntity tiposEmbarazosByIdTipoEmbarazo) {
        this.tiposEmbarazosByIdTipoEmbarazo = tiposEmbarazosByIdTipoEmbarazo;
    }
}
