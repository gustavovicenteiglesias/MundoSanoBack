package edu.unsada.apimundosano.models;


import jakarta.persistence.*;

@Entity
@Table(name = "antecedentes_apps", schema = "tripleconlast", catalog = "")
@IdClass(AntecedentesAppsEntityPK.class)
public class AntecedentesAppsEntity {

    @Id
    @Column(name = "id_antecedente")
    private int idAntecedente;

    @Id
    @Column(name = "id_app")
    private int idApp;
    @Basic
    @Column(name = "last_modified")
    private int lastModified;
    @Basic
    @Column(name = "sql_deleted")
    private Integer sqlDelete;

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
    public String toString() {
        return "AntecedentesAppsEntity{" +
                "idAntecedente=" + idAntecedente +
                ", idApp=" + idApp +
                ", lastModified=" + lastModified +
                ", sqlDelete=" + sqlDelete +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        AntecedentesAppsEntity that = (AntecedentesAppsEntity) o;

        if (idAntecedente != that.idAntecedente) return false;
        if (idApp != that.idApp) return false;
        if (lastModified != that.lastModified) return false;
        if (sqlDelete != that.sqlDelete) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idApp;
        result = 31 * result + lastModified;
        result = 31 * result + (int) sqlDelete;
        return result;
    }
}
