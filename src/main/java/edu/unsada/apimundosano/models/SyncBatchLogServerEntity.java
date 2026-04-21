package edu.unsada.apimundosano.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "sync_batch_log_server")
public class SyncBatchLogServerEntity extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "sync_batch_id", nullable = false, unique = true, length = 80)
    private String syncBatchId;

    @Column(name = "usuario", length = 120)
    private String usuario;

    @Column(name = "dispositivo", length = 160)
    private String dispositivo;

    @Column(name = "version_app", length = 60)
    private String versionApp;

    @Column(name = "fecha_inicio_cliente", length = 40)
    private String fechaInicioCliente;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    @Column(name = "total_items", nullable = false)
    private Integer totalItems = 0;

    @Column(name = "ok_count", nullable = false)
    private Integer okCount = 0;

    @Column(name = "rejected_count", nullable = false)
    private Integer rejectedCount = 0;

    @Column(name = "conflict_count", nullable = false)
    private Integer conflictCount = 0;

    @Column(name = "mensaje", length = 600)
    private String mensaje;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getFechaInicioCliente() {
        return fechaInicioCliente;
    }

    public void setFechaInicioCliente(String fechaInicioCliente) {
        this.fechaInicioCliente = fechaInicioCliente;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Integer getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(Integer totalItems) {
        this.totalItems = totalItems;
    }

    public Integer getOkCount() {
        return okCount;
    }

    public void setOkCount(Integer okCount) {
        this.okCount = okCount;
    }

    public Integer getRejectedCount() {
        return rejectedCount;
    }

    public void setRejectedCount(Integer rejectedCount) {
        this.rejectedCount = rejectedCount;
    }

    public Integer getConflictCount() {
        return conflictCount;
    }

    public void setConflictCount(Integer conflictCount) {
        this.conflictCount = conflictCount;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }
}

