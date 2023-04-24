package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "sync_table", schema = "tripleconlast", catalog = "")
public class SyncTableEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private int id;
    @Basic
    @Column(name = "sync_date")
    private Integer syncDate;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Integer getSyncDate() {
        return syncDate;
    }

    public void setSyncDate(Integer syncDate) {
        this.syncDate = syncDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        SyncTableEntity that = (SyncTableEntity) o;

        if (id != that.id) return false;
        if (syncDate != null ? !syncDate.equals(that.syncDate) : that.syncDate != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (syncDate != null ? syncDate.hashCode() : 0);
        return result;
    }
}
