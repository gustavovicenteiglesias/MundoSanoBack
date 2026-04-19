package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "tratchagas_eventosadv")
public class TratchagasEventosadvEntity extends BaseEntity {
    @Basic
    @Column(name = "id_tratamiento_chagas")
    private int idTratamientoChagas;
    @Basic
    @Column(name = "id_evento_adverso")
    private int idEventoAdverso;
    
    
    @Basic
    @Id
    @Column(name = "id")
    private Long id;

    public int getIdTratamientoChagas() {
        return idTratamientoChagas;
    }

    public void setIdTratamientoChagas(int idTratamientoChagas) {
        this.idTratamientoChagas = idTratamientoChagas;
    }

    public int getIdEventoAdverso() {
        return idEventoAdverso;
    }

    public void setIdEventoAdverso(int idEventoAdverso) {
        this.idEventoAdverso = idEventoAdverso;
    }

    

    

    

    

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        TratchagasEventosadvEntity that = (TratchagasEventosadvEntity) o;

        if (idTratamientoChagas != that.idTratamientoChagas) return false;
        if (idEventoAdverso != that.idEventoAdverso) return false;
        if (sqlDeleted != null ? !sqlDeleted.equals(that.sqlDeleted) : that.sqlDeleted != null) return false;
        if (lastModified != null ? !lastModified.equals(that.lastModified) : that.lastModified != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idTratamientoChagas;
        result = 31 * result + idEventoAdverso;
        result = 31 * result + (sqlDeleted != null ? sqlDeleted.hashCode() : 0);
        result = 31 * result + (lastModified != null ? lastModified.hashCode() : 0);
        return result;
    }

    public Long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}


