package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "seguimiento_chagas", schema = "tripleconlast", catalog = "")
public class SeguimientoChagasEntity {

    @Id
    @Column(name = "id_seguimiento_chagas")
    private int idSeguimientoChagas;
    @Basic
    @Column(name = "examen_clinico")
    private String examenClinico;
    @Basic
    @Column(name = "detalle_examen")
    private String detalleExamen;
    @Basic
    @Column(name = "ecg")
    private String ecg;
    @Basic
    @Column(name = "detalle_ecg")
    private String detalleEcg;
    @Basic
    @Column(name = "hepatograma")
    private String hepatograma;
    @Basic
    @Column(name = "ecocardiograma")
    private String ecocardiograma;
    @Basic
    @Column(name = "tele_rx_torax")
    private String teleRxTorax;
    @Basic
    @Column(name = "got")
    private String got;
    @Basic
    @Column(name = "gpt")
    private String gpt;
    @Basic
    @Column(name = "fal")
    private String fal;
    @Basic
    @Column(name = "parasitemia")
    private String parasitemia;
    @Basic
    @Column(name = "serologia_10")
    private String serologia10;
    @Basic
    @Column(name = "serologia_12")
    private String serologia12;
    @Basic
    @Column(name = "serologia_24")
    private String serologia24;
    @Basic
    @Column(name = "detalle_got")
    private String detalleGot;
    @Basic
    @Column(name = "detalle_gpt")
    private String detalleGpt;
    @Basic
    @Column(name = "detalle_hepatograma")
    private String detalleHepatograma;
    @Basic
    @Column(name = "detalle_ecocardiograma")
    private String detalleEcocardiograma;
    @Basic
    @Column(name = "detalle_fal")
    private String detalleFal;
    @Basic
    @Column(name = "detalle_rx_torax")
    private String detalleRxTorax;
    @Basic
    @Column(name = "hemograma")
    private String hemograma;
    @Basic
    @Column(name = "detalle_hemograma")
    private String detalleHemograma;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "seguimientoChagasByIdSeguimientoChagas")
    private Collection<ControlesEntity> controlesByIdSeguimientoChagas;

    public int getIdSeguimientoChagas() {
        return idSeguimientoChagas;
    }

    public void setIdSeguimientoChagas(int idSeguimientoChagas) {
        this.idSeguimientoChagas = idSeguimientoChagas;
    }

    public String getExamenClinico() {
        return examenClinico;
    }

    public void setExamenClinico(String examenClinico) {
        this.examenClinico = examenClinico;
    }

    public String getDetalleExamen() {
        return detalleExamen;
    }

    public void setDetalleExamen(String detalleExamen) {
        this.detalleExamen = detalleExamen;
    }

    public String getEcg() {
        return ecg;
    }

    public void setEcg(String ecg) {
        this.ecg = ecg;
    }

    public String getDetalleEcg() {
        return detalleEcg;
    }

    public void setDetalleEcg(String detalleEcg) {
        this.detalleEcg = detalleEcg;
    }

    public String getHepatograma() {
        return hepatograma;
    }

    public void setHepatograma(String hepatograma) {
        this.hepatograma = hepatograma;
    }

    public String getEcocardiograma() {
        return ecocardiograma;
    }

    public void setEcocardiograma(String ecocardiograma) {
        this.ecocardiograma = ecocardiograma;
    }

    public String getTeleRxTorax() {
        return teleRxTorax;
    }

    public void setTeleRxTorax(String teleRxTorax) {
        this.teleRxTorax = teleRxTorax;
    }

    public String getGot() {
        return got;
    }

    public void setGot(String got) {
        this.got = got;
    }

    public String getGpt() {
        return gpt;
    }

    public void setGpt(String gpt) {
        this.gpt = gpt;
    }

    public String getFal() {
        return fal;
    }

    public void setFal(String fal) {
        this.fal = fal;
    }

    public String getParasitemia() {
        return parasitemia;
    }

    public void setParasitemia(String parasitemia) {
        this.parasitemia = parasitemia;
    }

    public String getSerologia10() {
        return serologia10;
    }

    public void setSerologia10(String serologia10) {
        this.serologia10 = serologia10;
    }

    public String getSerologia12() {
        return serologia12;
    }

    public void setSerologia12(String serologia12) {
        this.serologia12 = serologia12;
    }

    public String getSerologia24() {
        return serologia24;
    }

    public void setSerologia24(String serologia24) {
        this.serologia24 = serologia24;
    }

    public String getDetalleGot() {
        return detalleGot;
    }

    public void setDetalleGot(String detalleGot) {
        this.detalleGot = detalleGot;
    }

    public String getDetalleGpt() {
        return detalleGpt;
    }

    public void setDetalleGpt(String detalleGpt) {
        this.detalleGpt = detalleGpt;
    }

    public String getDetalleHepatograma() {
        return detalleHepatograma;
    }

    public void setDetalleHepatograma(String detalleHepatograma) {
        this.detalleHepatograma = detalleHepatograma;
    }

    public String getDetalleEcocardiograma() {
        return detalleEcocardiograma;
    }

    public void setDetalleEcocardiograma(String detalleEcocardiograma) {
        this.detalleEcocardiograma = detalleEcocardiograma;
    }

    public String getDetalleFal() {
        return detalleFal;
    }

    public void setDetalleFal(String detalleFal) {
        this.detalleFal = detalleFal;
    }

    public String getDetalleRxTorax() {
        return detalleRxTorax;
    }

    public void setDetalleRxTorax(String detalleRxTorax) {
        this.detalleRxTorax = detalleRxTorax;
    }

    public String getHemograma() {
        return hemograma;
    }

    public void setHemograma(String hemograma) {
        this.hemograma = hemograma;
    }

    public String getDetalleHemograma() {
        return detalleHemograma;
    }

    public void setDetalleHemograma(String detalleHemograma) {
        this.detalleHemograma = detalleHemograma;
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

        SeguimientoChagasEntity that = (SeguimientoChagasEntity) o;

        if (idSeguimientoChagas != that.idSeguimientoChagas) return false;
        if (examenClinico != null ? !examenClinico.equals(that.examenClinico) : that.examenClinico != null)
            return false;
        if (detalleExamen != null ? !detalleExamen.equals(that.detalleExamen) : that.detalleExamen != null)
            return false;
        if (ecg != null ? !ecg.equals(that.ecg) : that.ecg != null) return false;
        if (detalleEcg != null ? !detalleEcg.equals(that.detalleEcg) : that.detalleEcg != null) return false;
        if (hepatograma != null ? !hepatograma.equals(that.hepatograma) : that.hepatograma != null) return false;
        if (ecocardiograma != null ? !ecocardiograma.equals(that.ecocardiograma) : that.ecocardiograma != null)
            return false;
        if (teleRxTorax != null ? !teleRxTorax.equals(that.teleRxTorax) : that.teleRxTorax != null) return false;
        if (got != null ? !got.equals(that.got) : that.got != null) return false;
        if (gpt != null ? !gpt.equals(that.gpt) : that.gpt != null) return false;
        if (fal != null ? !fal.equals(that.fal) : that.fal != null) return false;
        if (parasitemia != null ? !parasitemia.equals(that.parasitemia) : that.parasitemia != null) return false;
        if (serologia10 != null ? !serologia10.equals(that.serologia10) : that.serologia10 != null) return false;
        if (serologia12 != null ? !serologia12.equals(that.serologia12) : that.serologia12 != null) return false;
        if (serologia24 != null ? !serologia24.equals(that.serologia24) : that.serologia24 != null) return false;
        if (detalleGot != null ? !detalleGot.equals(that.detalleGot) : that.detalleGot != null) return false;
        if (detalleGpt != null ? !detalleGpt.equals(that.detalleGpt) : that.detalleGpt != null) return false;
        if (detalleHepatograma != null ? !detalleHepatograma.equals(that.detalleHepatograma) : that.detalleHepatograma != null)
            return false;
        if (detalleEcocardiograma != null ? !detalleEcocardiograma.equals(that.detalleEcocardiograma) : that.detalleEcocardiograma != null)
            return false;
        if (detalleFal != null ? !detalleFal.equals(that.detalleFal) : that.detalleFal != null) return false;
        if (detalleRxTorax != null ? !detalleRxTorax.equals(that.detalleRxTorax) : that.detalleRxTorax != null)
            return false;
        if (hemograma != null ? !hemograma.equals(that.hemograma) : that.hemograma != null) return false;
        if (detalleHemograma != null ? !detalleHemograma.equals(that.detalleHemograma) : that.detalleHemograma != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idSeguimientoChagas;
        result = 31 * result + (examenClinico != null ? examenClinico.hashCode() : 0);
        result = 31 * result + (detalleExamen != null ? detalleExamen.hashCode() : 0);
        result = 31 * result + (ecg != null ? ecg.hashCode() : 0);
        result = 31 * result + (detalleEcg != null ? detalleEcg.hashCode() : 0);
        result = 31 * result + (hepatograma != null ? hepatograma.hashCode() : 0);
        result = 31 * result + (ecocardiograma != null ? ecocardiograma.hashCode() : 0);
        result = 31 * result + (teleRxTorax != null ? teleRxTorax.hashCode() : 0);
        result = 31 * result + (got != null ? got.hashCode() : 0);
        result = 31 * result + (gpt != null ? gpt.hashCode() : 0);
        result = 31 * result + (fal != null ? fal.hashCode() : 0);
        result = 31 * result + (parasitemia != null ? parasitemia.hashCode() : 0);
        result = 31 * result + (serologia10 != null ? serologia10.hashCode() : 0);
        result = 31 * result + (serologia12 != null ? serologia12.hashCode() : 0);
        result = 31 * result + (serologia24 != null ? serologia24.hashCode() : 0);
        result = 31 * result + (detalleGot != null ? detalleGot.hashCode() : 0);
        result = 31 * result + (detalleGpt != null ? detalleGpt.hashCode() : 0);
        result = 31 * result + (detalleHepatograma != null ? detalleHepatograma.hashCode() : 0);
        result = 31 * result + (detalleEcocardiograma != null ? detalleEcocardiograma.hashCode() : 0);
        result = 31 * result + (detalleFal != null ? detalleFal.hashCode() : 0);
        result = 31 * result + (detalleRxTorax != null ? detalleRxTorax.hashCode() : 0);
        result = 31 * result + (hemograma != null ? hemograma.hashCode() : 0);
        result = 31 * result + (detalleHemograma != null ? detalleHemograma.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdSeguimientoChagas() {
        return controlesByIdSeguimientoChagas;
    }

    public void setControlesByIdSeguimientoChagas(Collection<ControlesEntity> controlesByIdSeguimientoChagas) {
        this.controlesByIdSeguimientoChagas = controlesByIdSeguimientoChagas;
    }
}
