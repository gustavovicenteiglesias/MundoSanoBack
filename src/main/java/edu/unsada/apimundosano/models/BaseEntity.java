package edu.unsada.apimundosano.models;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Transient;

@MappedSuperclass
public abstract class BaseEntity {

    @Column(name = "uuid", unique = true, nullable = false, length = 36)
    protected String uuid;

    @Column(name = "last_modified")
    protected Integer lastModified;

    @Column(name = "sql_deleted")
    protected Integer sqlDeleted = 0;

    @Transient
    protected boolean preserveIncomingLastModified = false;

    @PrePersist
    public void ensureUuidAndTimestamp() {
        if (uuid == null || uuid.isEmpty()) {
            uuid = java.util.UUID.randomUUID().toString();
        }

        if (sqlDeleted == null) {
            sqlDeleted = 0;
        }

        if (!preserveIncomingLastModified || lastModified == null) {
            lastModified = nowEpochSeconds();
        }
    }

    @PreUpdate
    public void updateTimestamp() {
        if (!preserveIncomingLastModified) {
            lastModified = nowEpochSeconds();
        }
    }

    protected Integer nowEpochSeconds() {
        return (int) (System.currentTimeMillis() / 1000);
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

    public boolean isPreserveIncomingLastModified() {
        return preserveIncomingLastModified;
    }

    public void setPreserveIncomingLastModified(boolean preserveIncomingLastModified) {
        this.preserveIncomingLastModified = preserveIncomingLastModified;
    }
}