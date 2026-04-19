package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "motivos_derivacion")
public class MotivosDerivacionEntity extends BaseEntity {

    @Id
    @Column(name = "id_motivo")
    private int idMotivo;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    
    
    @OneToMany(mappedBy = "motivosDerivacionByMotivo")
    private Collection<ControlEmbarazoEntity> controlEmbarazosByIdMotivo;

    public int getIdMotivo() {
        return idMotivo;
    }

    public void setIdMotivo(int idMotivo) {
        this.idMotivo = idMotivo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    

    

    

    

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        MotivosDerivacionEntity that = (MotivosDerivacionEntity) o;

        if (idMotivo != that.idMotivo) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idMotivo;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlEmbarazoEntity> getControlEmbarazosByIdMotivo() {
        return controlEmbarazosByIdMotivo;
    }

    public void setControlEmbarazosByIdMotivo(Collection<ControlEmbarazoEntity> controlEmbarazosByIdMotivo) {
        this.controlEmbarazosByIdMotivo = controlEmbarazosByIdMotivo;
    }
}


