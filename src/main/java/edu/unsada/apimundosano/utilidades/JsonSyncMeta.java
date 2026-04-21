package edu.unsada.apimundosano.utilidades;

public class JsonSyncMeta {
    private String syncBatchId;
    private String usuario;
    private String dispositivo;
    private String versionApp;
    private String fechaInicio;

    public String getSyncBatchId() {
        return syncBatchId;
    }

    public void setSyncBatchId(String syncBatchId) {
        this.syncBatchId = syncBatchId;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getDispositivo() {
        return dispositivo;
    }

    public void setDispositivo(String dispositivo) {
        this.dispositivo = dispositivo;
    }

    public String getVersionApp() {
        return versionApp;
    }

    public void setVersionApp(String versionApp) {
        this.versionApp = versionApp;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    @Override
    public String toString() {
        return "JsonSyncMeta{" +
                "syncBatchId='" + syncBatchId + '\'' +
                ", usuario='" + usuario + '\'' +
                ", dispositivo='" + dispositivo + '\'' +
                ", versionApp='" + versionApp + '\'' +
                ", fechaInicio='" + fechaInicio + '\'' +
                '}';
    }
}

