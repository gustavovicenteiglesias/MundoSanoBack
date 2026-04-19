package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "etmis")
public class EtmisEntity extends BaseEntity {

    @Id
    @Column(name = "id_etmi")
    private int idEtmi;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    
    
    @OneToMany(mappedBy = "etmisByIdEtmi")
    private Collection<EtmisPersonasEntity> etmisPersonasByIdEtmi;

    public int getIdEtmi() {
        return idEtmi;
    }

    public void setIdEtmi(int idEtmi) {
        this.idEtmi = idEtmi;
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

        EtmisEntity that = (EtmisEntity) o;

        if (idEtmi != that.idEtmi) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idEtmi;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<EtmisPersonasEntity> getEtmisPersonasByIdEtmi() {
        return etmisPersonasByIdEtmi;
    }

    public void setEtmisPersonasByIdEtmi(Collection<EtmisPersonasEntity> etmisPersonasByIdEtmi) {
        this.etmisPersonasByIdEtmi = etmisPersonasByIdEtmi;
    }
}


