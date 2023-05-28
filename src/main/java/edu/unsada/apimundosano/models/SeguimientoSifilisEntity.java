package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Timestamp;
import java.util.Collection;

@Entity
@Table(name = "seguimiento_sifilis", schema = "tripleconlast", catalog = "")
public class SeguimientoSifilisEntity {

    @Id
    @Column(name = "id_seguimiento_sifilis")
    private int idSeguimientoSifilis;
    @Basic
    @Column(name = "pareja_fecha_realizado")
    private Timestamp parejaFechaRealizado;
    @Basic
    @Column(name = "pareja_fecha_resultados")
    private Timestamp parejaFechaResultados;
    @Basic
    @Column(name = "pareja_resultado")
    private String parejaResultado;
    @Basic
    @Column(name = "pareja_tratamiento")
    private String parejaTratamiento;
    @Basic
    @Column(name = "rn_mes_seguimiento")
    private Short rnMesSeguimiento;
    @Basic
    @Column(name = "rn_examen_medico")
    private String rnExamenMedico;
    @Basic
    @Column(name = "rn_vdrl")
    private String rnVdrl;
    @Basic
    @Column(name = "rn_rx_osea")
    private String rnRxOsea;
    @Basic
    @Column(name = "rn_sedimento_orina")
    private String rnSedimentoOrina;
    @Basic
    @Column(name = "rn_got")
    private String rnGot;
    @Basic
    @Column(name = "rn_gpt")
    private String rnGpt;
    @Basic
    @Column(name = "rn_lcr")
    private String rnLcr;
    @Basic
    @Column(name = "rn_oftalmologico")
    private String rnOftalmologico;
    @Basic
    @Column(name = "rn_auditivo")
    private String rnAuditivo;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "seguimientoSifilisByIdSeguimientoSifilis")
    private Collection<ControlesEntity> controlesByIdSeguimientoSifilis;

    public int getIdSeguimientoSifilis() {
        return idSeguimientoSifilis;
    }

    public void setIdSeguimientoSifilis(int idSeguimientoSifilis) {
        this.idSeguimientoSifilis = idSeguimientoSifilis;
    }

    public Timestamp getParejaFechaRealizado() {
        return parejaFechaRealizado;
    }

    public void setParejaFechaRealizado(Timestamp parejaFechaRealizado) {
        this.parejaFechaRealizado = parejaFechaRealizado;
    }

    public Timestamp getParejaFechaResultados() {
        return parejaFechaResultados;
    }

    public void setParejaFechaResultados(Timestamp parejaFechaResultados) {
        this.parejaFechaResultados = parejaFechaResultados;
    }

    public String getParejaResultado() {
        return parejaResultado;
    }

    public void setParejaResultado(String parejaResultado) {
        this.parejaResultado = parejaResultado;
    }

    public String getParejaTratamiento() {
        return parejaTratamiento;
    }

    public void setParejaTratamiento(String parejaTratamiento) {
        this.parejaTratamiento = parejaTratamiento;
    }

    public Short getRnMesSeguimiento() {
        return rnMesSeguimiento;
    }

    public void setRnMesSeguimiento(Short rnMesSeguimiento) {
        this.rnMesSeguimiento = rnMesSeguimiento;
    }

    public String getRnExamenMedico() {
        return rnExamenMedico;
    }

    public void setRnExamenMedico(String rnExamenMedico) {
        this.rnExamenMedico = rnExamenMedico;
    }

    public String getRnVdrl() {
        return rnVdrl;
    }

    public void setRnVdrl(String rnVdrl) {
        this.rnVdrl = rnVdrl;
    }

    public String getRnRxOsea() {
        return rnRxOsea;
    }

    public void setRnRxOsea(String rnRxOsea) {
        this.rnRxOsea = rnRxOsea;
    }

    public String getRnSedimentoOrina() {
        return rnSedimentoOrina;
    }

    public void setRnSedimentoOrina(String rnSedimentoOrina) {
        this.rnSedimentoOrina = rnSedimentoOrina;
    }

    public String getRnGot() {
        return rnGot;
    }

    public void setRnGot(String rnGot) {
        this.rnGot = rnGot;
    }

    public String getRnGpt() {
        return rnGpt;
    }

    public void setRnGpt(String rnGpt) {
        this.rnGpt = rnGpt;
    }

    public String getRnLcr() {
        return rnLcr;
    }

    public void setRnLcr(String rnLcr) {
        this.rnLcr = rnLcr;
    }

    public String getRnOftalmologico() {
        return rnOftalmologico;
    }

    public void setRnOftalmologico(String rnOftalmologico) {
        this.rnOftalmologico = rnOftalmologico;
    }

    public String getRnAuditivo() {
        return rnAuditivo;
    }

    public void setRnAuditivo(String rnAuditivo) {
        this.rnAuditivo = rnAuditivo;
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

        SeguimientoSifilisEntity that = (SeguimientoSifilisEntity) o;

        if (idSeguimientoSifilis != that.idSeguimientoSifilis) return false;
        if (parejaFechaRealizado != null ? !parejaFechaRealizado.equals(that.parejaFechaRealizado) : that.parejaFechaRealizado != null)
            return false;
        if (parejaFechaResultados != null ? !parejaFechaResultados.equals(that.parejaFechaResultados) : that.parejaFechaResultados != null)
            return false;
        if (parejaResultado != null ? !parejaResultado.equals(that.parejaResultado) : that.parejaResultado != null)
            return false;
        if (parejaTratamiento != null ? !parejaTratamiento.equals(that.parejaTratamiento) : that.parejaTratamiento != null)
            return false;
        if (rnMesSeguimiento != null ? !rnMesSeguimiento.equals(that.rnMesSeguimiento) : that.rnMesSeguimiento != null)
            return false;
        if (rnExamenMedico != null ? !rnExamenMedico.equals(that.rnExamenMedico) : that.rnExamenMedico != null)
            return false;
        if (rnVdrl != null ? !rnVdrl.equals(that.rnVdrl) : that.rnVdrl != null) return false;
        if (rnRxOsea != null ? !rnRxOsea.equals(that.rnRxOsea) : that.rnRxOsea != null) return false;
        if (rnSedimentoOrina != null ? !rnSedimentoOrina.equals(that.rnSedimentoOrina) : that.rnSedimentoOrina != null)
            return false;
        if (rnGot != null ? !rnGot.equals(that.rnGot) : that.rnGot != null) return false;
        if (rnGpt != null ? !rnGpt.equals(that.rnGpt) : that.rnGpt != null) return false;
        if (rnLcr != null ? !rnLcr.equals(that.rnLcr) : that.rnLcr != null) return false;
        if (rnOftalmologico != null ? !rnOftalmologico.equals(that.rnOftalmologico) : that.rnOftalmologico != null)
            return false;
        if (rnAuditivo != null ? !rnAuditivo.equals(that.rnAuditivo) : that.rnAuditivo != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idSeguimientoSifilis;
        result = 31 * result + (parejaFechaRealizado != null ? parejaFechaRealizado.hashCode() : 0);
        result = 31 * result + (parejaFechaResultados != null ? parejaFechaResultados.hashCode() : 0);
        result = 31 * result + (parejaResultado != null ? parejaResultado.hashCode() : 0);
        result = 31 * result + (parejaTratamiento != null ? parejaTratamiento.hashCode() : 0);
        result = 31 * result + (rnMesSeguimiento != null ? rnMesSeguimiento.hashCode() : 0);
        result = 31 * result + (rnExamenMedico != null ? rnExamenMedico.hashCode() : 0);
        result = 31 * result + (rnVdrl != null ? rnVdrl.hashCode() : 0);
        result = 31 * result + (rnRxOsea != null ? rnRxOsea.hashCode() : 0);
        result = 31 * result + (rnSedimentoOrina != null ? rnSedimentoOrina.hashCode() : 0);
        result = 31 * result + (rnGot != null ? rnGot.hashCode() : 0);
        result = 31 * result + (rnGpt != null ? rnGpt.hashCode() : 0);
        result = 31 * result + (rnLcr != null ? rnLcr.hashCode() : 0);
        result = 31 * result + (rnOftalmologico != null ? rnOftalmologico.hashCode() : 0);
        result = 31 * result + (rnAuditivo != null ? rnAuditivo.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdSeguimientoSifilis() {
        return controlesByIdSeguimientoSifilis;
    }

    public void setControlesByIdSeguimientoSifilis(Collection<ControlesEntity> controlesByIdSeguimientoSifilis) {
        this.controlesByIdSeguimientoSifilis = controlesByIdSeguimientoSifilis;
    }
}
