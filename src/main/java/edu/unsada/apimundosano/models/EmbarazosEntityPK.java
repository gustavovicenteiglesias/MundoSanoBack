package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class EmbarazosEntityPK implements Serializable {
    @Column(name = "id_persona")
    @Id

    private int idPersona;
    @Column(name = "id_control")
    @Id

    private int idControl;
    @Column(name = "id_tipo_embarazo")
    @Id

    private int idTipoEmbarazo;

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

    public int getIdTipoEmbarazo() {
        return idTipoEmbarazo;
    }

    public void setIdTipoEmbarazo(int idTipoEmbarazo) {
        this.idTipoEmbarazo = idTipoEmbarazo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EmbarazosEntityPK that = (EmbarazosEntityPK) o;

        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (idTipoEmbarazo != that.idTipoEmbarazo) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idControl;
        result = 31 * result + idTipoEmbarazo;
        return result;
    }
}
