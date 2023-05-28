package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

@Entity
@Table(name = "idsegundevice", schema = "tripleconlast", catalog = "")
public class IdsegundeviceEntity {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id_device")
    private int idDevice;
    @Basic
    @Column(name = "nro_device")
    private String nroDevice;
    @Basic
    @Column(name = "min_id")
    private Integer minId;
    @Basic
    @Column(name = "max_id")
    private Integer maxId;
    @Basic
    @Column(name = "sql_delete")
    private int sqlDelete;
    @Basic
    @Column(name = "last_modified")
    private int lastModified;

    public int getIdDevice() {
        return idDevice;
    }

    public void setIdDevice(int idDevice) {
        this.idDevice = idDevice;
    }

    public String getNroDevice() {
        return nroDevice;
    }

    public void setNroDevice(String nroDevice) {
        this.nroDevice = nroDevice;
    }

    public Integer getMinId() {
        return minId;
    }

    public void setMinId(Integer minId) {
        this.minId = minId;
    }

    public Integer getMaxId() {
        return maxId;
    }

    public void setMaxId(Integer maxId) {
        this.maxId = maxId;
    }

    public int getSqlDelete() {
        return sqlDelete;
    }

    public void setSqlDelete(int sqlDelete) {
        this.sqlDelete = sqlDelete;
    }

    public int getLastModified() {
        return lastModified;
    }

    public void setLastModified(int lastModified) {
        this.lastModified = lastModified;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        IdsegundeviceEntity that = (IdsegundeviceEntity) o;

        if (idDevice != that.idDevice) return false;
        if (sqlDelete != that.sqlDelete) return false;
        if (lastModified != that.lastModified) return false;
        if (nroDevice != null ? !nroDevice.equals(that.nroDevice) : that.nroDevice != null) return false;
        if (minId != null ? !minId.equals(that.minId) : that.minId != null) return false;
        if (maxId != null ? !maxId.equals(that.maxId) : that.maxId != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = idDevice;
        result = 31 * result + (nroDevice != null ? nroDevice.hashCode() : 0);
        result = 31 * result + (minId != null ? minId.hashCode() : 0);
        result = 31 * result + (maxId != null ? maxId.hashCode() : 0);
        result = 31 * result + sqlDelete;
        result = 31 * result + lastModified;
        return result;
    }
}
