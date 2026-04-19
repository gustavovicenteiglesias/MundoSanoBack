package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

import java.util.Objects;

@Entity
@Table(name = "antecedentes_macs")
@IdClass(AntecedentesMacsEntityPK.class)
public class AntecedentesMacsEntity extends BaseEntity {


    @Id
    @Column(name = "id_antecedente")
    private int idAntecedente;


    @Id
    @Column(name = "id_mac")
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
        AntecedentesMacsEntity that = (AntecedentesMacsEntity) o;
        return idAntecedente == that.idAntecedente && idMac == that.idMac && lastModified == that.lastModified && Objects.equals(sqlDeleted, that.sqlDeleted);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idAntecedente, idMac, lastModified, sqlDeleted);
    }

    @Override
    public String toString() {
        return "AntecedentesMacsEntity{" +
                "idAntecedente=" + idAntecedente +
                ", idMac=" + idMac +
                ", lastModified=" + lastModified +
                ", sqlDeleted=" + sqlDeleted +
                '}';
    }
}


