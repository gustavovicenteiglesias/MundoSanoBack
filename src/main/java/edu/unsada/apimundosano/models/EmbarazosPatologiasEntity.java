package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "embarazos_patologias", schema = "tripleconlast", catalog = "")
@IdClass(EmbarazosPatologiasEntityPK.class)
public class EmbarazosPatologiasEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_control_embarazo_patologico")
    private int idControlEmbarazoPatologico;
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_patologia_embarazo")
    private int idPatologiaEmbarazo;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
    @JoinColumn(name = "id_control_embarazo_patologico", referencedColumnName = "id_control_emb_patologico", nullable = false,insertable=false, updatable=false)
    private ControlEmbPatologicoEntity controlEmbPatologicoByIdControlEmbarazoPatologico;
    @ManyToOne
    @JoinColumn(name = "id_patologia_embarazo", referencedColumnName = "id_patologia_embarazo", nullable = false,insertable=false, updatable=false)
    private PatologiasEmbarazosEntity patologiasEmbarazosByIdPatologiaEmbarazo;

    public int getIdControlEmbarazoPatologico() {
        return idControlEmbarazoPatologico;
    }

    public void setIdControlEmbarazoPatologico(int idControlEmbarazoPatologico) {
        this.idControlEmbarazoPatologico = idControlEmbarazoPatologico;
    }

    public int getIdPatologiaEmbarazo() {
        return idPatologiaEmbarazo;
    }

    public void setIdPatologiaEmbarazo(int idPatologiaEmbarazo) {
        this.idPatologiaEmbarazo = idPatologiaEmbarazo;
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

        EmbarazosPatologiasEntity that = (EmbarazosPatologiasEntity) o;

        if (idControlEmbarazoPatologico != that.idControlEmbarazoPatologico) return false;
        if (idPatologiaEmbarazo != that.idPatologiaEmbarazo) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControlEmbarazoPatologico;
        result = 31 * result + idPatologiaEmbarazo;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public ControlEmbPatologicoEntity getControlEmbPatologicoByIdControlEmbarazoPatologico() {
        return controlEmbPatologicoByIdControlEmbarazoPatologico;
    }

    public void setControlEmbPatologicoByIdControlEmbarazoPatologico(ControlEmbPatologicoEntity controlEmbPatologicoByIdControlEmbarazoPatologico) {
        this.controlEmbPatologicoByIdControlEmbarazoPatologico = controlEmbPatologicoByIdControlEmbarazoPatologico;
    }

    public PatologiasEmbarazosEntity getPatologiasEmbarazosByIdPatologiaEmbarazo() {
        return patologiasEmbarazosByIdPatologiaEmbarazo;
    }

    public void setPatologiasEmbarazosByIdPatologiaEmbarazo(PatologiasEmbarazosEntity patologiasEmbarazosByIdPatologiaEmbarazo) {
        this.patologiasEmbarazosByIdPatologiaEmbarazo = patologiasEmbarazosByIdPatologiaEmbarazo;
    }
}
