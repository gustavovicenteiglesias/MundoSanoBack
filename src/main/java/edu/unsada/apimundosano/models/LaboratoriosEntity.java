package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "laboratorios", schema = "tripleconlast", catalog = "")
public class LaboratoriosEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_laboratorio")
    private int idLaboratorio;
    @Basic
    @Column(name = "nombre")
    private String nombre;
    @Basic
    @Column(name = "resultado")
    private String resultado;
    @Basic
    @Column(name = "confirmacion")
    private short confirmacion;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "laboratoriosByIdLaboratorio")
    private Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdLaboratorio;

    public int getIdLaboratorio() {
        return idLaboratorio;
    }

    public void setIdLaboratorio(int idLaboratorio) {
        this.idLaboratorio = idLaboratorio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getResultado() {
        return resultado;
    }

    public void setResultado(String resultado) {
        this.resultado = resultado;
    }

    public short getConfirmacion() {
        return confirmacion;
    }

    public void setConfirmacion(short confirmacion) {
        this.confirmacion = confirmacion;
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

        LaboratoriosEntity that = (LaboratoriosEntity) o;

        if (idLaboratorio != that.idLaboratorio) return false;
        if (confirmacion != that.confirmacion) return false;
        if (nombre != null ? !nombre.equals(that.nombre) : that.nombre != null) return false;
        if (resultado != null ? !resultado.equals(that.resultado) : that.resultado != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idLaboratorio;
        result = 31 * result + (nombre != null ? nombre.hashCode() : 0);
        result = 31 * result + (resultado != null ? resultado.hashCode() : 0);
        result = 31 * result + (int) confirmacion;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<LaboratoriosRealizadosEntity> getLaboratoriosRealizadosByIdLaboratorio() {
        return laboratoriosRealizadosByIdLaboratorio;
    }

    public void setLaboratoriosRealizadosByIdLaboratorio(Collection<LaboratoriosRealizadosEntity> laboratoriosRealizadosByIdLaboratorio) {
        this.laboratoriosRealizadosByIdLaboratorio = laboratoriosRealizadosByIdLaboratorio;
    }
}
