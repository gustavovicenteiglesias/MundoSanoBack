package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Date;

@Entity
@Table(name = "antecedentes", schema = "tripleconlast", catalog = "")
public class AntecedentesEntity {

    @Id
    @Column(name = "id_antecedente")
    private int idAntecedente;
    @Basic
    @Column(name = "id_persona")
    private int idPersona;
    @Basic
    @Column(name = "id_control")
    private int idControl;
    @Basic
    @Column(name = "edad_primer_embarazo")
    private Integer edadPrimerEmbarazo;
    @Basic
    @Column(name = "fecha_ultimo_embarazo")
    private Date fechaUltimoEmbarazo;
    @Basic
    @Column(name = "gestas")
    private Integer gestas;
    @Basic
    @Column(name = "partos")
    private Integer partos;
    @Basic
    @Column(name = "cesareas")
    private Integer cesareas;
    @Basic
    @Column(name = "abortos")
    private Integer abortos;
    @Basic
    @Column(name = "planificado")
    private Integer planificado;
    @Basic
    @Column(name = "fum")
    private Date fum;
    @Basic
    @Column(name = "fpp")
    private Date fpp;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;

    @ManyToOne
    @JoinColumn(name = "id_persona", referencedColumnName = "id_persona", nullable = false,insertable=false, updatable=false)
    private PersonasEntity personasByIdPersona;
    @ManyToOne
    @JoinColumn(name = "id_control", referencedColumnName = "id_control", nullable = false,insertable=false, updatable=false)
    private ControlesEntity controlesByIdControl;

    public int getIdAntecedente() {
        return idAntecedente;
    }

    public void setIdAntecedente(int idAntecedente) {
        this.idAntecedente = idAntecedente;
    }

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    public Integer getEdadPrimerEmbarazo() {
        return edadPrimerEmbarazo;
    }

    public void setEdadPrimerEmbarazo(Integer edadPrimerEmbarazo) {
        this.edadPrimerEmbarazo = edadPrimerEmbarazo;
    }

    public Date getFechaUltimoEmbarazo() {
        return fechaUltimoEmbarazo;
    }

    public void setFechaUltimoEmbarazo(Date fechaUltimoEmbarazo) {
        this.fechaUltimoEmbarazo = fechaUltimoEmbarazo;
    }

    public Integer getGestas() {
        return gestas;
    }

    public void setGestas(Integer gestas) {
        this.gestas = gestas;
    }

    public Integer getPartos() {
        return partos;
    }

    public void setPartos(Integer partos) {
        this.partos = partos;
    }

    public Integer getCesareas() {
        return cesareas;
    }

    public void setCesareas(Integer cesareas) {
        this.cesareas = cesareas;
    }

    public Integer getAbortos() {
        return abortos;
    }

    public void setAbortos(Integer abortos) {
        this.abortos = abortos;
    }

    public Integer getPlanificado() {
        return planificado;
    }

    public void setPlanificado(Integer planificado) {
        this.planificado = planificado;
    }

    public Date getFum() {
        return fum;
    }

    public void setFum(Date fum) {
        this.fum = fum;
    }

    public Date getFpp() {
        return fpp;
    }

    public void setFpp(Date fpp) {
        this.fpp = fpp;
    }

    public Integer getLastModified() {
        return lastModified;
    }

    public void setLastModified(Integer lastModified) {
        this.lastModified = lastModified;
    }

    public Integer getSqlDeleted() {
        return sqlDeleted;
    }

    public void setSqlDeleted(Integer sqlDeleted) {
        this.sqlDeleted = sqlDeleted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AntecedentesEntity that = (AntecedentesEntity) o;

        if (idAntecedente != that.idAntecedente) return false;
        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (edadPrimerEmbarazo != null ? !edadPrimerEmbarazo.equals(that.edadPrimerEmbarazo) : that.edadPrimerEmbarazo != null)
            return false;
        if (fechaUltimoEmbarazo != null ? !fechaUltimoEmbarazo.equals(that.fechaUltimoEmbarazo) : that.fechaUltimoEmbarazo != null)
            return false;
        if (gestas != null ? !gestas.equals(that.gestas) : that.gestas != null) return false;
        if (partos != null ? !partos.equals(that.partos) : that.partos != null) return false;
        if (cesareas != null ? !cesareas.equals(that.cesareas) : that.cesareas != null) return false;
        if (abortos != null ? !abortos.equals(that.abortos) : that.abortos != null) return false;
        if (planificado != null ? !planificado.equals(that.planificado) : that.planificado != null) return false;
        if (fum != null ? !fum.equals(that.fum) : that.fum != null) return false;
        if (fpp != null ? !fpp.equals(that.fpp) : that.fpp != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idPersona;
        result = 31 * result + idControl;
        result = 31 * result + (edadPrimerEmbarazo != null ? edadPrimerEmbarazo.hashCode() : 0);
        result = 31 * result + (fechaUltimoEmbarazo != null ? fechaUltimoEmbarazo.hashCode() : 0);
        result = 31 * result + (gestas != null ? gestas.hashCode() : 0);
        result = 31 * result + (partos != null ? partos.hashCode() : 0);
        result = 31 * result + (cesareas != null ? cesareas.hashCode() : 0);
        result = 31 * result + (abortos != null ? abortos.hashCode() : 0);
        result = 31 * result + (planificado != null ? planificado.hashCode() : 0);
        result = 31 * result + (fum != null ? fum.hashCode() : 0);
        result = 31 * result + (fpp != null ? fpp.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        return result;
    }

    public PersonasEntity getPersonasByIdPersona() {
        return personasByIdPersona;
    }

    public void setPersonasByIdPersona(PersonasEntity personasByIdPersona) {
        this.personasByIdPersona = personasByIdPersona;
    }

    public ControlesEntity getControlesByIdControl() {
        return controlesByIdControl;
    }

    public void setControlesByIdControl(ControlesEntity controlesByIdControl) {
        this.controlesByIdControl = controlesByIdControl;
    }

    @Override
    public String toString() {
        return "AntecedentesEntity{" +
                "idAntecedente=" + idAntecedente +
                ", idPersona=" + idPersona +
                ", idControl=" + idControl +
                ", edadPrimerEmbarazo=" + edadPrimerEmbarazo +
                ", fechaUltimoEmbarazo=" + fechaUltimoEmbarazo +
                ", gestas=" + gestas +
                ", partos=" + partos +
                ", cesareas=" + cesareas +
                ", abortos=" + abortos +
                ", planificado=" + planificado +
                ", fum=" + fum +
                ", fpp=" + fpp +
                ", sqlDeleted=" + sqlDeleted +
                ", lastModified=" + lastModified +
                ", personasByIdPersona=" + personasByIdPersona +
                ", controlesByIdControl=" + controlesByIdControl +
                '}';
    }
}
