package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "control_embarazo", schema = "tripleconlast", catalog = "")
public class ControlEmbarazoEntity {


    @Id
    @Column(name = "id_control_embarazo")
    private int idControlEmbarazo;
    @Basic
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "edad_gestacional")
    private int edadGestacional;
    @Basic
    @Column(name = "eco")
    private String eco;
    @Basic
    @Column(name = "detalle_eco")
    private String detalleEco;
    @Basic
    @Column(name = "hpv")
    private String hpv;
    @Basic
    @Column(name = "pap")
    private String pap;
    @Basic
    @Column(name = "sistolica")
    private int sistolica;
    @Basic
    @Column(name = "diastolica")
    private int diastolica;
    @Basic
    @Column(name = "clinico")
    private String clinico;
    @Basic
    @Column(name = "observaciones")
    private String observaciones;
    @Basic
    @Column(name = "motivo")
    private Integer motivo;
    @Basic
    @Column(name = "derivada")
    private Integer derivada;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "controlEmbarazoByIdControlEmbarazo")
    private Collection<ControlEmbPatologicoEntity> controlEmbPatologicosByIdControlEmbarazo;
    @ManyToOne
 @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;
    @ManyToOne
   @JoinColumn(name = "motivo", referencedColumnName = "id_motivo",insertable=false, updatable=false)
    private MotivosDerivacionEntity motivosDerivacionByMotivo;

    public int getIdControlEmbarazo() {
        return idControlEmbarazo;
    }

    public void setIdControlEmbarazo(int idControlEmbarazo) {
        this.idControlEmbarazo = idControlEmbarazo;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public int getEdadGestacional() {
        return edadGestacional;
    }

    public void setEdadGestacional(int edadGestacional) {
        this.edadGestacional = edadGestacional;
    }

    public String getEco() {
        return eco;
    }

    public void setEco(String eco) {
        this.eco = eco;
    }

    public String getDetalleEco() {
        return detalleEco;
    }

    public void setDetalleEco(String detalleEco) {
        this.detalleEco = detalleEco;
    }

    public String getHpv() {
        return hpv;
    }

    public void setHpv(String hpv) {
        this.hpv = hpv;
    }

    public String getPap() {
        return pap;
    }

    public void setPap(String pap) {
        this.pap = pap;
    }

    public int getSistolica() {
        return sistolica;
    }

    public void setSistolica(int sistolica) {
        this.sistolica = sistolica;
    }

    public int getDiastolica() {
        return diastolica;
    }

    public void setDiastolica(int diastolica) {
        this.diastolica = diastolica;
    }

    public String getClinico() {
        return clinico;
    }

    public void setClinico(String clinico) {
        this.clinico = clinico;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    public Integer getMotivo() {
        return motivo;
    }

    public void setMotivo(Integer motivo) {
        this.motivo = motivo;
    }

    public Integer getDerivada() {
        return derivada;
    }



    public void setDerivada(Integer derivada) {
        this.derivada = derivada;
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

        ControlEmbarazoEntity that = (ControlEmbarazoEntity) o;

        if (idControlEmbarazo != that.idControlEmbarazo) return false;
        if (idControl != that.idControl) return false;
        if (edadGestacional != that.edadGestacional) return false;
        if (sistolica != that.sistolica) return false;
        if (diastolica != that.diastolica) return false;
        if (derivada != that.derivada) return false;
        if (eco != null ? !eco.equals(that.eco) : that.eco != null) return false;
        if (detalleEco != null ? !detalleEco.equals(that.detalleEco) : that.detalleEco != null) return false;
        if (hpv != null ? !hpv.equals(that.hpv) : that.hpv != null) return false;
        if (pap != null ? !pap.equals(that.pap) : that.pap != null) return false;
        if (clinico != null ? !clinico.equals(that.clinico) : that.clinico != null) return false;
        if (observaciones != null ? !observaciones.equals(that.observaciones) : that.observaciones != null)
            return false;
        if (motivo != null ? !motivo.equals(that.motivo) : that.motivo != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControlEmbarazo;
        result = 31 * result + idControl;
        result = 31 * result + edadGestacional;
        result = 31 * result + (eco != null ? eco.hashCode() : 0);
        result = 31 * result + (detalleEco != null ? detalleEco.hashCode() : 0);
        result = 31 * result + (hpv != null ? hpv.hashCode() : 0);
        result = 31 * result + (pap != null ? pap.hashCode() : 0);
        result = 31 * result + sistolica;
        result = 31 * result + diastolica;
        result = 31 * result + (clinico != null ? clinico.hashCode() : 0);
        result = 31 * result + (observaciones != null ? observaciones.hashCode() : 0);
        result = 31 * result + (motivo != null ? motivo.hashCode() : 0);
        result = 31 * result + (int) derivada;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlEmbPatologicoEntity> getControlEmbPatologicosByIdControlEmbarazo() {
        return controlEmbPatologicosByIdControlEmbarazo;
    }

    public void setControlEmbPatologicosByIdControlEmbarazo(Collection<ControlEmbPatologicoEntity> controlEmbPatologicosByIdControlEmbarazo) {
        this.controlEmbPatologicosByIdControlEmbarazo = controlEmbPatologicosByIdControlEmbarazo;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }

    public MotivosDerivacionEntity getMotivosDerivacionByMotivo() {
        return motivosDerivacionByMotivo;
    }

    public void setMotivosDerivacionByMotivo(MotivosDerivacionEntity motivosDerivacionByMotivo) {
        this.motivosDerivacionByMotivo = motivosDerivacionByMotivo;
    }

    @Override
    public String toString() {
        return "ControlEmbarazoEntity{" +
                "idControlEmbarazo=" + idControlEmbarazo +
                ", idControl=" + idControl +
                ", edadGestacional=" + edadGestacional +
                ", eco='" + eco + '\'' +
                ", detalleEco='" + detalleEco + '\'' +
                ", hpv='" + hpv + '\'' +
                ", pap='" + pap + '\'' +
                ", sistolica=" + sistolica +
                ", diastolica=" + diastolica +
                ", clinico='" + clinico + '\'' +
                ", observaciones='" + observaciones + '\'' +
                ", motivo=" + motivo +
                ", derivada=" + derivada +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", controlEmbPatologicosByIdControlEmbarazo=" + controlEmbPatologicosByIdControlEmbarazo +
                ", controlesByIdControl=" + controlesByIdControl +
                ", motivosDerivacionByMotivo=" + motivosDerivacionByMotivo +
                '}';
    }
}
