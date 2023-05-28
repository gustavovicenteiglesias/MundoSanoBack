package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "control_rn", schema = "tripleconlast", catalog = "")
public class ControlRnEntity {

    @Id
    @Column(name = "id_control_rn")
    private int idControlRn;
    @Basic
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "edad_gestacional")
    private int edadGestacional;
    @Basic
    @Column(name = "peso")
    private double peso;
    @Basic
    @Column(name = "labio_leporino")
    private short labioLeporino;
    @Basic
    @Column(name = "s_genetico_malformaciones")
    private short sGeneticoMalformaciones;
    @Basic
    @Column(name = "hipotiroidismo_congenito")
    private short hipotiroidismoCongenito;
    @Basic
    @Column(name = "bajo_peso")
    private short bajoPeso;
    @Basic
    @Column(name = "hiperbilirrubinemia")
    private short hiperbilirrubinemia;
    @Basic
    @Column(name = "sospecha_de_sepsis")
    private short sospechaDeSepsis;
    @Basic
    @Column(name = "deprimido_neonatal")
    private short deprimidoNeonatal;
    @Basic
    @Column(name = "madre_dbt")
    private short madreDbt;
    @Basic
    @Column(name = "prematuro")
    private short prematuro;
    @Basic
    @Column(name = "rciu")
    private short rciu;
    @Basic
    @Column(name = "hijo_de_madre_dbt")
    private short hijoDeMadreDbt;
    @Basic
    @Column(name = "derivacion")
    private String derivacion;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @ManyToOne
 @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;

    public int getIdControlRn() {
        return idControlRn;
    }

    public void setIdControlRn(int idControlRn) {
        this.idControlRn = idControlRn;
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

    public double getPeso() {
        return peso;
    }

    public void setPeso(double peso) {
        this.peso = peso;
    }

    public short getLabioLeporino() {
        return labioLeporino;
    }

    public void setLabioLeporino(short labioLeporino) {
        this.labioLeporino = labioLeporino;
    }

    public short getsGeneticoMalformaciones() {
        return sGeneticoMalformaciones;
    }

    public void setsGeneticoMalformaciones(short sGeneticoMalformaciones) {
        this.sGeneticoMalformaciones = sGeneticoMalformaciones;
    }

    public short getHipotiroidismoCongenito() {
        return hipotiroidismoCongenito;
    }

    public void setHipotiroidismoCongenito(short hipotiroidismoCongenito) {
        this.hipotiroidismoCongenito = hipotiroidismoCongenito;
    }

    public short getBajoPeso() {
        return bajoPeso;
    }

    public void setBajoPeso(short bajoPeso) {
        this.bajoPeso = bajoPeso;
    }

    public short getHiperbilirrubinemia() {
        return hiperbilirrubinemia;
    }

    public void setHiperbilirrubinemia(short hiperbilirrubinemia) {
        this.hiperbilirrubinemia = hiperbilirrubinemia;
    }

    public short getSospechaDeSepsis() {
        return sospechaDeSepsis;
    }

    public void setSospechaDeSepsis(short sospechaDeSepsis) {
        this.sospechaDeSepsis = sospechaDeSepsis;
    }

    public short getDeprimidoNeonatal() {
        return deprimidoNeonatal;
    }

    public void setDeprimidoNeonatal(short deprimidoNeonatal) {
        this.deprimidoNeonatal = deprimidoNeonatal;
    }

    public short getMadreDbt() {
        return madreDbt;
    }

    public void setMadreDbt(short madreDbt) {
        this.madreDbt = madreDbt;
    }

    public short getPrematuro() {
        return prematuro;
    }

    public void setPrematuro(short prematuro) {
        this.prematuro = prematuro;
    }

    public short getRciu() {
        return rciu;
    }

    public void setRciu(short rciu) {
        this.rciu = rciu;
    }

    public short getHijoDeMadreDbt() {
        return hijoDeMadreDbt;
    }

    public void setHijoDeMadreDbt(short hijoDeMadreDbt) {
        this.hijoDeMadreDbt = hijoDeMadreDbt;
    }

    public String getDerivacion() {
        return derivacion;
    }

    public void setDerivacion(String derivacion) {
        this.derivacion = derivacion;
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

        ControlRnEntity that = (ControlRnEntity) o;

        if (idControlRn != that.idControlRn) return false;
        if (idControl != that.idControl) return false;
        if (edadGestacional != that.edadGestacional) return false;
        if (Double.compare(that.peso, peso) != 0) return false;
        if (labioLeporino != that.labioLeporino) return false;
        if (sGeneticoMalformaciones != that.sGeneticoMalformaciones) return false;
        if (hipotiroidismoCongenito != that.hipotiroidismoCongenito) return false;
        if (bajoPeso != that.bajoPeso) return false;
        if (hiperbilirrubinemia != that.hiperbilirrubinemia) return false;
        if (sospechaDeSepsis != that.sospechaDeSepsis) return false;
        if (deprimidoNeonatal != that.deprimidoNeonatal) return false;
        if (madreDbt != that.madreDbt) return false;
        if (prematuro != that.prematuro) return false;
        if (rciu != that.rciu) return false;
        if (hijoDeMadreDbt != that.hijoDeMadreDbt) return false;
        if (derivacion != null ? !derivacion.equals(that.derivacion) : that.derivacion != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result;
        long temp;
        result = idControlRn;
        result = 31 * result + idControl;
        result = 31 * result + edadGestacional;
        temp = Double.doubleToLongBits(peso);
        result = 31 * result + (int) (temp ^ (temp >>> 32));
        result = 31 * result + (int) labioLeporino;
        result = 31 * result + (int) sGeneticoMalformaciones;
        result = 31 * result + (int) hipotiroidismoCongenito;
        result = 31 * result + (int) bajoPeso;
        result = 31 * result + (int) hiperbilirrubinemia;
        result = 31 * result + (int) sospechaDeSepsis;
        result = 31 * result + (int) deprimidoNeonatal;
        result = 31 * result + (int) madreDbt;
        result = 31 * result + (int) prematuro;
        result = 31 * result + (int) rciu;
        result = 31 * result + (int) hijoDeMadreDbt;
        result = 31 * result + (derivacion != null ? derivacion.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }
}
