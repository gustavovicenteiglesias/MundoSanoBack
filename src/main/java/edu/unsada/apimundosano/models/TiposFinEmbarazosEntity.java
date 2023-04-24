package edu.unsada.apimundosano.models;
import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "tipos_fin_embarazos", schema = "tripleconlast", catalog = "")
public class TiposFinEmbarazosEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_tipos_fin_embarazos")
    private int idTiposFinEmbarazos;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "tiposFinEmbarazosByIdTiposFinEmbarazos")
    private Collection<ControlesEntity> controlesByIdTiposFinEmbarazos;

    public int getIdTiposFinEmbarazos() {
        return idTiposFinEmbarazos;
    }

    public void setIdTiposFinEmbarazos(int idTiposFinEmbarazos) {
        this.idTiposFinEmbarazos = idTiposFinEmbarazos;
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

        TiposFinEmbarazosEntity that = (TiposFinEmbarazosEntity) o;

        if (idTiposFinEmbarazos != that.idTiposFinEmbarazos) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTiposFinEmbarazos;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdTiposFinEmbarazos() {
        return controlesByIdTiposFinEmbarazos;
    }

    public void setControlesByIdTiposFinEmbarazos(Collection<ControlesEntity> controlesByIdTiposFinEmbarazos) {
        this.controlesByIdTiposFinEmbarazos = controlesByIdTiposFinEmbarazos;
    }
}
