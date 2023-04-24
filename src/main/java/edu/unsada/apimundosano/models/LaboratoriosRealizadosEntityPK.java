package edu.unsada.apimundosano.models;
import jakarta.persistence.*;
import java.io.Serializable;

public class LaboratoriosRealizadosEntityPK implements Serializable {

    @Id
    @Column(name = "id_persona")
    private int idPersona;

    @Id
    @Column(name = "id_control")
    private int idControl;

    @Id
    @Column(name = "id_laboratorio")
    private int idLaboratorio;
    @Column(name = "trimestre")

    private Integer trimestre;

    @Id
    @Column(name = "id_etmi")
    private int idEtmi;

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

    public int getIdLaboratorio() {
        return idLaboratorio;
    }

    public void setIdLaboratorio(int idLaboratorio) {
        this.idLaboratorio = idLaboratorio;
    }

    public Integer getTrimestre() {
        return trimestre;
    }

    public void setTrimestre(Integer trimestre) {
        this.trimestre = trimestre;
    }

    public int getIdEtmi() {
        return idEtmi;
    }

    public void setIdEtmi(int idEtmi) {
        this.idEtmi = idEtmi;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        LaboratoriosRealizadosEntityPK that = (LaboratoriosRealizadosEntityPK) o;

        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (idLaboratorio != that.idLaboratorio) return false;
        if (trimestre != that.trimestre) return false;
        if (idEtmi != that.idEtmi) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idControl;
        result = 31 * result + idLaboratorio;
        result = 31 * result + (int) trimestre;
        result = 31 * result + idEtmi;
        return result;
    }
}
