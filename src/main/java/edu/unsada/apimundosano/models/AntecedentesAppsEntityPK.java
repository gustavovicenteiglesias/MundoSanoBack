package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.io.Serializable;

public class AntecedentesAppsEntityPK implements Serializable {

    @Id
    @Column(name = "id_antecedente")

    private int idAntecedente;

    @Id
    @Column(name = "id_app")

    private int idApp;

    public int getIdAntecedente() {
        return idAntecedente;
    }

    public void setIdAntecedente(int idAntecedente) {
        this.idAntecedente = idAntecedente;
    }

    public int getIdApp() {
        return idApp;
    }

    public void setIdApp(int idApp) {
        this.idApp = idApp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AntecedentesAppsEntityPK that = (AntecedentesAppsEntityPK) o;

        if (idAntecedente != that.idAntecedente) return false;
        if (idApp != that.idApp) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idApp;
        return result;
    }
}
