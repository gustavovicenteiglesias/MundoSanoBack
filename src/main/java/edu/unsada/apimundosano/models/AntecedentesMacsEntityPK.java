package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class AntecedentesMacsEntityPK implements Serializable {
    @Column(name = "id_antecedente")
    @Id

    private int idAntecedente;
    @Column(name = "id_mac")
    @Id

    private int idMac;

    public int getIdAntecedente() {
        return idAntecedente;
    }

    public void setIdAntecedente(int idAntecedente) {
        this.idAntecedente = idAntecedente;
    }

    public int getIdMac() {
        return idMac;
    }

    public void setIdMac(int idMac) {
        this.idMac = idMac;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AntecedentesMacsEntityPK that = (AntecedentesMacsEntityPK) o;

        if (idAntecedente != that.idAntecedente) return false;
        if (idMac != that.idMac) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idMac;
        return result;
    }
}
