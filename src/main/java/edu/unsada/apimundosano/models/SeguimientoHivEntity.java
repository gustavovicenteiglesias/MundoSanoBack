package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "seguimiento_hiv", schema = "tripleconlast", catalog = "")
public class SeguimientoHivEntity {

    @Id
    @Column(name = "id_seguimiento_hiv")
    private int idSeguimientoHiv;
    @Basic
    @Column(name = "antecedente")
    private String antecedente;
    @Basic
    @Column(name = "carga_viral")
    private String cargaViral;
    @Basic
    @Column(name = "medico_cargo")
    private String medicoCargo;
    @Basic
    @Column(name = "derivacion_hospital")
    private String derivacionHospital;
    @Basic
    @Column(name = "test_rapido_pareja")
    private String testRapidoPareja;
    @Basic
    @Column(name = "derivacion_hospital_pareja")
    private String derivacionHospitalPareja;
    @Basic
    @Column(name = "medico_cargo_pareja")
    private String medicoCargoPareja;
    @Basic
    @Column(name = "proviral_cargaviral")
    private String proviralCargaviral;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "seguimientoHivByIdSeguimientoHiv")
    private Collection<ControlesEntity> controlesByIdSeguimientoHiv;

    public int getIdSeguimientoHiv() {
        return idSeguimientoHiv;
    }

    public void setIdSeguimientoHiv(int idSeguimientoHiv) {
        this.idSeguimientoHiv = idSeguimientoHiv;
    }

    public String getAntecedente() {
        return antecedente;
    }

    public void setAntecedente(String antecedente) {
        this.antecedente = antecedente;
    }

    public String getCargaViral() {
        return cargaViral;
    }

    public void setCargaViral(String cargaViral) {
        this.cargaViral = cargaViral;
    }

    public String getMedicoCargo() {
        return medicoCargo;
    }

    public void setMedicoCargo(String medicoCargo) {
        this.medicoCargo = medicoCargo;
    }

    public String getDerivacionHospital() {
        return derivacionHospital;
    }

    public void setDerivacionHospital(String derivacionHospital) {
        this.derivacionHospital = derivacionHospital;
    }

    public String getTestRapidoPareja() {
        return testRapidoPareja;
    }

    public void setTestRapidoPareja(String testRapidoPareja) {
        this.testRapidoPareja = testRapidoPareja;
    }

    public String getDerivacionHospitalPareja() {
        return derivacionHospitalPareja;
    }

    public void setDerivacionHospitalPareja(String derivacionHospitalPareja) {
        this.derivacionHospitalPareja = derivacionHospitalPareja;
    }

    public String getMedicoCargoPareja() {
        return medicoCargoPareja;
    }

    public void setMedicoCargoPareja(String medicoCargoPareja) {
        this.medicoCargoPareja = medicoCargoPareja;
    }

    public String getProviralCargaviral() {
        return proviralCargaviral;
    }

    public void setProviralCargaviral(String proviralCargaviral) {
        this.proviralCargaviral = proviralCargaviral;
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

        SeguimientoHivEntity that = (SeguimientoHivEntity) o;

        if (idSeguimientoHiv != that.idSeguimientoHiv) return false;
        if (antecedente != null ? !antecedente.equals(that.antecedente) : that.antecedente != null) return false;
        if (cargaViral != null ? !cargaViral.equals(that.cargaViral) : that.cargaViral != null) return false;
        if (medicoCargo != null ? !medicoCargo.equals(that.medicoCargo) : that.medicoCargo != null) return false;
        if (derivacionHospital != null ? !derivacionHospital.equals(that.derivacionHospital) : that.derivacionHospital != null)
            return false;
        if (testRapidoPareja != null ? !testRapidoPareja.equals(that.testRapidoPareja) : that.testRapidoPareja != null)
            return false;
        if (derivacionHospitalPareja != null ? !derivacionHospitalPareja.equals(that.derivacionHospitalPareja) : that.derivacionHospitalPareja != null)
            return false;
        if (medicoCargoPareja != null ? !medicoCargoPareja.equals(that.medicoCargoPareja) : that.medicoCargoPareja != null)
            return false;
        if (proviralCargaviral != null ? !proviralCargaviral.equals(that.proviralCargaviral) : that.proviralCargaviral != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idSeguimientoHiv;
        result = 31 * result + (antecedente != null ? antecedente.hashCode() : 0);
        result = 31 * result + (cargaViral != null ? cargaViral.hashCode() : 0);
        result = 31 * result + (medicoCargo != null ? medicoCargo.hashCode() : 0);
        result = 31 * result + (derivacionHospital != null ? derivacionHospital.hashCode() : 0);
        result = 31 * result + (testRapidoPareja != null ? testRapidoPareja.hashCode() : 0);
        result = 31 * result + (derivacionHospitalPareja != null ? derivacionHospitalPareja.hashCode() : 0);
        result = 31 * result + (medicoCargoPareja != null ? medicoCargoPareja.hashCode() : 0);
        result = 31 * result + (proviralCargaviral != null ? proviralCargaviral.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdSeguimientoHiv() {
        return controlesByIdSeguimientoHiv;
    }

    public void setControlesByIdSeguimientoHiv(Collection<ControlesEntity> controlesByIdSeguimientoHiv) {
        this.controlesByIdSeguimientoHiv = controlesByIdSeguimientoHiv;
    }
}
