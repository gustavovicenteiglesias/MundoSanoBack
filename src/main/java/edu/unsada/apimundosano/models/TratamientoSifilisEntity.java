package edu.unsada.apimundosano.models;

import jakarta.persistence.*;
import java.sql.Date;
import java.util.Collection;

@Entity
@Table(name = "tratamiento_sifilis")
public class TratamientoSifilisEntity extends BaseEntity {

    @Id
    @Column(name = "id_tratamiento_sifilis")
    private int idTratamientoSifilis;
    @Basic
    @Column(name = "droga")
    private String droga;
    @Basic
    @Column(name = "fecha_dosis")
    private Date fechaDosis;
    @Basic
    @Column(name = "fecha_fin_tratamiento")
    private Date fechaFinTratamiento;
    @Basic
    @Column(name = "dosis_numero")
    private Integer dosisNumero;
    
    
    @OneToMany(mappedBy = "tratamientoSifilisByIdTratamientoSifilis")
    private Collection<ControlesEntity> controlesByIdTratamientoSifilis;

    public int getIdTratamientoSifilis() {
        return idTratamientoSifilis;
    }

    public void setIdTratamientoSifilis(int idTratamientoSifilis) {
        this.idTratamientoSifilis = idTratamientoSifilis;
    }

    public String getDroga() {
        return droga;
    }

    public void setDroga(String droga) {
        this.droga = droga;
    }

    public Date getFechaDosis() {
        return fechaDosis;
    }

    public void setFechaDosis(Date fechaDosis) {
        this.fechaDosis = fechaDosis;
    }

    public Date getFechaFinTratamiento() {
        return fechaFinTratamiento;
    }

    public void setFechaFinTratamiento(Date fechaFinTratamiento) {
        this.fechaFinTratamiento = fechaFinTratamiento;
    }

    public Integer getDosisNumero() {
        return dosisNumero;
    }

    public void setDosisNumero(Integer dosisNumero) {
        this.dosisNumero = dosisNumero;
    }

    

    

    

    

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TratamientoSifilisEntity that = (TratamientoSifilisEntity) o;

        if (idTratamientoSifilis != that.idTratamientoSifilis) return false;
        if (droga != null ? !droga.equals(that.droga) : that.droga != null) return false;
        if (fechaDosis != null ? !fechaDosis.equals(that.fechaDosis) : that.fechaDosis != null) return false;
        if (fechaFinTratamiento != null ? !fechaFinTratamiento.equals(that.fechaFinTratamiento) : that.fechaFinTratamiento != null)
            return false;
        if (dosisNumero != null ? !dosisNumero.equals(that.dosisNumero) : that.dosisNumero != null) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTratamientoSifilis;
        result = 31 * result + (droga != null ? droga.hashCode() : 0);
        result = 31 * result + (fechaDosis != null ? fechaDosis.hashCode() : 0);
        result = 31 * result + (fechaFinTratamiento != null ? fechaFinTratamiento.hashCode() : 0);
        result = 31 * result + (dosisNumero != null ? dosisNumero.hashCode() : 0);
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Collection<ControlesEntity> getControlesByIdTratamientoSifilis() {
        return controlesByIdTratamientoSifilis;
    }

    public void setControlesByIdTratamientoSifilis(Collection<ControlesEntity> controlesByIdTratamientoSifilis) {
        this.controlesByIdTratamientoSifilis = controlesByIdTratamientoSifilis;
    }
}


