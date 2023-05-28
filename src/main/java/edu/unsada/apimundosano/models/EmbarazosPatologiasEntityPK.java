package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class EmbarazosPatologiasEntityPK implements Serializable {
    @Column(name = "id_control_embarazo_patologico")
    @Id

    private int idControlEmbarazoPatologico;
    @Column(name = "id_patologia_embarazo")
    @Id

    private int idPatologiaEmbarazo;

    public int getIdControlEmbarazoPatologico() {
        return idControlEmbarazoPatologico;
    }

    public void setIdControlEmbarazoPatologico(int idControlEmbarazoPatologico) {
        this.idControlEmbarazoPatologico = idControlEmbarazoPatologico;
    }

    public int getIdPatologiaEmbarazo() {
        return idPatologiaEmbarazo;
    }

    public void setIdPatologiaEmbarazo(int idPatologiaEmbarazo) {
        this.idPatologiaEmbarazo = idPatologiaEmbarazo;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EmbarazosPatologiasEntityPK that = (EmbarazosPatologiasEntityPK) o;

        if (idControlEmbarazoPatologico != that.idControlEmbarazoPatologico) return false;
        if (idPatologiaEmbarazo != that.idPatologiaEmbarazo) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idControlEmbarazoPatologico;
        result = 31 * result + idPatologiaEmbarazo;
        return result;
    }
}
