package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "etmis_personas", schema = "tripleconlast", catalog = "")
@IdClass(EtmisPersonasEntityPK.class)
public class EtmisPersonasEntity {

    @Id
    @Column(name = "id_persona")
    private int idPersona;

    @Id
    @Column(name = "id_etmi")
    private int idEtmi;

    @Id
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "confirmada")
    private short confirmada;
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
@JoinColumn(name = "id_etmi", referencedColumnName = "id_etmi", nullable = false,insertable=false, updatable=false)
    private EtmisEntity etmisByIdEtmi;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false, insertable = false, updatable = false)
    private ControlesEntity controlesByIdControl;

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getIdEtmi() {
        return idEtmi;
    }

    public void setIdEtmi(int idEtmi) {
        this.idEtmi = idEtmi;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public short getConfirmada() {
        return confirmada;
    }

    public void setConfirmada(short confirmada) {
        this.confirmada = confirmada;
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

        EtmisPersonasEntity that = (EtmisPersonasEntity) o;

        if (idPersona != that.idPersona) return false;
        if (idEtmi != that.idEtmi) return false;
        if (idControl != that.idControl) return false;
        if (confirmada != that.confirmada) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idEtmi;
        result = 31 * result + idControl;
        result = 31 * result + (int) confirmada;
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

    public EtmisEntity getEtmisByIdEtmi() {
        return etmisByIdEtmi;
    }

    public void setEtmisByIdEtmi(EtmisEntity etmisByIdEtmi) {
        this.etmisByIdEtmi = etmisByIdEtmi;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }
}
