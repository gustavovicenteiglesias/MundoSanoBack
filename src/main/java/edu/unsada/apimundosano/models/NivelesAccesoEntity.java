package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "niveles_acceso", schema = "tripleconlast", catalog = "")
public class NivelesAccesoEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_nivel_acceso")
    private int idNivelAcceso;
    @Basic
    @Column(name = "acceso")
    private String acceso;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;

    public int getIdNivelAcceso() {
        return idNivelAcceso;
    }

    public void setIdNivelAcceso(int idNivelAcceso) {
        this.idNivelAcceso = idNivelAcceso;
    }

    public String getAcceso() {
        return acceso;
    }

    public void setAcceso(String acceso) {
        this.acceso = acceso;
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

        NivelesAccesoEntity that = (NivelesAccesoEntity) o;

        if (idNivelAcceso != that.idNivelAcceso) return false;
        if (acceso != null ? !acceso.equals(that.acceso) : that.acceso != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idNivelAcceso;
        result = 31 * result + (acceso != null ? acceso.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }
}
