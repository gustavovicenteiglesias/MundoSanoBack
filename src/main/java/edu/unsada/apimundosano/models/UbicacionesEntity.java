package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "ubicaciones", schema = "tripleconlast", catalog = "")
public class UbicacionesEntity {


    @Id
    @Column(name = "id_ubicacion")
    private int idUbicacion;
    @Basic
    @Column(name = "id_persona")
    private int idPersona;
    @Basic
    @Column(name = "id_paraje")
    private Integer idParaje;
    @Basic
    @Column(name = "id_area")
    private Integer idArea;
    @Basic
    @Column(name = "num_vivienda")
    private String numVivienda;
    @Basic
    @Column(name = "fecha")
    private Date fecha;
    @Basic
    @Column(name = "georeferencia")
    private String georeferencia;
    @Basic
    @Column(name = "id_pais")
    private Integer idPais;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;

    public int getIdUbicacion() {
        return idUbicacion;
    }

    public void setIdUbicacion(int idUbicacion) {
        this.idUbicacion = idUbicacion;
    }

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public Integer getIdParaje() {
        return idParaje;
    }

    public void setIdParaje(Integer idParaje) {
        this.idParaje = idParaje;
    }

    public Integer getIdArea() {
        return idArea;
    }

    public void setIdArea(Integer idArea) {
        this.idArea = idArea;
    }

    public String getNumVivienda() {
        return numVivienda;
    }

    public void setNumVivienda(String numVivienda) {
        this.numVivienda = numVivienda;
    }

    public Date getFecha() {
        return fecha;
    }

    public void setFecha(Date fecha) {
        this.fecha = fecha;
    }

    public String getGeoreferencia() {
        return georeferencia;
    }

    public void setGeoreferencia(String georeferencia) {
        this.georeferencia = georeferencia;
    }

    public Integer getIdPais() {
        return idPais;
    }

    public void setIdPais(Integer idPais) {
        this.idPais = idPais;
    }

    public Integer getSqlDeleted() {
        return sqlDeleted;
    }


    public void setSqlDeleted(Integer sqlDeleted) {
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

        UbicacionesEntity that = (UbicacionesEntity) o;

        if (idUbicacion != that.idUbicacion) return false;
        if (idPersona != that.idPersona) return false;
        if (idParaje != null ? !idParaje.equals(that.idParaje) : that.idParaje != null) return false;
        if (idArea != null ? !idArea.equals(that.idArea) : that.idArea != null) return false;
        if (numVivienda != null ? !numVivienda.equals(that.numVivienda) : that.numVivienda != null) return false;
        if (fecha != null ? !fecha.equals(that.fecha) : that.fecha != null) return false;
        if (georeferencia != null ? !georeferencia.equals(that.georeferencia) : that.georeferencia != null)
            return false;
        if (idPais != null ? !idPais.equals(that.idPais) : that.idPais != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idUbicacion;
        result = 31 * result + idPersona;
        result = 31 * result + (idParaje != null ? idParaje.hashCode() : 0);
        result = 31 * result + (idArea != null ? idArea.hashCode() : 0);
        result = 31 * result + (numVivienda != null ? numVivienda.hashCode() : 0);
        result = 31 * result + (fecha != null ? fecha.hashCode() : 0);
        result = 31 * result + (georeferencia != null ? georeferencia.hashCode() : 0);
        result = 31 * result + (idPais != null ? idPais.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    @Override
    public String toString() {
        return "UbicacionesEntity{" +
                "idUbicacion=" + idUbicacion +
                ", idPersona=" + idPersona +
                ", idParaje=" + idParaje +
                ", idArea=" + idArea +
                ", numVivienda='" + numVivienda + '\'' +
                ", fecha=" + fecha +
                ", georeferencia='" + georeferencia + '\'' +
                ", idPais=" + idPais +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                '}';
    }
}
