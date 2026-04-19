package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "patologias_rn")
public class PatologiasRnEntity extends BaseEntity {

    @Id
    @Column(name = "id_patologias_Rn")
    private int idPatologiasRn;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    
    

    public int getIdPatologiasRn() {
        return idPatologiasRn;
    }

    public void setIdPatologiasRn(int idPatologiasRn) {
        this.idPatologiasRn = idPatologiasRn;
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

        PatologiasRnEntity that = (PatologiasRnEntity) o;

        if (idPatologiasRn != that.idPatologiasRn) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPatologiasRn;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }
}


