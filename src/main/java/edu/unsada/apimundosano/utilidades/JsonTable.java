package edu.unsada.apimundosano.utilidades;

import java.util.List;

public class JsonTable {
    private String name;
    private List<JsonColumn> schema;
    private List<JsonIndex> indexes;
    private List values;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<JsonColumn> getSchema() {
        return schema;
    }

    public void setSchema(List<JsonColumn> schema) {
        this.schema = schema;
    }

    public List<JsonIndex> getIndexes() {
        return indexes;
    }

    public void setIndexes(List<JsonIndex> indexes) {
        this.indexes = indexes;
    }

    public List getValues() {
        return values;
    }

    public void setValues(List values) {
        this.values = values;
    }

    @Override
    public String toString() {
        return "JsonTable{" +
                "name='" + name + '\'' +
                ", schema=" + schema +
                ", indexes=" + indexes +
                ", values=" + values +
                '}';
    }
}
