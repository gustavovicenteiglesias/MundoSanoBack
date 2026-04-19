package edu.unsada.apimundosano.models;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.util.UUID;

@MappedSuperclass
public abstract class BaseEntity {

    @Column(name = "uuid", unique = true, nullable = false, length = 36)
    protected String uuid;

    @Column(name = "last_modified")
    protected Integer lastModified;

    @Column(name = "sql_deleted")
    protected Integer sqlDeleted = 0;

    @PrePersist
    public void ensureUuidAndTimestamp() {
        if (uuid == null || uuid.isEmpty()) {
            uuid = java.util.UUID.randomUUID().toString();
        }
        updateTimestamp();
    }

    @PreUpdate
    public void updateTimestamp() {
        lastModified = (int) (System.currentTimeMillis() / 1000);
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public Integer getLastModified() {
        return lastModified;
    }

    public void setLastModified(Integer lastModified) {
        this.lastModified = lastModified;
    }

    public Integer getSqlDeleted() {
        return sqlDeleted;
    }

    public void setSqlDeleted(Integer sqlDeleted) {
        this.sqlDeleted = sqlDeleted;
    }
}

