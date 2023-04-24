package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "provincias", schema = "tripleconlast", catalog = "")
public class ProvinciasEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_provincia")
    private int idProvincia;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "id_pais")
    private int idPais;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "provinciasByIdProvincia")
    private Collection<CiudadesEntity> ciudadesByIdProvincia;
    @ManyToOne
    @JoinColumn(name = "id_pais", referencedColumnName = "id_pais", nullable = false,insertable=false, updatable=false)
    private PaisesEntity paisesByIdPais;

    public int getIdProvincia() {
        return idProvincia;
    }

    public void setIdProvincia(int idProvincia) {
        this.idProvincia = idProvincia;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getIdPais() {
        return idPais;
    }

    public void setIdPais(int idPais) {
        this.idPais = idPais;
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

        ProvinciasEntity that = (ProvinciasEntity) o;

        if (idProvincia != that.idProvincia) return false;
        if (idPais != that.idPais) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idProvincia;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + idPais;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<CiudadesEntity> getCiudadesByIdProvincia() {
        return ciudadesByIdProvincia;
    }

    public void setCiudadesByIdProvincia(Collection<CiudadesEntity> ciudadesByIdProvincia) {
        this.ciudadesByIdProvincia = ciudadesByIdProvincia;
    }

    public PaisesEntity getPaisesByIdPais() {
        return paisesByIdPais;
    }

    public void setPaisesByIdPais(PaisesEntity paisesByIdPais) {
        this.paisesByIdPais = paisesByIdPais;
    }
}
