package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class EtmisPersonasEntityPK implements Serializable {
    @Column(name = "id_persona")
    @Id

    private int idPersona;
    @Column(name = "id_etmi")
    @Id

    private int idEtmi;
    @Column(name = "id_control")
    @Id

    private int idControl;

    public int getIdPersona() {
        return idPersona;
    }

    public void setIdPersona(int idPersona) {
        this.idPersona = idPersona;
    }

    public int getIdEtmi() {
        return idEtmi;
    }

    public void setIdEtmi(int idEtmi) {
        this.idEtmi = idEtmi;
    }

    public int getIdControl() {
        return idControl;
    }

    public void setIdControl(int idControl) {
        this.idControl = idControl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EtmisPersonasEntityPK that = (EtmisPersonasEntityPK) o;

        if (idPersona != that.idPersona) return false;
        if (idEtmi != that.idEtmi) return false;
        if (idControl != that.idControl) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idEtmi;
        result = 31 * result + idControl;
        return result;
    }
}
