package edu.unsada.apimundosano.models;

import jakarta.persistence.*;;
import java.util.Collection;

@Entity
@Table(name = "tratamiento_vhb", schema = "tripleconlast", catalog = "")
public class TratamientoVhbEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_tratamiento_vhb")
    private int idTratamientoVhb;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "tratamientoVhbByIdTratamientoVhb")
    private Collection<ControlesEntity> controlesByIdTratamientoVhb;

    public int getIdTratamientoVhb() {
        return idTratamientoVhb;
    }

    public void setIdTratamientoVhb(int idTratamientoVhb) {
        this.idTratamientoVhb = idTratamientoVhb;
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

        TratamientoVhbEntity that = (TratamientoVhbEntity) o;

        if (idTratamientoVhb != that.idTratamientoVhb) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTratamientoVhb;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdTratamientoVhb() {
        return controlesByIdTratamientoVhb;
    }

    public void setControlesByIdTratamientoVhb(Collection<ControlesEntity> controlesByIdTratamientoVhb) {
        this.controlesByIdTratamientoVhb = controlesByIdTratamientoVhb;
    }
}
