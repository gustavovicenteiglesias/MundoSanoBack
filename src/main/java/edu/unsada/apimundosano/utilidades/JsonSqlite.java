package edu.unsada.apimundosano.utilidades;

import java.util.List;

public class JsonSqlite {
    private String database;
    private Integer version;

    private Boolean overwrite ;
    private Boolean encrypted;
    private String mode;
    private List<JsonTable> tables;
    private List<JsonView> view;

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Boolean getOverwrite() {
        return overwrite;
    }

    public void setOverwrite(Boolean overwrite) {
        this.overwrite = overwrite;
    }

    public Boolean getEncrypted() {
        return encrypted;
    }

    public void setEncrypted(Boolean encrypted) {
        this.encrypted = encrypted;
    }

    public String getMode() {
        return mode;
    }

    public void setMode(String mode) {
        this.mode = mode;
    }

    public List<JsonTable> getTables() {
        return tables;
    }

    public void setTables(List<JsonTable> tables) {
        this.tables = tables;
    }

    public List<JsonView> getView() {
        return view;
    }

    public void setView(List<JsonView> view) {
        this.view = view;
    }

    @Override
    public String toString() {
        return "JsonSqlite{" +
                "database='" + database + '\'' +
                ", version=" + version +
                ", overwrite=" + overwrite +
                ", encrypted=" + encrypted +
                ", mode='" + mode + '\'' +
                ", tables=" + tables +
                ", view=" + view +
                '}';
    }
}
