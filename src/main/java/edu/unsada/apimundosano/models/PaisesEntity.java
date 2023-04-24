package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "paises", schema = "tripleconlast", catalog = "")
public class PaisesEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_pais")
    private int idPais;
    @Basic
    @Column(name = "codigo")
    private String codigo;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "paisesByIdPais")
    private Collection<AreasEntity> areasByIdPais;
    @OneToMany(mappedBy = "paisesByIdPais")
    private Collection<ProvinciasEntity> provinciasByIdPais;

    public int getIdPais() {
        return idPais;
    }

    public void setIdPais(int idPais) {
        this.idPais = idPais;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
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

        PaisesEntity that = (PaisesEntity) o;

        if (idPais != that.idPais) return false;
        if (codigo != null ? !codigo.equals(that.codigo) : that.codigo != null) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPais;
        result = 31 * result + (codigo != null ? codigo.hashCode() : 0);
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<AreasEntity> getAreasByIdPais() {
        return areasByIdPais;
    }

    public void setAreasByIdPais(Collection<AreasEntity> areasByIdPais) {
        this.areasByIdPais = areasByIdPais;
    }

    public Collection<ProvinciasEntity> getProvinciasByIdPais() {
        return provinciasByIdPais;
    }

    public void setProvinciasByIdPais(Collection<ProvinciasEntity> provinciasByIdPais) {
        this.provinciasByIdPais = provinciasByIdPais;
    }
}
