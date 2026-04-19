package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "inmunizaciones_control")
@IdClass(InmunizacionesControlEntityPK.class)
public class InmunizacionesControlEntity extends BaseEntity {


    @Id
    @Column(name = "id_persona")
    private Integer idPersona;


    @Id
    @Column(name = "id_control")
    private Integer idControl;


    @Id
    @Column(name = "id_inmunizacion")
    private Integer idInmunizacion;
    @Basic
    @Column(name = "estado")
    private String estado;
    
    
    @ManyToOne
    @JoinColumn(name = "id_persona", referencedColumnName = "id_persona", nullable = false,insertable=false, updatable=false)
    private PersonasEntity personasByIdPersona;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;
    @ManyToOne
    @JoinColumn(name = "id_inmunizacion", referencedColumnName = "id_inmunizacion", nullable = false,insertable=false, updatable=false)
    private InmunizacionesEntity inmunizacionesByIdInmunizacion;

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

    public int getIdInmunizacion() {
        return idInmunizacion;
    }

    public void setIdInmunizacion(int idInmunizacion) {
        this.idInmunizacion = idInmunizacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
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

    public InmunizacionesEntity getInmunizacionesByIdInmunizacion() {
        return inmunizacionesByIdInmunizacion;
    }

    public void setInmunizacionesByIdInmunizacion(InmunizacionesEntity inmunizacionesByIdInmunizacion) {
        this.inmunizacionesByIdInmunizacion = inmunizacionesByIdInmunizacion;
    }

    @Override
    public String toString() {
        return "InmunizacionesControlEntity{" +
                "idPersona=" + idPersona +
                ", idControl=" + idControl +
                ", idInmunizacion=" + idInmunizacion +
                ", estado='" + estado + '\'' +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", personasByIdPersona=" + personasByIdPersona +
                ", controlesByIdControl=" + controlesByIdControl +
                ", inmunizacionesByIdInmunizacion=" + inmunizacionesByIdInmunizacion +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        InmunizacionesControlEntity that = (InmunizacionesControlEntity) o;
        return idPersona.equals(that.idPersona) && idControl.equals(that.idControl) && idInmunizacion.equals(that.idInmunizacion) && Objects.equals(estado, that.estado) && Objects.equals(sqlDeleted, that.sqlDeleted) && Objects.equals(lastModified, that.lastModified) && Objects.equals(personasByIdPersona, that.personasByIdPersona) && Objects.equals(controlesByIdControl, that.controlesByIdControl) && Objects.equals(inmunizacionesByIdInmunizacion, that.inmunizacionesByIdInmunizacion);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idPersona, idControl, idInmunizacion, estado, sqlDeleted, lastModified, personasByIdPersona, controlesByIdControl, inmunizacionesByIdInmunizacion);
    }
}


