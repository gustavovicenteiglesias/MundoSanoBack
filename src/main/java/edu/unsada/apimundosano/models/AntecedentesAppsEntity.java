package edu.unsada.apimundosano.models;


import jakarta.persistence.*;

@Entity
@Table(name = "antecedentes_apps")
@IdClass(AntecedentesAppsEntityPK.class)
public class AntecedentesAppsEntity extends BaseEntity {


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
    public String toString() {
        return "AntecedentesAppsEntity{" +
                "idAntecedente=" + idAntecedente +
                ", idApp=" + idApp +
                ", lastModified=" + lastModified +
                ", sqlDeleted=" + sqlDeleted +
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
        if (sqlDeleted != that.sqlDeleted) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idAntecedente;
        result = 31 * result + idApp;
        result = 31 * result + lastModified;
        result = 31 * result + (int) sqlDeleted;
        return result;
    }


}


