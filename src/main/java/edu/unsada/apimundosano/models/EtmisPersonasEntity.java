package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "etmis_personas")
@IdClass(EtmisPersonasEntityPK.class)
public class EtmisPersonasEntity extends BaseEntity {

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
    private int confirmada;
    
    
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

    public int getConfirmada() {
        return confirmada;
    }

    public void setConfirmada(int confirmada) {
        this.confirmada = confirmada;
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

    @Override
    public String toString() {
        return "EtmisPersonasEntity{" +
                "idPersona=" + idPersona +
                ", idEtmi=" + idEtmi +
                ", idControl=" + idControl +
                ", confirmada=" + confirmada +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", personasByIdPersona=" + personasByIdPersona +
                ", etmisByIdEtmi=" + etmisByIdEtmi +
                ", controlesByIdControl=" + controlesByIdControl +
                '}';
    }
}


