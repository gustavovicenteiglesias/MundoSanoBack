package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "tratamiento_hiv", schema = "tripleconlast", catalog = "")
public class TratamientoHivEntity {

    @Id
    @Column(name = "id_tratamiento_hiv")
    private int idTratamientoHiv;
    @Basic
    @Column(name = "droga")
    private String droga;
    @Basic
    @Column(name = "medico_tratante")
    private String medicoTratante;
    @Basic
    @Column(name = "sql_deleted")
    private Byte sqlDeleted;
    @Basic
    @Column(name = "last_modified")
    private Integer lastModified;
    @OneToMany(mappedBy = "tratamientoHivByIdTratamientoHiv")
    private Collection<ControlesEntity> controlesByIdTratamientoHiv;

    public int getIdTratamientoHiv() {
        return idTratamientoHiv;
    }

    public void setIdTratamientoHiv(int idTratamientoHiv) {
        this.idTratamientoHiv = idTratamientoHiv;
    }

    public String getDroga() {
        return droga;
    }

    public void setDroga(String droga) {
        this.droga = droga;
    }

    public String getMedicoTratante() {
        return medicoTratante;
    }

    public void setMedicoTratante(String medicoTratante) {
        this.medicoTratante = medicoTratante;
    }

    public Byte getSqlDeleted() {
        return sqlDeleted;
    }

    public void setSqlDeleted(Byte sqlDeleted) {
        this.sqlDeleted = sqlDeleted;
    }

    public Integer getLastModified() {
        return lastModified;
    }

    public void setLastModified(Integer lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TratamientoHivEntity that = (TratamientoHivEntity) o;

        if (idTratamientoHiv != that.idTratamientoHiv) return false;
        if (droga != null ? !droga.equals(that.droga) : that.droga != null) return false;
        if (medicoTratante != null ? !medicoTratante.equals(that.medicoTratante) : that.medicoTratante != null)
            return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTratamientoHiv;
        result = 31 * result + (droga != null ? droga.hashCode() : 0);
        result = 31 * result + (medicoTratante != null ? medicoTratante.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdTratamientoHiv() {
        return controlesByIdTratamientoHiv;
    }

    public void setControlesByIdTratamientoHiv(Collection<ControlesEntity> controlesByIdTratamientoHiv) {
        this.controlesByIdTratamientoHiv = controlesByIdTratamientoHiv;
    }
}
