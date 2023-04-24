package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "antecedentes_macs", schema = "tripleconlast", catalog = "")
@IdClass(AntecedentesMacsEntityPK.class)
public class AntecedentesMacsEntity {

    @Id
    @Column(name = "id_antecedente")
    private int idAntecedente;

    @Id
    @Column(name = "id_mac")
    private int idMac;
    @Basic
    @Column(name = "last_modified")
    private int lastModified;
    @Basic
    @Column(name = "sql_delete")
    private Integer sqlDelete;

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

    public int getLastModified() {
        return lastModified;
    }

    public void setLastModified(int lastModified) {
        this.lastModified = lastModified;
    }


    public Integer getSqlDelete() {
        return sqlDelete;
    }

    public void setSqlDelete(Integer sqlDelete) {
        this.sqlDelete = sqlDelete;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AntecedentesMacsEntity that = (AntecedentesMacsEntity) o;

        if (idAntecedente != that.idAntecedente) return false;
        if (idMac != that.idMac) return false;
        if (lastModified != that.lastModified) return false;
        if (sqlDelete != that.sqlDelete) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idMac;
        result = 31 * result + lastModified;
        result = 31 * result + (int) sqlDelete;
        return result;
    }

    @Override
    public String toString() {
        return "AntecedentesMacsEntity{" +
                "idAntecedente=" + idAntecedente +
                ", idMac=" + idMac +
                ", lastModified=" + lastModified +
                ", sqlDelete=" + sqlDelete +
                '}';
    }
}
