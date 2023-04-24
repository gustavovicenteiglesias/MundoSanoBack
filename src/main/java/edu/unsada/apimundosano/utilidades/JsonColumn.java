package edu.unsada.apimundosano.utilidades;

public class JsonColumn {
    private String column;
    private String foreignkey;
    private String constraint;
    private String value;

    public String getColumn() {
        return column;
    }

    public void setColumn(String column) {
        this.column = column;
    }

    public String getForeignkey() {
        return foreignkey;
    }

    public void setForeignkey(String foreignkey) {
        this.foreignkey = foreignkey;
    }

    public String getConstraint() {
        return constraint;
    }

    public void setConstraint(String constraint) {
        this.constraint = constraint;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}
