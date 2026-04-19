package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "estados")
public class EstadosEntity extends BaseEntity {

    @Id
    @Column(name = "id_estado")
    private int idEstado;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    
    
    @OneToMany(mappedBy = "estadosByIdEstado")
    private Collection<ControlesEntity> controlesByIdEstado;

    public int getIdEstado() {
        return idEstado;
    }

    public void setIdEstado(int idEstado) {
        this.idEstado = idEstado;
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

        EstadosEntity that = (EstadosEntity) o;

        if (idEstado != that.idEstado) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idEstado;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdEstado() {
        return controlesByIdEstado;
    }

    public void setControlesByIdEstado(Collection<ControlesEntity> controlesByIdEstado) {
        this.controlesByIdEstado = controlesByIdEstado;
    }
}


