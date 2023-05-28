package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "ciudades", schema = "tripleconlast", catalog = "")
public class CiudadesEntity {

    @Id
    @Column(name = "id_ciudad")
    private int idCiudad;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "id_provincia")
    private int idProvincia;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
   @JoinColumn(name = "id_provincia", referencedColumnName = "id_provincia", nullable = false,insertable=false, updatable=false)
    private ProvinciasEntity provinciasByIdProvincia;

    public int getIdCiudad() {
        return idCiudad;
    }

    public void setIdCiudad(int idCiudad) {
        this.idCiudad = idCiudad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getIdProvincia() {
        return idProvincia;
    }

    public void setIdProvincia(int idProvincia) {
        this.idProvincia = idProvincia;
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

        CiudadesEntity that = (CiudadesEntity) o;

        if (idCiudad != that.idCiudad) return false;
        if (idProvincia != that.idProvincia) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idCiudad;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + idProvincia;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public ProvinciasEntity getProvinciasByIdProvincia() {
        return provinciasByIdProvincia;
    }

    public void setProvinciasByIdProvincia(ProvinciasEntity provinciasByIdProvincia) {
        this.provinciasByIdProvincia = provinciasByIdProvincia;
    }
}
