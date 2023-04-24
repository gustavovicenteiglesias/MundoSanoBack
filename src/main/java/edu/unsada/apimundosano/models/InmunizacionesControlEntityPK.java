package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class InmunizacionesControlEntityPK implements Serializable {
    @Column(name = "id_persona")
    @Id

    private int idPersona;
    @Column(name = "id_control")
    @Id

    private int idControl;
    @Column(name = "id_inmunizacion")
    @Id

    private int idInmunizacion;

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

    public int getIdInmunizacion() {
        return idInmunizacion;
    }

    public void setIdInmunizacion(int idInmunizacion) {
        this.idInmunizacion = idInmunizacion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        InmunizacionesControlEntityPK that = (InmunizacionesControlEntityPK) o;

        if (idPersona != that.idPersona) return false;
        if (idControl != that.idControl) return false;
        if (idInmunizacion != that.idInmunizacion) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idPersona;
        result = 31 * result + idControl;
        result = 31 * result + idInmunizacion;
        return result;
    }
}
