package edu.unsada.apimundosano.models;

import javax.persistence.*;

@jakarta.persistence.Entity
@Entity
@Table(name = "motivo_finalizacion_tratamiento", schema = "tripleconlast", catalog = "")
@jakarta.persistence.Table(name = "motivo_finalizacion_tratamiento", schema = "tripleconlast", catalog = "")
public class MotivoFinalizacionTratamientoEntity {
    @jakarta.persistence.GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    @jakarta.persistence.Id

    @Id
    @Column(name = "id_motivo_finalizacion_tratamiento")
    @jakarta.persistence.Column(name = "id_motivo_finalizacion_tratamiento")
    private int idMotivoFinalizacionTratamiento;
    @jakarta.persistence.Basic
    @Basic
    @Column(name = "nombre")
    @jakarta.persistence.Column(name = "nombre")
    private String nombre;
    @jakarta.persistence.Basic
    @Basic
    @Column(name = "sql_deleted")
    @jakarta.persistence.Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @jakarta.persistence.Basic
    @Basic
    @Column(name = "last_modified")
    @jakarta.persistence.Column(name = "last_modified")
    private Integer lastModified;

    public int getIdMotivoFinalizacionTratamiento() {
        return idMotivoFinalizacionTratamiento;
    }

    public void setIdMotivoFinalizacionTratamiento(int idMotivoFinalizacionTratamiento) {
        this.idMotivoFinalizacionTratamiento = idMotivoFinalizacionTratamiento;
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

        MotivoFinalizacionTratamientoEntity that = (MotivoFinalizacionTratamientoEntity) o;

        if (idMotivoFinalizacionTratamiento != that.idMotivoFinalizacionTratamiento) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idMotivoFinalizacionTratamiento;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }
}
