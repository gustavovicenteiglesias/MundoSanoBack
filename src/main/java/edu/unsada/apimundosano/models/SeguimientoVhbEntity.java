package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "seguimiento_vhb", schema = "tripleconlast", catalog = "")
public class SeguimientoVhbEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_seguimiento_vhb")
    private int idSeguimientoVhb;
    @Basic
    @Column(name = "antihbc")
    private String antihbc;
    @Basic
    @Column(name = "derivacion_hospital")
    private String derivacionHospital;
    @Basic
    @Column(name = "antihbs")
    private Integer antihbs;
    @Basic
    @Column(name = "vacuna12hs")
    private Short vacuna12Hs;
    @Basic
    @Column(name = "gammaglobulina_1248")
    private Short gammaglobulina1248;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "seguimientoVhbByIdSeguimientoVhb")
    private Collection<ControlesEntity> controlesByIdSeguimientoVhb;

    public int getIdSeguimientoVhb() {
        return idSeguimientoVhb;
    }

    public void setIdSeguimientoVhb(int idSeguimientoVhb) {
        this.idSeguimientoVhb = idSeguimientoVhb;
    }

    public String getAntihbc() {
        return antihbc;
    }

    public void setAntihbc(String antihbc) {
        this.antihbc = antihbc;
    }

    public String getDerivacionHospital() {
        return derivacionHospital;
    }

    public void setDerivacionHospital(String derivacionHospital) {
        this.derivacionHospital = derivacionHospital;
    }

    public Integer getAntihbs() {
        return antihbs;
    }

    public void setAntihbs(Integer antihbs) {
        this.antihbs = antihbs;
    }

    public Short getVacuna12Hs() {
        return vacuna12Hs;
    }

    public void setVacuna12Hs(Short vacuna12Hs) {
        this.vacuna12Hs = vacuna12Hs;
    }

    public Short getGammaglobulina1248() {
        return gammaglobulina1248;
    }

    public void setGammaglobulina1248(Short gammaglobulina1248) {
        this.gammaglobulina1248 = gammaglobulina1248;
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

        SeguimientoVhbEntity that = (SeguimientoVhbEntity) o;

        if (idSeguimientoVhb != that.idSeguimientoVhb) return false;
        if (antihbc != null ? !antihbc.equals(that.antihbc) : that.antihbc != null) return false;
        if (derivacionHospital != null ? !derivacionHospital.equals(that.derivacionHospital) : that.derivacionHospital != null)
            return false;
        if (antihbs != null ? !antihbs.equals(that.antihbs) : that.antihbs != null) return false;
        if (vacuna12Hs != null ? !vacuna12Hs.equals(that.vacuna12Hs) : that.vacuna12Hs != null) return false;
        if (gammaglobulina1248 != null ? !gammaglobulina1248.equals(that.gammaglobulina1248) : that.gammaglobulina1248 != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idSeguimientoVhb;
        result = 31 * result + (antihbc != null ? antihbc.hashCode() : 0);
        result = 31 * result + (derivacionHospital != null ? derivacionHospital.hashCode() : 0);
        result = 31 * result + (antihbs != null ? antihbs.hashCode() : 0);
        result = 31 * result + (vacuna12Hs != null ? vacuna12Hs.hashCode() : 0);
        result = 31 * result + (gammaglobulina1248 != null ? gammaglobulina1248.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdSeguimientoVhb() {
        return controlesByIdSeguimientoVhb;
    }

    public void setControlesByIdSeguimientoVhb(Collection<ControlesEntity> controlesByIdSeguimientoVhb) {
        this.controlesByIdSeguimientoVhb = controlesByIdSeguimientoVhb;
    }
}
