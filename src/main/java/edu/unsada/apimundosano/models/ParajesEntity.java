package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "parajes")
public class ParajesEntity extends BaseEntity {

    @Id
    @Column(name = "id_paraje")
    private int idParaje;
    @Basic
    @Column(name = "id_area")
    private int idArea;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    
    
    @ManyToOne
    @JoinColumn(name = "id_area", referencedColumnName = "id_area", nullable = false,insertable=false, updatable=false)
    private AreasEntity areasByIdArea;

    public int getIdParaje() {
        return idParaje;
    }

    public void setIdParaje(int idParaje) {
        this.idParaje = idParaje;
    }

    public int getIdArea() {
        return idArea;
    }

    public void setIdArea(int idArea) {
        this.idArea = idArea;
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

        ParajesEntity that = (ParajesEntity) o;

        if (idParaje != that.idParaje) return false;
        if (idArea != that.idArea) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idParaje;
        result = 31 * result + idArea;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public AreasEntity getAreasByIdArea() {
        return areasByIdArea;
    }

    public void setAreasByIdArea(AreasEntity areasByIdArea) {
        this.areasByIdArea = areasByIdArea;
    }
}


