package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "areas", schema = "tripleconlast", catalog = "")
public class AreasEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_area")
    private int idArea;
    @Basic
    @Column(name = "id_pais")
    private int idPais;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
    @JoinColumn(name = "id_pais", referencedColumnName = "id_pais", nullable = false,insertable=false, updatable=false)
    private PaisesEntity paisesByIdPais;
    @OneToMany(mappedBy = "areasByIdArea")
    private Collection<ParajesEntity> parajesByIdArea;

    public int getIdArea() {
        return idArea;
    }

    public void setIdArea(int idArea) {
        this.idArea = idArea;
    }

    public int getIdPais() {
        return idPais;
    }

    public void setIdPais(int idPais) {
        this.idPais = idPais;
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

        AreasEntity that = (AreasEntity) o;

        if (idArea != that.idArea) return false;
        if (idPais != that.idPais) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idArea;
        result = 31 * result + idPais;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public PaisesEntity getPaisesByIdPais() {
        return paisesByIdPais;
    }

    public void setPaisesByIdPais(PaisesEntity paisesByIdPais) {
        this.paisesByIdPais = paisesByIdPais;
    }

    public Collection<ParajesEntity> getParajesByIdArea() {
        return parajesByIdArea;
    }

    public void setParajesByIdArea(Collection<ParajesEntity> parajesByIdArea) {
        this.parajesByIdArea = parajesByIdArea;
    }
}
