package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "embarazos_patologias")
@IdClass(EmbarazosPatologiasEntityPK.class)
public class EmbarazosPatologiasEntity extends BaseEntity {

    @Id
    @Column(name = "id_control_embarazo_patologico")
    private int idControlEmbarazoPatologico;

    @Id
    @Column(name = "id_patologia_embarazo")
    private int idPatologiaEmbarazo;
    
    
    @ManyToOne
    @JoinColumn(name = "id_control_embarazo_patologico", referencedColumnName = "id_control_emb_patologico", nullable = false, insertable = false, updatable = false)
    private ControlEmbPatologicoEntity controlEmbPatologicoByIdControlEmbarazoPatologico;
    @ManyToOne
   @JoinColumn(name = "id_patologia_embarazo", referencedColumnName = "id_patologia_embarazo", nullable = false, insertable = false, updatable = false)
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


